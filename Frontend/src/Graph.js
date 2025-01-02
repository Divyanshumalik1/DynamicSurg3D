// // Graph.js
// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import { io } from 'socket.io-client';
// import './App.css';

// // Register all necessary components
// Chart.register(...registerables);

// const Graph = () => {
//     const [ssimData, setSsimData] = useState([]);
//     const [psnrData, setPsnrData] = useState([]);
//     const [lpipsData, setLpipsData] = useState([]);
//     const [labels, setLabels] = useState([]);
//     const socket = io('http://127.0.0.1:5001/'); // Change to your server address if necessary

//     useEffect(() => {
//         // Listen for image evaluation results from the server
//         socket.on('image_evaluation_result', (data) => {
//             setSsimData((prevData) => [...prevData, data.SSIM]);
//             setPsnrData((prevData) => [...prevData, data.PSNR]);
//             setLpipsData((prevData) => [...prevData, data.LPIPS]);
//             setLabels((prevLabels) => [...prevLabels, data.image_name]); // assuming image_name is unique
//         });

//         // Clean up the socket connection when the component unmounts
//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     const ssimChartData = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'SSIM',
//                 data: ssimData,
//                 fill: false,
//                 backgroundColor: 'rgba(75, 192, 192, 0.4)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//             },
//         ],
//     };

//     const psnrChartData = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'PSNR',
//                 data: psnrData,
//                 fill: false,
//                 backgroundColor: 'rgba(255, 99, 132, 0.4)',
//                 borderColor: 'rgba(255, 99, 132, 1)',
//             },
//         ],
//     };

//     const lpipsChartData = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'LPIPS',
//                 data: lpipsData,
//                 fill: false,
//                 backgroundColor: 'rgba(153, 102, 255, 0.4)',
//                 borderColor: 'rgba(153, 102, 255, 1)',
//             },
//         ],
//     };

//     return (
//         <div>
//             <h1>Image Evaluation Metrics</h1>
//             <div className="chart-container">
//                 <h2>SSIM</h2>
//                 <Line data={ssimChartData} />
//             </div>
//             <div className="chart-container">
//                 <h2>PSNR</h2>
//                 <Line data={psnrChartData} />
//             </div>
//             <div className="chart-container">
//                 <h2>LPIPS</h2>
//                 <Line data={lpipsChartData} />
//             </div>
//         </div>
//     );
// };

// export default Graph;


// // Graph.js
// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import { io } from 'socket.io-client';
// import './App.css';

// // Register all necessary components
// Chart.register(...registerables);

// const Graph = () => {
//     const [ssimData, setSsimData] = useState([]);
//     const [psnrData, setPsnrData] = useState([]);
//     const [lpipsData, setLpipsData] = useState([]);
//     const [labels, setLabels] = useState([]);
//     const socket = io('http://127.0.0.1:5001/'); // Change to your server address if necessary

//     useEffect(() => {
//         // Listen for image evaluation results from the server
//         socket.on('image_evaluation_result', (data) => {
//             setSsimData((prevData) => [...prevData, data.SSIM]);
//             setPsnrData((prevData) => [...prevData, data.PSNR]);
//             setLpipsData((prevData) => [...prevData, data.LPIPS]);
//             setLabels((prevLabels) => [...prevLabels, data.image_name]); // assuming image_name is unique
//         });

//         // Clean up the socket connection when the component unmounts
//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     const ssimChartData = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'SSIM',
//                 data: ssimData,
//                 fill: false,
//                 backgroundColor: 'rgba(75, 192, 192, 0.4)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//             },
//             {
//                 label: 'SSIM Data Points',
//                 data: ssimData.map((value, index) => ({ x: index, y: value })), // Map to { x, y } format
//                 fill: false,
//                 backgroundColor: 'rgba(75, 192, 192, 1)',
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 pointRadius: 5, // Adjust the size of the points
//                 showLine: false, // Disable line connecting the points
//             },
//         ],
//     };

