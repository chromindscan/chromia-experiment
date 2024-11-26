interface InterestLevelsProps {
  levels: {
    agent_A: number
    agent_B: number
  }
}

export default function InterestLevels({ levels }: InterestLevelsProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Interest Levels</h2>
      <div className="space-y-4">
        <div>
          <p className="mb-1">Jake (Hacker)</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${levels.agent_A}%` }}
            ></div>
          </div>
          <p className="text-right mt-1 text-sm">{levels.agent_A}%</p>
        </div>
        <div>
          <p className="mb-1">Mike (Rebel)</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-red-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${levels.agent_B}%` }}
            ></div>
          </div>
          <p className="text-right mt-1 text-sm">{levels.agent_B}%</p>
        </div>
      </div>
    </div>
  )
}

