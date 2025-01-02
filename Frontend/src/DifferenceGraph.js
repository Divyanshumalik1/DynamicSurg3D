import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register the necessary components
Chart.register(...registerables);

const DiffGraph = () => {
  const [data, setData] = useState([]);

  // Function to fetch data from the API
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
      fetchData(); // Poll for updates every 3 seconds
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Function to calculate differences between consecutive data points
  const calculateDifferences = (metricData) => {
    return metricData.map((value, index) => {
      if (index === 0) return 0; // No previous value for the first entry
      return value - metricData[index - 1]; // Difference from the previous value
    });
  };

  // Extract and calculate differences for the graphs
  const ssimData = data.map(entry => entry.ours_3000?.SSIM || 0);
  const psnrData = data.map(entry => entry.ours_3000?.PSNR || 0);
  const lpipsData = data.map(entry => entry.ours_3000?.LPIPS || 0);

  const ssimDifferences = calculateDifferences(ssimData);
  const psnrDifferences = calculateDifferences(psnrData);
  const lpipsDifferences = calculateDifferences(lpipsData);

  const labels = data.map((_, index) => index + 1); // Example labels: 1, 2, 3, ...

  // Function to get background colors based on value
  const getBackgroundColor = (dataArray) => {
    return dataArray.map(value => (value >= 0 ? 'rgba(0, 0, 255, 1)' : 'rgba(255, 0, 0, 1)')); // Green for positive, red for negative
  };

   // Chart options
   const options = (chartTitle) => ({
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: chartTitle,
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            borderColor: 'black',
            borderWidth: 5,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMin: -1,
        suggestedMax: 1,
      },
    },
  });

  return (
    <div style={{ width: '100%', height: '200px', overflow: 'hidden', marginTop: '10px'}}>
      <div>
        {/* <Bar
          data={{
            labels, // Add labels here
            datasets: [{
              label: 'SSIM Difference',
              data: ssimDifferences,
              backgroundColor: getBackgroundColor(ssimDifferences), // Set color based on value
            }],
          }}
          options={options('SSIM Difference')} // Add the chart title here
        />
      </div>

      <div> */}
        <Bar
          data={{
            labels, // Add labels here
            datasets: [{
              label: 'Monitoring Unit',
              data: psnrDifferences,
              backgroundColor: getBackgroundColor(psnrDifferences), // Set color based on value
            }],
          }}
          options={options('MONITORING UNIT')} // Add the chart title here
        />
      </div>

      {/* <div>
        <Bar
          data={{
            labels, // Add labels here
            datasets: [{
              label: 'LPIPS Difference',
              data: lpipsDifferences,
              backgroundColor: getBackgroundColor(lpipsDifferences), // Set color based on value
            }],
          }}
          options={options('LPIPS Difference')} // Add the chart title here
        />
      </div> */}
    </div>
  );
};

export default DiffGraph;
