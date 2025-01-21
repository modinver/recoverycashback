import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import multer from 'multer';
import sharp from 'sharp';
import { put } from '@vercel/blob';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuración de Vercel Blob
const BLOB_STORE_NAME = 'recoverycashback-media';
const BLOB_BASE_URL = 'https://73ccojo3rks1qy2o.public.blob.vercel-storage.com';
process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_73ccojo3RKSlQY2O_TqzGL6NAtJrglA6QeWXatPAOIuVmuR";

async function createServer() {
  const app = express();

  // Configurar multer para manejar la subida de archivos
  const storage = multer.memoryStorage();
  const upload = multer({ 
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // Límite de 5MB
    }
  });

  // Crear servidor Vite en modo desarrollo
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Usar vite middleware
  app.use(vite.middlewares);

  // Servir archivos estáticos
  app.use('/images', express.static(resolve(__dirname, 'public/images')));

  // Endpoint para subir imágenes usando Vercel Blob
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      // Validar tipo de archivo
      if (!req.file.mimetype.startsWith('image/')) {
        res.status(400).json({ error: 'Only image files are allowed' });
        return;
      }

      // Generar un nombre único para el archivo y organizarlo en carpetas por fecha
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const uniqueFilename = `${BLOB_STORE_NAME}/${year}/${month}/${Date.now()}-${req.file.originalname}`;

      // Optimizar la imagen con sharp
      const optimizedBuffer = await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toBuffer();

      // Subir a Vercel Blob
      const blob = await put(uniqueFilename, optimizedBuffer, {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'image/webp'
      });

      // Construir la URL completa
      const url = `${BLOB_BASE_URL}/${blob.url.split('/').pop()}`;

      res.json({
        ...blob,
        url,
        store: BLOB_STORE_NAME
      });
    } catch (error) {
      console.error('Error processing upload:', error);
      res.status(500).json({ error: 'Failed to process upload' });
    }
  });

  return app;
}

// Crear y arrancar el servidor
createServer().then(app => {
  app.listen(8080, () => {
    console.log('Server running at http://localhost:8080');
    console.log('Blob storage configured for:', BLOB_STORE_NAME);
  });
});
