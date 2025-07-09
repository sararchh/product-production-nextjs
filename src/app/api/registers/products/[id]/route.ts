import { NextRequest, NextResponse } from 'next/server';
import { ProductRequest } from '@/modules/products';
import { verifyToken, extractToken } from '@/lib/auth-utils';
import { getDatabase } from '@/lib/database';

export async function GET(
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
    
    const database = getDatabase();
    const product = await database.getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

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
    
    const database = getDatabase();
    const existingProduct = await database.getProductById(id);
    
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    const updatedProductData = {
      name: body.name,
      description: body.description || existingProduct.description,
      price: body.price !== undefined ? body.price : existingProduct.price,
      minProduction: body.minProduction,
      maxProduction: body.maxProduction,
      updatedAt: new Date().toISOString()
    };

    const updatedProduct = await database.updateProduct(id, updatedProductData);

    return NextResponse.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
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
    
    const database = getDatabase();
    const productExists = await database.getProductById(id);
    
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
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
