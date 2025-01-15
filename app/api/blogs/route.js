import { NextResponse } from 'next/server';
import { storage } from '@/lib/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Obtener los datos del formulario
    const title = formData.get('title');
    const content = formData.get('content');
    const author = formData.get('author');
    const userId = formData.get('userId');
    const image = formData.get('image');

    let imageUrl = null;

    // Si hay una imagen, subirla a Firebase Storage
    if (image) {
      try {
        // Crear un Blob desde el archivo
        const bytes = await image.arrayBuffer();
        const blob = new Blob([bytes], { type: image.type });
        
        // Generar un nombre único para el archivo
        const fileName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, `blog-images/${fileName}`);
        
        // Subir el archivo
        const uploadResult = await uploadBytes(storageRef, blob);
        console.log('Archivo subido exitosamente:', uploadResult);
        
        // Obtener la URL
        imageUrl = await getDownloadURL(uploadResult.ref);
        console.log('URL de imagen obtenida:', imageUrl);
      } catch (storageError) {
        console.error('Error específico de Storage:', storageError);
        throw new Error(`Error al subir la imagen: ${storageError.message}`);
      }
    }

    // Crear el documento en Firestore
    const blogData = {
      title,
      content,
      author,
      userId,
      imageUrl,
      createdAt: serverTimestamp(),
      date: new Date().toLocaleDateString()
    };

    const docRef = await addDoc(collection(db, 'blogs'), blogData);

    return NextResponse.json({
      ok: true,
      id: docRef.id,
      message: 'Blog creado exitosamente'
    });

  } catch (error) {
    console.error('Error detallado en la API de blogs:', error);
    return NextResponse.json(
      { 
        ok: false, 
        error: error.message || 'Error al crear el blog',
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      },
      { status: 500 }
    );
  }
} 