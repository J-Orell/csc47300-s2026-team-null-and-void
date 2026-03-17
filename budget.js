// ══════════════════════════════════════════════════════════════
// BUDGET PAGE - JavaScript
// ══════════════════════════════════════════════════════════════

// ── Constants ──
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// ── State Variables ──
let currentDate = new Date(2026, 1);
let editingIdx = null;
let budgets = [];

// ── Initialize on Page Load ──
document.addEventListener('DOMContentLoaded', function () {
    loadBudgetData();
    setupModalListener();
});

// ── Load Budget Data from JSON ──
function loadBudgetData() {
    fetch('budget-data.json')
        .then(response => response.json())
        .then(data => {
            budgets = data;
            changeMonth(0);
            render();
        })
        .catch(error => {
            console.error('Error loading budget data:', error);
            // Fallback: start with empty budgets
            budgets = [];
            changeMonth(0);
            render();
        });
}

// ── Month Navigation ──
function changeMonth(dir) {
    currentDate.setMonth(currentDate.getMonth() + dir);
    document.getElementById("monthLabel").textContent =
        MONTHS[currentDate.getMonth()] + " " + currentDate.getFullYear();
}

// ── Render Budget Cards ──
function render() {
    const grid = document.getElementById("budgetsGrid");
    const empty = document.getElementById("emptyState");

    if (budgets.length === 0) {
        grid.innerHTML = "";
        empty.style.display = "block";
        updateSummary();
        return;
    }

    empty.style.display = "none";

    grid.innerHTML = budgets.map((b, i) => {
        const pct = Math.min((b.spent / b.limit) * 100, 100);
        const over = b.spent > b.limit;
        const warn = !over && pct >= 90;
        const state = over ? "danger" : warn ? "warning" : "safe";
        const remain = b.limit - b.spent;

        return `
            <div class="budget-card">
                <div class="card-header">
                    <div class="card-title">
                        <span class="card-icon">${b.icon}</span>
                        <span class="card-name">${b.name}</span>
                    </div>
                    <div class="card-actions">
                        <button class="icon-btn" onclick="openEdit(${i})" title="Edit">✏️</button>
                        <button class="icon-btn del" onclick="deleteBudget(${i})" title="Delete">🗑</button>
                    </div>
                </div>

                <div class="amounts">
                    <span class="spent-label">Spent: <span>$${b.spent.toFixed(2)}</span></span>
                    <span class="budget-label">Limit: <span>$${b.limit.toFixed(2)}</span></span>
                </div>

                <div class="progress-wrap">
                    <div class="budget-progress-bar ${state}" style="width:${pct.toFixed(1)}%"></div>
                </div>

                <div class="card-footer">
                    <span class="remaining ${state}">
                        ${over ? "Over by $" + Math.abs(remain).toFixed(2) : "$" + remain.toFixed(2) + " left"}
                    </span>
                    <span class="pct-label">${pct.toFixed(0)}% used</span>
                </div>

                ${over ? '<span class="alert-badge over">⚠️ Over Budget</span>' :
                  warn ? '<span class="alert-badge">⚠️ Near Limit</span>' : ''}
            </div>`;
    }).join("");

    updateSummary();
}

// ── Update Summary Cards ──
function updateSummary() {
    const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
    const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
    const remain = totalBudget - totalSpent;

    document.getElementById("totalBudget").textContent = "$" + totalBudget.toFixed(2);
    document.getElementById("totalSpent").textContent = "$" + totalSpent.toFixed(2);
    document.getElementById("totalRemain").textContent =
        (remain < 0 ? "-$" : "$") + Math.abs(remain).toFixed(2);

    document.getElementById("spentCard").className =
        "summary-card " + (totalSpent / totalBudget > 0.9 ? "over" : "warn");
    document.getElementById("remainCard").className =
        "summary-card " + (remain < 0 ? "over" : "");
}

// ── Add New Budget ──
function addBudget() {
    const icon = document.getElementById("catIcon").value;
    const name = document.getElementById("catName").value.trim();
    const limit = parseFloat(document.getElementById("catLimit").value);
    const spent = parseFloat(document.getElementById("catSpent").value) || 0;

    if (!name) {
        alert("Please enter a category name.");
        return;
    }
    if (!limit || limit <= 0) {
        alert("Please enter a valid budget limit.");
        return;
    }

    budgets.push({ icon, name, limit, spent });

    // Clear form inputs
    document.getElementById("catName").value = "";
    document.getElementById("catLimit").value = "";
    document.getElementById("catSpent").value = "";

    render();
}

// ── Delete Budget ──
function deleteBudget(i) {
    if (confirm(`Delete "${budgets[i].name}" budget?`)) {
        budgets.splice(i, 1);
        render();
    }
}

// ── Edit Modal: Open ──
function openEdit(i) {
    editingIdx = i;
    document.getElementById("editName").value = budgets[i].name;
    document.getElementById("editLimit").value = budgets[i].limit;
    document.getElementById("editSpent").value = budgets[i].spent;
    document.getElementById("editModal").classList.add("open");
}

// ── Edit Modal: Close ──
function closeModal() {
    document.getElementById("editModal").classList.remove("open");
    editingIdx = null;
}

// ── Edit Modal: Save ──
function saveEdit() {
    const name = document.getElementById("editName").value.trim();
    const limit = parseFloat(document.getElementById("editLimit").value);
    const spent = parseFloat(document.getElementById("editSpent").value) || 0;

    if (!name || !limit || limit <= 0) {
        alert("Please fill in all fields correctly.");
        return;
    }

    budgets[editingIdx] = { ...budgets[editingIdx], name, limit, spent };
    closeModal();
    render();
}

// ── Edit Modal: Click Outside to Close ──
function setupModalListener() {
    document.getElementById("editModal").addEventListener("click", function (e) {
        if (e.target === this) closeModal();
    });
}

// Log successful initialization
console.log("Budget Manager initialized successfully");