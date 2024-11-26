import { useEffect, useRef } from 'react'

interface LogDisplayProps {
  logs: string[]
}

export default function LogDisplay({ logs }: LogDisplayProps) {
  const logEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-[400px] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-2">Logs</h2>
      {logs.map((log, index) => (
        <p key={index} className="mb-1 text-sm">
          <span className="text-blue-600">&gt; </span>
          {log}
        </p>
      ))}
      <div ref={logEndRef} />
    </div>
  )
}

