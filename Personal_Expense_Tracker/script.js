let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let expenseId = expenses.length > 0 ? expenses[expenses.length - 1].id + 1 : 1;
let walletAmount = parseFloat(localStorage.getItem('walletAmount')) || 500.00;
let incomeAmount = parseFloat(localStorage.getItem('incomeAmount')) || 0.00;


const addExpense = () => {
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;

    document.getElementById("descriptionError").textContent = "";
    document.getElementById("amountError").textContent = "";
    document.getElementById("dateError").textContent = "";
    document.getElementById("categoryError").textContent = "";

    let isValid = true;

    const descriptionRegex = /^[a-zA-Z0-9\s]{2,30}$/;
    if (!descriptionRegex.test(description)) {
        document.getElementById("descriptionError").textContent = "Description can contain letters, numbers, and spaces";
        isValid = false;
    } else {
        document.getElementById("descriptionError").textContent = "";
    }

    const amountRegex = /^[0-9]+$/;
    if (!amountRegex.test(amount) || amount <= 0) {
        document.getElementById("amountError").textContent = "Invalid Amount.";
        isValid = false;
    } else {
        document.getElementById("amountError").textContent = "";
    }

    if (!date) {
        document.getElementById("dateError").textContent = "Date is required.";
        isValid = false;
    } else {
        document.getElementById("dateError").textContent = "";
    }

    if (category === "SelectCategory") {
        document.getElementById("categoryError").textContent = "Please select a category.";
        isValid = false;
    } else {
        document.getElementById("categoryError").textContent = "";
    }

    if (amount > walletAmount) {
        document.getElementById("expenseLimitError").textContent = "Insufficient Balance!";
        isValid = false;
    }


    if (isValid) {
        const newExpense = {
            id: expenseId++,
            description,
            amount,
            date,
            category,
        };

        expenses.push(newExpense);
        const successMessage = document.getElementById("successMessage");
        successMessage.style.display = "block";

        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);

        localStorage.setItem('expenses', JSON.stringify(expenses));

        walletAmount -= amount;
        localStorage.setItem('walletAmount', walletAmount);

        updateWalletAmount();
        displayExpenses();
        updatePieChart();
        updateMonthlyLineGraph();
        closeExpensePopup();

    }
};

const createTableCell = (content) => {
    const cell = document.createElement("td");
    cell.textContent = content;
    return cell;
};

const createActionButtons = (expenseId) => {
    const cell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.innerHTML = "&#9998;";

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.innerHTML = "&#128465;";

    editButton.onclick = () => editExpense(expenseId);
    deleteButton.onclick = () => deleteExpense(expenseId);

    cell.appendChild(editButton);
    cell.appendChild(deleteButton);

    return cell;
};

const displayExpenses = () => {
    const expenseTableBody = document.querySelector("#expenseTable tbody");
    expenseTableBody.textContent = "";

    let totalExpenses = 0;
    expenses.forEach(expense => {
        totalExpenses += expense.amount;

        const row = document.createElement("tr");
        row.id = `expense_${expense.id}`;
        row.appendChild(createTableCell(expense.description));
        row.appendChild(createTableCell(expense.amount));
        row.appendChild(createTableCell(expense.date));
        row.appendChild(createTableCell(expense.category));
        row.appendChild(createActionButtons(expense.id));

        expenseTableBody.appendChild(row);
    });

    const totalElement = document.getElementById("total");
    if (totalElement) {
        totalElement.textContent = totalExpenses;
    }
};



const editExpense = (id) => {
    const expense = expenses.find(exp => exp.id === id);
    if (expense) {
        document.getElementById("description").value = expense.description;
        document.getElementById("amount").value = expense.amount;
        document.getElementById("date").value = expense.date;
        document.getElementById("category").value = expense.category;

        const addButton = document.querySelector(".popup-content button");
        addButton.textContent = "Update Expense";
        addButton.onclick = () => updateExpense(id);

        openExpensePopup();
    }
};

const updateExpense = (id) => {
    const description = document.getElementById("description").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;

    if (description && amount > 0 && date) {
        const expense = expenses.find(exp => exp.id === id);
        expense.description = description;
        expense.amount = amount;
        expense.date = date;
        expense.category = category;

        localStorage.setItem('expenses', JSON.stringify(expenses));
        displayExpenses();
        updatePieChart();
        updateMonthlyLineGraph();
        closeExpensePopup();
    }
};
const deleteExpense = (id) => {
    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
    updatePieChart();
    updateMonthlyLineGraph();
};

const openAddCashPopup = () => {
    const cashAmount = prompt("Enter cash amount to add:");
    if (cashAmount && parseFloat(cashAmount) > 0) {
        walletAmount += parseFloat(cashAmount);
        localStorage.setItem('walletAmount', walletAmount);
        updateWalletAmount();
    }
};

const updateWalletAmount = () => {
    const walletAmountElement = document.getElementById("walletAmount");
    if (walletAmountElement) {
        walletAmountElement.textContent = walletAmount;
    }
};


