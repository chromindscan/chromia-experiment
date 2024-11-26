import { useState, useEffect } from 'react';

export default function SimulationControl() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [interestLevels, setInterestLevels] = useState<{
        agent_A: number;
        agent_B: number;
    }>({ agent_A: 0, agent_B: 0 });
    const [isRunning, setIsRunning] = useState(false);

    const startSimulation = () => {
        const ws = new WebSocket('ws://localhost:8765');
        
        ws.onopen = () => {
            setIsRunning(true);
            console.log('Connected to simulation server');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'log') {
                setLogs(prev => [...prev, data.message]);
            } else if (data.type === 'interest_levels') {
                setInterestLevels(data.levels);
            }
        };

        ws.onclose = () => {
            setIsRunning(false);
            console.log('Disconnected from simulation server');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsRunning(false);
        };

        setSocket(ws);
    };

    const stopSimulation = () => {
        if (socket) {
            socket.close();
            setSocket(null);
        }
    };

    useEffect(() => {
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [socket]);

    return (
        <div className="p-4">
            <div className="mb-4">
                <button
                    onClick={isRunning ? stopSimulation : startSimulation}
                    className={`px-4 py-2 rounded ${
                        isRunning 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                >
                    {isRunning ? 'Stop Simulation' : 'Start Simulation'}
                </button>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Interest Levels:</h3>
                <div className="flex gap-4">
                    <div>Jake: {interestLevels.agent_A}%</div>
                    <div>Mike: {interestLevels.agent_B}%</div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Simulation Logs:</h3>
                <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                    {logs.map((log, index) => (
                        <div key={index} className="mb-2">
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 