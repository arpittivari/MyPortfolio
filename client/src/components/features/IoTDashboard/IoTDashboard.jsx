// client/src/components/features/IoTDashboard/IoTDashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Zap } from 'lucide-react';

const mockDataGenerator = (count) => {
  const data = [];
  let temp = 25;
  let humidity = 60;
  for (let i = 0; i < count; i++) {
    temp = temp + (Math.random() - 0.5) * 0.5; // Simulate small fluctuation
    humidity = humidity + (Math.random() - 0.5) * 1.5;
    data.push({
      name: `${i * 2}s`,
      temperature: parseFloat(temp.toFixed(2)),
      humidity: parseFloat(humidity.toFixed(2)),
    });
  }
  return data;
};

/**
 * Simulates a live IoT dashboard fetching sensor data.
 */
const IoTDashboard = () => {
  const [data, setData] = useState(mockDataGenerator(10));
  const [status, setStatus] = useState("RUNNING");

  const updateData = useCallback(() => {
    setStatus("FETCHING");
    setTimeout(() => {
        setData(prevData => {
            // Take the last point and generate a new one
            const lastPoint = prevData[prevData.length - 1];
            let newTemp = lastPoint.temperature + (Math.random() - 0.5) * 0.5;
            let newHumidity = lastPoint.humidity + (Math.random() - 0.5) * 1.5;

            newTemp = parseFloat(Math.max(20, Math.min(30, newTemp)).toFixed(2));
            newHumidity = parseFloat(Math.max(50, Math.min(75, newHumidity)).toFixed(2));

            const newPoint = {
                name: new Date().toLocaleTimeString('en-US', { second: '2-digit' }),
                temperature: newTemp,
                humidity: newHumidity,
            };

            // Keep the array length fixed (e.g., last 15 points)
            return [...prevData.slice(-14), newPoint];
        });
        setStatus("RUNNING");
    }, 500); // Simulate API latency
  }, []);

  useEffect(() => {
    const intervalId = setInterval(updateData, 2000); // Update every 2 seconds
    return () => clearInterval(intervalId);
  }, [updateData]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl border border-pcb-green/20">
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-pcb-green" /> Live Sensor Feed (Mock)
        </h3>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${status === 'RUNNING' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
            {status}
        </span>
      </div>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis yAxisId="left" stroke="#4ade80" domain={['auto', 'auto']} />
            <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" domain={[50, 75]} />
            <Tooltip 
                contentStyle={{ background: '#1f2937', border: '1px solid #4ade80', borderRadius: '4px' }}
                labelStyle={{ color: '#a7f3d0' }}
            />
            {/* Temperature Line */}
            <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#4ade80" dot={false} strokeWidth={2} />
            {/* Humidity Line */}
            <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#3b82f6" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-around text-xs pt-2">
        <p className="text-pcb-green flex items-center"><Thermometer className="w-4 h-4 mr-1" /> Temperature (°C)</p>
        <p className="text-blue-500 flex items-center"><Zap className="w-4 h-4 mr-1" /> Humidity (%)</p>
      </div>
    </div>
  );
};

export default IoTDashboard;