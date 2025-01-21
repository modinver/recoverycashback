import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import formidable from 'formidable';
import sharp from 'sharp';
import cors from 'cors';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use('/images', express.static(resolve(__dirname, 'public/images')));

// Endpoint para subir imágenes
app.post('/api/upload', async (req, res) => {
  try {
    const uploadDir = resolve(__dirname, 'public/images');
    const form = formidable({
      uploadDir,
      filename: (name, ext, part) => {
        const timestamp = Date.now();
        const random = Math.round(Math.random() * 1E9);
        return `image-${timestamp}-${random}.webp`;
      }
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Optimizar imagen con sharp
    await sharp(file.filepath)
      .webp({ quality: 80 })
      .toFile(file.filepath + '.webp');

    const fileName = file.newFilename + '.webp';
    
    return res.json({
      url: `/images/${fileName}`,
      fileName: fileName
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return res.status(500).json({ error: 'Failed to process upload' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
