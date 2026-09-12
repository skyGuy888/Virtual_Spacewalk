// import * as THREE from "three";
// // import * as THREE from "../../../node_modules/three/build/three.module.js";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";




import * as THREE from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";




let scene = null;
let camera = null;
let renderer = null;
let controls = null;

let currentModel = null;

let animationMixer = null;

let headBone = null;

let faceAnchor = null;

let faceMesh = null;

// =====================================================
// INIT
// =====================================================

export function initThreeScene(container) {

    console.log("[THREE] Initializing...");

    const width = container.clientWidth;
    const height = container.clientHeight;

    console.log(
        "[THREE] Container size:",
        width,
        height
    );

    if (width === 0 || height === 0) {

        console.error(
            "[THREE] Container has zero size!",
            {
                width,
                height
            }
        );

        return;
    }


    // -------------------------------------------------
    // Scene
    // -------------------------------------------------

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x050814);


    // -------------------------------------------------
    // Camera
    // -------------------------------------------------


    camera =
        new THREE.PerspectiveCamera(
            35,
            width / height,
            0.01,
            1000
        );

    camera.position.set(
        0,
        1.6,
        6
    );


    // -------------------------------------------------
    // Renderer
    // -------------------------------------------------

    renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        width,
        height
    );

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    renderer.shadowMap.enabled = true;

    container.innerHTML = "";

    container.appendChild(
        renderer.domElement
    );


    // -------------------------------------------------
    // Controls
    // -------------------------------------------------

    controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );


    controls.enableDamping = true;

    controls.enablePan = false;

    controls.minDistance = 2;

    controls.maxDistance = 8;


    // -------------------------------------------------
    // Lights
    // -------------------------------------------------

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            2
        );

    scene.add(ambient);


    const keyLight =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );

    keyLight.position.set(
        3,
        5,
        5
    );

    keyLight.castShadow = true;

    scene.add(keyLight);


    const fillLight =
        new THREE.DirectionalLight(
            0x6688ff,
            1.5
        );

    fillLight.position.set(
        -4,
        3,
        2
    );

    scene.add(fillLight);


    // -------------------------------------------------
    // Resize
    // -------------------------------------------------

    window.addEventListener(
        "resize",
        () => {

            resizeThreeScene(
                container
            );

        }
    );


    // -------------------------------------------------
    // Render Loop
    // -------------------------------------------------

    animate();


    console.log(
        "[THREE] Scene ready"
    );
}


// =====================================================
// LOAD GLB
// =====================================================

