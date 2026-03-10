// Global variables for charts
let monthlyChartInstance = null;
let categoryChartInstance = null;
let chartData = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateDate();
});

// Load data from JSON file
function loadData() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            chartData = data;
            updateMetrics();
            initializeCharts();
            populateCategoryList();
        })
        .catch(error => console.error('Error loading data:', error));
}

// Update the current date
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = today;
}

// Update metric cards with data
function updateMetrics() {
    const currentMonth = chartData.currentMonth;
    document.getElementById('totalIncome').textContent = '$' + formatNumber(currentMonth.totalIncome);
    document.getElementById('totalExpenses').textContent = '$' + formatNumber(currentMonth.totalExpenses);
    document.getElementById('totalSavings').textContent = '$' + formatNumber(currentMonth.savings);
    document.getElementById('savingsRate').textContent = currentMonth.savingsRate;
}

// Format numbers with commas
function formatNumber(num) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Initialize charts
function initializeCharts() {
    createMonthlyChart();
    createCategoryChart();
}

// Create Monthly Income vs Expenses Bar Chart
function createMonthlyChart() {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    // Create gradients
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(0, 'rgba(76, 175, 80, 0.8)');
    gradient1.addColorStop(1, 'rgba(76, 175, 80, 0.1)');

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 300);
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
                        label: function(context) {
                            return context.dataset.label + ': $' + formatNumber(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000).toFixed(1) + 'k';
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
function createCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    const categoryLabels = Object.keys(chartData.categoryBreakdown);
    const categoryData = Object.values(chartData.categoryBreakdown);

    const colors = [
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
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': $' + formatNumber(context.parsed) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Populate category breakdown list
function populateCategoryList() {
    const categoryList = document.getElementById('categoryList');
    const categories = chartData.categoryBreakdown;
    const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

    const categoryHTML = Object.entries(categories)
        .map(([name, amount]) => {
            const percentage = ((amount / total) * 100).toFixed(1);
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

// Handle window resize for responsive charts
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        if (monthlyChartInstance) monthlyChartInstance.resize();
        if (categoryChartInstance) categoryChartInstance.resize();
    }, 250);
});

// Log successful initialization
console.log('Financial Dashboard initialized successfully');
