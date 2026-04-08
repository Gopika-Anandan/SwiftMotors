// LOGIN LOGIC
const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const user = document.getElementById("loginUsername").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();

    if (user && pass) {
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("loginError").innerText = "Enter username & password";
    }
  });
}

// DASHBOARD LOGIC
if (document.getElementById("barChart")) {

  const plants = [...new Set(DATA.map(d => d.plant))];
  const totals = plants.map(p =>
    DATA.filter(d => d.plant === p).reduce((sum, d) => sum + d.units, 0)
  );

  const ctx = document.getElementById("barChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: plants,
      datasets: [{
        label: "Units Produced",
        data: totals,
        backgroundColor: "orange"
      }]
    }
  });

  // LINE CHART
  const months = ["Jan", "Feb", "Mar"];
  const defects = [2.1, 1.8, 2.0];

  new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: months,
      datasets: [{
        label: "Defect %",
        data: defects,
        borderColor: "blue"
      }]
    }
  });

  // PIE CHART
  new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: ["Engine", "Paint", "Assembly"],
      datasets: [{
        data: [40, 30, 30],
        backgroundColor: ["red", "yellow", "green"]
      }]
    }
  });

}