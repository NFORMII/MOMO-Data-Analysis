    // Toggle dropdown menu 
    function showSection(id) {
      const sections = document.querySelectorAll('.details-section');
      sections.forEach(section => section.style.display = 'none');
      const target = document.getElementById(id);
      if (target) {
        target.style.display = 'block';
      }
    }
  
    // Show dashboard by default
    document.addEventListener("DOMContentLoaded", () => {
      showSection("dashboard-section");
    });
  // PIE CHART: Transaction Categories
  const ctx1 = document.getElementById('categoryChart').getContext('2d');
  new Chart(ctx1, {
    type: 'pie',
    data: {
      labels: ['Bank Transfers', 'Airtime', 'Payments', 'Withdrawals'],
      datasets: [{
        label: 'Transactions',
        data: [3, 1, 2, 2],
        backgroundColor: ['#673ab7', '#ff9800', '#009688', '#ffc107'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });

  // BAR CHART: Daily Transaction Amounts
  const ctx2 = document.getElementById('dailyChart').getContext('2d');
  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        label: 'FCFA',
        data: [8000, 12000, 5500, 9500, 7000],
        backgroundColor: '#001F5B'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => value + ' FCFA'
          }
        }
      }
    }
  });
  // BAR CHART: Withdrawals vs Deposits
  const ctx3 = document.getElementById('withdrawalsDepositsChart').getContext('2d');
  new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [
        {
          label: 'Withdrawals',
          data: [3000, 4000, 2500, 3500, 2000],
          backgroundColor: '#e74c3c'
        },
        {
          label: 'Deposits',
          data: [5000, 6000, 4500, 7000, 3000],
          backgroundColor: '#27ae60'
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => value + ' FCFA'
          }
        }
      }
    }
  });
  // DOUGHNUT CHART: Payments by Type
  const ctx4 = document.getElementById('paymentsTypeChart').getContext('2d');
  new Chart(ctx4, {
    type: 'doughnut',
    data: {
      labels: ['Groceries', 'Bills', 'Airtime', 'Other'],
      datasets: [{
        label: 'Payments',
        data: [2000, 1500, 1000, 500],
        backgroundColor: ['#ff9800', '#009688', '#2196f3', '#9c27b0']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
  // LINE CHART: Monthly Growth
  const ctx5 = document.getElementById('monthlyGrowthChart').getContext('2d');
  new Chart(ctx5, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Growth',
        data: [100, 200, 350, 500, 700, 900],
        borderColor: '#673ab7',
        backgroundColor: 'rgba(103,58,183,0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true
    }
  });
  // BAR CHART: Top Senders
  const ctx6 = document.getElementById('topSendersChart').getContext('2d');
  new Chart(ctx6, {
    type: 'bar',
    data: {
      labels: ['Alice', 'Bob', 'Carol', 'Dan', 'Eve'],
      datasets: [{
        label: 'Amount Sent',
        data: [1200, 950, 800, 700, 600],
        backgroundColor: ['#ff9800', '#009688', '#2196f3', '#9c27b0', '#e74c3c']
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => value + ' FCFA'
          }
        }
      }
    }
  });

  fetch('./data/incoming_money_table.json')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('transactions-body');
    tableBody.innerHTML = ''; // Clear existing content

    data.forEach(tx => {
      const row = document.createElement('tr');
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
  .catch(error => {
    console.error('Error loading transactions:', error);
  });


    fetch('./data/cash_power_bill_payments.json')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('payments-body');
    tableBody.innerHTML = ''; // Clear existing content

    data.forEach(tx => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-2">${tx.transaction_id}</td>
        <td class="px-4 py-2">${tx.payment_amount} FCFA</td>
        <td class="px-4 py-2">${tx.token}</td>
        <td class="px-4 py-2">${tx.date}</td>
        <td class="px-4 py-2">${tx.fee} FCFA</td>
        <td class="px-4 py-2">${tx.new_balance} FCFA</td>
        <td class="px-4 py-2">${tx.provider} FCFA</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Error loading transactions:', error);
  });

   fetch('./data/withdrawals_from_agents.json')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('withdrawals-body');
    tableBody.innerHTML = ''; // Clear existing content

    data.forEach(tx => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-2">${tx.name}</td>
        <td class="px-4 py-2">${tx.agent_name} FCFA</td>
        <td class="px-4 py-2">${tx.agent_number}</td>
        <td class="px-4 py-2">${tx.account}</td>
        <td class="px-4 py-2">${tx.amount} FCFA</td>
        <td class="px-4 py-2">${tx.date} FCFA</td>
        <td class="px-4 py-2">${tx.fee} FCFA</td>
        <td class="px-4 py-2">${tx.new_balance} FCFA</td>
        <td class="px-4 py-2">${tx.transaction_id} FCFA</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Error loading transactions:', error);
  });

  fetch('./data/airtime_payments.json')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('airtime-purchase-body');
    tableBody.innerHTML = ''; // Clear existing content

    data.forEach(tx => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-2">${tx.date}</td>
        <td class="px-4 py-2">${tx.txid}</td>
        <td class="px-4 py-2">${tx.payment_amount} FCFA</td>
        <td class="px-4 py-2">${tx.fee} FCFA</td>
        <td class="px-4 py-2">${tx.new_balance} FCFA</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Error loading transactions:', error);
  });

   fetch('./data/bank_transfers.json')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('bank-transfers-body');
    tableBody.innerHTML = ''; // Clear existing content

    data.forEach(tx => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-2">${tx.transaction_id}</td>
        <td class="px-4 py-2">${tx.amount} FCFA</td>
        <td class="px-4 py-2">${tx.date}</td>
        <td class="px-4 py-2">${tx.recipient_name}</td>
        <td class="px-4 py-2">${tx.recipient_phone}</td>
        <td class="px-4 py-2">${tx.sender_account}</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Error loading transactions:', error);
  });

   fetch('./data/transactions_initiated_by_third_parties.json')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('unknown-body');
    tableBody.innerHTML = ''; // Clear existing content

    data.forEach(tx => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-2">${tx.transaction_id}</td>
        <td class="px-4 py-2">${tx.amount} FCFA</td>
        <td class="px-4 py-2">${tx.date}</td>
        <td class="px-4 py-2">${tx.sender}</td>
        <td class="px-4 py-2">${tx.new_balance} FCFA</td>
        <td class="px-4 py-2">${tx.fee} FCFA</td>
        <td class="px-4 py-2">${tx.external_transaction_id}</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Error loading transactions:', error);
  });

  fetch('./data/internet_voice_bundles.json')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('data-bundles-body');
    tableBody.innerHTML = ''; // Clear existing content

    data.forEach(tx => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-2">${tx.transaction_id}</td>
        <td class="px-4 py-2">${tx.amount} FCFA</td>
        <td class="px-4 py-2">${tx.service}</td>
        <td class="px-4 py-2">${tx.date}</td>
        <td class="px-4 py-2">${tx.new_balance} FCFA</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Error loading transactions:', error);
  });

  fetch('./data/bank_deposits.json')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('bank-deposits-body');
    tableBody.innerHTML = ''; // Clear existing content

    data.forEach(tx => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-2">${tx.transaction_id}</td>
        <td class="px-4 py-2">${tx.amount} FCFA</td>
        <td class="px-4 py-2">${tx.date}</td>
        <td class="px-4 py-2">${tx.new_balance} FCFA</td>
        <td class="px-4 py-2">${tx.fee} FCFA</td>
        <td class="px-4 py-2">${tx.recipient} FCFA</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Error loading transactions:', error);
  });

  fetch('./data/failed_transactions.json')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.getElementById('failed-transfer-body');
    tableBody.innerHTML = ''; // Clear existing content

    data.forEach(tx => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-4 py-2">${tx.amount_transferred}FCFA</td>
        <td class="px-4 py-2">${tx.recipient}</td>
        <td class="px-4 py-2">${tx.recipient_number}</td>
        <td class="px-4 py-2">${tx.date}</td>
        <td class="px-4 py-2">${tx.time}</td>
        <td class="px-4 py-2">${tx.fee} FCFA</td>
        <td class="px-4 py-2">${tx.new_balance} FCFA</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error('Error loading transactions:', error);
  });


