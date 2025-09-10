import { useGLTF } from "@react-three/drei"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

export function CommunityModel() {
  const { scene } = useGLTF("/Earth.glb")
  const modelRef = useRef()

  // Add slow rotation
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002
    }
  })

  return <primitive ref={modelRef} object={scene} scale={1.5} />
}
