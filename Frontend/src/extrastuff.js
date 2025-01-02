// import PointCloud from './PointClouds';
// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import io from 'socket.io-client';
// import './App.css';

// // Register all necessary chart components
// Chart.register(...registerables);

// const App = () => {
//     const [lossData, setLossData] = useState([]);
//     const [labels, setLabels] = useState([]);
    
//     useEffect(() => {
//         // Connect to the Flask-SocketIO server
//         const socket = io('http://127.0.0.1:5000/');  // Update this with your server's IP
        
//         // Listen for 'training_status' events and update the chart data
//         socket.on('training_status', (data) => {
//             setLossData((prevLossData) => [...prevLossData, data.loss]);  // Append new loss
//             setLabels((prevLabels) => [...prevLabels, `Epoch ${data.epoch}`]);  // Update labels with epoch
//         });

//         return () => {
//             socket.disconnect();  // Clean up the socket connection when the component unmounts
//         };
//     }, []);

//     const runScript = () => {
//         fetch('http://127.0.0.1:5000/train')  // Trigger training via HTTP GET request
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Training started:', data);
//             })
//             .catch(error => {
//                 console.error("Error running script:", error);
//             });
//     };

//     // Chart.js data configuration
//     const data = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'Loss over Epoch',
//                 data: lossData,
//                 fill: false,
//                 backgroundColor: 'rgba(75,192,192,0.4)',
//                 borderColor: 'rgba(75,192,192,1)',
//                 tension: 0.1,  // Line curve smoothness
//             },
//         ],
//     };

//     return (
      
     
//     <div>
//         <h1>3D FLIm Visualization</h1>
//           <div classname="content">
         
//                 <div className="container">
//                 <PointCloud url={"frame_5.ply"} />
//                 </div>

//                 <div className="container">
//                 <button className="button" onClick={runScript}>Start Training</button>
//                 <Line  data={data} />
//                 </div>

//            </div>  

//       </div>

//     );
// };

// export default App;

// CODE FOR sending test PSNR values from server to react app works fine
// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000');

// function App() {
//   const [imageResults, setImageResults] = useState([]);

//   useEffect(() => {
//     // Listen for real-time evaluation results for each image
//     socket.on('image_evaluation_result', (data) => {
//       setImageResults((prevResults) => [...prevResults, data]);
//     });

//     return () => {
//       socket.off('image_evaluation_result');
//     };
//   }, []);

//   const startEvaluation = () => {
//     const modelPaths = ['/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/Camera_no_ins_v2_2'];

//     // Trigger the evaluation process
//     socket.emit('start_evaluation', { model_paths: modelPaths });
//   };

//   return (
//     <div>
//       <h1>Real-Time Image Evaluation Results</h1>
//       <button onClick={startEvaluation}>Start Evaluation</button>
//       <div>
//         {imageResults.map((result, index) => (
//           <div key={index}>
//             <h3>{result.scene} - {result.method}</h3>
//             <p>Image: {result.image_name}</p>
//             <p>SSIM: {result.SSIM}</p>
//             <p>PSNR: {result.PSNR}</p>
//             <p>LPIPS: {result.LPIPS}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;


// // SLIDER POINT CLOUD VIS NOT WORKING
// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import { Canvas } from '@react-three/fiber';

// const socket = io('http://localhost:5000'); // Change the URL if your Flask server runs on a different address

// const PointCloudViewer = () => {
//     const [currentPCD, setCurrentPCD] = useState(null); // Store the current point cloud data
//     const [pcIndex, setPcIndex] = useState(0); // Track the selected point cloud index (0 to 6)

//     useEffect(() => {
//         // Listen for incoming point cloud data from the server
//         socket.on('point_cloud_data', (data) => {
//             console.log('Received point cloud:', data);
//             setCurrentPCD(data.point_cloud); // Update the point cloud data
//         });

