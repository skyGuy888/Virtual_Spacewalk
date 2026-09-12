// import {
//   initThreeScene,
//   loadAstronautModel
// } from "./threeScene.js";





import {
  initThreeScene,
  loadAstronautModel,
  setPlayerFace
} from "./threeScene.js";






// // =====================================================
// // START
// // =====================================================

// console.log(
//     "🚀 Virtual Spacewalk Starting..."
// );


// // Initialize Three.js

// const three =
//     initThreeScene();


// // Load Astronaut

// loadAstronautModel();






// async function showAstronaut() {

//     showScreen("astronaut");

//     const container =
//         document.getElementById(
//             "threeContainer"
//         );

//     if (!container) {

//         console.error(
//             "threeContainer not found"
//         );

//         return;

//     }


//     initThreeScene(
//         container
//     );


//     const suit =
//         window.SpacewalkState.selectedSuit;

//     if (!suit) {

//         console.warn(
//             "No suit selected"
//         );

//         return;

//     }


//     await loadAstronautModel(
//         suit.model
//     );

// }




// async function showAstronaut() {

//   showScreen("astronaut");


//   const container =
//     document.getElementById(
//       "threeContainer"
//     );


//   if (!container) {

//     console.error(
//       "[APP] threeContainer not found"
//     );

//     return;

//   }


//   initThreeScene(
//     container
//   );


//   const suit =
//     window.SpacewalkState.selectedSuit;


//   if (!suit) {

//     console.error(
//       "[APP] No suit selected"
//     );

//     return;

//   }


//   try {

//     await loadAstronautModel(
//       suit.model
//     );

//     console.log(
//       "[APP] Astronaut ready"
//     );

//   } catch (error) {

//     console.error(
//       "[APP] Astronaut load failed",
//       error
//     );

//   }

// }





// async function showAstronaut() {

//   showScreen("astronaut");

//   const container =
//     document.getElementById("threeContainer");

//   if (!container) {
//     console.error("[APP] threeContainer not found");
//     return;
//   }

//   console.log("[APP] Three container:", container);

//   initThreeScene(container);

//   const suit =
//     window.SpacewalkState.selectedSuit;

//   if (!suit) {
//     console.error("[APP] No suit selected");
//     return;
//   }

//   try {

//     await loadAstronautModel(suit.model);

//     console.log("[APP] Astronaut ready");

//   } catch (error) {

//     console.error(
//       "[APP] Astronaut load failed",
//       error
//     );

//   }
// }







async function showAstronaut() {

  showScreen("astronaut");

  const container =
    document.getElementById("threeContainer");


  const rect =
    container.getBoundingClientRect();

  console.log(
    "[APP] THREE RECT:",
    {
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left
    }
  );




  if (!container) {
    console.error("[APP] threeContainer not found");
    return;
  }

  // รอให้ browser แสดง screen และคำนวณ layout ก่อน
  await new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });

  console.log(
    "[APP] Three container size:",
    container.clientWidth,
    container.clientHeight
  );

  initThreeScene(container);

  const suit =
    window.SpacewalkState.selectedSuit;

  if (!suit) {
    console.error("[APP] No suit selected");
    return;
  }

  try {

    await loadAstronautModel(suit.model);

    console.log("[APP] Astronaut ready");



    const faceDataUrl =
      window.SpacewalkState.faceDataUrl;

    if (faceDataUrl) {

      console.log(
        "[APP] Applying player face..."
      );

      setPlayerFace(faceDataUrl);

    } else {

      console.warn(
        "[APP] No player face captured"
      );

    }





  } catch (error) {

    console.error(
      "[APP] Astronaut load failed",
      error
    );

  }
}








document.addEventListener("DOMContentLoaded", () => {
  renderSuits();
  renderPlanets();
  updateWeightUI();

  document.addEventListener("click", async event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    switch (button.dataset.action) {

      case "start":
        showScreen("suit-select");
        break;

      case "confirm-suit":
        if (!SpacewalkState.selectedSuit) {
          alert("กรุณาเลือกชุดนักบินอวกาศ");
          return;
        }
        showScreen("face-capture");
        await startCamera();
        break;

      case "capture-face":
        await captureFace();
        if (SpacewalkState.faceDataUrl) {
          showScreen("astronaut");
        }
        await showAstronaut();

        break;

      case "back-suit":
        stopCamera();
        showScreen("suit-select");
        break;

      case "choose-planet":
        showScreen("planet-select");
        break;

      case "back-astronaut":
        showScreen("astronaut");
        break;

      case "confirm-planet":
        if (!SpacewalkState.selectedPlanet) {
          alert("กรุณาเลือกดาว");
          return;
        }
        prepareFinalScene();
        showScreen("spacewalk");
        break;

      case "take-photo":
        //await captureSpacewalk();
        showScreen("qr");
        break;

      case "restart":
        window.SpacewalkState = {
          screen: "idle",
          selectedSuit: null,
          faceDataUrl: null,
          earthWeight: 60.0,
          selectedPlanet: null,
          planetWeight: null,
          photoPath: null
        };
        renderSuits();
        renderPlanets();
        updateWeightUI();
        showScreen("idle");
        break;
    }
  });
});