const searchExpenses = () => {
    const query = document.getElementById("searchBar").value.toLowerCase().trim();
    const expenseRows = document.querySelectorAll("#expenseTable tbody tr");

    expenseRows.forEach(row => {
        const description = row.children[0].textContent.toLowerCase();
        row.style.display = description.includes(query) ? "" : "none";
    });
};
const sortExpenses = () => {
    const sortBy = document.getElementById("sortingDropdown").value;
    if (sortBy === "amount-low-to-high") {
        expenses.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === "amount-high-to-low") {
        expenses.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === "date") {
        expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    displayExpenses();
};

document.getElementById("searchBar").addEventListener("input", searchExpenses);
document.getElementById("sortingDropdown").addEventListener("change", sortExpenses);

const updateCategoryTotals = () => {
    categoryTotals = {
        'Food': 0,
        'Transport': 0,
        'Entertainment': 0,
        'Rent': 0,
        'Others': 0
    };

    expenses.forEach(expense => {
        categoryTotals[expense.category] += expense.amount;
    });

    updatePieChart();
};

let pieChart;

const updateTotals = () => {
    let expense = expenses.reduce((total, expense) => total + expense.amount, 0);
    let income = incomeAmount;
    let balance = income - expense;

    document.getElementById('incomeAmount').innerText = income;
    document.getElementById('expenseAmount').innerText = expense;
    document.getElementById('balanceAmount').innerText = balance;

    updatePieChart();
};

const updatePieChart = () => {
    categoryTotals = {
        'Food': 0,
        'Transport': 0,
        'Entertainment': 0,
        'Rent': 0,
        'Others': 0
    };

    expenses.forEach(expenseItem => {
        categoryTotals[expenseItem.category] += expenseItem.amount;
    });

    const chartData = {
        labels: Object.keys(categoryTotals),
        datasets: [{
            data: Object.values(categoryTotals),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#00ABA9', '#974e9d'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#00ABA9', '#974e9d']
        }]
    };

    if (pieChart) {
        pieChart.destroy();
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: chartData,
        options: {
            responsive: true,
            title: {
                display: true,
                text: "Expenses by Category"
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            const category = tooltipItem.label;
                            const value = tooltipItem.raw;
                            return `${category}: Rs. ${value}`;
                        }
                    }
                }
            }
        }
    });
};
updateTotals();

const getMonthlyExpenses = () => {
    const monthlyExpenses = {};

    expenses.forEach(expense => {
        const date = new Date(expense.date);
        const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`;

        if (!monthlyExpenses[monthYear]) {
            monthlyExpenses[monthYear] = 0;
        }

        monthlyExpenses[monthYear] += expense.amount;
    });

    return monthlyExpenses;
};


const updateMonthlyLineGraph = () => {
    const monthlyExpenses = getMonthlyExpenses();

    const months = Object.keys(monthlyExpenses);
    const totals = Object.values(monthlyExpenses);

    const ctx = document.getElementById('monthlyChart');

    if (ctx) {
        const monthlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Total Expenses by Month',
                    data: totals,
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Month-Year'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Total Expense Amount (Rs.)'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }
};

window.onload = () => {
    updateWalletAmount();
    displayExpenses();
    updatePieChart();
    updateMonthlyLineGraph();
};

const updateIncomeAmount = () => {
    const incomeAmountElement = document.getElementById("incomeAmount");
    if (incomeAmountElement) {
        incomeAmountElement.innerText = income;
    }
    updateMonthlyLineGraph();
};

const addIncome = () => {
    const incomeInput = document.getElementById("incomeInput").value.trim();

    document.getElementById("incomeError").textContent = "";

    const incomeRegex = /^[0-9]*\.?[0-9]+$/;

    if (!incomeRegex.test(incomeInput) || incomeInput <= 0) {
        document.getElementById("incomeError").textContent = "Please enter a valid positive number for income.";
    } else {
        incomeAmount += parseFloat(incomeInput);
        document.getElementById("incomeAmount").textContent = incomeAmount;
        localStorage.setItem('incomeAmount', incomeAmount);

        updateBalance();

        document.getElementById("incomeInput").value = '';
    }
};


const updateBalance = () => {
    const expensesAmount = parseFloat(document.getElementById("expenseAmount").textContent);
    const balance = incomeAmount - expensesAmount;
    document.getElementById("balanceAmount").textContent = balance;
};

const openExpensePopup = () => {
    document.getElementById("expensePopup").style.display = "flex";
    document.getElementById("incomePopup").style.display = "none";

    document.querySelector('.status-tab[data-filter="all"]').classList.add('active');
    document.querySelector('.status-tab[data-filter="pending"]').classList.remove('active');
};

const closeExpensePopup = () => {
    document.getElementById("expensePopup").style.display = "none";
};

const openIncomePopup = () => {
    document.getElementById("incomePopup").style.display = "flex";
    document.getElementById("expensePopup").style.display = "none";

    document.querySelector('.status-tab[data-filter="pending"]').classList.add('active');
    document.querySelector('.status-tab[data-filter="all"]').classList.remove('active');
};

const closeIncomePopup = () => {
    document.getElementById("incomePopup").style.display = "none";
};



document.getElementById("walletAmount").textContent = walletAmount;

let currentFilter = 'all';

const tabs = document.querySelectorAll('.status-tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        display();
    });
});

function display() {
    taskList.innerHTML = ''

    tasks.filter(task => {
        if (currentFilter === 'pending') return task.status === 'Pending';
        if (currentFilter === 'completed') return task.status === 'Completed';
        return true;
    })
        .forEach(task => createTaskElement(task));
}