export function loadAstronautModel(
    modelPath
) {

    return new Promise(
        (resolve, reject) => {

            console.log(
                "[THREE] Loading GLB:",
                modelPath
            );


            const loader =
                new GLTFLoader();


            loader.load(

                modelPath,

                (gltf) => {

                    console.log(
                        "[THREE] GLB loaded"
                    );


                    // ---------------------------------
                    // Remove previous model
                    // ---------------------------------

                    if (currentModel) {

                        scene.remove(
                            currentModel
                        );

                    }


                    currentModel =
                        gltf.scene;


                    // ---------------------------------
                    // Mesh setup
                    // ---------------------------------

                    currentModel.traverse(
                        (object) => {

                            if (
                                object.isMesh
                            ) {

                                object.castShadow =
                                    true;

                                object.receiveShadow =
                                    true;

                                console.log(
                                    "[THREE][MESH]",
                                    object.name
                                );

                            }

                        }
                    );


                    // ---------------------------------
                    // Find skeleton bones
                    // ---------------------------------

                    currentModel.traverse(
                        (object) => {

                            if (
                                object.isBone
                            ) {

                                console.log(
                                    "[THREE][BONE]",
                                    object.name
                                );


                                if (
                                    object.name ===
                                    "head_045"
                                ) {

                                    headBone =
                                        object;

                                    console.log(
                                        "[THREE] HEAD FOUND",
                                        headBone
                                    );

                                }

                            }

                        }
                    );



                    // =====================================================
                    // CENTER + SCALE MODEL
                    // =====================================================

                    const box = new THREE.Box3().setFromObject(currentModel);

                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());

                    console.log("[THREE] MODEL SIZE", size);
                    console.log("[THREE] MODEL CENTER", center);

                    // Scale โดยอิงความสูง
                    const targetHeight = 3.2;

                    const scale =
                        targetHeight / size.y;

                    currentModel.scale.setScalar(scale);

                    // Recalculate bounding box หลัง scale
                    const scaledBox =
                        new THREE.Box3().setFromObject(currentModel);

                    const scaledCenter =
                        scaledBox.getCenter(new THREE.Vector3());

                    const scaledSize =
                        scaledBox.getSize(new THREE.Vector3());

                    console.log("[THREE] SCALED SIZE", scaledSize);
                    console.log("[THREE] SCALED CENTER", scaledCenter);

                    // จัดให้อยู่กลาง Scene
                    currentModel.position.x -= scaledCenter.x;
                    currentModel.position.z -= scaledCenter.z;

                    // ให้เท้าวางใกล้ Y = 0
                    currentModel.position.y -= scaledBox.min.y;

                    scene.add(currentModel);





                    const debugBox =
                        new THREE.Box3().setFromObject(currentModel);

                    console.log(
                        "[THREE] FINAL MODEL BOX",
                        debugBox.min,
                        debugBox.max
                    );

                    console.log(
                        "[THREE] FINAL MODEL WORLD CENTER",
                        debugBox.getCenter(new THREE.Vector3())
                    );





                    // DEBUG
                    const axesHelper = new THREE.AxesHelper(2);
                    scene.add(axesHelper);

                    const gridHelper =
                        new THREE.GridHelper(10, 10);

                    scene.add(gridHelper);








                    console.log("[THREE] MODEL POSITION", currentModel.position);
                    console.log("[THREE] MODEL SCALE", currentModel.scale);




                    const finalBox = new THREE.Box3().setFromObject(currentModel);

                    const finalCenter = finalBox.getCenter(new THREE.Vector3());

                    currentModel.position.x -= finalCenter.x;
                    currentModel.position.z -= finalCenter.z;
                    currentModel.position.y -= finalBox.min.y;

                    console.log(
                        "[THREE] FINAL BOX",
                        finalBox.min,
                        finalBox.max
                    );

                    console.log(
                        "[THREE] FINAL POSITION",
                        currentModel.position
                    );





                    // // ---------------------------------
                    // // Calculate bounding box
                    // // ---------------------------------

                    // const box =
                    //     new THREE.Box3()
                    //         .setFromObject(
                    //             currentModel
                    //         );


                    // const center =
                    //     box.getCenter(
                    //         new THREE.Vector3()
                    //     );


                    // const size =
                    //     box.getSize(
                    //         new THREE.Vector3()
                    //     );


                    // console.log(
                    //     "[THREE] MODEL SIZE",
                    //     size
                    // );


                    // // ---------------------------------
                    // // Center model
                    // // ---------------------------------

                    // currentModel.position.sub(
                    //     center
                    // );


                    // // ---------------------------------
                    // // Scale
                    // // ---------------------------------

                    // const maxSize =
                    //     Math.max(
                    //         size.x,
                    //         size.y,
                    //         size.z
                    //     );


                    // const targetHeight =
                    //     3.2;


                    // const scale =
                    //     targetHeight /
                    //     maxSize;


                    // currentModel.scale.setScalar(
                    //     scale
                    // );


                    // // ---------------------------------
                    // // Add model
                    // // ---------------------------------

                    // scene.add(
                    //     currentModel
                    // );



























                    // ---------------------------------
                    // Animation
                    // ---------------------------------

                    if (
                        gltf.animations &&
                        gltf.animations.length
                    ) {

                        animationMixer =
                            new THREE.AnimationMixer(
                                currentModel
                            );


                        const action =
                            animationMixer.clipAction(
                                gltf.animations[0]
                            );


                        action.play();


                        console.log(
                            "[THREE] Animation started:",
                            gltf.animations[0].name
                        );

                    }


                    // ---------------------------------
                    // Create Face Anchor
                    // ---------------------------------

                    createFaceAnchor();


                    // ---------------------------------
                    // Camera
                    // ---------------------------------



                    // camera.position.set(0, 1.6, 5.5);

                    // controls.target.set(0, 1.6, 0);

                    // camera.lookAt(0, 1.6, 0);

                    camera.position.set(
                        0,
                        2.0,
                        6
                    );

                    controls.target.set(
                        0,
                        2.0,
                        0
                    );

                    camera.lookAt(
                        0,
                        2.0,
                        0
                    );


                    controls.update();


                    // camera.position.set(
                    //     0,
                    //     1.5,
                    //     5
                    // );


                    // controls.target.set(
                    //     0,
                    //     0,
                    //     0
                    // );


                    controls.update();


                    resolve(
                        currentModel
                    );

                },


                (progress) => {

                    if (
                        progress.total
                    ) {

                        const percent =
                            (
                                progress.loaded /
                                progress.total
                            ) * 100;


                        console.log(
                            `[THREE] Loading ${percent.toFixed(0)}%`
                        );

                    }

                },


                (error) => {

                    console.error(
                        "[THREE] GLB ERROR",
                        error
                    );


                    reject(error);

                }

            );

        }
    );
}


