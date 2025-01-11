import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Button } from '@/Components/ui/button';
import { Download } from 'lucide-react';
import { authService } from '../services/auth';
import axiosInstance from '../utils/axios';

export default function OptimizationResultsDashboard() {
  const [optimizationData, setOptimizationData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
          throw new Error('No authenticated user found');
        }
        const response = await axiosInstance.get(`/results/userId=${currentUser.userId}`);
        setOptimizationData(Array.isArray(response.data) ? response.data : [response.data]);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch optimization results');
      }
    };
    fetchData();
  }, []);

  const machineUtilData = useMemo(() => {
    return optimizationData.map((item) => ({
      label: new Date(item.createdAt).toLocaleString(),
      initial: item.average_initial_total_machine_utilization || 0,
      optimized: item.average_optimized_total_machine_utilization || 0,
      improvement: item.utilization_improvement || 0
    }));
  }, [optimizationData]);

  const productionTimeData = useMemo(() => {
    return optimizationData.map((item) => ({
      label: new Date(item.createdAt).toLocaleString(),
      initial: item.initial_total_production_time || 0,
      optimized: item.optimized_total_production_time || 0,
      improvement: item.time_improvement || 0
    }));
  }, [optimizationData]);

  const downloadChart = (chartId) => {
    const svgElement = document.querySelector(`#${chartId} svg`);
    if (!svgElement) return;
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chartId}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatValue = (value) => {
    return typeof value === 'number' ? value.toFixed(2) : '0.00';
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Optimization Results</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Machine Utilization Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Machine Utilization (%)</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => downloadChart('machine-utilization-chart')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
          <div id="machine-utilization-chart" className="h-96">
            <ResponsiveContainer>
              <BarChart data={machineUtilData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="label" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value) => formatValue(value) + '%'}
                />
                <Legend />
                <Bar 
                  dataKey="initial" 
                  fill="#9333ea" 
                  name="Initial Utilization" 
                />
                <Bar 
                  dataKey="optimized" 
                  fill="#22c55e" 
                  name="Optimized Utilization" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Production Time Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Production Time (minutes)</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => downloadChart('production-time-chart')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
          <div id="production-time-chart" className="h-96">
            <ResponsiveContainer>
              <LineChart data={productionTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="label" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <Tooltip formatter={(value) => formatValue(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="initial"
                  stroke="#9333ea"
                  name="Initial Time"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="optimized"
                  stroke="#22c55e"
                  name="Optimized Time"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {optimizationData.map((data, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-sm font-medium text-gray-500">
              Run {index + 1}: {new Date(data.createdAt).toLocaleDateString()}
            </h4>
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                Utilization Improvement: {formatValue(data.utilization_improvement)}%
              </p>
              <p className="text-sm">
                Time Improvement: {formatValue(data.time_improvement)} min
              </p>
              <p className="text-sm">
                Percentage Improvement: {formatValue(data.percentage_improvement)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Raw Data Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Raw Data</h3>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
          <pre className="text-sm">
            {JSON.stringify(optimizationData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}