//     const psnrChartData = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'PSNR',
//                 data: psnrData,
//                 fill: false,
//                 backgroundColor: 'rgba(255, 99, 132, 0.4)',
//                 borderColor: 'rgba(255, 99, 132, 1)',
//             },
//             {
//                 label: 'PSNR Data Points',
//                 data: psnrData.map((value, index) => ({ x: index, y: value })), // Map to { x, y } format
//                 fill: false,
//                 backgroundColor: 'rgba(255, 99, 132, 1)',
//                 borderColor: 'rgba(255, 99, 132, 1)',
//                 pointRadius: 5, // Adjust the size of the points
//                 showLine: false, // Disable line connecting the points
//             },
//         ],
//     };

//     const lpipsChartData = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'LPIPS',
//                 data: lpipsData,
//                 fill: false,
//                 backgroundColor: 'rgba(153, 102, 255, 0.4)',
//                 borderColor: 'rgba(153, 102, 255, 1)',
//             },
//             {
//                 label: 'LPIPS Data Points',
//                 data: lpipsData.map((value, index) => ({ x: index, y: value })), // Map to { x, y } format
//                 fill: false,
//                 backgroundColor: 'rgba(153, 102, 255, 1)',
//                 borderColor: 'rgba(153, 102, 255, 1)',
//                 pointRadius: 5, // Adjust the size of the points
//                 showLine: false, // Disable line connecting the points
//             },
//         ],
//     };

//     return (
//         <div>
//             <h1>Image Evaluation Metrics</h1>
//             <div className="chart-container">
//                 <h2>SSIM</h2>
//                 <Line data={ssimChartData} />
//             </div>
//             <div className="chart-container">
//                 <h2>PSNR</h2>
//                 <Line data={psnrChartData} />
//             </div>
//             <div className="chart-container">
//                 <h2>LPIPS</h2>
//                 <Line data={lpipsChartData} />
//             </div>
//         </div>
//     );
// };

// export default Graph;

// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import 'chartjs-plugin-zoom'; // Import the zoom plugin
// import { io } from 'socket.io-client';
// import './App.css';

// // Register all necessary components for Chart.js
// Chart.register(...registerables);

// const Graph = () => {
//     const [ssimData, setSsimData] = useState([]);
//     const [psnrData, setPsnrData] = useState([]);
//     const [lpipsData, setLpipsData] = useState([]);
//     const [labels, setLabels] = useState([]);
//     const socket = io('http://127.0.0.1:5001/'); // Change to your server address if necessary
    
    
//     useEffect(() => {
//         // Listen for metrics updates from the server
//         socket.on('json_data', (data) => {
//             const ssimValues = Object.values(data.ours_3000.SSIM);
//             const psnrValues = Object.values(data.ours_3000.PSNR);
//             const lpipsValues = Object.values(data.ours_3000.LPIPS);
//             const newLabels = Object.keys(data.ours_3000.SSIM); // Using image file names as labels

//             // Update the state with new data
//             setSsimData(ssimValues);
//             setPsnrData(psnrValues);
//             setLpipsData(lpipsValues);
//             setLabels(newLabels);
//         });

//         // Clean up the socket connection when the component unmounts
//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     const createChartData = (label, data, color) => ({
//         labels,
//         datasets: [
//             {
//                 label: label,
//                 data: data,
//                 fill: false,
//                 backgroundColor: color,
//                 borderColor: color,
//                 tension: 0.2,
//             },
//             {
//                 label: `${label} Data Points`,
//                 data: data.map((value, index) => ({ x: index, y: value })), // Map to { x, y } format
//                 fill: false,
//                 backgroundColor: color,
//                 borderColor: color,
//                 pointRadius: 5, // Adjust the size of the points
//                 showLine: false, // Disable line connecting the points
//             },
//         ],
//     });