// =====================================================
// FACE ANCHOR
// =====================================================

function createFaceAnchor() {

    if (!headBone) {

        console.warn(
            "[THREE] head_045 not found"
        );

        return;

    }


    // ---------------------------------
    // Remove previous
    // ---------------------------------

    if (faceAnchor) {

        headBone.remove(
            faceAnchor
        );

    }


    // ---------------------------------
    // Anchor
    // ---------------------------------

    faceAnchor =
        new THREE.Group();


    faceAnchor.name =
        "PLAYER_FACE_ANCHOR";


    headBone.add(
        faceAnchor
    );


    // ---------------------------------
    // DEBUG OBJECT
    // ---------------------------------

    const geometry =
        new THREE.SphereGeometry(
            0.08,
            16,
            16
        );


    const material =
        new THREE.MeshBasicMaterial({
            color: 0xff0000
        });


    // const debugSphere =
    //     new THREE.Mesh(
    //         geometry,
    //         material
    //     );

    const debugSphere =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.12,
                16,
                16
            ),
            new THREE.MeshBasicMaterial({
                color: 0xff0000
            })
        );



        
    debugSphere.name =
        "FACE_ANCHOR_DEBUG";


    faceAnchor.add(
        debugSphere
    );


    console.log(
        "[THREE] Face Anchor created"
    );
}


// =====================================================
// RESIZE
// =====================================================

function resizeThreeScene(
    container
) {

    if (
        !camera ||
        !renderer
    ) {

        return;

    }


    const width =
        container.clientWidth;


    const height =
        container.clientHeight;


    camera.aspect =
        width / height;


    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height
    );
}


// =====================================================
// ANIMATION LOOP
// =====================================================

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        clock.getDelta();


    if (
        animationMixer
    ) {

        animationMixer.update(
            delta
        );

    }


    if (controls) {

        controls.update();

    }


    if (
        renderer &&
        scene &&
        camera
    ) {

        renderer.render(
            scene,
            camera
        );

    }

}



















// =====================================================
// PLAYER FACE
// =====================================================

