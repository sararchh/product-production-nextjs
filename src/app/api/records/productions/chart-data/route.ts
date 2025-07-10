import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/database";

export async function GET() {
  try {
    const db = getDatabase();
    
    const productions = await db.getProductionChartData();

    // Processar os dados para o gráfico
    const chartData = productions.map(production => {
      let status: 'low' | 'normal' | 'high' = 'normal';
      
      if (production.quantity < production.minProduction) {
        status = 'low';
      } else if (production.quantity > production.maxProduction) {
        status = 'high';
      }

      return {
        date: production.productionDate,
        quantity: production.quantity,
        productName: production.productName,
        minProduction: production.minProduction,
        maxProduction: production.maxProduction,
        status
      };
    });

    return NextResponse.json({
      success: true,
      data: chartData
    });

  } catch (error) {
    console.error('Erro ao buscar dados do gráfico:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao buscar dados do gráfico' },
      { status: 500 }
    );
  }
}
