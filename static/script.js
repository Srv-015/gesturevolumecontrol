document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");

  const volVal = document.getElementById("vol-val");
  const distVal = document.getElementById("dist-val");
  const accVal = document.getElementById("acc-val");
  const timeVal = document.getElementById("time-val");

  const cardOpen = document.getElementById("card-open");
  const cardPinch = document.getElementById("card-pinch");
  const cardClosed = document.getElementById("card-closed");

  function sendCommand(command) {
    fetch(`/${command}`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => console.log(data.status));
  }

  startBtn.addEventListener("click", () => sendCommand("start"));
  pauseBtn.addEventListener("click", () => sendCommand("pause"));

  function updateUI(data) {
    // Update basic metrics
    volVal.innerText = data.current_volume + "%";
    distVal.innerText = data.finger_distance_mm + "mm";
    accVal.innerText = data.accuracy + "%";
    timeVal.innerText = data.response_time_ms + "ms";

    // Reset all cards to inactive state
    [cardOpen, cardPinch, cardClosed].forEach((card) => {
      card.classList.remove("active-card");
      const statusBadge = card.querySelector(".status");
      statusBadge.innerText = "Inactive";
      statusBadge.classList.remove("active");
      statusBadge.classList.add("inactive");
    });

    // Set the current gesture card to active
    let activeCard = null;
    if (data.current_gesture === "Open Hand") activeCard = cardOpen;
    else if (data.current_gesture === "Pinch") activeCard = cardPinch;
    else if (data.current_gesture === "Closed") activeCard = cardClosed;

    if (activeCard && data.is_running) {
      activeCard.classList.add("active-card");
      const statusEl = activeCard.querySelector(".status");
      statusEl.innerText = "Active";
      statusEl.classList.remove("inactive");
      statusEl.classList.add("active");
    }
  }

  // Continuously poll for data updates
  setInterval(() => {
    fetch("/get_data")
      .then((response) => response.json())
      .then((data) => {
        // We always update UI so that "Inactive" states reflect immediately
        updateUI(data);
      });
  }, 100);

  // Default to paused state on load
  sendCommand("pause");
});
