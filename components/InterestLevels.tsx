"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface InterestLevelsProps {
  levels: {
    agent_A: number
    agent_B: number
  }
}

export default function InterestLevels({ levels }: InterestLevelsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative backdrop-blur-xl bg-black/30 p-8 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-gradient" />
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Interest Levels
        </h2>
        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-3">
              <p className="font-medium text-white/90 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Jake (Hacker)
              </p>
              <motion.span
                key={levels.agent_A}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-cyan-400 font-mono text-lg tabular-nums"
              >
                {levels.agent_A}%
              </motion.span>
            </div>
            <div className="relative">
              <div className="w-full bg-white/5 rounded-full h-4 backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levels.agent_A}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                >
                  <div className="absolute inset-0 rounded-full animate-pulse-slow bg-gradient-to-r from-cyan-400 to-blue-400 opacity-50 blur-sm" />
                </motion.div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-3">
              <p className="font-medium text-white/90 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                Mike (Rebel)
              </p>
              <motion.span
                key={levels.agent_B}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 font-mono text-lg tabular-nums"
              >
                {levels.agent_B}%
              </motion.span>
            </div>
            <div className="relative">
              <div className="w-full bg-white/5 rounded-full h-4 backdrop-blur-sm">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levels.agent_B}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative h-full rounded-full bg-gradient-to-r from-red-500 to-pink-500"
                >
                  <div className="absolute inset-0 rounded-full animate-pulse-slow bg-gradient-to-r from-red-400 to-pink-400 opacity-50 blur-sm" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

