function showScreen(screenName){
  document.querySelectorAll(".screen").forEach(screen=>{
    screen.classList.toggle("active",screen.dataset.screen===screenName);
  });
  setState("screen",screenName);
}

function updateWeightUI(){
  document.getElementById("earthWeight").textContent=
    `${SpacewalkState.earthWeight.toFixed(1)} kg`;
}

function prepareFinalScene(){
  const planet=SpacewalkState.selectedPlanet;
  const weight=calculatePlanetWeight(
    SpacewalkState.earthWeight,
    planet.gravity
  );

  setState("planetWeight",weight);

  document.getElementById("destinationName").textContent=planet.name;
  document.getElementById("planetWeight").textContent=
    `${weight.toFixed(1)} kg`;
}