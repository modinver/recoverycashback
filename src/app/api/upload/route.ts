import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

const BLOB_BASE_URL = 'https://73ccojo3rks1qy2o.public.blob.vercel-storage.com';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json(
      { error: 'Filename is required' },
      { status: 400 }
    );
  }

  try {
    // Generar un nombre único para el archivo
    const uniqueFilename = `${Date.now()}-${filename}`;
    
    const blob = await put(uniqueFilename, request.body, {
      access: 'public',
      addRandomSuffix: false, // Usamos nuestro propio sufijo temporal
    });

    // Construir la URL completa
    const url = `${BLOB_BASE_URL}/${blob.url.split('/').pop()}`;

    return NextResponse.json({
      ...blob,
      url
    });
  } catch (error) {
    console.error('Error uploading to blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
