function showSection(id) {
  const sections = document.querySelectorAll(".details-section");
  sections.forEach((section) => (section.style.display = "none"));
  const target = document.getElementById(id);
  if (target) {
    target.style.display = "block";
  }
}

// Show dashboard by default
document.addEventListener("DOMContentLoaded", () => {
  showSection("dashboard-section");
});
// PIE CHART: Transaction Categories
const ctx1 = document.getElementById("categoryChart").getContext("2d");
new Chart(ctx1, {
  type: "pie",
  data: {
    labels: ["Bank Transfers", "Airtime", "Payments", "Withdrawals"],
    datasets: [
      {
        label: "Transactions",
        data: [3, 1, 2, 2],
        backgroundColor: ["#673ab7", "#ff9800", "#009688", "#ffc107"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
});

// BAR CHART: Daily Transaction Amounts
const ctx2 = document.getElementById("dailyChart").getContext("2d");
new Chart(ctx2, {
  type: "bar",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "FCFA",
        data: [8000, 12000, 5500, 9500, 7000],
        backgroundColor: "#001F5B",
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value + " FCFA",
        },
      },
    },
  },
});

fetch("./data/bank_transfers.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // Log the data to check its structure
    const tableBody = document.getElementById("bank-transfers-body");
    console.log(tableBody); // Log the table body to ensure it's selected correctly
    if (!tableBody) {
      console.error("Table body not found");
      return;
    }
    tableBody.innerHTML = ""; // Clear existing content

    data.forEach((tx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-4 py-2">${tx.transaction_id}</td>
        <td class="px-4 py-2">${tx.amount} FCFA</td>
        <td class="px-4 py-2">${tx.date}</td>
        <td class="px-4 py-2">${tx.recipient_name}</td>
        <td class="px-4 py-2">${tx.recipient_phone} FCFA</td>
        <td class="px-4 py-2">${tx.sender_account} FCFA</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch((error) => {
    console.error("Error loading transactions:", error);
  });

fetch("./data/incoming_money_table.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(tableBody, "here"); // Log the data to check its structure
    tableBody.innerHTML = ""; // Clear existing content

    data.forEach((tx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-4 py-2">${tx.txid}</td>
        <td class="px-4 py-2">${tx.amount_received} FCFA</td>
        <td class="px-4 py-2">${tx.sender}</td>
        <td class="px-4 py-2">${tx.date}</td>
        <td class="px-4 py-2">${tx.new_balance} FCFA</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch((error) => {
    console.error("Error loading transactions:", error);
  });