export function setPlayerFace(dataUrl) {

    if (!faceAnchor) {
        console.warn("[THREE] Face anchor not ready");
        return;
    }

    if (!dataUrl) {
        console.warn("[THREE] No face image");
        return;
    }

    console.log("[THREE] Loading player face...");

    const loader = new THREE.TextureLoader();

    loader.load(
        dataUrl,
        (texture) => {

            texture.colorSpace =
                THREE.SRGBColorSpace;

            // -----------------------------------------
            // REMOVE OLD FACE
            // -----------------------------------------

            if (faceMesh) {

                faceAnchor.remove(faceMesh);

                faceMesh.geometry.dispose();

                if (faceMesh.material.map) {
                    faceMesh.material.map.dispose();
                }

                faceMesh.material.dispose();

                faceMesh = null;
            }


            // -----------------------------------------
            // FACE GEOMETRY
            // -----------------------------------------

            // const geometry =
            //     new THREE.PlaneGeometry(
            //         0.55,
            //         0.55
            //     );

            const geometry =
                new THREE.PlaneGeometry(
                    0.8,
                    0.8
                );

            // -----------------------------------------
            // FACE MATERIAL
            // -----------------------------------------

            const material =
                new THREE.MeshBasicMaterial({

                    // map: texture,

                    // transparent: true,

                    // side: THREE.DoubleSide


                    map: texture,

                    transparent: false,

                    side: THREE.DoubleSide,

                    depthTest: false,

                    depthWrite: false

                });


            // -----------------------------------------
            // FACE MESH
            // -----------------------------------------

            faceMesh =
                new THREE.Mesh(
                    geometry,
                    material
                );

            faceMesh.name =
                "PLAYER_FACE_MESH";


            // -----------------------------------------
            // POSITION
            // -----------------------------------------

            // faceMesh.position.set(
            //     0,
            //     0,
            //     0.30
            // );

            faceMesh.position.set(
                0,
                0,
                0.6
            );


            // -----------------------------------------
            // ROTATION
            // -----------------------------------------

            // faceMesh.rotation.set(
            //     0,
            //     0,
            //     0
            // );


            faceMesh.rotation.set(
                0,
                Math.PI,
                0
            );


            faceMesh.scale.set(
                1.2,
                1.2,
                1.2
            );



            // DEBUG
            faceMesh.renderOrder = 999;
            material.depthTest = false;
            material.depthWrite = false;

            faceAnchor.add(faceMesh);

            console.log(
                "[THREE] Player face added"
            );

        },

        undefined,

        (error) => {

            console.error(
                "[THREE] Face texture error:",
                error
            );

        }
    );
}






// =====================================================
// GETTERS
// =====================================================

export function getThreeScene() {

    return {

        scene,

        camera,

        renderer,

        model: currentModel,

        headBone,

        faceAnchor

    };

}





// let scene;
// let camera;
// let renderer;
// let controls;

// let currentModel = null;

// let animationFrameId = null;

// export function initThreeScene(container) {

//     console.log("[Three.js] Initializing...");

//     // --------------------------------
//     // Scene
//     // --------------------------------

//     scene = new THREE.Scene();

//     scene.background = new THREE.Color(0x050914);


//     // --------------------------------
//     // Camera
//     // --------------------------------

//     camera = new THREE.PerspectiveCamera(
//         35,
//         container.clientWidth / container.clientHeight,
//         0.1,
//         1000
//     );

//     camera.position.set(
//         0,
//         1.5,
//         5
//     );


//     // --------------------------------
//     // Renderer
//     // --------------------------------

//     renderer = new THREE.WebGLRenderer({
//         antialias: true,
//         alpha: true
//     });

//     renderer.setPixelRatio(
//         Math.min(window.devicePixelRatio, 2)
//     );

//     renderer.setSize(
//         container.clientWidth,
//         container.clientHeight
//     );

//     renderer.outputColorSpace = THREE.SRGBColorSpace;

//     renderer.shadowMap.enabled = true;

//     container.innerHTML = "";

//     container.appendChild(renderer.domElement);


//     // --------------------------------
//     // Controls
//     // --------------------------------

//     controls = new OrbitControls(
//         camera,
//         renderer.domElement
//     );

//     controls.enableDamping = true;

//     controls.enablePan = false;

//     controls.minDistance = 2;

//     controls.maxDistance = 8;

//     controls.target.set(
//         0,
//         1.3,
//         0
//     );


//     // --------------------------------
//     // Lights
//     // --------------------------------

