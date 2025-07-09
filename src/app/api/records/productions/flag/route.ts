import { NextRequest, NextResponse } from 'next/server';
import { ProductionFlagRequest } from '@/modules/productions';
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

    const body: ProductionFlagRequest = await request.json();
    const { id, active } = body;

    const database = getDatabase();
    await database.updateProductionFlag(id, active);

    return NextResponse.json({
      success: true,
      data: { id, active }
    });
  } catch (error) {
    console.error('Error updating production flag:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