//         // Clean up the socket connection when the component is unmounted
//         return () => {
//             socket.off('point_cloud_data');
//         };
//     }, []);

//     useEffect(() => {
//         // Emit a request to load the point cloud for the selected index
//         socket.emit('start_point_cloud_stream', {
//             model_paths: ['/opt/nfs/home/dmalik/Downloads/Endo-4DGS-test/Old_repo_working/Endo-4DGS/output/endonerf/pulling'], // Replace with your actual path
//             index: pcIndex // Send the current index to the server
//         });
//     }, [pcIndex]);

//     // Render a range slider for scrolling through 7 points
//     const handleScroll = (event) => {
//         const value = parseInt(event.target.value, 10);
//         setPcIndex(value); // Update the point cloud index when the slider changes
//     };

//     // Render the current point cloud (assuming it's in a format you can visualize with react-three-fiber)
//     return (
//         <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//             <h1>Point Cloud Viewer</h1>

//             {/* Scroll bar with 7 points */}
//             <input
//                 type="range"
//                 min="0"
//                 max="6" // 7 points (0 to 6)
//                 value={pcIndex}
//                 onChange={handleScroll}
//                 style={{ width: '50%', marginBottom: '20px' }}
//             />

//             {/* Display the selected point cloud index */}
//             <p>Selected Point Cloud: {pcIndex + 1}</p>

//             {/* Render the point cloud (this is where you'd use react-three-fiber or three.js to visualize the point cloud) */}
//             {currentPCD ? (
//                 <Canvas style={{ height: '80%', width: '80%' }}>
//                     {/* Placeholder for rendering the actual point cloud. Replace with your point cloud rendering logic */}
//                     <pointCloud position={[0, 0, 0]}>
//                         {currentPCD.map(([x, y, z], index) => (
//                             <points position={[x, y, z]} key={index} />
//                         ))}
//                     </pointCloud>
//                 </Canvas>
//             ) : (
//                 <p>Loading Point Cloud {pcIndex + 1}...</p>
//             )}
//         </div>
//     );
// };

// export default PointCloudViewer;


// import React, { useState, useEffect, useRef } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';
// import io from 'socket.io-client';

// // WebSocket URL (connect to Flask server)
// const socket = io('http://localhost:5000'); // Change this to your server address

// const PointCloud = ({ points }) => {
//   const geometryRef = useRef();

//   useEffect(() => {
//     if (geometryRef.current && points.length) {
//       const positions = new Float32Array(points.flat());
//       geometryRef.current.setAttribute(
//         'position',
//         new THREE.BufferAttribute(positions, 3)
//       );
//     }
//   }, [points]);

//   return (
//     <points>
//       <bufferGeometry ref={geometryRef} />
//       <pointsMaterial size={0.01} color={0xffffff} />
//     </points>
//   );
// };

// const App = () => {
//   const [pointCloud, setPointCloud] = useState([]);

//   useEffect(() => {
//     socket.emit('request_point_cloud');
    
//     socket.on('point_cloud_data', (data) => {
//         const parsedData = JSON.parse(data);
//         console.log('Received point cloud data:', parsedData); // Debug log
//         setPointCloud(parsedData);
//     });

//     return () => {
//         socket.off('point_cloud_data');
//     };
// }, []);


//   return (
//     <Canvas camera={{ position: [1, 1, 2] }}>
//       <ambientLight />
//       <PointCloud points={pointCloud} />
//       <OrbitControls />
//     </Canvas>
//   );
// };

// export default App;


// // src/App.js
// import React, { useEffect, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';

// const PointCloud = ({ points }) => {
//   const geometry = new THREE.BufferGeometry();
  
//   // Extract positions and colors from points data
//   const positions = points.flatMap(p => [p.x, p.y, p.z]);
//   const colors = points.flatMap(p => p.color ? [p.color.r / 255, p.color.g / 255, p.color.b / 255] : [1, 1, 1]);

//   // Create buffer attributes
//   geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
//   geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

