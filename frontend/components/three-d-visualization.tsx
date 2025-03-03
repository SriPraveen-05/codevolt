"use client"

import { useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type * as THREE from "three"

function Model() {
  const { scene } = useGLTF("/assets/3d/duck.glb")

  // This is a placeholder - in a real app, we would use an actual car model
  // and highlight the oxygen sensor location

  return <primitive object={scene} scale={2} position={[0, -1, 0]} />
}

function Annotations() {
  const { camera } = useThree()
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.quaternion.copy(camera.quaternion)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Oxygen Sensor Annotation */}
      <Html position={[1, 0, 0]} distanceFactor={10}>
        <div className="bg-background border rounded-lg p-2 shadow-lg w-[200px]">
          <Badge variant="destructive" className="mb-1 flex w-fit items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Faulty Component
          </Badge>
          <h3 className="text-sm font-bold">Oxygen Sensor</h3>
          <p className="text-xs text-muted-foreground">Bank 1 Sensor 1 needs replacement</p>
          <Button size="sm" variant="outline" className="mt-2 text-xs w-full">
            View Details
          </Button>
        </div>
      </Html>
    </group>
  )
}

export default function ThreeDVisualization() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Model />
      <Annotations />
      <OrbitControls />
      <Environment preset="studio" />
    </Canvas>
  )
}