//     const ambientLight = new THREE.AmbientLight(
//         0xffffff,
//         2
//     );

//     scene.add(ambientLight);


//     const keyLight = new THREE.DirectionalLight(
//         0xffffff,
//         3
//     );

//     keyLight.position.set(
//         3,
//         5,
//         5
//     );

//     keyLight.castShadow = true;

//     scene.add(keyLight);


//     const fillLight = new THREE.DirectionalLight(
//         0x88aaff,
//         1.5
//     );

//     fillLight.position.set(
//         -4,
//         3,
//         2
//     );

//     scene.add(fillLight);


//     // --------------------------------
//     // Resize
//     // --------------------------------

//     window.addEventListener(
//         "resize",
//         () => resizeThreeScene(container)
//     );


//     // --------------------------------
//     // Start render
//     // --------------------------------

//     animate();

//     console.log("[Three.js] Ready");
// }


// function resizeThreeScene(container) {

//     if (!camera || !renderer) return;

//     const width = container.clientWidth;
//     const height = container.clientHeight;

//     camera.aspect = width / height;

//     camera.updateProjectionMatrix();

//     renderer.setSize(
//         width,
//         height
//     );
// }


// export function loadAstronautModel(modelPath) {

//     return new Promise((resolve, reject) => {

//         const loader = new GLTFLoader();

//         console.log(
//             "[Three.js] Loading:",
//             modelPath
//         );


//         loader.load(

//             modelPath,

//             (gltf) => {

//                 console.log(
//                     "[Three.js] GLB loaded"
//                 );

//                 // ลบโมเดลเก่า
//                 if (currentModel) {

//                     scene.remove(
//                         currentModel
//                     );

//                 }


//                 currentModel = gltf.scene;


//                 // --------------------------------
//                 // Model settings
//                 // --------------------------------

//                 currentModel.traverse(
//                     (object) => {

//                         if (
//                             object.isMesh
//                         ) {

//                             object.castShadow = true;

//                             object.receiveShadow = true;

//                         }

//                     }
//                 );


//                 // --------------------------------
//                 // Center model
//                 // --------------------------------

//                 const box =
//                     new THREE.Box3()
//                         .setFromObject(
//                             currentModel
//                         );

//                 const center =
//                     box.getCenter(
//                         new THREE.Vector3()
//                     );

//                 currentModel.position.sub(
//                     center
//                 );


//                 // --------------------------------
//                 // Scale
//                 // --------------------------------

//                 const size =
//                     box.getSize(
//                         new THREE.Vector3()
//                     );

//                 const maxSize =
//                     Math.max(
//                         size.x,
//                         size.y,
//                         size.z
//                     );

//                 const targetHeight = 3.2;

//                 const scale =
//                     targetHeight / maxSize;

//                 currentModel.scale.setScalar(
//                     scale
//                 );


//                 // --------------------------------
//                 // Add to scene
//                 // --------------------------------

//                 scene.add(
//                     currentModel
//                 );


//                 // --------------------------------
//                 // Camera reset
//                 // --------------------------------

//                 camera.position.set(
//                     0,
//                     1.5,
//                     5
//                 );

//                 controls.target.set(
//                     0,
//                     0,
//                     0
//                 );

//                 controls.update();


//                 resolve(
//                     currentModel
//                 );

//             },

//             (progress) => {

//                 if (progress.total) {

//                     const percent =
//                         (
//                             progress.loaded /
//                             progress.total
//                         ) * 100;

//                     console.log(
//                         `[Three.js] ${percent.toFixed(0)}%`
//                     );

//                 }

//             },

//             (error) => {

//                 console.error(
//                     "[Three.js] GLB Error:",
//                     error
//                 );

//                 reject(error);

//             }
//         );
//     });
// }


// function animate() {

//     animationFrameId =
//         requestAnimationFrame(
//             animate
//         );

//     if (controls) {

//         controls.update();

//     }

//     if (renderer && scene && camera) {

//         renderer.render(
//             scene,
//             camera
//         );

//     }
// }


