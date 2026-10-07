"use client";
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, TorusKnot, Icosahedron, Float } from "@react-three/drei";
import * as THREE from "three";

function NodeNetwork({ isDark }: { isDark: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.2;
    }
  });

  // Bennett Blue for light mode, light grey for dark mode
  const primaryWire = isDark ? "#888888" : "#003366";
  const secondaryWire = isDark ? "#444444" : "#B31B1B";

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <TorusKnot args={[6, 1.5, 200, 32]}>
          <meshBasicMaterial color={primaryWire} wireframe transparent opacity={0.25} />
        </TorusKnot>
      </Float>
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        <Icosahedron args={[4, 1]}>
          <meshBasicMaterial color={secondaryWire} wireframe transparent opacity={0.15} />
        </Icosahedron>
      </Float>
    </group>
  );
}

export default function ThreeCanvas() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    // Initial check
    updateTheme();

    // Observe changes to the 'class' attribute on the html tag
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const fogColor = isDark ? "#0A0A0A" : "#F8F9FA";

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <fog attach="fog" args={[fogColor, 10, 25]} />
        <NodeNetwork isDark={isDark} />
      </Canvas>
    </div>
  );
}
