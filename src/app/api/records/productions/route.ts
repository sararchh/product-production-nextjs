import { NextRequest, NextResponse } from 'next/server';
import { Production, ProductionRequest } from '@/modules/productions';

const productions: Production[] = [
  {
    id: '1',
    productId: '1',
    quantity: 50,
    productionDate: new Date().toISOString().split('T')[0],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    productId: '2',
    quantity: 30,
    productionDate: new Date().toISOString().split('T')[0],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

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
