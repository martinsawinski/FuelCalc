let timerInterval;
let isTimerRunning = false;

document.getElementById("timerButton").addEventListener("click", function() {
    if (!isTimerRunning) {
        startTimer();
    } else {
        stopTimer();
    }
});

function startTimer() {
    // Reset fields to 0 when the timer starts
    document.getElementById("timeMinutes").value = 0;
    document.getElementById("timeSeconds").value = 0;
    document.getElementById("fuelRemaining").value = 0;
    document.getElementById("raceMinutes").value = 0;
    document.getElementById("lapSeconds").value = 0;

    // Reset Consumption Results
    resetConsumptionResults();

    // Disable validation for the fields
    disableFieldValidation();

    let minutes = 0;
    let seconds = 0;

    // Change button text to "Stop Timer" and change color
    document.getElementById("timerButton").innerText = "Stop";
    document.getElementById("timerButton").style.backgroundColor = "#d9534f"; // Red for Stop
    document.getElementById("timerButton").style.color = "#fff"; // White text

    // Start the timer
    timerInterval = setInterval(function() {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }

        // Update the fields with the elapsed time
        document.getElementById("timeMinutes").value = minutes;
        document.getElementById("timeSeconds").value = seconds;
    }, 1000);

    isTimerRunning = true;
}

function stopTimer() {
    // Stop the interval (timer)
    clearInterval(timerInterval);

    // Change button text back to "Start Timer" and change color
    document.getElementById("timerButton").innerText = "Start";
    document.getElementById("timerButton").style.backgroundColor = "#4CAF50"; // Green for Start
    document.getElementById("timerButton").style.color = "#fff"; // White text

    // Enable validation for the fields
    enableFieldValidation();

    isTimerRunning = false;
}

function disableFieldValidation() {
    // Disable validation for the specified fields
    document.getElementById("timeMinutes").setAttribute("disabled", "true");
    document.getElementById("timeSeconds").setAttribute("disabled", "true");
    document.getElementById("fuelRemaining").setAttribute("disabled", "true");
    document.getElementById("raceMinutes").setAttribute("disabled", "true");
    document.getElementById("lapSeconds").setAttribute("disabled", "true");
}

function enableFieldValidation() {
    // Re-enable validation for the specified fields
    document.getElementById("timeMinutes").removeAttribute("disabled");
    document.getElementById("timeSeconds").removeAttribute("disabled");
    document.getElementById("fuelRemaining").removeAttribute("disabled");
    document.getElementById("raceMinutes").removeAttribute("disabled");
    document.getElementById("lapSeconds").removeAttribute("disabled");
}

// Function to reset the Consumption Results
function resetConsumptionResults() {
    const resultMileage = document.getElementById('result-mileage');
    const resultPit = document.getElementById('result-pit');

    resultMileage.innerHTML = '';
    resultPit.innerHTML = '';
    resultMileage.style.display = 'none';
    resultPit.style.display = 'none';
}

// Example consumption update function (This is just a placeholder for your logic)
function updateConsumptionResults() {
    const resultMileage = document.getElementById('result-mileage');
    const resultPit = document.getElementById('result-pit');

    // Reset consumption results here when the timer is started
    resetConsumptionResults();

    // Additional logic to calculate and display consumption results
    // (Modify as per your app's logic)
}



function updateConsumptionResults() {
    // Get the tank volume and other relevant data
    const tankVolume = parseFloat(document.getElementById('tankVolume').value); // Assuming this is the fuel tank volume in cc
    const fuelRate = getFuelConsumptionRate(); // You should implement this function to calculate fuel consumption per time unit

    // Calculate fuel consumed based on elapsed time
    const fuelConsumed = fuelRate * elapsedTime; // Adjust this formula based on your actual calculation logic

    // Update the consumption results (you can have these values displayed on the page)
    const remainingFuel = tankVolume - fuelConsumed;
    document.getElementById('remainingFuel').textContent = `Remaining Fuel: ${remainingFuel.toFixed(2)} cc`;

    // You can also calculate and display runtime predictions if needed
}

function getFuelConsumptionRate() {
    // Implement this function based on how you want to calculate fuel consumption
    // Example: Assume the rate is 0.05 cc per second
    return 0.05;
}

