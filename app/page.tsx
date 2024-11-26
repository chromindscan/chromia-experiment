"use client"

import { useState, useEffect } from "react"
import LogDisplay from "../components/LogDisplay"
import InterestLevels from "../components/InterestLevels"
import { motion } from "framer-motion"
import CharacterScene from '../components/CharacterScene';

export default function Home() {
  const [logs, setLogs] = useState<string[]>([])
  const [interestLevels, setInterestLevels] = useState({ agent_A: 50, agent_B: 50 })
  const [currentSpeaker, setCurrentSpeaker] = useState<string | undefined>();
  const [emotions, setEmotions] = useState({
    sophie: "neutral",
    jake: "neutral",
    mike: "neutral"
  });
  const [socket, setSocket] = useState<WebSocket | null>(null);
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
    if (logs.length > 0) {
      const lastMessage = logs[logs.length - 1].toLowerCase();
      
      if (lastMessage.includes("jake")) {
        setCurrentSpeaker("jake");
        if (lastMessage.includes("happy")) {
          setEmotions(prev => ({ ...prev, jake: "happy" }));
        } else if (lastMessage.includes("angry")) {
          setEmotions(prev => ({ ...prev, jake: "angry" }));
        }
      }
    }
  }, [logs]);

  return (
    <main className="min-h-screen p-4 lg:p-8 bg-gradient-to-b from-black via-purple-950/20 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center relative"
        >
          <h1 className="text-5xl lg:text-6xl font-bold mb-3 relative">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Dystopian Experiment
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-xl animate-pulse-slow" />
          </h1>
          <p className="text-white/60 text-lg relative z-10">
            Watch as AI agents compete for Sophie&apos;s attention
          </p>
          
          <div className="mt-4">
            <button
              onClick={isRunning ? stopSimulation : startSimulation}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              } text-white`}
            >
              {isRunning ? 'Stop Simulation' : 'Start Simulation'}
            </button>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LogDisplay logs={logs} />
          </div>
          <div className="space-y-6">
            <CharacterScene
              currentSpeaker={currentSpeaker}
              interestLevels={interestLevels}
            />
            <InterestLevels levels={interestLevels} />
            <CharacterList />
          </div>
        </div>
      </div>
    </main>
  )
}

function CharacterList() {
  return (
    <div className="relative backdrop-blur-xl bg-black/30 p-8 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-gradient" />
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Characters
        </h2>
        <div className="space-y-4">
          <CharacterCard
            name="Sophie"
            role="AI Researcher"
            color="amber"
          />
          <CharacterCard
            name="Jake"
            role="The Hacker"
            color="cyan"
          />
          <CharacterCard
            name="Mike"
            role="The Rebel"
            color="red"
          />
        </div>
      </div>
    </div>
  )
}

interface CharacterCardProps {
  name: string
  role: string
  color: string
}

function CharacterCard({ name, role, color }: CharacterCardProps) {
  const colorClasses = {
    cyan: "from-cyan-500 to-blue-500",
    red: "from-red-500 to-pink-500",
    amber: "from-amber-500 to-yellow-500",
  }[color]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden"
    >
      <div
        className={`p-4 rounded-xl backdrop-blur-sm bg-gradient-to-r ${colorClasses} bg-opacity-10 border border-white/10`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative z-10">
          <h3 className="font-bold text-white">{name}</h3>
          <p className="text-sm text-white/60">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}