//   return (
//     <points>
//       <bufferGeometry attach="geometry" {...geometry} />
//       <pointsMaterial attach="material" vertexColors size={0.001} />
//     </points>
//   );
// };

// function App() {
//   const [points, setPoints] = useState([]);
//   const pointSize = 0.9; // Set your desired point size here
//   const fov = 4; // Set your desired FOV here

//   useEffect(() => {
//     // Load point cloud data from the JSON file
//     fetch('frame_01.json')
//       .then(response => response.json())
//       .then(data => setPoints(data));
//   }, []);

//   return (
//     <Canvas style={{ height: '100vh' }} camera={{ fov: fov, position: [0, 0, -2] }}>
//       <ambientLight />
//       <pointLight position={[10, 10, 10]} />
//       <OrbitControls />
      
//       {points.length > 0 && <PointCloud points={points} />}
//     </Canvas>
//   );
// }

// export default App;

//PERFECTLY WORKING CODE TO SHOW PC from JSON
// import React, { useEffect, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';

// const PointCloud = ({ points, pointSize }) => {
//   const geometry = new THREE.BufferGeometry();

//   // Extract positions and colors from points data
//   const positions = points.flatMap(p => [p.x, p.y, p.z]);
//   const colors = points.flatMap(p => p.color ? [p.color.r / 255, p.color.g / 255, p.color.b / 255] : [1, 1, 1]);

//   // Create buffer attributes
//   geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
//   geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

//   return (
//     <points>
//       <bufferGeometry attach="geometry" {...geometry} />
//       <pointsMaterial attach="material" vertexColors size={pointSize} />
//     </points>
//   );
// };

// function App() {
//   const [points, setPoints] = useState([]);
//   const [pointSize, setPointSize] = useState(0.0005);
//   const [fov, setFov] = useState(25);

//   useEffect(() => {
//     // Load point cloud data from the JSON file
//     fetch('frame_01.json')
//       .then(response => response.json())
//       .then(data => setPoints(data));
//   }, []);

//   return (
//     <>
//       <div style={{ position: 'absolute', zIndex: 1 }}>
//         <label>
//           Point Size: 
//           <input 
//             type="range" 
//             min="0.0001" 
//             max="0.009" 
//             step="0.00001" 
//             value={pointSize} 
//             onChange={(e) => setPointSize(parseFloat(e.target.value))} 
//           />
//         </label>
//         <label>
//           FOV: 
//           <input 
//             type="range" 
//             min="1" 
//             max="100" 
//             step="10" 
//             value={fov} 
//             onChange={(e) => setFov(parseInt(e.target.value))} 
//           />
//         </label>
//       </div>
//       <Canvas style={{ height: '100vh' }} camera={{ fov: fov, position: [0, 0, -1], near: 0.00000001, far: 10 }}>
//         <ambientLight />
//         <pointLight position={[10, 10, 10]} />
//         <OrbitControls />
        
//         {points.length > 0 && <PointCloud points={points} pointSize={pointSize} />}
//       </Canvas>
//     </>
//   );
// }

// export default App;

// PERFECTLY WORKING FOR SWITCHING LOCAL PCs but we need server communication
// import React, { useEffect, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';

// const PointCloud = ({ points, pointSize }) => {
//   const geometry = new THREE.BufferGeometry();

//   // Extract positions and colors from points data
//   const positions = points.flatMap(p => [p.x, p.y, p.z]);
//   const colors = points.flatMap(p => p.color ? [p.color.r / 255, p.color.g / 255, p.color.b / 255] : [1, 1, 1]);

//   // Create buffer attributes
//   geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
//   geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

//   return (
//     <points rotation={[0, 0, Math.PI]}>
//       <bufferGeometry attach="geometry" {...geometry} />
//       <pointsMaterial attach="material" vertexColors size={pointSize} />
//     </points>
//   );
// };

