import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    // Ruta al archivo robots.txt en la carpeta public
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');

    // Escribir el contenido en el archivo
    await fs.promises.writeFile(robotsPath, content, 'utf8');

    res.status(200).json({ message: 'robots.txt updated successfully' });
  } catch (error) {
    console.error('Error updating robots.txt:', error);
    res.status(500).json({ message: 'Error updating robots.txt file' });
  }
}
