const planets = [
  { id: "moon", name: "MOON", icon: "🌕", gravity: 0.165 },
  { id: "mars", name: "MARS", icon: "🔴", gravity: 0.378 },
  { id: "venus", name: "VENUS", icon: "🟠", gravity: 0.904 },
  { id: "jupiter", name: "JUPITER", icon: "🪐", gravity: 2.528 },
  { id: "earth", name: "EARTH", icon: "🌎", gravity: 1.000 }
];

function calculatePlanetWeight(earthWeight, gravity) {
  return earthWeight * gravity;
}

function renderPlanets() {
  const grid = document.getElementById("planetGrid");
  grid.innerHTML = planets.map(p => `
    <button class="choice-card planet-card" data-planet="${p.id}">
      <div class="planet-icon">
      
 ${p.icon}
      
      </div>
      <strong>${p.name}</strong>
      <small>${p.gravity.toFixed(3)} g</small>
    </button>
  `).join("");

  grid.querySelectorAll("[data-planet]").forEach(card => {
    card.addEventListener("click", () => {
      grid.querySelectorAll(".choice-card").forEach(x => x.classList.remove("selected"));
      card.classList.add("selected");
      setState("selectedPlanet", planets.find(p => p.id === card.dataset.planet));
    });
  });
}