import { useEffect, useRef } from "react";
import * as THREE from "three";

type OrbitalSceneProps = {
  selectedTask: number;
  color: string;
};

const TASK_COLORS = ["#f15a38", "#315aff", "#168c71"];

export default function OrbitalScene({ selectedTask, color }: OrbitalSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const selectedTaskRef = useRef(selectedTask);
  const colorRef = useRef(color);
  const staticRenderRef = useRef<(() => void) | null>(null);

  selectedTaskRef.current = selectedTask;
  colorRef.current = color;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: window.devicePixelRatio < 2,
        powerPreference: "low-power",
      });
    } catch {
      canvas.parentElement?.setAttribute("data-unavailable", "true");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
    camera.position.set(0, 0, 7.2);

    const root = new THREE.Group();
    scene.add(root);

    scene.add(new THREE.HemisphereLight(0xf3ecdc, 0x262522, 1.25));
    const keyLight = new THREE.PointLight(0xf15a38, 22, 18);
    keyLight.position.set(2.8, 2.3, 3.3);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x315aff, 20, 16);
    rimLight.position.set(-3.5, -1.8, -1.8);
    scene.add(rimLight);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: "#bbb8ae",
      emissive: "#f15a38",
      emissiveIntensity: 0.35,
      metalness: 0.92,
      roughness: 0.24,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
    });
    const core = new THREE.Mesh(new THREE.DodecahedronGeometry(0.98, 0), coreMaterial);
    root.add(core);

    const innerShell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.13, 1),
      new THREE.MeshBasicMaterial({ color: "#282a2d", wireframe: true, transparent: true, opacity: 0.5 }),
    );
    root.add(innerShell);

    const beaconMaterial = new THREE.MeshPhysicalMaterial({ color: "#fff6e4", emissive: "#f15a38", emissiveIntensity: 1.4, metalness: 0.48, roughness: 0.16, clearcoat: 1 });
    const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), beaconMaterial);
    root.add(beacon);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(1.3, 36, 36),
      new THREE.MeshBasicMaterial({ color: "#f15a38", transparent: true, opacity: 0.07, depthWrite: false }),
    );
    root.add(halo);

    const ringMaterial = new THREE.MeshPhysicalMaterial({
      color: "#e8e2d4",
      metalness: 0.92,
      roughness: 0.28,
      emissive: "#f15a38",
      emissiveIntensity: 0.18,
      transparent: true,
      opacity: 0.9,
    });
    const rings = [
      { radius: 1.78, thickness: 0.014, rotation: [0.9, 0.08, 0.16] as const, arc: Math.PI * 1.8 },
      { radius: 2.08, thickness: 0.009, rotation: [0.22, 0.72, 0.62] as const, arc: Math.PI * 1.62 },
      { radius: 1.48, thickness: 0.008, rotation: [1.34, 0.3, 0.92] as const, arc: Math.PI * 1.56 },
    ];
    const ringMeshes = rings.map(({ radius, thickness, rotation, arc }) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, thickness, 10, 220, arc), ringMaterial.clone());
      ring.rotation.set(rotation[0], rotation[1], rotation[2]);
      root.add(ring);
      return ring;
    });

    const nodeGroup = new THREE.Group();
    root.add(nodeGroup);
    const markers: THREE.Mesh[] = [];
    const markerMaterials: THREE.MeshStandardMaterial[] = [];
    const glowMaterials: THREE.MeshBasicMaterial[] = [];
    const markerAngles = [-0.48, 1.7, 3.66];
    const markerDepths = [0.34, -0.5, 0.18];

    markerAngles.forEach((angle, index) => {
      const markerMaterial = new THREE.MeshStandardMaterial({
        color: "#fbf7ed",
        emissive: TASK_COLORS[index],
        emissiveIntensity: 1.8,
        metalness: 0.18,
        roughness: 0.2,
      });
      const marker = new THREE.Mesh(new THREE.SphereGeometry(0.105, 24, 24), markerMaterial);
      marker.position.set(Math.cos(angle) * 1.92, Math.sin(angle) * 1.32, markerDepths[index]);
      marker.userData.taskIndex = index;
      nodeGroup.add(marker);
      markers.push(marker);
      markerMaterials.push(markerMaterial);

      const glowMaterial = new THREE.MeshBasicMaterial({ color: TASK_COLORS[index], transparent: true, opacity: 0.18, depthWrite: false });
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.21, 20, 20), glowMaterial);
      glow.position.copy(marker.position);
      nodeGroup.add(glow);
      glowMaterials.push(glowMaterial);
    });

    const syncSceneState = (render = true) => {
      const currentColor = colorRef.current;
      coreMaterial.emissive.set(currentColor);
      halo.material.color.set(currentColor);
      keyLight.color.set(currentColor);
      const active = selectedTaskRef.current;
      markerMaterials.forEach((material, index) => {
        material.emissiveIntensity = index === active ? 3.4 : 1.15;
        glowMaterials[index].opacity = index === active ? 0.32 : 0.11;
        markers[index].scale.setScalar(index === active ? 1.24 : 1);
      });
      if (render) renderer.render(scene, camera);
    };
    staticRenderRef.current = () => syncSceneState();

    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 2.5 + Math.random() * 3.7;
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() * 2 - 1) * 2.1;
      const ringRadius = Math.sqrt(Math.max(0, 1 - (z / 2.1) ** 2)) * radius;
      particlePositions[i * 3] = Math.cos(theta) * ringRadius;
      particlePositions[i * 3 + 1] = Math.sin(theta) * ringRadius;
      particlePositions[i * 3 + 2] = z - 1.1;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: "#34363b", size: 0.018, transparent: true, opacity: 0.52, sizeAttenuation: true }),
    );
    scene.add(particles);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = reducedMotionQuery.matches;
    let animationFrame = 0;
    let disposed = false;
    let time = 0;
    let scrollTarget = 0;
    let scrollProgress = 0;

    const resize = () => {
      const width = Math.max(1, canvas.clientWidth);
      const height = Math.max(1, canvas.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = width < 520 ? 43 : width < 800 ? 38 : 34;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const updateScroll = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      scrollTarget = THREE.MathUtils.clamp(window.scrollY / scrollable, 0, 1);
      if (reducedMotion) staticRenderRef.current?.();
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointerTarget.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointerTarget, camera);
      const hit = raycaster.intersectObjects(markers, false)[0];
      canvas.style.cursor = hit ? "pointer" : "grab";
    };

    const pickNode = () => {
      raycaster.setFromCamera(pointerTarget, camera);
      const hit = raycaster.intersectObjects(markers, false)[0];
      const index = hit?.object.userData.taskIndex;
      if (typeof index === "number") {
        window.dispatchEvent(new CustomEvent("techfest:select-task", { detail: { index } }));
      }
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion) {
        cancelAnimationFrame(animationFrame);
        staticRenderRef.current?.();
      } else {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      if (disposed || reducedMotion) return;
      animationFrame = requestAnimationFrame(animate);
      time += 0.008;
      scrollProgress += (scrollTarget - scrollProgress) * 0.035;
      pointer.lerp(pointerTarget, 0.035);

      const phase = scrollProgress * Math.PI * 2;
      root.rotation.y = time * 0.17 + scrollProgress * 1.16;
      root.rotation.x = Math.sin(time * 0.48) * 0.08 + Math.sin(phase) * 0.12;
      beacon.rotation.y = time * 0.72;
      beacon.rotation.x = time * 0.36;
      root.position.y = Math.sin(time * 0.65) * 0.08 + Math.sin(phase * 1.45) * 0.18;
      root.scale.setScalar(1 + Math.sin(phase + 0.4) * 0.035);
      nodeGroup.rotation.y = -root.rotation.y * 0.6;
      ringMeshes[0].rotation.z += 0.0007;
      ringMeshes[1].rotation.x += 0.00045;
      particles.rotation.z = time * 0.012 + scrollProgress * 0.24;
      camera.position.x += (pointer.x * 0.23 + Math.sin(phase) * 0.24 - camera.position.x) * 0.028;
      camera.position.y += (pointer.y * 0.16 + Math.cos(phase * 1.2) * 0.12 - camera.position.y) * 0.028;
      camera.position.z += (7.2 - scrollProgress * 0.4 - camera.position.z) * 0.022;
      camera.lookAt(0, 0, 0);

      syncSceneState(false);
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    canvas.addEventListener("pointermove", updatePointer);
    canvas.addEventListener("pointerdown", updatePointer);
    canvas.addEventListener("pointerup", pickNode);
    canvas.addEventListener("pointerleave", () => { canvas.style.cursor = "default"; });
    window.addEventListener("scroll", updateScroll, { passive: true });
    reducedMotionQuery.addEventListener("change", onMotionChange);
    resize();
    updateScroll();
    if (!reducedMotion) animationFrame = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      staticRenderRef.current = null;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", updatePointer);
      canvas.removeEventListener("pointerdown", updatePointer);
      canvas.removeEventListener("pointerup", pickNode);
      window.removeEventListener("scroll", updateScroll);
      reducedMotionQuery.removeEventListener("change", onMotionChange);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    staticRenderRef.current?.();
  }, [selectedTask, color]);

  return (
    <div className="orbital-scene" aria-hidden="true">
      <canvas ref={canvasRef} className="orbital-canvas" aria-hidden="true" />
      <div className="scene-fallback" />
    </div>
  );
}
