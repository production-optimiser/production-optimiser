import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { authService } from '../services/auth';
import axiosInstance from '../utils/axios';
import { Button } from '@/Components/ui/button';
import { Download } from 'lucide-react';

const OptimizationResultsDashboard = () => {
  const [optimizationData, setOptimizationData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          throw new Error('No authenticated user found');
        }
        const response = await axiosInstance.get(`/results?userId=550e8400-e29b-41d4-a716-446655440002`);
        setOptimizationData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch optimization results');
      }
    };
  
    fetchData();
  }, []);

  const downloadChart = (chartType) => {
    // Get the chart SVG element
    const chartElement = document.querySelector(
      chartType === 'bar' ? '#machine-utilization-chart svg' : '#production-time-chart svg'
    );

    if (!chartElement) {
      console.error('Chart element not found');
      return;
    }

    // Deep clone the SVG element
    const svgCopy = chartElement.cloneNode(true);
    
    // Get the computed style of the original SVG
    const computedStyle = window.getComputedStyle(chartElement);
    
    // Set the white background and dimensions
    svgCopy.style.backgroundColor = 'white';
    svgCopy.setAttribute('width', computedStyle.width);
    svgCopy.setAttribute('height', computedStyle.height);
    
    // Convert SVG to string with correct dimensions
    const svgString = new XMLSerializer().serializeToString(svgCopy);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    // Create an image to load the SVG
    const img = new Image();
    img.onload = () => {
      // Create canvas with the same dimensions
      const canvas = document.createElement('canvas');
      const scale = 2; // Increase resolution
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      // Get canvas context and set white background
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the image
      ctx.drawImage(img, 0, 0);
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = chartType === 'bar' ? 'machine-utilization.png' : 'production-time.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
      }, 'image/png');
    };
    
    img.src = url;
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Optimization Results</h2>
      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">Machine Utilization</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => downloadChart('bar')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
          <div id="machine-utilization-chart">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={optimizationData}>
                <XAxis dataKey="averageInitialTotalMachineUtilization" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageOptimizedTotalMachineUtilization" fill="#8884d8" name="Machine Utilization" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">Production Time</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => downloadChart('line')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
          <div id="production-time-chart">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={optimizationData}>
                <XAxis dataKey="initialTotalProductionTime" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="optimizedTotalProductionTime" stroke="#8884d8" name="Production Time" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Raw Data</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(optimizationData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default OptimizationResultsDashboard;