// export function getThreeScene() {

//     return {
//         scene,
//         camera,
//         renderer,
//         model: currentModel
//     };

// }














// // import * as THREE from "three";

// // import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


// // =====================================================
// // VARIABLES
// // =====================================================

// let scene;
// let camera;
// let renderer;

// let astronaut;
// let mixer;

// let clock;

// let container;


// // =====================================================
// // INIT SCENE
// // =====================================================

// export function initThreeScene() {

//     container = document.getElementById("space-container");

//     clock = new THREE.Clock();

//     // -------------------------------------------------
//     // Scene
//     // -------------------------------------------------

//     scene = new THREE.Scene();

//     scene.background = new THREE.Color(0x000000);


//     // -------------------------------------------------
//     // Camera
//     // -------------------------------------------------

//     camera = new THREE.PerspectiveCamera(
//         60,
//         window.innerWidth / window.innerHeight,
//         0.1,
//         1000
//     );

//     camera.position.set(
//         0,
//         1.5,
//         6
//     );


//     // -------------------------------------------------
//     // Renderer
//     // -------------------------------------------------

//     renderer = new THREE.WebGLRenderer({
//         antialias: true,
//         alpha: false
//     });

//     renderer.setPixelRatio(
//         Math.min(window.devicePixelRatio, 2)
//     );

//     renderer.setSize(
//         window.innerWidth,
//         window.innerHeight
//     );

//     renderer.outputColorSpace =
//         THREE.SRGBColorSpace;

//     renderer.shadowMap.enabled = true;

//     container.appendChild(
//         renderer.domElement
//     );


//     // -------------------------------------------------
//     // LIGHTING
//     // -------------------------------------------------

//     const ambientLight =
//         new THREE.AmbientLight(
//             0xffffff,
//             1.5
//         );

//     scene.add(ambientLight);


//     const directionalLight =
//         new THREE.DirectionalLight(
//             0xffffff,
//             3
//         );

//     directionalLight.position.set(
//         5,
//         10,
//         5
//     );

//     directionalLight.castShadow = true;

//     scene.add(directionalLight);


//     // -------------------------------------------------
//     // STARFIELD
//     // -------------------------------------------------

//     createStarfield();


//     // -------------------------------------------------
//     // RESIZE
//     // -------------------------------------------------

//     window.addEventListener(
//         "resize",
//         onWindowResize
//     );


//     // -------------------------------------------------
//     // START RENDER
//     // -------------------------------------------------

//     animate();


//     console.log(
//         "[ThreeScene] Scene initialized"
//     );


//     return {
//         scene,
//         camera,
//         renderer
//     };
// }


// // =====================================================
// // STARFIELD
// // =====================================================

// function createStarfield() {

//     const starCount = 5000;

//     const geometry =
//         new THREE.BufferGeometry();

//     const positions =
//         new Float32Array(
//             starCount * 3
//         );


//     for (let i = 0; i < starCount; i++) {

//         const i3 = i * 3;

//         positions[i3] =
//             (Math.random() - 0.5) * 200;

//         positions[i3 + 1] =
//             (Math.random() - 0.5) * 200;

//         positions[i3 + 2] =
//             (Math.random() - 0.5) * 200;
//     }


//     geometry.setAttribute(
//         "position",
//         new THREE.BufferAttribute(
//             positions,
//             3
//         )
//     );


//     const material =
//         new THREE.PointsMaterial({

//             color: 0xffffff,

//             size: 0.08,

//             sizeAttenuation: true
//         });


//     const stars =
//         new THREE.Points(
//             geometry,
//             material
//         );


//     scene.add(stars);
// }


// // =====================================================
// // LOAD ASTRONAUT
// // =====================================================

// export function loadAstronautModel() {

//     const loader =
//         new GLTFLoader();


//     loader.load(

//         // "./models/astronaut.glb",
//         "./models/suits/suit01.glb",

//         (gltf) => {

//             astronaut =
//                 gltf.scene;


//             console.log(
//                 "[Astronaut] Model loaded",
//                 astronaut
//             );


