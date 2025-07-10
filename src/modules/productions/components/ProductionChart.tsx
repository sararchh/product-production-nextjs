"use client";

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { useProductionChartData } from '../hooks/useProductionChartData';
import { Spinner } from '@/shared/components';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const ProductionChart = () => {
  const { data, isLoading, error } = useProductionChartData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        Erro ao carregar dados do gráfico
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        Nenhum dado de produção encontrado
      </div>
    );
  }

  const chartData = {
    labels: data.data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('pt-BR');
    }),
    datasets: [
      {
        label: 'Quantidade Produzida',
        data: data.data.map(item => item.quantity),
        borderColor: data.data.map(item => {
          switch (item.status) {
            case 'low':
              return '#ef4444';
            case 'high':
              return '#f59e0b';
            default:
              return '#10b981';
          }
        }),
        backgroundColor: data.data.map(item => {
          switch (item.status) {
            case 'low':
              return '#ef444440';
            case 'high':
              return '#f59e0b40';
            default:
              return '#10b98140';
          }
        }),
        pointBackgroundColor: data.data.map(item => {
          switch (item.status) {
            case 'low':
              return '#ef4444';
            case 'high':
              return '#f59e0b';
            default:
              return '#10b981';
          }
        }),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        tension: 0.1,
        fill: false
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolução da Produção'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const dataIndex = context.dataIndex;
            const item = data.data[dataIndex];
            const statusText = item.status === 'low' ? 'Baixa' : 
                             item.status === 'high' ? 'Alta' : 'Normal';
            return [
              `${item.productName}: ${item.quantity}`,
              `Status: ${statusText}`,
              `Min: ${item.minProduction} | Max: ${item.maxProduction}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Data'
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Dashboard de Produção
        </h3>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Produção Baixa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Produção Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-gray-600">Produção Alta</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