// function App() {
//   const [pointClouds, setPointClouds] = useState([]);  // Array to hold multiple point clouds
//   const [currentIndex, setCurrentIndex] = useState(0);  // Index of the currently selected point cloud
//   const [pointSize, setPointSize] = useState(0.0005);
//   const [fov, setFov] = useState(25);

//   // Load multiple point clouds
//   useEffect(() => {
//     const files = ['frame_1.json', 'frame_2.json', 'frame_3.json', 'frame0.json']; // Add your file names here

//     Promise.all(
//       files.map(file => fetch(file)
//         .then(response => {
//           if (!response.ok) {
//             throw new Error(`Failed to load ${file}`);
//           }
//           return response.json();
//         })
//       )
//     )
//       .then(data => {
//         console.log('Loaded point clouds:', data);  // Check if point clouds are being loaded correctly
//         setPointClouds(data);
//       })
//       .catch(error => {
//         console.error('Error loading point cloud data:', error);
//       });
//   }, []);

//   return (
//     <>
//       <div style={{ position: 'absolute', zIndex: 1 }}>
//         <label>
//           Point Size: 
//           <input 
//             type="range" 
//             min="0.0001" 
//             max="0.009" 
//             step="0.00001" 
//             value={pointSize} 
//             onChange={(e) => setPointSize(parseFloat(e.target.value))} 
//           />
//         </label>
//         <label>
//           FOV: 
//           <input 
//             type="range" 
//             min="1" 
//             max="100" 
//             step="10" 
//             value={fov} 
//             onChange={(e) => setFov(parseInt(e.target.value))} 
//           />
//         </label>
//         <label>
//           Point Cloud Index: 
//           <input 
//             type="range" 
//             min="0" 
//             max={pointClouds.length - 1} 
//             step="1" 
//             value={currentIndex} 
//             onChange={(e) => setCurrentIndex(parseInt(e.target.value))} 
//             disabled={pointClouds.length === 0}  // Disable if no point clouds are loaded
//           />
//         </label>
//         <p>
//           {pointClouds.length > 0 
//             \? `Displaying Point Cloud: ${currentIndex + 1} / ${pointClouds.length}`
//             : 'No point clouds loaded'}
//         </p>
//       </div>
      
//       <Canvas style={{ height: '100vh' }} camera={{ fov: fov, position: [0, 0, -1], near: 0.00000001, far: 10 }}>
//         <ambientLight />
//         <pointLight position={[10, 10, 10]} />
//         <OrbitControls />
        
//         {pointClouds.length > 0 && pointClouds[currentIndex] && (
//           <PointCloud points={pointClouds[currentIndex]} pointSize={pointSize} />
//         )}
//       </Canvas>
//     </>
//   );
// }

// export default App;

// PERFECTLY RENDERS PC GOT FROM SERVER
// import React, { useEffect, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';
// import { io } from 'socket.io-client';

// const PointCloud = ({ points, pointSize }) => {
//   const geometry = new THREE.BufferGeometry();

//   // Extract positions and colors from points data
//   const positions = points.flatMap(p => [p.x, p.y, p.z]);
//   const colors = points.flatMap(p => p.color ? [p.color.r / 255, p.color.g / 255, p.color.b / 255] : [1, 1, 1]);

//   // Create buffer attributes
//   geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
//   geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

//   return (
//     <points rotation={[0, 0, Math.PI]}>
//       <bufferGeometry attach="geometry" {...geometry} />
//       <pointsMaterial attach="material" vertexColors size={pointSize} />
//     </points>
//   );
// };

// function App() {
//   const [pointCloudData, setPointCloudData] = useState([]);  // Array to hold the full point cloud data
//   const [currentIndex, setCurrentIndex] = useState(0);  // Index of the currently selected point cloud
//   const [pointSize, setPointSize] = useState(0.0005);
//   const [fov, setFov] = useState(25);

//   useEffect(() => {
//     const socket = io('http://localhost:5001', { transports: ['websocket'] });  // Connect to the Flask server

