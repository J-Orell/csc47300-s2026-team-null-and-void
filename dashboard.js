// Load data from JSON
let chartData = {};

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        chartData = data;
        updateStatsCards();
        initializeCharts();
        updateDate();
    })
    .catch(error => console.error('Error loading data:', error));

function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = today;
}

function updateStatsCards() {
    const data = chartData.currentMonth;
    document.getElementById('totalIncome').textContent = '$' + data.totalIncome.toLocaleString();
    document.getElementById('totalExpenses').textContent = '$' + data.totalExpenses.toLocaleString();
    document.getElementById('totalSavings').textContent = '$' + data.savings.toLocaleString();
    document.getElementById('savingsRate').textContent = data.savingsRate;
}

function initializeCharts() {
    // Monthly Income vs Expenses Chart
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    const gradient1 = monthlyCtx.createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(0, 'rgba(76, 175, 80, 0.8)');
    gradient1.addColorStop(1, 'rgba(76, 175, 80, 0.1)');

    const gradient2 = monthlyCtx.createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0, 'rgba(255, 107, 107, 0.8)');
    gradient2.addColorStop(1, 'rgba(255, 107, 107, 0.1)');

    new Chart(monthlyCtx, {
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
                    hoverBackgroundColor: 'rgba(76, 175, 80, 0.9)',
                    tension: 0.3
                },
                {
                    label: 'Expenses',
                    data: chartData.monthlyData.expenses,
                    backgroundColor: gradient2,
                    borderColor: '#FF6B6B',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                    hoverBackgroundColor: 'rgba(255, 107, 107, 0.9)',
                    tension: 0.3
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
                        font: { size: 13, weight: '500', family: "'Inter', sans-serif" },
                        color: '#666',
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 13, weight: 'bold' },
                    bodyFont: { size: 12 },
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    displayColors: true,
                    boxPadding: 8,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        },
                        color: '#999',
                        font: { size: 11 }
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

    // Category Spending Pie Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
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

    new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: categoryLabels,
            datasets: [
                {
                    data: categoryData,
                    backgroundColor: colors.slice(0, categoryLabels.length),
                    borderColor: 'white',
                    borderWidth: 3,
                    hoverOffset: 8,
                    hoverBorderColor: '#f5f5f5'
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
                        font: { size: 12, weight: '500', family: "'Inter', sans-serif" },
                        color: '#666',
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 13, weight: 'bold' },
                    bodyFont: { size: 12 },
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': $' + context.parsed.toLocaleString() + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}
