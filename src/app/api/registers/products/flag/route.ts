import { NextRequest, NextResponse } from 'next/server';
import { ProductFlagRequest } from '@/modules/products';

const products = [
  {
    id: '1',
    name: 'Produto A',
    description: 'Descrição do Produto A',
    price: 100.00,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Produto B',
    description: 'Descrição do Produto B',
    price: 200.00,
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

    const body: ProductFlagRequest = await request.json();
    const { id, active } = body;

    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    products[productIndex] = {
      ...products[productIndex],
      active,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: products[productIndex]
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