//     // Request the first point cloud chunk
//     socket.emit('get_point_cloud', { index: 0, chunk_index: 0 });

//     // Listen for point cloud chunks
//     socket.on('point_cloud_chunk', (data) => {
//       setPointCloudData((prevData) => [...prevData, ...data.chunk]);  // Append chunk to the array

//       // If there are more chunks, request the next one
//       if (data.chunk_index < data.total_chunks - 1) {
//         socket.emit('get_point_cloud', { index: 0, chunk_index: data.chunk_index + 1 });
//       }
//     });

//     // Handle errors
//     socket.on('error', (error) => {
//       console.error('Error:', error.message);
//     });

//     return () => {
//       socket.disconnect();  // Cleanup on component unmount
//     };
//   }, []);

//   return (
//     <>
//       <div style={{ position: 'absolute', zIndex: 1 }}>
//         <label>
//           Point Size: 
//           <input 
//             type="range" 
//             min="0.0001" 
//             max="0.009" 
//             step="0.00001" 
//             value={pointSize} 
//             onChange={(e) => setPointSize(parseFloat(e.target.value))} 
//           />
//         </label>
//         <label>
//           FOV: 
//           <input 
//             type="range" 
//             min="1" 
//             max="100" 
//             step="10" 
//             value={fov} 
//             onChange={(e) => setFov(parseInt(e.target.value))} 
//           />
//         </label>
//         <p>{pointCloudData.length > 0 ? `Total points: ${pointCloudData.length}` : 'No point cloud data'}</p>
//       </div>

//       <Canvas style={{ height: '100vh' }} camera={{ fov: fov, position: [0, 0, -1], near: 0.00000001, far: 10 }}>
//         <ambientLight />
//         <pointLight position={[10, 10, 10]} />
//         <OrbitControls />
//         {/* Render the point cloud once data is loaded */}
//         {pointCloudData.length > 0 && (
//           <PointCloud points={pointCloudData} pointSize={pointSize} />
//         )}
//       </Canvas>
//     </>
//   );
// }

// export default App;


//////////////////////////////////////////////////


// // src/PointCloud.js
// import React, { useEffect } from 'react';
// import * as THREE from 'three';
// import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const PointCloud = ({ filePath }) => {
//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0xeeeeee); // Set background color
//     document.body.appendChild(renderer.domElement);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);

//     const axesHelper = new THREE.AxesHelper(5);
//     scene.add(axesHelper); // Add axes helper

//     const loader = new PLYLoader();
//     loader.load(filePath, (geometry) => {
//       console.log('Loaded geometry:', geometry);
//       const material = new THREE.PointsMaterial({ size: 0.01, vertexColors: true });
//       const points = new THREE.Points(geometry, material);
//       scene.add(points);
//     });

//     camera.position.set(0, 0, 10); // Adjust camera position
//     camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the center

//     // Add OrbitControls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
//     controls.dampingFactor = 0.25;
//     controls.screenSpacePanning = false;

//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update(); // Update controls
//       renderer.render(scene, camera);
//     };
//     animate();

//     return () => {
//       controls.dispose(); // Clean up controls
//       renderer.dispose();
//       document.body.removeChild(renderer.domElement);
//     };
//   }, [filePath]);

//   return null;
// };

// export default PointCloud;


// src/PointCloud.js
// import React, { useEffect } from 'react';
// import * as THREE from 'three';
// import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const PointCloud = ({ filePath }) => {
//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0xeeeeee); // Set background color
//     document.body.appendChild(renderer.domElement);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);

//     const axesHelper = new THREE.AxesHelper(5);
//     scene.add(axesHelper); // Add axes helper

