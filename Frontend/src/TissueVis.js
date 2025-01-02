

// // works perfect 
// import React, { useEffect, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';
// import { io } from 'socket.io-client';
// import './Input.css'
// import DiffGraph from './DifferenceGraph';

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

// function TissueComponent() {
//   const [pointCloudData, setPointCloudData] = useState([]);  // Array to hold the full point cloud data
//   const [cachedData, setCachedData] = useState({}); // Cache for point cloud data
//   const [currentIndex, setCurrentIndex] = useState(0);  // Index of the currently selected point cloud
//   const [pointSize, setPointSize] = useState(0.0005);
//   const [fov, setFov] = useState(15);
//   const [totalFiles, setTotalFiles] = useState(1); // Number of available point cloud files

//   useEffect(() => {
//     const socket = io('http://127.0.0.1:5000', { transports: ['websocket'], reconnectionAttempts: 5,});  // Connect to the Flask server

//     // Request the available point cloud files on connection
//     socket.emit('get_available_files');

//     // Listen for available files
//     socket.on('available_files', (data) => {
//       setTotalFiles(data.files.length); // Update the total files count
//     });

//     // Fetch point cloud data for the current index
//     const fetchPointCloudData = (index) => {
//       // Check if data for the current index is already cached
//       if (cachedData[index]) {
//         setPointCloudData(cachedData[index]); // Use cached data
//       } else {
//         setPointCloudData([]); // Clear existing data for new fetch
//         socket.emit('get_point_cloud', { index: index, chunk_index: 0 });
//       }
//     };

//     // Listen for point cloud chunks
//     socket.on('point_cloud_chunk', (data) => {
//       setPointCloudData((prevData) => [...prevData, ...data.chunk]);  // Append chunk to the array

//       // Cache the data after fetching all chunks
//       if (data.chunk_index < data.total_chunks - 1) {
//         socket.emit('get_point_cloud', { index: currentIndex, chunk_index: data.chunk_index + 1 });
//       } else {
//         // Cache the complete data for this index
//         setCachedData((prevCache) => ({
//           ...prevCache,
//           [currentIndex]: [...pointCloudData, ...data.chunk], // Store full data
//         }));
//       }
//     });

//     // Handle errors
//     socket.on('error', (error) => {
//       console.error('Error:', error.message);
//     });

//     // Fetch data for the current index when the component mounts or when currentIndex changes
//     fetchPointCloudData(currentIndex);

//     return () => {
//       socket.disconnect();  // Cleanup on component unmount
//     };
//   }, [currentIndex]); // Fetch new data when currentIndex changes

//   // Handle the point cloud file index change
//   const handleIndexChange = (e) => {
//     const index = parseInt(e.target.value);
//     setCurrentIndex(index); // Update the current index

//     // Clear existing point cloud data when switching
//     setPointCloudData([]); // Clear previous point cloud data
//   };

//     return (
//       <div style={{ display: 'flex', height: '95vh', maxWidth: '80vw' }}>

//       <div style={{ 
//   width: '250px',
//   marginTop: '25px', 
//   padding: '10px', 
//   display: 'flex', 
//   flexDirection: 'column', 
//   justifyContent: 'flex-start',
//   gap: '20px' // Add spacing between input elements
// }}>
  
//   {/* Buttons in one line */}
//   <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
//       <button 
//         style={{ 
//           padding: '10px 20px', 
//           color: 'black', 
//           border: 'none', 
//           borderRadius: '5px', 
//           cursor: 'pointer' 
//         }}>
//         START
//       </button>
//       <button 
//         style={{ 
//           padding: '10px 20px',  
//           color: 'black', 
//           border: 'none', 
//           borderRadius: '5px', 
//           cursor: 'pointer' 
//         }}>
//         STOP
//       </button>
//     </div>
//     <p>Training In Progress...</p>
//   <label style={{ display: 'flex', flexDirection: 'column' }}>
//     Point Size: 
//     <input 
//       type="range" 
//       min="0.0001" 
//       max="0.009" 
//       step="0.00001" 
//       value={pointSize} 
//       onChange={(e) => setPointSize(parseFloat(e.target.value))} 
//       className="point-size-slider"
//     />
//   </label>
//   <label style={{ display: 'flex', flexDirection: 'column' }}>
//     FOV: 
//     <input 
//       type="range" 
//       min="1" 
//       max="100" 
//       step="10" 
//       value={fov} 
//       onChange={(e) => setFov(parseInt(e.target.value))}
//       className="fov-slider" 

