import { NextRequest, NextResponse } from 'next/server';
import { ProductionFlagRequest } from '@/modules/productions';

const productions = [
  {
    id: '1',
    productId: '1',
    quantity: 50,
    date: new Date().toISOString().split('T')[0],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    productId: '2',
    quantity: 30,
    date: new Date().toISOString().split('T')[0],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Token de autenticação requerido' },
        { status: 401 }
      );
    }

    const body: ProductionFlagRequest = await request.json();
    const { id, active } = body;

    const productionIndex = productions.findIndex(p => p.id === id);
    
    if (productionIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Apontamento não encontrado' },
        { status: 404 }
      );
    }

    productions[productionIndex] = {
      ...productions[productionIndex],
      active,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: productions[productionIndex]
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
