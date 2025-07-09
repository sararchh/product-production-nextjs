import { NextRequest, NextResponse } from 'next/server';
import { ProductFlagRequest } from '@/modules/products';
import { getDatabase } from '@/lib/database';

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

    const database = getDatabase();
    const existingProduct = await database.getProductById(id);
    
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    await database.updateProductFlag(id, active);

    return NextResponse.json({
      success: true,
      data: { id, active }
    });
  } catch (error) {
    console.error('Error updating product flag:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
