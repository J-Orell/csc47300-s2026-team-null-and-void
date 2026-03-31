import { FC, useEffect, useRef } from 'react'
import { Chart as ChartJS, ArcElement, DoughnutController, Tooltip, Legend } from 'chart.js'
import { ChartOptions } from 'chart.js'
import { CategoryBreakdown } from '../types'

ChartJS.register(ArcElement, DoughnutController, Tooltip, Legend)

interface CategoryChartProps {
  data: CategoryBreakdown
}

const CategoryChart: FC<CategoryChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<ChartJS | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    const categoryLabels = Object.keys(data)
    const categoryValues = Object.values(data)

    const colors = [
      'rgba(76, 175, 80, 0.85)',
      'rgba(255, 107, 107, 0.85)',
      'rgba(255, 152, 0, 0.85)',
      'rgba(66, 133, 244, 0.85)',
      'rgba(156, 39, 176, 0.85)',
      'rgba(0, 188, 212, 0.85)',
      'rgba(255, 64, 129, 0.85)',
    ]

    const options: ChartOptions<'doughnut'> = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'nearest',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            font: { size: 12, weight: 500 },
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
          cornerRadius: 8,
        },
      },
    }

    chartRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        labels: categoryLabels,
        datasets: [
          {
            data: categoryValues,
            backgroundColor: colors.slice(0, categoryLabels.length),
            borderColor: 'white',
            borderWidth: 3,
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

export default CategoryChart
