// client/src/components/features/MLGame/MLGame.jsx

import React, { useState, useEffect } from 'react';
import { GitBranch, Play, StopCircle, Heart, Award } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Loader from '../../../components/ui/Loader.jsx';
// NOTE: For a real visual, you would use a canvas or D3/Recharts here. 
// We simplify the visualization to just the metrics.

const INITIAL_METRICS = {
    accuracy: 0.0,
    loss: 1.0,
    isTrained: false,
    message: 'Set hyperparameters and press Train Model.'
};

/**
 * Interactive simulation of training a classification model.
 */
const MLGame = () => {
    const [params, setParams] = useState({ learningRate: 0.1, epochs: 10 });
    const [metrics, setMetrics] = useState(INITIAL_METRICS);
    const [isTraining, setIsTraining] = useState(false);

    const handleParamChange = (e) => {
        setParams({ ...params, [e.target.name]: parseFloat(e.target.value) });
        if (metrics.isTrained) setMetrics(INITIAL_METRICS); // Reset if trained metrics are displayed
    };

    const trainModel = () => {
        setIsTraining(true);
        setMetrics({ ...INITIAL_METRICS, message: 'Training model...' });
        
        let currentAccuracy = 0.5;
        let currentLoss = 0.5;
        let epoch = 0;

        const trainingInterval = setInterval(() => {
            epoch++;

            // --- Simulation Logic ---
            // High learning rate causes wild swings (instability)
            const instability = params.learningRate > 0.5 ? Math.random() * 0.1 - 0.05 : 0;
            
            // High epochs and medium learning rate leads to high accuracy/low loss
            const idealPerformance = (params.epochs / 100) * (params.learningRate / 0.3);

            // Update metrics
            currentAccuracy = Math.min(0.99, currentAccuracy + (idealPerformance * 0.05) + instability);
            currentLoss = Math.max(0.01, currentLoss - (idealPerformance * 0.05) - instability);

            setMetrics(prev => ({
                ...prev,
                accuracy: parseFloat(currentAccuracy.toFixed(3)),
                loss: parseFloat(currentLoss.toFixed(3)),
            }));
            
            // Stop condition
            if (epoch >= params.epochs) {
                clearInterval(trainingInterval);
                setIsTraining(false);
                setMetrics(prev => ({ 
                    ...prev, 
                    isTrained: true, 
                    message: prev.accuracy > 0.95 
                        ? 'Training Complete. Excellent generalization!' 
                        : 'Training Complete. Model under-fitted or diverged.' 
                }));
            }
        }, 100);

        return () => clearInterval(trainingInterval);
    };

    const isOptimal = metrics.isTrained && metrics.accuracy > 0.95;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-pcb-green/20 space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <GitBranch className="w-5 h-5 mr-2 text-pcb-green" /> ML Hyperparameter Tuner (Simulated)
            </h3>
            
            {/* Hyperparameter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="learningRate" className="admin-label flex justify-between">
                        Learning Rate: <span>{params.learningRate.toFixed(2)}</span>
                    </label>
                    <input 
                        type="range" 
                        id="learningRate"
                        name="learningRate" 
                        min="0.01" max="1.0" step="0.01" 
                        value={params.learningRate} 
                        onChange={handleParamChange}
                        disabled={isTraining}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700 accent-pcb-green"
                    />
                    <p className="text-xs text-gray-500 mt-1">Controls step size. Too high = instability.</p>
                </div>
                <div>
                    <label htmlFor="epochs" className="admin-label flex justify-between">
                        Epochs: <span>{params.epochs}</span>
                    </label>
                    <input 
                        type="range" 
                        id="epochs"
                        name="epochs" 
                        min="1" max="100" step="1" 
                        value={params.epochs} 
                        onChange={handleParamChange}
                        disabled={isTraining}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700 accent-pcb-green"
                    />
                    <p className="text-xs text-gray-500 mt-1">Controls training duration. Too low = under-fitting.</p>
                </div>
            </div>

            {/* Metrics Display */}
            <div className="grid grid-cols-2 gap-4 text-center">
                <MetricDisplay label="Current Accuracy" value={metrics.accuracy} max={1.0} Icon={Heart} color="text-pcb-green" />
                <MetricDisplay label="Current Loss" value={metrics.loss} max={1.0} Icon={StopCircle} color="text-red-500" />
            </div>

            {/* Status and Control */}
            <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                <p className={`font-medium ${isOptimal ? 'text-green-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {metrics.message}
                </p>
                <Button 
                    onClick={trainModel}
                    isLoading={isTraining}
                    disabled={isTraining}
                    className={`${isTraining ? 'bg-yellow-600' : 'bg-pcb-green'} min-w-[120px]`}
                >
                    {isTraining ? 'Training...' : <><Play className="w-5 h-5 mr-1" /> Train Model</>}
                </Button>
            </div>

            {isOptimal && (
                <div className="flex items-center justify-center p-3 
                       bg-green-100 dark:bg-green-900/40   /* Lighter background */
                       border border-green-500             
                       rounded-lg 
                       text-green-700 dark:text-green-300 /* Brighter text */
                       font-bold">
        <Award className="w-6 h-6 mr-3 text-green-500" /> {/* Keep icon color */}
        Optimal Hyperparameters Found!
      </div>
            )}
        </div>
    );
};

const MetricDisplay = ({ label, value, Icon, color }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <div className="flex items-center justify-center mt-1">
            <Icon className={`w-5 h-5 mr-2 ${color}`} />
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {value.toFixed(3)}
            </span>
        </div>
    </div>
);

export default MLGame;