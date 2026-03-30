// ══════════════════════════════════════════════════════════════
// TRANSACTIONS PAGE
// ══════════════════════════════════════════════════════════════

// Type Definitions
type TransactionType = "income" | "expense";
type CategoryKey = "income" | "food" | "utilities" | "entertainment" | "transport" | "shopping";

interface Transaction {
    id: number;
    date: string;
    description: string;
    category: CategoryKey;
    amount: number;
    type: TransactionType;
}

interface CategoryDisplay {
    label: string;
    cssClass: string;
}

interface CategoryMap {
    [key: string]: CategoryDisplay;
}

// Global Variables
let transactions: Transaction[] = [];
let nextId: number = 1;
let currentPage: number = 1;
const rowsPerPage: number = 5;
let editingId: number | null = null;

// Category display mapping
const categoryMap: CategoryMap = {
    income: { label: "Income", cssClass: "income-cat" },
    food: { label: "Food", cssClass: "food" },
    utilities: { label: "Utilities", cssClass: "utilities" },
    entertainment: { label: "Entertainment", cssClass: "entertainment" },
    transport: { label: "Transport", cssClass: "transport" },
    shopping: { label: "Shopping", cssClass: "shopping" }
};

// Initialize
document.addEventListener("DOMContentLoaded", function (): void {
    loadTransactions();
    setupEventListeners();
    injectModal();
});

// Load Transactions from JSON
function loadTransactions(): void {
    fetch("/data/transactions-data.json")
        .then((response: Response) => response.json())
        .then((data: Transaction[]) => {
            transactions = data;
            // Set nextId to one more than the highest existing id
            const maxId: number = transactions.reduce(
                (max: number, t: Transaction) => (t.id > max ? t.id : max),
                0
            );
            nextId = maxId + 1;
            renderTable();
            updateSummary();
        })
        .catch((error: Error) => {
            console.error("Error loading transactions:", error);
            // If fetch fails, start with empty array
            transactions = [];
            nextId = 1;
            renderTable();
            updateSummary();
        });
}

