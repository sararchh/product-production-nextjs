import { NextRequest, NextResponse } from 'next/server';
import { Production, ProductionRequest } from '@/modules/productions';
import { getDatabase } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Token de autenticação requerido' },
        { status: 401 }
      );
    }

    const database = getDatabase();
    const productions = await database.getProductions();

    return NextResponse.json({
      success: true,
      data: productions
    });
  } catch (error) {
    console.error('Error getting productions:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Token de autenticação requerido' },
        { status: 401 }
      );
    }

    const body: ProductionRequest = await request.json();
    
    const newProduction: Production = {
      id: Date.now().toString(),
      productId: body.productId,
      quantity: body.quantity,
      productionDate: body.productionDate,
      justification: body.justification,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const database = getDatabase();
    await database.createProduction(newProduction);

    return NextResponse.json({
      success: true,
      data: newProduction
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating production:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
