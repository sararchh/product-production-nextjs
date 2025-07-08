import { NextRequest, NextResponse } from 'next/server';
import { Product, ProductRequest } from '@/modules/products';
import { verifyToken, extractToken } from '@/lib/auth-utils';

const products: Product[] = [
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

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, message: 'Token de autenticação inválido ou expirado' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: products
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
    const token = extractToken(authHeader);
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, message: 'Token de autenticação inválido ou expirado' },
        { status: 401 }
      );
    }

    const body: ProductRequest = await request.json();
    
    const newProduct: Product = {
      id: Date.now().toString(),
      ...body,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);

    return NextResponse.json({
      success: true,
      data: newProduct
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
