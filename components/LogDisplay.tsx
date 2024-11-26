"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useRef } from "react"

interface LogDisplayProps {
  logs: string[]
}

export default function LogDisplay({ logs }: LogDisplayProps) {
  const logEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current && logEndRef.current) {
      containerRef.current.scrollTo({
        top: logEndRef.current.offsetTop,
        behavior: "smooth"
      })
    }
  }, [logs])

  return (
    <div className="relative backdrop-blur-xl bg-black/30 p-8 rounded-2xl border border-white/10 shadow-2xl h-[600px]">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-pink-500/10 animate-gradient" />
      
      <div className="relative z-10 h-full flex flex-col">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
          Live Simulation
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </h2>

        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto pr-4 custom-scrollbar"
          style={{ overscrollBehavior: "contain" }}
        >
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {logs.map((log, index) => {
                const isJake = log.toLowerCase().includes("jake")
                const isMike = log.toLowerCase().includes("mike")
                const isSophie = log.toLowerCase().includes("sophie")

                const colorClass = isJake
                  ? "text-cyan-400"
                  : isMike
                  ? "text-red-400"
                  : isSophie
                  ? "text-amber-400"
                  : "text-white/80"

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className={`relative backdrop-blur-sm bg-white/5 p-4 rounded-lg border border-white/10 ${colorClass}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <span className="text-white/40 font-mono text-sm">
                        [{new Date().toLocaleTimeString()}]
                      </span>{" "}
                      {log}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  )
}