//     const loader = new PLYLoader();
//     // loader.load(filePath, (geometry) => {
//     //   console.log('Loaded geometry:', geometry);
//     //   geometry.center(); // Center the geometry at the origin
//     //   const material = new THREE.PointsMaterial({ size: 2, vertexColors: true });
//     //   const points = new THREE.Points(geometry, material);
//     //   scene.add(points);
//     // });
//     loader.load(filePath, (geometry) => {
//         console.log('Loaded geometry:', geometry);
//         console.log('Vertices count:', geometry.attributes.position.count); // Log the number of vertices
      
//         geometry.center(); // Center the geometry at the origin
//         const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });
//         const points = new THREE.Points(geometry, material);
//         scene.add(points);
      
//         console.log('Bounding box after centering:', geometry.boundingBox); // Log bounding box after centering
//       });
      
      

//     camera.position.set(0, 0, 10); // Adjust camera position
//     camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the center

//     // Add OrbitControls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
//     controls.dampingFactor = 0.25;
//     controls.screenSpacePanning = false;

//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update(); // Update controls
//       renderer.render(scene, camera);
//     };
//     animate();

//     return () => {
//       controls.dispose(); // Clean up controls
//       renderer.dispose();
//       document.body.removeChild(renderer.domElement);
//     };
//   }, [filePath]);

//   return null;
// };

// export default PointCloud;


// import React, { useEffect } from 'react';
// import * as THREE from 'three';
// import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const PointCloud = ({ filePath }) => {
//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });

//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setClearColor(0xeeeeee); // Set background color
//     document.body.appendChild(renderer.domElement);

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);

//     const axesHelper = new THREE.AxesHelper(5);
//     scene.add(axesHelper); // Add axes helper

//     const loader = new PLYLoader();
//     loader.load(filePath, (geometry) => {
//       console.log('Loaded geometry:', geometry);
//       console.log('Vertices count:', geometry.attributes.position.count); // Log vertex count
//       const material = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff }); // Use solid color for visibility
//       const points = new THREE.Points(geometry, material);
//       scene.add(points);
      
//       geometry.computeBoundingBox(); // Compute the bounding box
//       console.log('Bounding box:', geometry.boundingBox); // Log bounding box
//     });

//     camera.position.set(0, 0, 20); // Move camera further back
//     camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the center

//     // Add OrbitControls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.25;
//     controls.screenSpacePanning = false;

//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     return () => {
//       controls.dispose();
//       renderer.dispose();
//       document.body.removeChild(renderer.domElement);
//     };
//   }, [filePath]);

//   return null;
// };

// export default PointCloud;




///////////////////////////////////////////////////////

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import './App.css';

// // Register all necessary components
// Chart.register(...registerables);

// const Graph = () => {
//     const [progress, setProgress] = useState([]);
//     const [labels, setLabels] = useState([]);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             axios.get('http://127.0.0.1:5000/progress')
//                 .then(response => {
//                     const currentProgress = response.data.progress.split('\n').map(Number);
//                     setProgress(currentProgress);
//                     setLabels(currentProgress.map((_, index) => index + 1));
//                 })
//                 .catch(error => {
//                     console.error("Error fetching progress:", error);
//                 });
//         }, 1000);

//         return () => clearInterval(interval);
//     }, []);

//     const runScript = () => {
//         axios.get('http://127.0.0.1:5000/run-script')
//             .then(response => {
//                 console.log(response.data);
//             })
//             .catch(error => {
//                 console.error("Error running script:", error);
//             });
//     };

//     const data = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'Progress',
//                 data: progress,
//                 fill: false,
//                 backgroundColor: 'rgba(75,192,192,0.4)',
//                 borderColor: 'rgba(75,192,192,1)',
//             },
//         ],
//     };

//     return (
//       <div>
//           <h1>3D FLIM VISUALIZATION</h1>
//           <button className="button" onClick={runScript}>Run Script</button>
//           <div className="container">
//               <pre className="pre">{progress.join('\n')}</pre>
//               <div className="chart-container">
//                   <Line data={data} />
//               </div>
//           </div>
//       </div>
//   );
  
// };

// export default Graph;