import { Request, Response } from 'express';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export async function uploadHandler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public/images');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      filename: (name, ext, part) => {
        const originalName = part.originalFilename || 'image';
        const baseName = path.basename(originalName, path.extname(originalName));
        const sanitizedName = sanitizeFileName(baseName);
        const timestamp = `-${Date.now()}`;
        return `${sanitizedName}${timestamp}${ext}`;
      },
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const baseName = path.basename(file.newFilename, path.extname(file.newFilename));
    const optimizedFileName = `${baseName}.webp`;
    const optimizedPath = path.join(uploadDir, optimizedFileName);

    await sharp(file.filepath)
      .webp({ quality: 80 })
      .toFile(optimizedPath);

    await fs.unlink(file.filepath);

    return res.status(200).json({
      url: `/images/${optimizedFileName}`,
      fileName: optimizedFileName,
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return res.status(500).json({ error: 'Failed to process upload' });
  }
}
