const balanceLabel = document.getElementById("balance");
const incomeLabel = document.getElementById("income");
const expenseLabel = document.getElementById("expense");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");

const transactionForm = document.getElementById("transaction-form");
const transactionList = document.getElementById("transaction-list");

const USDformat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactions.forEach((transaction) => {
    const li = createTransaction(transaction);
    transactionList.appendChild(li);
});
updateSummary();

transactionForm.addEventListener("submit", addTransaction);

function addTransaction(event){
    event.preventDefault();
    let description = descriptionInput.value;
    let amount = Number(amountInput.value);
    if (description == "" || amount == ""){
        alert("Please fill out both description and amount!");
        return;
    }
    let transaction = {id: Date.now(), description, amount};
    updateTransactionList(transaction);
    updateSummary();
    transactionForm.reset();
}

function createTransaction(transaction){
    const li = document.createElement("li");
    if (transaction.amount > 0){
        li.classList.add("income");
    }
    else{
        li.classList.add("expense");
    }
    li.innerHTML = `
        <div class="card">
            <p>${transaction.description}</p>
            <p>${USDformat.format(transaction.amount)}</p>
        </div>
    `;
    li.onclick = () => {
        removeTransaction(transaction.id);
    };
    return li;
}

function removeTransaction(id){
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    transactionList.innerHTML = "";
    transactions.forEach(t => transactionList.appendChild(createTransaction(t)));
    updateSummary();
}

function updateTransactionList(transaction){
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    const li = createTransaction(transaction);
    transactionList.appendChild(li);
}

function updateSummary(){
    let income = 0, expense = 0;
    transactions.forEach((transaction) => {
        if (transaction.amount > 0)
            income += transaction.amount;
        else
            expense += transaction.amount;
    });
    incomeLabel.textContent = USDformat.format(income);
    expenseLabel.textContent = USDformat.format(Math.abs(expense));
    let balance = income + expense;
    if (balance > 0)
        balanceLabel.style.color = "green";
    else if (balance < 0)
        balanceLabel.style.color = "red";
    else
        balanceLabel.style.color = "black";
    balanceLabel.textContent = USDformat.format(Math.abs(balance));
}