//     />
//   </label>
//   <label style={{ display: 'flex', flexDirection: 'column' }}>
//     Current Video Frame :  
//     <input 
//       type="range" 
//       min="0" 
//       max={totalFiles - 1} 
//       step="1" 
//       value={currentIndex} 
//       onChange={handleIndexChange} 
//       className="select-frame-slider"

//     />
//   </label>
   
//   <img src="/00018.png" alt="Current Frame" style={{ width: '200px', height: '150px', marginTop: '10px' }} />
  
//   {/* <DiffGraph/> */}

//   {/* Keep this line to show total points */}
//   {/* <p>{pointCloudData.length > 0 ? `Total points: ${pointCloudData.length}` : 'No point cloud data'}</p> */}
// </div>

    
       

//     <Canvas style={{ flexGrow: 1, maxWidth: 'calc(80vw - 250px)', margin: '20px',  height: '100%'}} camera={{ fov: fov, position: [0, 0, -1], near: 0.0000000001, far: 10 }}>
//       <ambientLight />
//       <pointLight position={[10, 10, 10]} />
//       <OrbitControls />
//       {/* Render the point cloud once data is loaded */}
//       {pointCloudData.length > 0 && (
//         <PointCloud points={pointCloudData} pointSize={pointSize} />
//       )}
//     </Canvas>


//     </div>
//   );
        
//   }
  

// export default TissueComponent;


// import React, { useEffect, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';
// import { io } from 'socket.io-client';
// import './Input.css';
// //import DiffGraph from './DifferenceGraph';

// const PointCloud = ({ points, pointSize }) => {
//   const geometry = new THREE.BufferGeometry();
//   const positions = points.flatMap(p => [p.x, p.y, p.z]);
//   const colors = points.flatMap(p => p.color ? [p.color.r / 255, p.color.g / 255, p.color.b / 255] : [1, 1, 1]);
  
//   geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
//   geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  
//   return (
//     <points rotation={[0, 0, Math.PI]}>
//       <bufferGeometry attach="geometry" {...geometry} />
//       <pointsMaterial attach="material" vertexColors size={pointSize} />
//     </points>
//   );
// };

// function TissueComponent() {
//   const [pointCloudData, setPointCloudData] = useState([]);  // Array to hold the full point cloud data
//   const [cachedData, setCachedData] = useState({}); // Cache for point cloud data
//   const [currentIndex, setCurrentIndex] = useState(0);  // Index of the currently selected point cloud
//   const [pointSize, setPointSize] = useState(0.001);
//   const [fov, setFov] = useState(10);
//   const [totalFiles, setTotalFiles] = useState(1); // Number of available point cloud files
//   const [isTraining, setIsTraining] = useState(false);  // Add a state to track training status


//   useEffect(() => {
//     const socket = io('http://127.0.0.1:5000', { transports: ['websocket'], reconnectionAttempts: 5 });  // Connect to the Flask server

//     // Request the available point cloud files on connection
//     socket.emit('get_available_files');

//     // Listen for available files
//     socket.on('available_files', (data) => {
//       setTotalFiles(data.files.length); // Update the total files count
//     });

