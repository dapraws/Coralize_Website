import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bounds,
  Center,
  ContactShadows,
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

/**
 * Slowly dollies the camera toward the model and back again. Some detail —
 * the polyps on the staghorn colony — is only legible up close, and the wheel
 * is spoken for by the show's navigation, so the push-in has to be automatic.
 */
function AutoPushIn({ amount = 0.42, period = 16 }: { amount?: number; period?: number }) {
  const { camera, controls } = useThree();
  const base = useRef<number | null>(null);
  const t = useRef(0);

  useEffect(() => {
    base.current = null;
    t.current = 0;
  }, [amount, period]);

  useFrame((_, delta) => {
    const target = (controls as unknown as { target?: THREE.Vector3 })?.target;
    if (!target) return;
    const dist = camera.position.distanceTo(target);
    if (base.current === null) {
      base.current = dist;
      return;
    }
    t.current += delta;
    // Ease in and back out on a sine so it never snaps.
    const wave = (1 - Math.cos((t.current / period) * Math.PI * 2)) / 2;
    const wanted = base.current * (1 - amount * wave);
    const dir = camera.position.clone().sub(target).normalize();
    camera.position.copy(dir.multiplyScalar(wanted).add(target));
  });

  return null;
}

export function ModelStage({
  modelUrl,
  autoRotate = true,
  margin = 1.3,
  pushIn = false,
}: {
  modelUrl: string;
  autoRotate?: boolean;
  /** Lower = model fills more of its container. */
  margin?: number;
  /** Slowly cycle the camera closer, to reveal fine detail. */
  pushIn?: boolean;
}) {
  return (
    <Canvas
      // Elevated start so you look slightly *down* onto the model. Bounds fits
      // along the camera's existing direction, so a head-on default meant flat
      // subjects (the biorock frame especially) read as a line until you
      // dragged them. This gives the structure away immediately.
      camera={{ fov: 38, position: [0, 2.6, 6] }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
      }}
    >
      {/* Studio setup for a light page: enough fill that nothing crushes to
          black, but restrained — over-lighting washes the models out against
          white and the coral loses its colour. */}
      <ambientLight intensity={0.62} />
      <hemisphereLight args={["#ffffff", "#b9cdf0", 0.55]} />
      <directionalLight position={[-4, 6, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[5, 2, -4]} intensity={0.6} color="#ffd9c8" />
      <directionalLight position={[0, -4, 2]} intensity={0.25} color="#cfe6ff" />

      <Suspense fallback={null}>
        {/* Do NOT wrap this in <Float>, and do not add `observe`: Bounds
            re-fits the camera whenever its subtree changes, so a per-frame
            animation inside it makes Bounds fight the rotation every frame and
            the model sits dead still. Motion belongs to OrbitControls. */}
        <Bounds key={modelUrl} fit clip margin={margin}>
          <Center>
            <Model url={modelUrl} />
          </Center>
        </Bounds>
        {/* `preset="city"` makes drei fetch this HDR from raw.githack.com at
            runtime — a third-party CDN the site would silently depend on for
            its lighting, and the same class of dependency as the Draco
            decoder that was already removed. The file is vendored instead. */}
        <Environment files="/hdri/city.hdr" />
      </Suspense>

      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={0.3}
        blur={3.2}
        far={4}
        color="#0c1848"
      />
      {/* makeDefault is required for Bounds to hand the camera over to the
          controls; without it the two drive the camera independently. */}
      <OrbitControls
        makeDefault
        enableZoom={false}
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={0.9}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={(Math.PI * 3) / 5}
      />
      {/* Must sit after OrbitControls so `controls` is available from context. */}
      {pushIn && <AutoPushIn key={modelUrl} />}
    </Canvas>
  );
}
