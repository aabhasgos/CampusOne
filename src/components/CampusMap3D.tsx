"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

function Building({ position, size, name }: { position: [number, number, number], size: [number, number, number], name: string }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, size[1] / 2, 0]}>
        <boxGeometry args={size} />
        {/* Solid architectural material */}
        <meshStandardMaterial color="#1A1A1A" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Golden wireframe overlay for brutalist look */}
      <mesh position={[0, size[1] / 2, 0]}>
        <boxGeometry args={[size[0] + 0.02, size[1] + 0.02, size[2] + 0.02]} />
        <meshBasicMaterial color="#333333" wireframe />
      </mesh>
      {/* HTML overlay is much safer and won't crash the WebGL context like standard Text sometimes does */}
      <Html position={[0, size[1] + 0.5, 0]} center zIndexRange={[100, 0]}>
        <div className="text-primary text-[10px] md:text-xs font-bold whitespace-nowrap uppercase tracking-widest bg-black px-2 py-1 border-[1px] border-primary">
          {name}
        </div>
      </Html>
    </group>
  );
}

export default function CampusMap3D() {
  return (
    <div className="w-full h-[600px] bg-black border-[1px] border-border relative">
      <div className="absolute top-4 left-4 z-10 text-primary text-sm font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-space-grotesk)" }}>
        Interactive 3D Campus Model
      </div>
      <Canvas shadows camera={{ position: [-10, 15, 20], fov: 40 }}>
        <color attach="background" args={["#0A0A0A"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow />
        
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={0.5} 
          enableZoom={true} 
          maxPolarAngle={Math.PI / 2.2} 
        />
        
        {/* Ground Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#0f0f11" />
        </mesh>

        {/* Grid Helper for technical look */}
        <gridHelper args={[50, 50, "#333333", "#111111"]} />

        {/* Simulated Bennett University Blocks */}
        <Building position={[-6, 0, -6]} size={[4, 3, 4]} name="Block A" />
        <Building position={[0, 0, -8]} size={[5, 4, 3]} name="Block B" />
        <Building position={[6, 0, -4]} size={[3, 5, 3]} name="Block C" />
        <Building position={[-8, 0, 2]} size={[3, 2, 6]} name="Hostels" />
        <Building position={[0, 0, 4]} size={[6, 2, 6]} name="Library" />
        <Building position={[8, 0, 6]} size={[5, 3, 8]} name="Sports Complex" />
      </Canvas>
    </div>
  );
}