//     // Fetch point cloud data for the current index
//     const fetchPointCloudData = (index) => {
//       if (cachedData[index]) {
//         setPointCloudData(cachedData[index]); // Use cached data
//       } else {
//         setPointCloudData([]); // Clear existing data for new fetch
//         socket.emit('get_point_cloud', { index: index, chunk_index: 0 });
//       }
//     };

//     // Listen for point cloud chunks
//     socket.on('point_cloud_chunk', (data) => {
//       setPointCloudData((prevData) => [...prevData, ...data.chunk]);  // Append chunk to the array

//       // Cache the data after fetching all chunks
//       if (data.chunk_index < data.total_chunks - 1) {
//         socket.emit('get_point_cloud', { index: currentIndex, chunk_index: data.chunk_index + 1 });
//       } else {
//         setCachedData((prevCache) => ({
//           ...prevCache,
//           [currentIndex]: [...pointCloudData, ...data.chunk], // Store full data
//         }));
//       }
//     });

//     socket.on('error', (error) => {
//       console.error('Error:', error.message);
//     });

//     fetchPointCloudData(currentIndex);

//     return () => {
//       socket.disconnect();  // Cleanup on component unmount
//     };
//   }, [currentIndex]);

//   const handleIndexChange = (e) => {
//     const index = parseInt(e.target.value);
//     setCurrentIndex(index);  // Update the current index
//     setPointCloudData([]);  // Clear previous point cloud data
//   };

//   const getImageSrc = () => {
//     const paddedIndex = String(currentIndex).padStart(5, '0');  // Zero-pad the index to match image filename format
//     return `http://127.0.0.1:5000/frames/${paddedIndex}.png`;   // Make sure this matches the working link
//   };
  
//     // Handle the "START" button click to trigger the Flask script
//     const handleStartClick = async () => {
//       setIsTraining(true); // Set training to true when the process starts
//       try {
//         const response = await fetch('http://127.0.0.1:5001/start_training', { method: 'POST' });
//         if (!response.ok) {
//           throw new Error('Error starting the training');
//         }
//         console.log('Training started');
//       } catch (error) {
//         console.error('Error:', error.message);
//       }
//     };
  
//     // Handle the "STOP" button click to stop the training
//     const handleStopClick = async () => {
//       setIsTraining(false); // Set training to false when stopping the process
//       try {
//         const response = await fetch('http://127.0.0.1:5001/stop_training', { method: 'POST' });
//         if (!response.ok) {
//           throw new Error('Error stopping the training');
//         }
//         console.log('Training stopped');
//       } catch (error) {
//         console.error('Error:', error.message);
//       }
//     };

//   return (
//     <div style={{ display: 'flex', height: '95vh', maxWidth: '80vw' }}>
//     <div style={{ width: '250px', marginTop: '25px', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '20px' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
//         <button
//           onClick={handleStartClick}  // Trigger Flask script on "START"
//           style={{ padding: '10px 20px', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//         >
//           {isTraining ? 'TRAINING' : 'START'}
//         </button>
//         <button
//           onClick={handleStopClick}  // Stop the training
//           style={{ padding: '10px 20px', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
//         >
//           STOP
//         </button>
//       </div>

//       <p>{isTraining ? 'Training In Progress...' : 'Training Not Started'}</p>


//         <label style={{ display: 'flex', flexDirection: 'column' }}>
//           Point Size: 
//           <input 
//             type="range" 
//             min="0.0001" 
//             max="0.009" 
//             step="0.00001" 
//             value={pointSize} 
//             onChange={(e) => setPointSize(parseFloat(e.target.value))} 
//             className="point-size-slider"
//           />
//         </label>

//         <label style={{ display: 'flex', flexDirection: 'column' }}>
//           FOV Field of View: 
//           <input 
//             type="range" 
//             min="1" 
//             max="100" 
//             step="10" 
//             value={fov} 
//             onChange={(e) => setFov(parseInt(e.target.value))}
//             className="fov-slider" 
//           />
//         </label>

