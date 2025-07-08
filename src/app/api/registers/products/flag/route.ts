import { NextRequest, NextResponse } from 'next/server';
import { ProductFlagRequest } from '@/modules/products';
import { database } from '@/lib/database';

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

    const existingProduct = await database.findProductAsync(id);
    
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    const updatedProduct = {
      ...existingProduct,
      active,
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