//     const options = {
//         responsive: true,
//         scales: {
//             x: {
//                 type: 'category', // Use category scale for labels
//                 title: {
//                     display: true,
//                     text: 'Image Files',
//                 },
//                 ticks: {
//                     autoSkip: true,
//                     maxTicksLimit: 20, // Adjust the number of visible labels
//                 },
//             },
//             y: {
//                 title: {
//                     display: true,
//                     text: 'Values',
//                 },
//             },
//         },
//         plugins: {
//             zoom: {
//                 pan: {
//                     enabled: true,
//                     mode: 'x', // Enable horizontal panning
//                 },
//                 zoom: {
//                     enabled: true,
//                     mode: 'x', // Enable horizontal zooming
//                 },
//             },
//         },
//     };

//     return (
//         <div>
//             <h1>Image Evaluation Metrics</h1>
//             <div className="chart-container">
//                 <h2>SSIM</h2>
//                 <Line data={createChartData('SSIM', ssimData, 'rgba(75, 192, 192, 1)')} options={options} />
//             </div>
//             <div className="chart-container">
//                 <h2>PSNR</h2>
//                 <Line data={createChartData('PSNR', psnrData, 'rgba(255, 99, 132, 1)')} options={options} />
//             </div>
//             <div className="chart-container">
//                 <h2>LPIPS</h2>
//                 <Line data={createChartData('LPIPS', lpipsData, 'rgba(153, 102, 255, 1)')} options={options} />
//             </div>
//         </div>
//     );
// };

// export default Graph;


// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import 'chartjs-plugin-zoom'; // Import the zoom plugin
// import { io } from 'socket.io-client';
// import './App.css';

// // Register all necessary components for Chart.js
// Chart.register(...registerables);

// const Graph = () => {
//     const [ssimData, setSsimData] = useState([]);
//     const [psnrData, setPsnrData] = useState([]);
//     const [lpipsData, setLpipsData] = useState([]);
//     const [labels, setLabels] = useState([]);
//     const socket = io('http://127.0.0.1:5002/'); // Change to your server address if necessary

//     useEffect(() => {
//         // Listen for metrics updates from the server
//         socket.on('json_data', (data) => {
//             const ssimValues = Object.values(data.ours_3000.SSIM);
//             const psnrValues = Object.values(data.ours_3000.PSNR);
//             const lpipsValues = Object.values(data.ours_3000.LPIPS);
//             const newLabels = Object.keys(data.ours_3000.SSIM); // Using image file names as labels

//             // Update the state with new data
//             setSsimData(ssimValues);
//             setPsnrData(psnrValues);
//             setLpipsData(lpipsValues);
//             setLabels(newLabels);
//         });

//         // Clean up the socket connection when the component unmounts
//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     const createChartData = (label, data, color) => ({
//         labels,
//         datasets: [
//             {
//                 label: label,
//                 data: data,
//                 fill: false,
//                 backgroundColor: color,
//                 borderColor: color,
//                 tension: 0.2,
//             },
//             {
//                 label: `${label} Data Points`,
//                 data: data.map((value, index) => ({ x: index, y: value })), // Map to { x, y } format
//                 fill: false,
//                 backgroundColor: color,
//                 borderColor: color,
//                 pointRadius: 5, // Adjust the size of the points
//                 showLine: false, // Disable line connecting the points
//             },
//         ],
//     });

//     const options = {
//         responsive: true,
//         scales: {
//             x: {
//                 type: 'category', // Use category scale for labels
//                 title: {
//                     display: true,
//                     text: 'Batches',
//                 },
//                 ticks: {
//                     autoSkip: true,
//                     maxTicksLimit: 20, // Adjust the number of visible labels
//                 },
//             },
//             y: {
//                 title: {
//                     display: true,
//                     text: 'Values',
//                 },
//             },
//         },
//         plugins: {
//             zoom: {
//                 pan: {
//                     enabled: true,
//                     mode: 'x', // Enable horizontal panning
//                 },
//                 zoom: {
//                     enabled: true,
//                     mode: 'x', // Enable horizontal zooming
//                 },
//             },
//         },
//     };

