import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.151.0/three.module.js";

const canvasEl = document.querySelector("#flowerCanvas");
const stageEl = document.querySelector(".flower-stage");
const toggleEl = document.querySelector(".render-toggle");
const fragmentShader = document.getElementById("fragmentShader")?.textContent;
const vertexShader = document.getElementById("vertexShader")?.textContent;

if (canvasEl && stageEl && fragmentShader && vertexShader) {
  const pointer = {
    x: 0.65,
    y: 0.34,
    clicked: true
  };

  let isStart = true;
  let isRendering = true;
  let renderer;
  let shaderScene;
  let mainScene;
  let renderTargets;
  let camera;
  let clock;
  let basicMaterial;
  let shaderMaterial;

  const backgroundColor = new THREE.Color(0xfff8ef);

  initScene();
  updateSize();

  window.addEventListener("resize", updateSize);
  canvasEl.addEventListener("click", handlePointer);
  canvasEl.addEventListener("touchstart", handlePointer, { passive: false });
  toggleEl?.addEventListener("click", handleToggle);

  window.setTimeout(() => addFlower(0.75, 0.5), 350);
  window.setTimeout(() => addFlower(0.42, 0.55), 650);

  render();

  function handlePointer(event) {
    event.preventDefault();

    const rect = canvasEl.getBoundingClientRect();
    let clientX;
    let clientY;

    if (event.type === "touchstart") {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;

    addFlower(x, y);
  }

  function handleToggle() {
    isRendering = !isRendering;
    toggleEl.textContent = isRendering ? "Pausar flores" : "Continuar flores";
    toggleEl.setAttribute("aria-pressed", String(!isRendering));
  }

  function addFlower(x, y) {
    pointer.x = Math.min(Math.max(x, 0), 1);
    pointer.y = Math.min(Math.max(y, 0), 1);
    pointer.clicked = true;
    isRendering = true;

    if (toggleEl) {
      toggleEl.textContent = "Pausar flores";
      toggleEl.setAttribute("aria-pressed", "false");
    }
  }

  function getStageSize() {
    const rect = stageEl.getBoundingClientRect();
    return {
      width: Math.max(1, Math.floor(rect.width)),
      height: Math.max(1, Math.floor(rect.height))
    };
  }

  function initScene() {
    const { width, height } = getStageSize();

    renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      alpha: true,
      antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    shaderScene = new THREE.Scene();
    mainScene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    clock = new THREE.Clock();

    renderTargets = [
      new THREE.WebGLRenderTarget(width, height),
      new THREE.WebGLRenderTarget(width, height)
    ];

    const planeGeometry = new THREE.PlaneGeometry(2, 2);

    shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_ratio: { value: width / height },
        u_point: { value: new THREE.Vector2(pointer.x, pointer.y) },
        u_time: { value: 0 },
        u_stop_time: { value: 0 },
        u_stop_randomizer: { value: new THREE.Vector3(0, 0, 0) },
        u_texture: { value: null },
        u_background_color: { value: backgroundColor }
      },
      vertexShader,
      fragmentShader,
      transparent: true
    });

    basicMaterial = new THREE.MeshBasicMaterial({ transparent: true });
    const backgroundColorMaterial = new THREE.MeshBasicMaterial({ color: backgroundColor, transparent: true });

    const planeBasic = new THREE.Mesh(planeGeometry, basicMaterial);
    const planeShader = new THREE.Mesh(planeGeometry, shaderMaterial);
    const coloredPlane = new THREE.Mesh(planeGeometry, backgroundColorMaterial);

    shaderScene.add(planeShader);
    mainScene.add(coloredPlane);

    renderer.setSize(width, height, false);
    renderer.setRenderTarget(renderTargets[0]);
    renderer.render(mainScene, camera);

    mainScene.remove(coloredPlane);
    mainScene.add(planeBasic);
  }

  function render() {
    requestAnimationFrame(render);
    const delta = clock.getDelta();

    if (!isRendering) return;

    shaderMaterial.uniforms.u_texture.value = renderTargets[0].texture;
    shaderMaterial.uniforms.u_time.value = clock.getElapsedTime() + 0.9;

    if (pointer.clicked) {
      shaderMaterial.uniforms.u_point.value = new THREE.Vector2(pointer.x, 1 - pointer.y);
      shaderMaterial.uniforms.u_stop_randomizer.value = new THREE.Vector3(Math.random(), Math.random(), Math.random());

      if (isStart) {
        shaderMaterial.uniforms.u_stop_randomizer.value = new THREE.Vector3(0.5, 1, 1);
        isStart = false;
      }

      shaderMaterial.uniforms.u_stop_time.value = 0;
      pointer.clicked = false;
    }

    shaderMaterial.uniforms.u_stop_time.value += delta;

    renderer.setRenderTarget(renderTargets[1]);
    renderer.render(shaderScene, camera);

    basicMaterial.map = renderTargets[1].texture;

    renderer.setRenderTarget(null);
    renderer.render(mainScene, camera);

    const temporaryTarget = renderTargets[0];
    renderTargets[0] = renderTargets[1];
    renderTargets[1] = temporaryTarget;
  }

  function updateSize() {
    if (!renderer || !shaderMaterial || !renderTargets) return;

    const { width, height } = getStageSize();
    shaderMaterial.uniforms.u_ratio.value = width / height;
    renderer.setSize(width, height, false);
    renderTargets.forEach((target) => target.setSize(width, height));
  }
}
