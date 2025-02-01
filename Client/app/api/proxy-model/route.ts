import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { modelUrl } = await request.json();

    if (!modelUrl) {
      return NextResponse.json({ error: 'Model URL is required' }, { status: 400 });
    }

    // Download the model from Meshy.ai
    const response = await axios.get(modelUrl, {
      responseType: 'arraybuffer'
    });

    // Forward the model with appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', 'model/gltf-binary');
    headers.set('Content-Disposition', 'attachment; filename="model.glb"');
    headers.set('Access-Control-Allow-Origin', '*');

    return new NextResponse(response.data, {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error proxying model:', error);
    return NextResponse.json(
      { error: 'Failed to download model' },
      { status: 500 }
    );
  }
} 