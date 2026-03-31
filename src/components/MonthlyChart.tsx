import { FC, useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend } from 'chart.js'
import { ChartOptions } from 'chart.js'
import { MonthlyData } from '../types'

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend)

interface MonthlyChartProps {
  data: MonthlyData
}

const MonthlyChart: FC<MonthlyChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<ChartJS | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    // Destroy previous chart instance
    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const gradient1 = ctx.createLinearGradient(0, 0, 0, 300)
    gradient1.addColorStop(0, 'rgba(76, 175, 80, 0.8)')
    gradient1.addColorStop(1, 'rgba(76, 175, 80, 0.1)')

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 300)
    gradient2.addColorStop(0, 'rgba(255, 107, 107, 0.8)')
    gradient2.addColorStop(1, 'rgba(255, 107, 107, 0.1)')

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            font: { size: 13, weight: 500 },
            color: '#666',
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle' as const,
            boxWidth: 10,
            boxHeight: 10,
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          padding: 12,
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          displayColors: true,
          boxPadding: 8,
          cornerRadius: 8,
          titleMarginBottom: 8,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#999',
            font: { size: 11 },
            padding: 10,
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
        },
        x: {
          ticks: {
            color: '#666',
            font: { size: 12 },
          },
          grid: {
            display: false,
          },
        },
      },
    }

    chartRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: data.months,
        datasets: [
          {
            label: 'Income',
            data: data.income,
            backgroundColor: gradient1,
            borderColor: '#4CAF50',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.7,
            categoryPercentage: 0.8,
          },
          {
            label: 'Expenses',
            data: data.expenses,
            backgroundColor: gradient2,
            borderColor: '#FF6B6B',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.7,
            categoryPercentage: 0.8,
          },
        ],
      },
      options,
    })

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={canvasRef} />
}

export default MonthlyChart