//     return (
//         <div>
//             <h1>Image Evaluation Metrics</h1>
//             <div className="chart-container">
//                 <h2>SSIM</h2>
//                 <Line data={createChartData('SSIM', ssimData, 'rgba(75, 192, 192, 1)')} options={options} />
//             </div>
//             <div className="chart-container">
//                 <h2>PSNR</h2>
//                 <Line data={createChartData('PSNR', psnrData, 'rgba(255, 99, 132, 1)')} options={options} />
//             </div>
//             <div className="chart-container">
//                 <h2>LPIPS</h2>
//                 <Line data={createChartData('LPIPS', lpipsData, 'rgba(153, 102, 255, 1)')} options={options} />
//             </div>
//         </div>
//     );
// };

// export default Graph;

// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import 'chartjs-plugin-zoom'; // Import the zoom plugin
// import { io } from 'socket.io-client';
// import './App.css';

// // Register all necessary components for Chart.js
// Chart.register(...registerables);

// const Graph = () => {
//     const [ssimData, setSsimData] = useState([]);
//     const [psnrData, setPsnrData] = useState([]);
//     const [lpipsData, setLpipsData] = useState([]);
//     const [labels, setLabels] = useState([]);
//     const socket = io('http://127.0.0.1:5001/'); // Ensure this matches your Flask server

//     useEffect(() => {
//         // Listen for metrics updates from the server
//         socket.on('json_data', (data) => {
//             // Use the new file format
//             const ssimValues = [data.ours_1000.SSIM];
//             const psnrValues = [data.ours_1000.PSNR];
//             const lpipsValues = [data.ours_1000.LPIPS];
//             const newLabels = ['Latest Data']; // Can be adjusted to show timestamps or unique identifiers

//             // Update the state with new data
//             setSsimData(prevData => [...prevData, ...ssimValues]);
//             setPsnrData(prevData => [...prevData, ...psnrValues]);
//             setLpipsData(prevData => [...prevData, ...lpipsValues]);
//             setLabels(prevLabels => [...prevLabels, ...newLabels]);
//         });

//         // Clean up the socket connection when the component unmounts
//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     const createChartData = (label, data, color) => ({
//         labels,
//         datasets: [
//             {
//                 label: label,
//                 data: data,
//                 fill: false,
//                 backgroundColor: color,
//                 borderColor: color,
//                 tension: 0.2,
//             },
//             {
//                 label: `${label} Data Points hello`,
//                 data: data.map((value, index) => ({ x: index, y: value })), // Map to { x, y } format
//                 fill: false,
//                 backgroundColor: color,
//                 borderColor: color,
//                 pointRadius: 5, // Adjust the size of the points
//                 showLine: false, // Disable line connecting the points
//             },
//         ],
//     });

//     const options = {
//         responsive: true,
//         scales: {
//             x: {
//                 type: 'category', // Use category scale for labels
//                 title: {
//                     display: true,
//                     text: 'Batches',
//                 },
//                 ticks: {
//                     autoSkip: true,
//                     maxTicksLimit: 20, // Adjust the number of visible labels
//                 },
//             },
//             y: {
//                 title: {
//                     display: true,
//                     text: 'Values',
//                 },
//             },
//         },
//         plugins: {
//             zoom: {
//                 pan: {
//                     enabled: true,
//                     mode: 'x', // Enable horizontal panning
//                 },
//                 zoom: {
//                     enabled: true,
//                     mode: 'x', // Enable horizontal zooming
//                 },
//             },
//         },
//     };

