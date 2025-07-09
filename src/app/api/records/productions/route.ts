import { NextRequest, NextResponse } from 'next/server';
import { Production, ProductionRequest } from '@/modules/productions';
import { productions } from '@/lib/productions-store';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Token de autenticação requerido' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: productions
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Token de autenticação requerido' },
        { status: 401 }
      );
    }

    const body: ProductionRequest = await request.json();
    
    const newProduction: Production = {
      id: Date.now().toString(),
      ...body,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    productions.push(newProduction);

    return NextResponse.json({
      success: true,
      data: newProduction
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