// Inject Add/Edit Modal into the DOM
function injectModal(): void {
    const modalHTML: string = `
    <div class="modal-overlay" id="txModal">
        <div class="modal">
            <h3 id="modalTitle">Add Transaction</h3>
            <div class="field">
                <label>Date</label>
                <input type="date" id="txDate" value="2026-02-20">
            </div>
            <div class="field">
                <label>Description</label>
                <input type="text" id="txDesc" placeholder="e.g. Grocery shopping">
            </div>
            <div class="field">
                <label>Category</label>
                <select id="txCategory">
                    <option value="income">Income</option>
                    <option value="food">Food</option>
                    <option value="utilities">Utilities</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="transport">Transport</option>
                    <option value="shopping">Shopping</option>
                </select>
            </div>
            <div class="field">
                <label>Amount ($)</label>
                <input type="number" id="txAmount" placeholder="0.00" min="0.01" step="0.01">
            </div>
            <div class="modal-btns">
                <button class="btn-save" id="txSaveBtn">Save</button>
                <button class="btn-cancel-modal" id="txCancelBtn">Cancel</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Modal event listeners
    const saveBtn: HTMLElement | null = document.getElementById("txSaveBtn");
    const cancelBtn: HTMLElement | null = document.getElementById("txCancelBtn");
    const modalOverlay: HTMLElement | null = document.getElementById("txModal");

    if (saveBtn) saveBtn.addEventListener("click", saveTransaction);
    if (cancelBtn) cancelBtn.addEventListener("click", closeTransactionModal);
    if (modalOverlay) {
        modalOverlay.addEventListener("click", function (e: Event): void {
            if (e.target === modalOverlay) closeTransactionModal();
        });
    }
}

// Setup Event Listeners
function setupEventListeners(): void {
    // Add Transaction button
    const addBtn: HTMLElement | null = document.querySelector(".add-transaction-btn");
    if (addBtn) {
        addBtn.addEventListener("click", function (): void {
            openTransactionModal();
        });
    }

    // Filter button
    const filterBtn: HTMLElement | null = document.querySelector(".btn-filter");
    if (filterBtn) {
        filterBtn.addEventListener("click", function (): void {
            currentPage = 1;
            renderTable();
        });
    }
}

// Get Filtered Transactions
function getFilteredTransactions(): Transaction[] {
    let filtered: Transaction[] = [...transactions];

    const categoryFilter: HTMLSelectElement | null = document.getElementById("filter-category") as HTMLSelectElement | null;
    const typeFilter: HTMLSelectElement | null = document.getElementById("filter-type") as HTMLSelectElement | null;
    const dateFilter: HTMLInputElement | null = document.getElementById("filter-date") as HTMLInputElement | null;

    // Filter by category
    if (categoryFilter && categoryFilter.value !== "all") {
        const catValue: string = categoryFilter.value;
        filtered = filtered.filter(function (t: Transaction): boolean {
            return t.category === catValue;
        });
    }

    // Filter by type
    if (typeFilter && typeFilter.value !== "all") {
        const typeValue: string = typeFilter.value;
        filtered = filtered.filter(function (t: Transaction): boolean {
            return t.type === typeValue;
        });
    }

    // Filter by date range (show transactions ON or AFTER the selected date)
    if (dateFilter && dateFilter.value) {
        const fromDate: Date = new Date(dateFilter.value + "T00:00:00");
        filtered = filtered.filter(function (t: Transaction): boolean {
            const txDate: Date = new Date(t.date + "T00:00:00");
            return txDate >= fromDate;
        });
    }

    // Sort by date descending
    filtered.sort(function (a: Transaction, b: Transaction): number {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return filtered;
}

// Toggle Empty State
function toggleEmptyState(filteredCount: number): void {
    const tableWrapper: HTMLElement | null = document.querySelector(".table-wrapper");
    const pagination: HTMLElement | null = document.querySelector(".pagination");

    // Check if empty state element already exists; if not, create it
    let emptyState: HTMLElement | null = document.getElementById("txEmptyState");
    if (!emptyState) {
        const emptyHTML: string = `
        <div class="empty-state" id="txEmptyState" style="display:none;">
            <div class="icon">📋</div>
            <p>No transactions found. Add one or adjust your filters!</p>
        </div>`;
        if (tableWrapper) {
            tableWrapper.insertAdjacentHTML("afterend", emptyHTML);
            emptyState = document.getElementById("txEmptyState");
        }
    }

    if (filteredCount === 0) {
        if (tableWrapper) tableWrapper.style.display = "none";
        if (pagination) pagination.style.display = "none";
        if (emptyState) emptyState.style.display = "block";
    } else {
        if (tableWrapper) tableWrapper.style.display = "";
        if (pagination) pagination.style.display = "";
        if (emptyState) emptyState.style.display = "none";
    }
}

// Render Table
function renderTable(): void {
    const tbody: HTMLTableSectionElement | null = document.querySelector("tbody");
    if (!tbody) return;

    const filtered: Transaction[] = getFilteredTransactions();

    // Toggle empty state based on filtered results
    toggleEmptyState(filtered.length);

    const totalPages: number = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const startIdx: number = (currentPage - 1) * rowsPerPage;
    const pageData: Transaction[] = filtered.slice(startIdx, startIdx + rowsPerPage);

    tbody.innerHTML = pageData.map(function (t: Transaction): string {
        const catInfo: CategoryDisplay = categoryMap[t.category] || { label: t.category, cssClass: t.category };
        const amountClass: string = t.type === "income" ? "income" : "expense";
        const amountPrefix: string = t.type === "income" ? "+$" : "-$";
        const formattedDate: string = formatDate(t.date);

        return `
        <tr>
            <td class="tx-date">${formattedDate}</td>
            <td class="tx-description">${t.description}</td>
            <td><span class="tx-category ${catInfo.cssClass}">${catInfo.label}</span></td>
            <td class="tx-amount ${amountClass}">${amountPrefix}${t.amount.toFixed(2)}</td>
            <td class="tx-actions">
                <button class="icon-btn" onclick="editTransaction(${t.id})" title="Edit">✏️</button>
                <button class="icon-btn del" onclick="deleteTransaction(${t.id})" title="Delete">🗑</button>
            </td>
        </tr>`;
    }).join("");

    // Update count label
    const countEl: HTMLElement | null = document.querySelector(".transaction-count");
    if (countEl) {
        countEl.textContent = "Showing " + pageData.length + " of " + filtered.length + " transactions";
    }

    renderPagination(totalPages);
    updateSummary();
}

// Render Pagination
function renderPagination(totalPages: number): void {
    const paginationEl: HTMLElement | null = document.querySelector(".pagination");
    if (!paginationEl) return;

    let html: string = `<button class="page-btn arrow" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? "disabled" : ""}>‹</button>`;

    for (let i: number = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? "active" : ""}" onclick="goToPage(${i})">${i}</button>`;
    }

    html += `<button class="page-btn arrow" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? "disabled" : ""}>›</button>`;

    paginationEl.innerHTML = html;
}

// Page Navigation
function goToPage(page: number): void {
    const filtered: Transaction[] = getFilteredTransactions();
    const totalPages: number = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
}

