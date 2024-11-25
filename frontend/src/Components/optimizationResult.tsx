import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { authService } from '../services/auth';
import axiosInstance from '../utils/axios';

const OptimizationResultsDashboard = () => {
  const [optimizationData, setOptimizationData] = useState([]);
  const [error, setError] = useState(null);

// useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const currentUser = authService.getCurrentUser();
//         if (!currentUser) {
//           throw new Error('No authenticated user found');
//         }

//         const response = await axiosInstance.get(`http://localhost:8080/api/results?userId=${currentUser.id}`);
//         console.log('Response:', response);
//         setOptimizationData(response.data);
//       } catch (error) {
//         console.error('Error:', error);
//         setError(error.message);
//       }
//     };

//     fetchData();
//   }, []);
// useEffect(() => {
//     const fetchData = async () => {
//         try {
//           const currentUser = authService.getCurrentUser();
//           if (!currentUser) throw new Error('No authenticated user found');
      
//           console.log('Current User:', currentUser);
//           const response = await axiosInstance.get(`/results?userId=${currentUser.id}`, {
//             withCredentials: true
//           });
          
//           console.log('Response:', response);
//           setOptimizationData(response.data);
//         } catch (error) {
//           console.error('Error:', error);
//           setError(error.message);
//         }
//       };
  
//     fetchData();
//   }, []);
useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          throw new Error('No authenticated user found');
        }
        console.log(currentUser);
        const response = await axiosInstance.get(`/results?userId=550e8400-e29b-41d4-a716-446655440002`);
        console.log('Optimization Results:', response.data);
        setOptimizationData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch optimization results');
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Optimization Results</h2>
      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-bold mb-2">Machine Utilization</h3>
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

        <div>
          <h3 className="text-xl font-bold mb-2">Production Time</h3>
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