//             // -------------------------------------------------
//             // MODEL POSITION
//             // -------------------------------------------------

//             astronaut.position.set(
//                 0,
//                 -1,
//                 0
//             );


//             // -------------------------------------------------
//             // MODEL SCALE
//             // -------------------------------------------------

//             astronaut.scale.set(
//                 1,
//                 1,
//                 1
//             );


//             // -------------------------------------------------
//             // SHADOW
//             // -------------------------------------------------

//             astronaut.traverse(
//                 (object) => {

//                     if (object.isMesh) {

//                         object.castShadow = true;

//                         object.receiveShadow = true;
//                     }
//                 }
//             );


//             // -------------------------------------------------
//             // ADD TO SCENE
//             // -------------------------------------------------

//             scene.add(
//                 astronaut
//             );


//             // -------------------------------------------------
//             // ANIMATION
//             // -------------------------------------------------

//             if (
//                 gltf.animations &&
//                 gltf.animations.length > 0
//             ) {

//                 mixer =
//                     new THREE.AnimationMixer(
//                         astronaut
//                     );


//                 gltf.animations.forEach(
//                     (clip) => {

//                         const action =
//                             mixer.clipAction(
//                                 clip
//                             );

//                         action.play();
//                     }
//                 );


//                 console.log(
//                     "[Astronaut] Animations:",
//                     gltf.animations.length
//                 );
//             }


//             // -------------------------------------------------
//             // HIDE LOADING
//             // -------------------------------------------------

//             const loading =
//                 document.getElementById(
//                     "loading"
//                 );

//             if (loading) {

//                 loading.classList.add(
//                     "hidden"
//                 );
//             }


//             // -------------------------------------------------
//             // DEBUG
//             // -------------------------------------------------

//             console.log(
//                 "[Astronaut] Position:",
//                 astronaut.position
//             );

//             console.log(
//                 "[Astronaut] Scale:",
//                 astronaut.scale
//             );
//         },


//         // -------------------------------------------------
//         // PROGRESS
//         // -------------------------------------------------

//         (xhr) => {

//             if (xhr.total) {

//                 const percent =
//                     (
//                         xhr.loaded /
//                         xhr.total
//                     ) * 100;

//                 console.log(
//                     `Astronaut ${percent.toFixed(0)}%`
//                 );
//             }
//         },


//         // -------------------------------------------------
//         // ERROR
//         // -------------------------------------------------

//         (error) => {

//             console.error(
//                 "[Astronaut] Load failed:",
//                 error
//             );

//             const loading =
//                 document.getElementById(
//                     "loading"
//                 );

//             if (loading) {

//                 loading.innerText =
//                     "Failed to load suit01.glb";
//             }
//         }
//     );
// }


// // =====================================================
// // ANIMATION LOOP
// // =====================================================

// function animate() {

//     requestAnimationFrame(
//         animate
//     );


//     const delta =
//         clock.getDelta();


//     // -------------------------------------------------
//     // GLB ANIMATION
//     // -------------------------------------------------

//     if (mixer) {

//         mixer.update(
//             delta
//         );
//     }


//     // -------------------------------------------------
//     // ASTRONAUT FLOATING
//     // -------------------------------------------------

//     if (astronaut) {

//         astronaut.rotation.y +=
//             delta * 0.15;

//         astronaut.position.y =
//             -1 +
//             Math.sin(
//                 performance.now() * 0.001
//             ) * 0.05;
//     }


//     // -------------------------------------------------
//     // RENDER
//     // -------------------------------------------------

//     renderer.render(
//         scene,
//         camera
//     );
// }


// // =====================================================
// // RESIZE
// // =====================================================

// function onWindowResize() {

//     if (!camera || !renderer) {
//         return;
//     }


//     camera.aspect =
//         window.innerWidth /
//         window.innerHeight;


//     camera.updateProjectionMatrix();


//     renderer.setSize(
//         window.innerWidth,
//         window.innerHeight
//     );
// }