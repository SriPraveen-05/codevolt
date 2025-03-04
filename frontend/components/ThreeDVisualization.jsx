import React, { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { Model } from "@/components/Model" // Import your model

const ThreeDVisualization = () => {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={<span>Loading Model...</span>}>
        <Model />
      </Suspense>
      <OrbitControls enableZoom={true} />
    </Canvas>
  )
}

export default ThreeDVisualization
