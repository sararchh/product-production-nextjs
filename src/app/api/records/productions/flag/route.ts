import { NextRequest, NextResponse } from 'next/server';
import { ProductionFlagRequest } from '@/modules/productions';
import { productions } from '@/lib/productions-store';

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
