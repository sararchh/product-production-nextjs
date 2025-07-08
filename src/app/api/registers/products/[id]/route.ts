import { NextRequest, NextResponse } from 'next/server';
import { Product, ProductRequest } from '@/modules/products';
import { verifyToken, extractToken } from '@/lib/auth-utils';
import { database } from '@/lib/database';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, message: 'Token de autenticação inválido ou expirado' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body: ProductRequest = await request.json();
    
    const existingProduct = await database.findProductAsync(id);
    
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    const updatedProduct: Product = {
      ...existingProduct,
      name: body.name,
      description: body.description || existingProduct.description,
      price: body.price || existingProduct.price,
      minProduction: body.minProduction,
      maxProduction: body.maxProduction,
      updatedAt: new Date().toISOString()
    };

    await database.updateProduct(id, updatedProduct);

    return NextResponse.json({
      success: true,
      data: updatedProduct
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { success: false, message: 'Token de autenticação inválido ou expirado' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    
    const productExists = await database.findProductAsync(id);
    
    if (!productExists) {
      return NextResponse.json(
        { success: false, message: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    await database.deleteProduct(id);

    return NextResponse.json({
      success: true,
      data: { success: true }
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