//     return (
//         <div>
//             <h1>Image Evaluation Metrics</h1>
//             <div className="chart-container">
//                 <h2>SSIM</h2>
//                 <Line data={createChartData('SSIM', ssimData, 'rgba(75, 192, 192, 1)')} options={options} />
//             </div>
//             <div className="chart-container">
//                 <h2>PSNR</h2>
//                 <Line data={createChartData('PSNR', psnrData, 'rgba(255, 99, 132, 1)')} options={options} />
//             </div>
//             <div className="chart-container">
//                 <h2>LPIPS</h2>
//                 <Line data={createChartData('LPIPS', lpipsData, 'rgba(153, 102, 255, 1)')} options={options} />
//             </div>
//         </div>
//     );
// };

// export default Graph;



// src/App.js

// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
// import io from 'socket.io-client';

// // Initialize Chart.js
// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

// const socket = io('http://127.0.0.1:5000'); // Connect to the Flask WebSocket server

// const Graph = () => {
//     const [data, setData] = useState({
//         ssim: [],
//         psnr: [],
//         lpips: [],
//     });

//     const [labels, setLabels] = useState([]);

//     useEffect(() => {
//         socket.on('new_data', (newData) => {
//             const key = Object.keys(newData)[0]; // Assuming one object in the JSON
//             const metrics = newData[key];

//             setData(prevData => ({
//                 ssim: [...prevData.ssim, metrics.SSIM],
//                 psnr: [...prevData.psnr, metrics.PSNR],
//                 lpips: [...prevData.lpips, metrics.LPIPS],
//             }));

//             setLabels(prevLabels => [...prevLabels, new Date().toLocaleTimeString()]);
//         });

//         return () => {
//             socket.disconnect();
//         };
//     }, []);

//     const chartDataSSIM = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'SSIM',
//                 data: data.ssim,
//                 borderColor: 'rgba(75, 192, 192, 1)',
//                 fill: false,
//             },
//         ],
//     };

//     const chartDataPSNR = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'PSNR',
//                 data: data.psnr,
//                 borderColor: 'rgba(255, 99, 132, 1)',
//                 fill: false,
//             },
//         ],
//     };

//     const chartDataLPIPS = {
//         labels: labels,
//         datasets: [
//             {
//                 label: 'LPIPS',
//                 data: data.lpips,
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 fill: false,
//             },
//         ],
//     };

//     return (
//         <div>
//             <h1>Real-time Data from Flask</h1>
//             <div style={{ width: '600px', height: '400px' }}>
//                 <Line data={chartDataSSIM} />
//             </div>
//             <div style={{ width: '600px', height: '400px' }}>
//                 <Line data={chartDataPSNR} />
//             </div>
//             <div style={{ width: '600px', height: '400px' }}>
//                 <Line data={chartDataLPIPS} />
//             </div>
//         </div>
//     );
// };

// export default Graph;


// src/components/ChartComponent.js


//// shows only public folder predefined json files
// import React, { useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   CategoryScale // Import CategoryScale
// } from 'chart.js';

// // Register all necessary components including CategoryScale
// ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend, CategoryScale);