//         <label style={{ display: 'flex', flexDirection: 'column' }}>
//           Current Video Frame:  
//           <input 
//             type="range" 
//             min="0" 
//             max={totalFiles - 1} 
//             step="1" 
//             value={currentIndex} 
//             onChange={handleIndexChange} 
//             className="select-frame-slider"
//           />
//         </label>

//         {/* Display the current frame */}
//         <img src={getImageSrc()} alt="Current Frame" style={{ width: '200px', height: '150px', marginTop: '10px' }} />
//       </div>

//       <Canvas style={{ flexGrow: 1, maxWidth: 'calc(80vw - 250px)', margin: '20px', height: '100%' }} camera={{ fov: fov, position: [0, 0, -0.00001], near: 0.00000000000000000000000000001, far: 10000 }}>
//         <ambientLight />
//         <pointLight position={[0, 0, 0]} />

       
//         <OrbitControls
//          enableZoom={true}
//          minDistance={0.000002}  // No min distance, allows zooming infinitely
//          maxDistance={0.06}  // Infinite zoom out
//          zoomSpeed={10}  // Increase zoom speed for faster zoom
//          enablePan={true}
//          panSpeed={5}  // Adjust pan speed for better control
//          enableRotate={true}
//          rotateSpeed={1}
//          enableDamping={true}
//          dampingFactor={0.1}
//         />


//         {pointCloudData.length > 0 && (
//           <PointCloud points={pointCloudData} pointSize={pointSize} />
//         )}
//       </Canvas>
//     </div>
//   );
// }

// export default TissueComponent;



import React, { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { io } from 'socket.io-client';
import './Input.css';
import PointCloud from './PointCloudcomponent';




function CameraUpdater({ fov }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [fov, camera]);

  return null;
}