function calculateRuntime() {
  const tank = parseFloat(document.getElementById('tankVolume').value);
  const fuelRemaining = parseFloat(document.getElementById('fuelRemaining').value);
  const timeMin = parseFloat(document.getElementById('timeMinutes').value);
  const timeSec = parseFloat(document.getElementById('timeSeconds').value);
  const raceMin = parseFloat(document.getElementById('raceMinutes').value);
  const lapSec = parseFloat(document.getElementById('lapSeconds').value);

  const resultMileage = document.getElementById('result-mileage');
  const resultPit = document.getElementById('result-pit');

  const isTankValid = !isNaN(tank) && tank > 0;
  const isFuelRemainingValid = !isNaN(fuelRemaining) && fuelRemaining >= 0;
  const isTimeValid = !isNaN(timeMin) && timeMin >= 0 && !isNaN(timeSec) && timeSec >= 0;

  if (!isTankValid || !isFuelRemainingValid || !isTimeValid) {
    resultMileage.style.display = 'none'; resultPit.style.display = 'none';
    resultMileage.innerHTML = ''; resultPit.innerHTML = '';
    highlightRequiredFields();
    return;
  }

  const totalTimeSec = (timeMin * 60) + timeSec;
  const fuelUsed = tank - fuelRemaining;
  if (fuelUsed <= 0 || totalTimeSec <= 0 || fuelRemaining < 0) {
    resultMileage.style.display = 'none'; resultPit.style.display = 'none';
    resultMileage.innerHTML = ''; resultPit.innerHTML = '';
    highlightRequiredFields();
    return;
  }

  const actualRate = fuelUsed / totalTimeSec;
  const actualRateCCPerMin = actualRate * 60;
  const remainingRuntimeSec = fuelRemaining / actualRate;
  const fullTankRuntimeSec = tank / actualRate;

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}s`;
  }

  const lapDurationSec = !isNaN(lapSec) ? lapSec : null;
  let summaryHTML = '<h3>Consumption Summary</h3>';
  summaryHTML += `<p>Actual Consumption Rate: <span class="value">${actualRateCCPerMin.toFixed(2)} cc/min</span></p>`;
  if (lapDurationSec) {
    const ccPerLap = actualRate * lapDurationSec;
    summaryHTML += `<p>Consumption Rate per Lap: <span class="value">${ccPerLap.toFixed(2)} cc/lap</span></p>`;
  }
  summaryHTML += `<p>Estimated Runtime for Remaining Fuel: <span class="value">${formatTime(remainingRuntimeSec)}</span></p>`;
  summaryHTML += `<p>Estimated Total Runtime for Full Tank: <span class="value">${formatTime(fullTankRuntimeSec)}</span></p>`;
  resultMileage.innerHTML = summaryHTML; resultMileage.style.display = 'block';

  let pitHTML = '';
  if (!isNaN(raceMin) && raceMin > 0) {
    const raceDurationSec = raceMin * 60;
    const stopsTime = Math.max(0, Math.ceil(raceDurationSec / fullTankRuntimeSec) - 1);
    const stopTimesTime = [];
    for (let i = 1; i <= stopsTime; i++) {
      let stopTime = i * fullTankRuntimeSec;
      stopTime = Math.floor(stopTime / 15) * 15;
      stopTimesTime.push(formatTime(stopTime));
    }
    pitHTML += '<h3>Time-Based Refueling</h3>';
    pitHTML += `<p>Number of Fuel Stops: <span class="value">${stopsTime}</span></p>`;
    pitHTML += `<p>Maximum Refuel Times: <span class="value">${stopTimesTime.length ? stopTimesTime.join(', ') : 'N/A'}</span></p>`;
  }
  if (lapDurationSec) {
    const totalLapsPerTank = Math.floor(fullTankRuntimeSec / lapDurationSec);
    let stopsLap = 0; let stopLaps = [];
    if (!isNaN(raceMin) && raceMin > 0) {
      const raceDurationSec = raceMin * 60;
      const totalLapsRace = Math.floor(raceDurationSec / lapDurationSec);
      stopsLap = Math.max(0, Math.ceil(totalLapsRace / totalLapsPerTank) - 1);
      for (let i = 1; i <= stopsLap; i++) { stopLaps.push(i * totalLapsPerTank); }
    }
    pitHTML += '<h3>Lap-Based Refueling</h3>';
    pitHTML += `<p>Total Laps per Tank: <span class="value">${totalLapsPerTank}</span></p>`;
    pitHTML += `<p>Number of Fuel Stops: <span class="value">${stopsLap}</span></p>`;
    pitHTML += `<p>Maximum Refuel Laps: <span class="value">${stopLaps.length ? stopLaps.join(', ') : 'N/A'}</span></p>`;
  }
  if (pitHTML) { resultPit.innerHTML = pitHTML; resultPit.style.display = 'block'; }
  else { resultPit.innerHTML = ''; resultPit.style.display = 'none'; }
  highlightRequiredFields();
}

function highlightRequiredFields() {
  const tankEl = document.getElementById('tankVolume');
  const fuelEl = document.getElementById('fuelRemaining');
  const minEl = document.getElementById('timeMinutes');
  const secEl = document.getElementById('timeSeconds');
  const tankVal = parseFloat(tankEl.value);
  const fuelVal = parseFloat(fuelEl.value);
  const minVal = parseFloat(minEl.value);
  const secVal = parseFloat(secEl.value);

  tankEl.classList.toggle('required-warning', isNaN(tankVal) || tankVal <= 0);
  fuelEl.classList.toggle('required-warning', isNaN(fuelVal) || fuelVal < 0);
  minEl.classList.toggle('required-warning', isNaN(minVal) || minVal < 0);
  secEl.classList.toggle('required-warning', isNaN(secVal) || secVal < 0);
}

window.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkModeToggle");
  const saved = localStorage.getItem("darkMode") === "true";
  toggle.checked = saved; if (saved) document.body.classList.add("dark-mode");
  toggle.addEventListener("change", () => {
    if (toggle.checked) { document.body.classList.add("dark-mode"); localStorage.setItem("darkMode","true"); }
    else { document.body.classList.remove("dark-mode"); localStorage.setItem("darkMode","false"); }
  });
  ['fuelRemaining','tankVolume','timeMinutes','timeSeconds','raceMinutes','lapSeconds'].forEach(id => {
    document.getElementById(id).addEventListener("input", calculateRuntime);
  });
});
