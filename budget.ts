// ══════════════════════════════════════════════════════════════
// BUDGET PAGE
// ══════════════════════════════════════════════════════════════

// Type Definitions
interface BudgetItem {
    icon: string;
    name: string;
    limit: number;
    spent: number;
}

type BudgetState = "safe" | "warning" | "danger";

// Constants
const MONTHS: string[] = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// State Variables
let currentDate: Date = new Date(2026, 1);
let editingIdx: number | null = null;
let budgets: BudgetItem[] = [];

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', function (): void {
    loadBudgetData();
    setupModalListener();
});

// Load Budget Data from JSON
function loadBudgetData(): void {
    fetch('budget-data.json')
        .then((response: Response) => response.json())
        .then((data: BudgetItem[]) => {
            budgets = data;
            changeMonth(0);
            render();
        })
        .catch((error: Error) => {
            console.error('Error loading budget data:', error);
            // Fallback: start with empty budgets
            budgets = [];
            changeMonth(0);
            render();
        });
}

// Month Navigation
function changeMonth(dir: number): void {
    currentDate.setMonth(currentDate.getMonth() + dir);
    const monthLabel: HTMLElement | null = document.getElementById("monthLabel");
    if (monthLabel) {
        monthLabel.textContent =
            MONTHS[currentDate.getMonth()] + " " + currentDate.getFullYear();
    }
}

// Render Budget Cards
function render(): void {
    const grid: HTMLElement | null = document.getElementById("budgetsGrid");
    const empty: HTMLElement | null = document.getElementById("emptyState");

    if (!grid || !empty) return;

    if (budgets.length === 0) {
        grid.innerHTML = "";
        empty.style.display = "block";
        updateSummary();
        return;
    }

    empty.style.display = "none";

    grid.innerHTML = budgets.map((b: BudgetItem, i: number): string => {
        const pct: number = Math.min((b.spent / b.limit) * 100, 100);
        const over: boolean = b.spent > b.limit;
        const warn: boolean = !over && pct >= 90;
        const state: BudgetState = over ? "danger" : warn ? "warning" : "safe";
        const remain: number = b.limit - b.spent;

        return `
            <div class="budget-card">
                <div class="card-header">
                    <div class="card-title">
                        <span class="card-icon">${b.icon}</span>
                        <span class="card-name">${b.name}</span>
                    </div>
                    <div class="card-actions">
                        <button class="icon-btn" onclick="openEdit(${i})"
                            title="Edit">✏️</button>
                        <button class="icon-btn del" onclick="deleteBudget(${i})"
                            title="Delete">🗑</button>
                    </div>
                </div>

                <div class="amounts">
                    <span class="spent-label">Spent: <span>$${b.spent.toFixed(2)}</span></span>
                    <span class="budget-label">Limit: <span>$${b.limit.toFixed(2)}</span></span>
                </div>

                <div class="progress-wrap">
                    <div class="budget-progress-bar ${state}"
                        style="width:${pct.toFixed(1)}%"></div>
                </div>

                <div class="card-footer">
                    <span class="remaining ${state}">
                        ${over ? "Over by $" + Math.abs(remain).toFixed(2) : "$" +
                            remain.toFixed(2) + " left"}
                    </span>
                    <span class="pct-label">${pct.toFixed(0)}% used</span>
                </div>

                ${over ? '<span class="alert-badge over">⚠️ Over Budget</span>' :
                    warn ? '<span class="alert-badge">⚠️ Near Limit</span>' : ''}
            </div>`;
    }).join("");

    updateSummary();
}