function animateValue(id, start, end, duration) {
  const obj = document.getElementById(id);
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = end;
    }
  };
  window.requestAnimationFrame(step);
}
function animateBar(id, percent) {
  const bar = document.getElementById(id);
  bar.style.width = '0';
  setTimeout(() => {
    bar.style.width = percent + '%';
  }, 100);
}
document.addEventListener('DOMContentLoaded', () => {
  animateValue('all-tx', 0, 1600, 1200);
  animateBar('progress-all', 100);
  animateValue('bank-tx', 0, 12000, 1000);
  animateBar('progress-bank', 60);
  animateValue('airtime-tx', 0, 2000, 1000);
  animateBar('progress-airtime', 20);
  animateValue('payments-tx', 0, 5500, 1000);
  animateBar('progress-payments', 40);
  animateValue('withdrawals-tx', 0, 10000, 1000);
  animateBar('progress-withdrawals', 50);
  animateValue('bundles-tx', 0, 3500, 1000);
  animateBar('progress-bundles', 25);
  animateValue('failed-tx', 0, 0, 1000);
  animateBar('progress-failed', 0);
});
// Fetch user profile from backend
function fetchUserProfile() {
  return fetch('/get-user-profile')
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .catch(() => ({ error: true }));
}
function showProfile() {
  // Show loading state
  document.getElementById('profile-name').value = '';
  document.getElementById('profile-email').value = '';
  document.getElementById('profile-phone').value = '';
  document.getElementById('profile-avatar').src = 'https://ui-avatars.com/api/?name=User';
  document.getElementById('profile-save-msg').style.display = 'none';
  showSection('profile-section');
  fetchUserProfile().then(userProfile => {
    if (userProfile.error) {
      document.querySelector('.profile-info').innerHTML = '<div style="color:red;">Could not load profile. Please check your connection or try again later.</div>';
    } else {
      document.getElementById('profile-name').value = userProfile.fullname || '';
      document.getElementById('profile-email').value = userProfile.email || '';
      document.getElementById('profile-phone').value = userProfile.phone || '';
      document.getElementById('profile-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.fullname || 'User')}`;
    }
  });
}
document.getElementById('profile-form').onsubmit = function(e) {
  e.preventDefault();
  const data = {
    fullname: document.getElementById('profile-name').value,
    email: document.getElementById('profile-email').value,
    phone: document.getElementById('profile-phone').value
  };
  fetch('/update-user-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.ok ? res.json() : Promise.reject())
  .then(() => {
    document.getElementById('profile-save-msg').style.display = 'block';
    setTimeout(() => document.getElementById('profile-save-msg').style.display = 'none', 2000);
  });
};
document.querySelectorAll('.dropdown-content a')[0].onclick = function(e) {
  e.preventDefault();
  showProfile();
}