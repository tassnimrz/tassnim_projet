import React from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

export default function PatientChart({ data, theme }) {
  const gradientStroke = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(236, 72, 153, 0.6)'); // rose
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.3)'); // bleu
    return gradient;
  };

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'Patients par jour',
        data: data.map(d => d.count),
        borderColor: '#ec4899', // rose foncé
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx} = chart;
          return gradientStroke(ctx);
        },
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#60a5fa', // bleu clair
        pointBorderColor: '#ec4899',
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#ec4899',
        pointHoverBorderColor: '#60a5fa'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? 'white' : '#1e293b',
          font: {
            weight: 'bold',
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f472b6',
        bodyColor: 'white',
        borderColor: '#ec4899',
        borderWidth: 1,
        callbacks: {
          label: (context) => `📈 ${context.parsed.y} patients`
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? 'white' : '#1e293b',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(255,255,255,0.05)'
        }
      },
      y: {
        ticks: {
          beginAtZero: true,
          color: theme === 'dark' ? 'white' : '#1e293b',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: theme === 'dark' ? '#334155' : '#e2e8f0',
          borderDash: [5, 5]
        }
      }
    }
  };

  return <Line data={chartData} options={chartOptions} />;
}
