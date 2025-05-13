let trips = new Map();
let users = new Map();
let expenses = new Map();

function initializeTrip() {
    const tripName = document.getElementById("tripName").value;
    const numPeople = parseInt(document.getElementById("numPeople").value);
    
    if (!tripName || numPeople < 2) {
        alert("Please enter a valid trip name and at least two people.");
        return;
    }

    const tripId = Date.now().toString();
    const trip = {
        tripId,
        tripName,
        numPeople,
        usersMapped: [],
        expenseMap: new Map(),
        budget: 0,
        totalExpense: 0,
        tripStart: new Date(),
        tripEndDate: null,
        tripStatus: 'ongoing'
    };

    for (let i = 1; i <= numPeople; i++) {
        const name = prompt(`Enter name of person ${i}:`);
        const userId = Date.now().toString() + i;
        const user = { userId, name, age: null, email: null };
        users.set(userId, user);
        trip.usersMapped.push(userId);
    }

    addOrEditTrip(trip);
    renderTable();
    populateDropdowns();
    document.getElementById("expenseSection").classList.remove("hidden");
}

function renderTable() {
    let table = `<tr><th>Person</th>`;
    const trip = getAllTrips()[0];
    trip.usersMapped.forEach(userId => {
        const user = getUser(userId);
        table += `<th>${user.name}</th>`;
    });
    table += `</tr>`;
    
    trip.usersMapped.forEach(userId => {
        const user = getUser(userId);
        table += `<tr><td>${user.name}</td>`;
        trip.usersMapped.forEach(otherUserId => {
            const otherUser = getUser(otherUserId);
            const amount = trip.expenseMap.get(userId)?.get(otherUserId) || 0;
            table += `<td>${amount}</td>`;
        });
        table += `</tr>`;
    });
    
    document.getElementById("expenseTable").innerHTML = table;
}

function populateDropdowns() {
    let payerSelect = document.getElementById("payer");
    let beneficiariesSelect = document.getElementById("beneficiaries");
    payerSelect.innerHTML = "";
    beneficiariesSelect.innerHTML = "";

    const trip = getAllTrips()[0];
    trip.usersMapped.forEach(userId => {
        const user = getUser(userId);
        payerSelect.innerHTML += `<option value="${userId}">${user.name}</option>`;
        beneficiariesSelect.innerHTML += `<option value="${userId}">${user.name}</option>`;
    });
}

function toggleDistributionInputs() {
    const distribution = document.getElementById("distribution").value;
    const unequalInputs = document.getElementById("unequalDistributionInputs");
    if (distribution === "unequal") {
        unequalInputs.classList.remove("hidden");
    } else {
        unequalInputs.classList.add("hidden");
    }
}

function addExpense() {
    const trip = getAllTrips()[0];
    const payerId = document.getElementById("payer").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const beneficiaries = Array.from(document.getElementById("beneficiaries").selectedOptions).map(opt => opt.value);
    const distribution = document.getElementById("distribution").value;
    
    if (!payerId || amount <= 0 || beneficiaries.length === 0) {
        alert("Please enter valid expense details.");
        return;
    }
    
    if (distribution === "equal") {
        const splitAmount = amount / beneficiaries.length;
        beneficiaries.forEach(beneficiaryId => {
            if (beneficiaryId !== payerId) {
                if (!trip.expenseMap.has(beneficiaryId)) {
                    trip.expenseMap.set(beneficiaryId, new Map());
                }
                const payerMap = trip.expenseMap.get(beneficiaryId);
                payerMap.set(payerId, (payerMap.get(payerId) || 0) + splitAmount);
            }
        });
    } else {
        const unequalAmounts = document.getElementById("unequalAmounts").value.split(',').map(parseFloat);
        if (unequalAmounts.length !== beneficiaries.length) {
            alert("Please enter the correct number of amounts for each beneficiary.");
            return;
        }
        beneficiaries.forEach((beneficiaryId, index) => {
            if (beneficiaryId !== payerId) {
                if (!trip.expenseMap.has(beneficiaryId)) {
                    trip.expenseMap.set(beneficiaryId, new Map());
                }
                const payerMap = trip.expenseMap.get(beneficiaryId);
                payerMap.set(payerId, (payerMap.get(payerId) || 0) + unequalAmounts[index]);
            }
        });
    }

    addOrEditTrip(trip);
    renderTable();
}

function printReport() {
    const trip = getAllTrips()[0];
    let printContent = `<h2>Expense Report for Trip: ${trip.tripName}</h2>`;
    printContent += document.getElementById("expenseTable").outerHTML;
    let newWin = window.open("", "Print-Window");
    newWin.document.write(`<html><body>${printContent}</body></html>`);
    newWin.document.close();
    newWin.focus();
    newWin.print();
    newWin.close();
}

// Existing methods from main.js

function addOrEditTrip(trip) {
    trips.set(trip.tripId, trip); // Add or edit trip
}

function getTrip(tripId) {
    return trips.get(tripId);
}

function getAllTrips() {
    return Array.from(trips.values());
}

function addOrEditUser(user) {
    users.set(user.userId, user); // Add or edit user
}

function getUser(userId) {
    return users.get(userId);
}

function getAllUsers() {
    return Array.from(users.values());
}

function addOrEditExpense(expense) {
    expenses.set(expense.expenseId, expense); // Add or edit expense
}

function getExpense(expenseId) {
    return expenses.get(expenseId);
}

function getAllExpenses() {
    return Array.from(expenses.values());
}

function searchTrip(query) {
    return Array.from(trips.values()).filter(t => t.tripName.includes(query) || t.name.includes(query));
}

function searchUser(query) {
    return Array.from(users.values()).filter(u => u.name.includes(query) || (u.email && u.email.includes(query)));
}

function searchExpense(query) {
    return Array.from(expenses.values()).filter(e => e.description.includes(query));
}