// Update Summary Cards
function updateSummary(): void {
    const totalIncome: number = transactions
        .filter(function (t: Transaction): boolean { return t.type === "income"; })
        .reduce(function (sum: number, t: Transaction): number { return sum + t.amount; }, 0);

    const totalExpenses: number = transactions
        .filter(function (t: Transaction): boolean { return t.type === "expense"; })
        .reduce(function (sum: number, t: Transaction): number { return sum + t.amount; }, 0);

    const balance: number = totalIncome - totalExpenses;

    const incomeEl: HTMLElement | null = document.querySelector(".summary-card:nth-child(1) .amount");
    const expenseEl: HTMLElement | null = document.querySelector(".summary-card:nth-child(2) .amount");
    const balanceEl: HTMLElement | null = document.querySelector(".summary-card:nth-child(3) .amount");

    if (incomeEl) incomeEl.textContent = "$" + formatNumber(totalIncome);
    if (expenseEl) expenseEl.textContent = "$" + formatNumber(totalExpenses);
    if (balanceEl) balanceEl.textContent = "$" + formatNumber(balance);
}

// Open Modal (Add or Edit)
function openTransactionModal(id?: number): void {
    editingId = id || null;
    const modal: HTMLElement | null = document.getElementById("txModal");
    const title: HTMLElement | null = document.getElementById("modalTitle");

    const dateInput: HTMLInputElement | null = document.getElementById("txDate") as HTMLInputElement | null;
    const descInput: HTMLInputElement | null = document.getElementById("txDesc") as HTMLInputElement | null;
    const catSelect: HTMLSelectElement | null = document.getElementById("txCategory") as HTMLSelectElement | null;
    const amountInput: HTMLInputElement | null = document.getElementById("txAmount") as HTMLInputElement | null;

    if (editingId !== null) {
        const tx: Transaction | undefined = transactions.find(function (t: Transaction): boolean { return t.id === editingId; });
        if (!tx) return;
        if (title) title.textContent = "Edit Transaction";
        if (dateInput) dateInput.value = tx.date;
        if (descInput) descInput.value = tx.description;
        if (catSelect) catSelect.value = tx.category;
        if (amountInput) amountInput.value = tx.amount.toString();
    } else {
        if (title) title.textContent = "Add Transaction";
        if (dateInput) dateInput.value = "2026-02-20";
        if (descInput) descInput.value = "";
        if (catSelect) catSelect.value = "food";
        if (amountInput) amountInput.value = "";
    }

    if (modal) modal.classList.add("open");
}

// Close Modal
function closeTransactionModal(): void {
    const modal: HTMLElement | null = document.getElementById("txModal");
    if (modal) modal.classList.remove("open");
    editingId = null;
}

// Save Transaction (Add or Update)
function saveTransaction(): void {
    const dateInput: HTMLInputElement | null = document.getElementById("txDate") as HTMLInputElement | null;
    const descInput: HTMLInputElement | null = document.getElementById("txDesc") as HTMLInputElement | null;
    const catSelect: HTMLSelectElement | null = document.getElementById("txCategory") as HTMLSelectElement | null;
    const amountInput: HTMLInputElement | null = document.getElementById("txAmount") as HTMLInputElement | null;

    if (!dateInput || !descInput || !catSelect || !amountInput) return;

    const date: string = dateInput.value;
    const description: string = descInput.value.trim();
    const category: CategoryKey = catSelect.value as CategoryKey;
    const amount: number = parseFloat(amountInput.value);

    if (!description) {
        alert("Please enter a description.");
        return;
    }
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const type: TransactionType = category === "income" ? "income" : "expense";

    if (editingId !== null) {
        // Update existing transaction
        const idx: number = transactions.findIndex(function (t: Transaction): boolean { return t.id === editingId; });
        if (idx !== -1) {
            transactions[idx] = {
                id: editingId,
                date: date,
                description: description,
                category: category,
                amount: amount,
                type: type
            };
        }
    } else {
        // Add new transaction
        transactions.push({
            id: nextId++,
            date: date,
            description: description,
            category: category,
            amount: amount,
            type: type
        });
    }

    closeTransactionModal();
    renderTable();
}

// Edit Transaction
function editTransaction(id: number): void {
    openTransactionModal(id);
}

// Delete Transaction
function deleteTransaction(id: number): void {
    const tx: Transaction | undefined = transactions.find(function (t: Transaction): boolean { return t.id === id; });
    if (!tx) return;

    if (confirm('Delete "' + tx.description + '"?')) {
        transactions = transactions.filter(function (t: Transaction): boolean { return t.id !== id; });
        renderTable();
    }
}

// Format Date
function formatDate(dateStr: string): string {
    const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d: Date = new Date(dateStr + "T00:00:00");
    return months[d.getMonth()] + " " + String(d.getDate()).padStart(2, "0") + ", " + d.getFullYear();
}

// Format Number with Commas
function formatNumber(num: number): string {
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Log successful initialization
console.log("Transaction Manager initialized successfully");