function TissueComponent() {
  const [pointCloudData, setPointCloudData] = useState([]);
  const [cachedData, setCachedData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pointSize, setPointSize] = useState(0.001);
  const [fov, setFov] = useState(10);
  const [totalFiles, setTotalFiles] = useState(1);
  const [isTraining, setIsTraining] = useState(false);

  // New state for pan, zoom, and rotate controls
  const [panSpeed, setPanSpeed] = useState(5);  // default value
  const [zoomSpeed, setZoomSpeed] = useState(10); // default value
  const [rotateSpeed, setRotateSpeed] = useState(1); // default value
  const [enablePan, setEnablePan] = useState(true);
  const [enableZoom, setEnableZoom] = useState(true);
  const [enableRotate, setEnableRotate] = useState(true);

  useEffect(() => {
    const socket = io('http://127.0.0.1:5000', { transports: ['websocket'], reconnectionAttempts: 5 });

    socket.emit('get_available_files');
    socket.on('available_files', (data) => {
      setTotalFiles(data.files.length);
    });

    const fetchPointCloudData = (index) => {
      if (cachedData[index]) {
        setPointCloudData(cachedData[index]);
      } else {
        setPointCloudData([]);
        socket.emit('get_point_cloud', { index: index, chunk_index: 0 });
      }
    };

    socket.on('point_cloud_chunk', (data) => {
      setPointCloudData((prevData) => [...prevData, ...data.chunk]);
      if (data.chunk_index < data.total_chunks - 1) {
        socket.emit('get_point_cloud', { index: currentIndex, chunk_index: data.chunk_index + 1 });
      } else {
        setCachedData((prevCache) => ({
          ...prevCache,
          [currentIndex]: [...pointCloudData, ...data.chunk],
        }));
      }
    });

    socket.on('error', (error) => {
      console.error('Error:', error.message);
    });

    fetchPointCloudData(currentIndex);

    return () => {
      socket.disconnect();
    };
  }, [currentIndex]);

  const handleIndexChange = (e) => {
    const index = parseInt(e.target.value);
    setCurrentIndex(index);
    setPointCloudData([]);
  };

  const getImageSrc = () => {
    const paddedIndex = String(currentIndex).padStart(5, '0');
    return `http://127.0.0.1:5000/frames/${paddedIndex}.png`;
  };

  const handleStartClick = async () => {
    setIsTraining(true);
    try {
      const response = await fetch('http://127.0.0.1:5001/start_training', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Error starting the training');
      }
      console.log('Training started');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleStopClick = async () => {
    setIsTraining(false);
    try {
      const response = await fetch('http://127.0.0.1:5001/stop_training', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Error stopping the training');
      }
      console.log('Training stopped');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div style={{ display: 'flex', height: '95vh', maxWidth: '80vw' }}>
      <div
        style={{
          width: '250px',
          marginTop: '25px',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
          <button
            onClick={handleStartClick}
            style={{
              padding: '10px 20px',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {isTraining ? 'TRAINING' : 'START'}
          </button>
          <button
            onClick={handleStopClick}
            style={{
              padding: '10px 20px',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            STOP
          </button>
        </div>

        <p>{isTraining ? 'Training In Progress...' : 'Training Not Started'}</p>

        <img src={getImageSrc()} alt="Current Frame" style={{ width: '200px', height: '150px', marginTop: '10px' }} />

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          Current Video Frame: {currentIndex}
          <input
            type="range"
            min="0"
            max={totalFiles - 1}
            step="1"
            value={currentIndex}
            onChange={handleIndexChange}
            className="select-frame-slider"
          />
        </label>

        

        {/* Previous Sliders */}
        <label>
          Point Size: {pointSize}
          <input
            type="range"
            min="0.0001"
            max="0.05"
            step="0.0001"
            value={pointSize}
            onChange={(e) => setPointSize(parseFloat(e.target.value))}
          />
        </label>

        <label>
          FOV: {fov}
          <input
            type="range"
            min="1"
            max="120"
            value={fov}
            onChange={(e) => setFov(parseInt(e.target.value))}
          />
        </label>

        {/* New Pan, Zoom, and Rotate Sliders */}
        <label>
          Pan Speed: {panSpeed}
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={panSpeed}
            onChange={(e) => setPanSpeed(parseInt(e.target.value))}
          />
        </label>

        <label>
          Zoom Speed: {zoomSpeed}
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={zoomSpeed}
            onChange={(e) => setZoomSpeed(parseInt(e.target.value))}
          />
        </label>

        <label>
          Rotate Speed: {rotateSpeed}
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={rotateSpeed}
            onChange={(e) => setRotateSpeed(parseFloat(e.target.value))}
          />
        </label>

        {/* Enable/Disable Controls */}
        <label>
          Enable Pan:
          <input type="checkbox" checked={enablePan} onChange={() => setEnablePan(!enablePan)} />
        </label>

        <label>
          Enable Zoom:
          <input type="checkbox" checked={enableZoom} onChange={() => setEnableZoom(!enableZoom)} />
        </label>

        <label>
          Enable Rotate:
          <input type="checkbox" checked={enableRotate} onChange={() => setEnableRotate(!enableRotate)} />
        </label>

        
      </div>

      <Canvas
        camera={{ fov: fov, near: 0.0001, far: 1000, position: [0, 0, -1] }}
        style={{ flexGrow: 1, maxWidth: 'calc(80vw - 250px)', margin: '20px', height: '100%' }}
      >
        <CameraUpdater fov={fov} />
        <ambientLight />
        <pointLight position={[0, 0, 0]} />

        <OrbitControls
          enableZoom={enableZoom}
          zoomSpeed={zoomSpeed}
          enablePan={enablePan}
          panSpeed={panSpeed}
          enableRotate={enableRotate}
          rotateSpeed={rotateSpeed}
          enableDamping={true}
          dampingFactor={0.1}
        />

        {pointCloudData.length > 0 && <PointCloud points={pointCloudData} pointSize={pointSize} />}
      </Canvas>
    </div>
  );
}

export default TissueComponent;