// Update Summary Cards
function updateSummary(): void {
    const totalBudget: number = budgets.reduce((s: number, b: BudgetItem) => s + b.limit, 0);
    const totalSpent: number = budgets.reduce((s: number, b: BudgetItem) => s + b.spent, 0);
    const remain: number = totalBudget - totalSpent;

    const totalBudgetEl: HTMLElement | null = document.getElementById("totalBudget");
    const totalSpentEl: HTMLElement | null = document.getElementById("totalSpent");
    const totalRemainEl: HTMLElement | null = document.getElementById("totalRemain");
    const spentCardEl: HTMLElement | null = document.getElementById("spentCard");
    const remainCardEl: HTMLElement | null = document.getElementById("remainCard");

    if (totalBudgetEl) {
        totalBudgetEl.textContent = "$" + totalBudget.toFixed(2);
    }
    if (totalSpentEl) {
        totalSpentEl.textContent = "$" + totalSpent.toFixed(2);
    }
    if (totalRemainEl) {
        totalRemainEl.textContent =
            (remain < 0 ? "-$" : "$") + Math.abs(remain).toFixed(2);
    }
    if (spentCardEl) {
        spentCardEl.className =
            "summary-card " + (totalSpent / totalBudget > 0.9 ? "over" : "warn");
    }
    if (remainCardEl) {
        remainCardEl.className =
            "summary-card " + (remain < 0 ? "over" : "");
    }
}

// Add New Budget
function addBudget(): void {
    const iconEl: HTMLSelectElement | null = document.getElementById("catIcon") as HTMLSelectElement | null;
    const nameEl: HTMLInputElement | null = document.getElementById("catName") as HTMLInputElement | null;
    const limitEl: HTMLInputElement | null = document.getElementById("catLimit") as HTMLInputElement | null;
    const spentEl: HTMLInputElement | null = document.getElementById("catSpent") as HTMLInputElement | null;

    if (!iconEl || !nameEl || !limitEl || !spentEl) return;

    const icon: string = iconEl.value;
    const name: string = nameEl.value.trim();
    const limit: number = parseFloat(limitEl.value);
    const spent: number = parseFloat(spentEl.value) || 0;

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
    nameEl.value = "";
    limitEl.value = "";
    spentEl.value = "";

    render();
}

// Delete Budget
function deleteBudget(i: number): void {
    if (confirm(`Delete "${budgets[i].name}" budget?`)) {
        budgets.splice(i, 1);
        render();
    }
}

// Edit Modal: Open
function openEdit(i: number): void {
    editingIdx = i;
    const editNameEl: HTMLInputElement | null = document.getElementById("editName") as HTMLInputElement | null;
    const editLimitEl: HTMLInputElement | null = document.getElementById("editLimit") as HTMLInputElement | null;
    const editSpentEl: HTMLInputElement | null = document.getElementById("editSpent") as HTMLInputElement | null;
    const editModalEl: HTMLElement | null = document.getElementById("editModal");

    if (editNameEl) editNameEl.value = budgets[i].name;
    if (editLimitEl) editLimitEl.value = budgets[i].limit.toString();
    if (editSpentEl) editSpentEl.value = budgets[i].spent.toString();
    if (editModalEl) editModalEl.classList.add("open");
}

// Edit Modal: Close
function closeModal(): void {
    const editModalEl: HTMLElement | null = document.getElementById("editModal");
    if (editModalEl) editModalEl.classList.remove("open");
    editingIdx = null;
}

// Edit Modal: Save
function saveEdit(): void {
    const editNameEl: HTMLInputElement | null = document.getElementById("editName") as HTMLInputElement | null;
    const editLimitEl: HTMLInputElement | null = document.getElementById("editLimit") as HTMLInputElement | null;
    const editSpentEl: HTMLInputElement | null = document.getElementById("editSpent") as HTMLInputElement | null;

    if (!editNameEl || !editLimitEl || !editSpentEl) return;

    const name: string = editNameEl.value.trim();
    const limit: number = parseFloat(editLimitEl.value);
    const spent: number = parseFloat(editSpentEl.value) || 0;

    if (!name || !limit || limit <= 0) {
        alert("Please fill in all fields correctly.");
        return;
    }

    if (editingIdx !== null) {
        budgets[editingIdx] = { ...budgets[editingIdx], name, limit, spent };
    }
    closeModal();
    render();
}

// Edit Modal: Click Outside to Close
function setupModalListener(): void {
    const editModalEl: HTMLElement | null = document.getElementById("editModal");
    if (editModalEl) {
        editModalEl.addEventListener("click", function (e: MouseEvent): void {
            if (e.target === editModalEl) closeModal();
        });
    }
}

// Log successful initialization
console.log("Budget Manager initialized successfully");