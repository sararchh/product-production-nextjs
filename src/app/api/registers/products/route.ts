import { NextRequest, NextResponse } from 'next/server';
import { Product, ProductRequest } from '@/modules/products';
import { verifyToken, extractToken } from '@/lib/auth-utils';
import { getDatabase } from '@/lib/database';

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

    const database = getDatabase();
    const products = await database.getProducts();

    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error getting products:', error);
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
      name: body.name,
      description: body.description || '',
      price: body.price || 0,
      minProduction: body.minProduction,
      maxProduction: body.maxProduction,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const database = getDatabase();
    await database.createProduct(newProduct);

    return NextResponse.json({
      success: true,
      data: newProduct
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
