// const suits = [
//   { id: "suit01", name: "EXPLORER", icon: "👨‍🚀", model: "suit01.glb" },
//   { id: "suit02", name: "COMMANDER", icon: "🧑‍🚀", model: "suit02.glb" },
//   { id: "suit03", name: "SCIENTIST", icon: "👩‍🚀", model: "suit03.glb" }
// ];





const suits = [

  {
    id: "suit01",
    name: "EXPLORER",
    icon: "./models/suits/icon/astronaut_1.png",
    model: "./models/suits/suit01.glb"
  },

  {
    id: "suit02",
    name: "COMMANDER",
    icon: "./models/suits/icon/astronaut_2.png",
    model: "./models/suits/suit02.glb"
  },

  {
    id: "suit03",
    name: "SCIENTIST",
    icon: "./models/suits/icon/astronaut_3.png",
    model: "./models/suits/suit03.glb"
  }

];



function renderSuits() {
  const grid = document.getElementById("suitGrid");
  grid.innerHTML = suits.map(s => `
    <button class="choice-card" data-suit="${s.id}">
      <div class="suit-preview">
      
       <img src=" ${s.icon}">
      
      </div>
      <strong>${s.name}</strong>
    </button>
  `).join("");

  grid.querySelectorAll("[data-suit]").forEach(card => {
    card.addEventListener("click", () => {
      grid.querySelectorAll(".choice-card").forEach(x => x.classList.remove("selected"));
      card.classList.add("selected");
      setState("selectedSuit", suits.find(s => s.id === card.dataset.suit));
    });
  });
}