// const ChartComponent = () => {
//   const [data, setData] = useState({
//     ssim: [],
//     psnr: [],
//     lpips: [],
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       const jsonFiles = [
//         // Add the names of your JSON files here
//         'results_20241009_135220.json',
//         'results_20241009_135220.json',
//         'results_20241009_135220.json',
//         'results_20241009_135220.json',
//         'results.json'
//         // Add more files as needed
//       ];

//       const newData = { ssim: [], psnr: [], lpips: [] };

//       for (const file of jsonFiles) {
//         const response = await fetch(`/${file}`);
//         const json = await response.json();
//         const key = Object.keys(json)[0];
//         newData.ssim.push(json[key].SSIM);
//         newData.psnr.push(json[key].PSNR);
//         newData.lpips.push(json[key].LPIPS);
//       }

//       setData(newData);
//     };

//     fetchData();
//   }, []);

//   const chartData = {
//     labels: data.ssim.map((_, index) => `File ${index + 1}`),
//     datasets: [
//       {
//         label: 'SSIM',
//         data: data.ssim,
//         borderColor: 'rgba(75, 192, 192, 1)',
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//       },
//       {
//         label: 'PSNR',
//         data: data.psnr,
//         borderColor: 'rgba(153, 102, 255, 1)',
//         backgroundColor: 'rgba(153, 102, 255, 0.2)',
//       },
//       {
//         label: 'LPIPS',
//         data: data.lpips,
//         borderColor: 'rgba(255, 99, 132, 1)',
//         backgroundColor: 'rgba(255, 99, 132, 0.2)',
//       },
//     ],
//   };

//   return (
//     <div>
//       <h2>Metrics Chart</h2>
//       <Line data={chartData} />
//     </div>
//   );
// };

// export default ChartComponent;



// src/WebSocketComponent.js
// import React, { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// const socket = io('http://127.0.0.1:5000'); // Connect to the Flask server

// const Graph = () => {
//     const [data, setData] = useState([]);

//     useEffect(() => {
//         // Handle incoming JSON data from the server
//         socket.on('json_data', (data) => {
//             console.log("Received data:", data); // Log incoming data
//             setData(data); // Update state with received data
//         });

//         // Clean up the socket listener on component unmount
//         return () => {
//             socket.off('json_data');
//         };
//     }, []);

//     return (
//         <div>
//             <h1>WebSocket JSON Data</h1>
//             {data.length > 0 ? (
//                 // Map through the data to display each JSON entry
//                 data.map((item, index) => (
//                     <div key={index}>
//                         <h2>Data Item {index + 1}</h2>
//                         <pre>{JSON.stringify(item, null, 2)}</pre> {/* Prettify JSON */}
//                     </div>
//                 ))
//             ) : (
//                 <p>No data received yet.</p> // Message for no data
//             )}
//         </div>
//     );
// };

// export default Graph;


import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, Legend, LinearScale, registerables } from 'chart.js';
import DiffGraph from './DifferenceGraph'

// Register the scales and any necessary components
Chart.register(...registerables);

const Graph = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/data', { timeout: 5000 }); // 5 seconds timeout
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  useEffect(() => {
    fetchData(); // Initial fetch

    const interval = setInterval(() => {
      fetchData(); // Poll for updates every 5 seconds
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Extract data for the graphs
  const ssimData = data.map(entry => entry.ours_3000?.SSIM || 0);
  const psnrData = data.map(entry => entry.ours_3000?.PSNR || 0);
  const lpipsData = data.map(entry => entry.ours_3000?.LPIPS || 0);
  const labels = data.map((_, index) => index + 1); // Example labels: 1, 2, 3, ...

  // Chart options
  const options = (chartTitle) => ({
    plugins: {
      legend: {
        display: false, // Hides the legend
      },
      title: {
        display: true, // Displays a title above the chart
        text: chartTitle, // Dynamic title for each chart
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  });

  return (
    <div className="App">
        <h2>Model Performance</h2>
      <div>
        {/* <h2>SSIM </h2> */}
        <Line
          data={{
            labels, // Add labels here
            datasets: [{
              label: 'SSIM',
              data: ssimData,
              borderColor: 'rgba(75,192,192,1)',
              fill: false,
            }],
          }}
          options={options('SSIM')}
        />
      </div>

      <div>
        {/* <h2>PSNR </h2> */}
        <Line
          data={{
            labels, // Add labels here
            datasets: [{
              label: 'PSNR',
              data: psnrData,
              borderColor: 'rgba(153,102,255,1)',
              fill: false,
            }],
          }}
          options={options('PSNR')}
        />
      </div>

      <div >
        {/* <h2>LPIPS</h2> */}
        <Line
          data={{
            labels, // Add labels here
            datasets: [{
              label: 'LPIPS',
              data: lpipsData,
              borderColor: 'rgba(255,99,132,1)',
              fill: false,
            }],
          }}
          options={options('LPIPS')}
        />
      </div>
      
      <DiffGraph/>

    </div>
  );
};

export default Graph;
