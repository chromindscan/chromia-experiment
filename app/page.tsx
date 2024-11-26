'use client'

import { useState, useEffect } from 'react'
import LogDisplay from '../components/LogDisplay'
import InterestLevels from '../components/InterestLevels'

export default function Home() {
  const [logs, setLogs] = useState<string[]>([])
  const [interestLevels, setInterestLevels] = useState({ agent_A: 50, agent_B: 50 })

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8765')

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'log') {
        setLogs((prevLogs) => [...prevLogs, data.message])
      } else if (data.type === 'interest_levels') {
        setInterestLevels(data.levels)
      }
    }

    return () => {
      socket.close()
    }
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        AI Dating Simulation Logs
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LogDisplay logs={logs} />
        <InterestLevels levels={interestLevels} />
      </div>
    </main>
  )
}

