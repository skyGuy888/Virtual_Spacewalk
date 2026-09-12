window.SpacewalkState={
  screen:"idle",
  selectedSuit:null,
  faceDataUrl:null,
  earthWeight:60.0,
  selectedPlanet:null,
  planetWeight:null,
  photoPath:null
};

window.setState=(key,value)=>{window.SpacewalkState[key]=value;};