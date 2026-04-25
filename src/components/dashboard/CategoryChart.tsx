import { FC, useEffect, useRef, useState } from 'react'
import { Chart as ChartJS, ArcElement, DoughnutController, Tooltip, Legend } from 'chart.js'
import { ChartOptions } from 'chart.js'
import { CategoryBreakdown } from '../../types'

ChartJS.register(ArcElement, DoughnutController, Tooltip, Legend)

interface CategoryChartProps {
  data: CategoryBreakdown
}

const CategoryChart: FC<CategoryChartProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<ChartJS | null>(null)
  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set())

  const categoryLabels = Object.keys(data)

  const toggleCategory = (category: string) => {
    setHiddenCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    if (chartRef.current) {
      chartRef.current.destroy()
    }

    // Filter data based on hidden categories
    const filteredLabels = categoryLabels.filter(label => !hiddenCategories.has(label))
    const filteredValues = filteredLabels.map(label => data[label as keyof CategoryBreakdown])

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
          onClick: () => false, // Disable default click behavior
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
        labels: filteredLabels,
        datasets: [
          {
            data: filteredValues,
            backgroundColor: colors.slice(0, filteredLabels.length),
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
  }, [data, hiddenCategories])

  return (
    <div>
      <div style={{
        position: 'relative',
        height: '300px',
        marginBottom: '0.5rem'
      }}>
        <canvas ref={canvasRef} />
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginTop: '1rem',
        justifyContent: 'center',
        padding: '0 1rem',
        maxWidth: '100%'
      }}>
        {categoryLabels.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            style={{
              padding: '0.6rem 1.2rem',
              border: hiddenCategories.has(category) ? '1px solid #c8e6c9' : '2px solid #2e7d32',
              borderRadius: '8px',
              background: hiddenCategories.has(category) ? '#f0f0f0' : '#ffffff',
              color: hiddenCategories.has(category) ? '#999999' : '#2e7d32',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: hiddenCategories.has(category) ? 0.5 : 1,
              textDecoration: hiddenCategories.has(category) ? 'line-through' : 'none',
              boxShadow: hiddenCategories.has(category) ? 'none' : '0 2px 8px rgba(46, 125, 50, 0.1)',
              transform: hiddenCategories.has(category) ? 'scale(0.95)' : 'scale(1)'
            }}
            onMouseEnter={(e) => {
              if (!hiddenCategories.has(category)) {
                e.currentTarget.style.background = '#e8f5e9'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(46, 125, 50, 0.2)'
                e.currentTarget.style.transform = 'scale(1.05)'
              }
            }}
            onMouseLeave={(e) => {
              if (!hiddenCategories.has(category)) {
                e.currentTarget.style.background = '#ffffff'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(46, 125, 50, 0.1)'
                e.currentTarget.style.transform = 'scale(1)'
              }
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryChart