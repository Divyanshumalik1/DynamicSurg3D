// import React, { useRef, useState } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { PLYLoader } from "three-stdlib";
// import * as THREE from "three";

// const PLYModel = ({ url }) => {
//   const [geometry, setGeometry] = useState(null);
//   const materialRef = useRef();

//   // Load the PLY file
//   React.useEffect(() => {
//     const loader = new PLYLoader();
//     loader.load(url, (loadedGeometry) => {
//       loadedGeometry.computeVertexNormals(); // Ensure smooth shading
//       setGeometry(loadedGeometry);
//     });
//   }, [url]);

//   return (
//     geometry && (
//       <mesh geometry={geometry}>
//         <meshStandardMaterial
//           ref={materialRef}
//           vertexColors={true}
//           //color={"red"}
//           wireframe={true}
//         />
//       </mesh>
//     )
//   );
// };

// const PointCloud = ({url}) => {
//   return (
//     <Canvas camera={{ position: [2, 2, 2], fov: 75 }}>
//       {/* Ambient and directional lights for better visualization */}
//       <ambientLight intensity={0.4} />
//       <directionalLight position={[5, 5, 5]} intensity={1} />

//       {/* Load PLY model */}
//       <PLYModel url={url} />

//       {/* Add OrbitControls for interaction */}
//       <OrbitControls />
//     </Canvas>
//   );
// };

// export default PointCloud;


// import React, { useRef, useState } from "react";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { PLYLoader } from "three-stdlib";
// import * as THREE from "three";

// const PLYModel = ({ url }) => {
//   const [geometry, setGeometry] = useState(null);
//   const materialRef = useRef();

//   // Load the PLY file
//   React.useEffect(() => {
//     const loader = new PLYLoader();
//     loader.load(url, (loadedGeometry) => {
//       loadedGeometry.computeVertexNormals(); // Ensure smooth shading
//     // Rotate the geometry to fix the inverted issue
//       loadedGeometry.rotateY(Math.PI); // Rotate 180 degrees around the X-axis to fix inversion
//       loadedGeometry.rotateZ(Math.PI); // Rotate 180 degrees around the X-axis to fix inversion
      
//       // Darken the vertex colors
//       const colors = loadedGeometry.attributes.color.array; // Get the vertex colors
//       for (let i = 0; i < colors.length; i += 3) {
//         colors[i] *= 0.5;   // Red channel
//         colors[i + 1] *= 0.5; // Green channel
//         colors[i + 2] *= 0.5; // Blue channel
//       }

//       loadedGeometry.attributes.color.needsUpdate = true; // Update the colors

//       setGeometry(loadedGeometry);
//     });
//   }, [url]);

//   return (
//     geometry && (
//       <points scale={[1, 1, 1]}>
//         <bufferGeometry attach="geometry" {...geometry} />
//         <pointsMaterial
//           size={0.09} // Increase point size to make the point cloud more visible
//           sizeAttenuation={true} // Enables scaling based on perspective
//           vertexColors={true} // Use vertex colors if present
          
//         />
//       </points>
//     )
//   );
// };

// const PointCloud = ({ url }) => {
//   return (
//     <Canvas camera={{ position: [1, 1, 0.1], fov: 1 }}>
//       {/* Ambient and directional lights for better visualization */}
//       <ambientLight intensity={1} />
//       <directionalLight position={[5, 5, 5]} intensity={1} />
//       <pointLight position={[-5, -5, -5]} intensity={1} />

//       {/* Load PLY model */}
//       <PLYModel url={url} />

//       {/* Add OrbitControls for interaction */}
//       <OrbitControls enableDamping={true} dampingFactor={0.1} />
//     </Canvas>
//   );
// };

// export default PointCloud;
