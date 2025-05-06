let charts = {};

function loadData() {
  Papa.parse(CSV_FILE, {
    download: true,
    header: true,
    delimiter: ";",
    complete: function (results) {
      const data = results.data.filter(row => row["Datum"] && row["Uhrzeit"]);
      updateTimestamp();
      renderCharts(data);
    },
  });
}

function updateTimestamp() {
  const now = new Date();
  document.getElementById("last-update").textContent = `Last updated: ${now.toLocaleString()}`;
}

function renderCharts(data) {
  const labels = data.map(d => `${d["Datum"]} ${d["Uhrzeit"]}`);

  const metrics = {
    "chart-co2": {
      label: "eCO₂ (ppm)",
      color: "rgb(75, 192, 192)",
      values: data.map(d => parseFloat(d["eCO2 (ppm)"])),
    },
    "chart-temp": {
      label: "Temperature (°C)",
      color: "rgb(255, 99, 132)",
      values: data.map(d => parseFloat(d["Temperatur (°C)"])),
    },
    "chart-humidity": {
      label: "Humidity (%)",
      color: "rgb(54, 162, 235)",
      values: data.map(d => parseFloat(d["relative Luftfeuchte (%)"])),
    },
    "chart-pressure": {
      label: "Air Pressure (hPa)",
      color: "rgb(255, 206, 86)",
      values: data.map(d => parseFloat(d["Luftdruck (hpPa)"])),
    },
    "chart-tvoc": {
      label: "tVOC (ppb)",
      color: "rgb(153, 102, 255)",
      values: data.map(d => parseFloat(d["tVOC (ppb)"])),
    }
  };

  for (const [id, metric] of Object.entries(metrics)) {
    const ctx = document.getElementById(id).getContext("2d");

    // Destroy existing chart if present
    if (charts[id]) charts[id].destroy();

    charts[id] = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: metric.label,
          data: metric.values,
          fill: false,
          borderColor: metric.color,
          tension: 0.2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          x: {
            ticks: {
              maxTicksLimit: 10,
              autoSkip: true
            }
          }
        }
      }
    });
  }
}

// Load data on page load
window.onload = loadData;