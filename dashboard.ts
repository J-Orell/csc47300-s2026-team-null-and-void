// ══════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ══════════════════════════════════════════════════════════════

// Type Definitions

// Declare Chart.js global (loaded via CDN in HTML)
declare const Chart: any;

interface MonthlyData {
    months: string[];
    income: number[];
    expenses: number[];
}

interface CurrentMonth {
    totalIncome: number;
    totalExpenses: number;
    savings: number;
    savingsRate: string;
}

interface CategoryBreakdown {
    [key: string]: number;
}

interface DashboardData {
    monthlyData: MonthlyData;
    categoryBreakdown: CategoryBreakdown;
    currentMonth: CurrentMonth;
}

// Global Variables
let monthlyChartInstance: any = null;
let categoryChartInstance: any = null;
let chartData: DashboardData = {} as DashboardData;

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', function (): void {
    loadData();
    updateDate();
});

// Load Data from JSON File
function loadData(): void {
    fetch('data.json')
        .then((response: Response) => response.json())
        .then((data: DashboardData) => {
            chartData = data;
            updateMetrics();
            initializeCharts();
            populateCategoryList();
        })
        .catch((error: Error) => console.error('Error loading data:', error));
}

// Update the Current Date
function updateDate(): void {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const today: string = new Date().toLocaleDateString('en-US', options);
    const currentDateEl: HTMLElement | null = document.getElementById('currentDate');
    if (currentDateEl) {
        currentDateEl.textContent = today;
    }
}

// Update Metric Cards with Data
function updateMetrics(): void {
    const currentMonth: CurrentMonth = chartData.currentMonth;

    const totalIncomeEl: HTMLElement | null = document.getElementById('totalIncome');
    const totalExpensesEl: HTMLElement | null = document.getElementById('totalExpenses');
    const totalSavingsEl: HTMLElement | null = document.getElementById('totalSavings');
    const savingsRateEl: HTMLElement | null = document.getElementById('savingsRate');

    if (totalIncomeEl) {
        totalIncomeEl.textContent = '$' + formatNumber(currentMonth.totalIncome);
    }
    if (totalExpensesEl) {
        totalExpensesEl.textContent = '$' + formatNumber(currentMonth.totalExpenses);
    }
    if (totalSavingsEl) {
        totalSavingsEl.textContent = '$' + formatNumber(currentMonth.savings);
    }
    if (savingsRateEl) {
        savingsRateEl.textContent = currentMonth.savingsRate;
    }
}

// Format Numbers with Commas
function formatNumber(num: number): string {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Initialize Charts
function initializeCharts(): void {
    createMonthlyChart();
    createCategoryChart();
}

// Create Monthly Income vs Expenses Bar Chart
function createMonthlyChart(): void {
    const canvas: HTMLCanvasElement | null = document.getElementById('monthlyChart') as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    // Create gradients
    const gradient1: CanvasGradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(0, 'rgba(76, 175, 80, 0.8)');
    gradient1.addColorStop(1, 'rgba(76, 175, 80, 0.1)');

    const gradient2: CanvasGradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0, 'rgba(255, 107, 107, 0.8)');
    gradient2.addColorStop(1, 'rgba(255, 107, 107, 0.1)');

    monthlyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.monthlyData.months,
            datasets: [
                {
                    label: 'Income',
                    data: chartData.monthlyData.income,
                    backgroundColor: gradient1,
                    borderColor: '#4CAF50',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8,
                    hoverBackgroundColor: 'rgba(76, 175, 80, 0.95)'
                },
                {
                    label: 'Expenses',
                    data: chartData.monthlyData.expenses,
                    backgroundColor: gradient2,
                    borderColor: '#FF6B6B',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8,
                    hoverBackgroundColor: 'rgba(255, 107, 107, 0.95)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 13, weight: '500' },
                        color: '#666',
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 10,
                        boxHeight: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    padding: 12,
                    titleFont: { size: 13, weight: '600' },
                    bodyFont: { size: 12 },
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    displayColors: true,
                    boxPadding: 8,
                    cornerRadius: 8,
                    titleMarginBottom: 8,
                    callbacks: {
                        label: function (context: any): string {
                            return context.dataset.label + ': $' +
                                formatNumber(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value: number | string): string {
                            return '$' + (Number(value) / 1000).toFixed(1) + 'k';
                        },
                        color: '#999',
                        font: { size: 11 },
                        padding: 10
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#666',
                        font: { size: 12 }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    });
}

// Create Expense Category Pie Chart
function createCategoryChart(): void {
    const canvas: HTMLCanvasElement | null = document.getElementById('categoryChart') as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;

    const categoryLabels: string[] = Object.keys(chartData.categoryBreakdown);
    const categoryData: number[] = Object.values(chartData.categoryBreakdown);

    const colors: string[] = [
        'rgba(76, 175, 80, 0.85)',
        'rgba(255, 107, 107, 0.85)',
        'rgba(255, 152, 0, 0.85)',
        'rgba(66, 133, 244, 0.85)',
        'rgba(156, 39, 176, 0.85)',
        'rgba(0, 188, 212, 0.85)',
        'rgba(255, 64, 129, 0.85)'
    ];

    categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoryLabels,
            datasets: [
                {
                    data: categoryData,
                    backgroundColor: colors.slice(0, categoryLabels.length),
                    borderColor: 'white',
                    borderWidth: 3,
                    hoverOffset: 10,
                    hoverBorderColor: 'rgba(255, 255, 255, 0.5)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'nearest',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { size: 12, weight: '500' },
                        color: '#666',
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 10,
                        boxHeight: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    padding: 12,
                    titleFont: { size: 13, weight: '600' },
                    bodyFont: { size: 12 },
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    displayColors: true,
                    cornerRadius: 8,
                    callbacks: {
                        label: function (context: any): string {
                            const total: number = context.dataset.data.reduce(
                                (a: number, b: number) => a + b, 0
                            );
                            const percentage: string = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': $' + formatNumber(context.parsed) +
                                ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Populate Category Breakdown List
function populateCategoryList(): void {
    const categoryList: HTMLElement | null = document.getElementById('categoryList');
    if (!categoryList) return;

    const categories: CategoryBreakdown = chartData.categoryBreakdown;
    const total: number = Object.values(categories).reduce(
        (sum: number, val: number) => sum + val, 0
    );

    const categoryHTML: string = Object.entries(categories)
        .map(([name, amount]: [string, number]): string => {
            const percentage: string = ((amount / total) * 100).toFixed(1);
            return `
                <div class="category-item">
                    <div class="category-name">${name}</div>
                    <div class="category-amount">$${formatNumber(amount)}</div>
                    <div style="font-size: 0.85rem; color: #999; margin-top: 0.5rem;">${percentage}% of total</div>
                </div>
            `;
        })
        .join('');

    categoryList.innerHTML = categoryHTML;
}

// Handle Window Resize for Responsive Charts
let resizeTimer: number;
window.addEventListener('resize', function (): void {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function (): void {
        if (monthlyChartInstance) monthlyChartInstance.resize();
        if (categoryChartInstance) categoryChartInstance.resize();
    }, 250);
});

// Log successful initialization
console.log('Financial Dashboard initialized successfully');