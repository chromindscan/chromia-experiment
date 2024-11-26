import PixelCharacter from "./PixelCharacter";
import { motion } from "framer-motion";

interface CharacterSceneProps {
  currentSpeaker?: string;
  interestLevels: {
    agent_A: number;
    agent_B: number;
  };
}

export default function CharacterScene({ 
  currentSpeaker, 
  interestLevels 
}: CharacterSceneProps) {
  // Determine emotions based on interest levels
  const getEmotion = (score: number) => {
    if (score >= 75) return "love";
    if (score >= 60) return "happy";
    if (score >= 40) return "neutral";
    if (score >= 25) return "sad";
    return "angry";
  };

  // Calculate Sophie's reaction based on highest interest level
  const highestInterest = Math.max(interestLevels.agent_A, interestLevels.agent_B);
  const sophieEmotion = getEmotion(highestInterest);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-pink-500/10 animate-gradient" />
      
      <div className="relative z-10">
        <h3 className="text-lg font-semibold mb-4 text-white/90">Character Scene</h3>
        <div className="flex justify-between items-end min-h-[200px]">
          {/* Jake */}
          <motion.div
            animate={{ 
              x: currentSpeaker === "jake" ? 20 : 0,
              y: interestLevels.agent_A > 60 ? [-5, 5] : 0
            }}
            transition={{ 
              y: { 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 2 
              }
            }}
            className="transform-gpu"
          >
            <PixelCharacter
              name="jake"
              emotion={getEmotion(interestLevels.agent_A)}
              speaking={currentSpeaker === "jake"}
              interestLevel={interestLevels.agent_A}
            />
          </motion.div>

          {/* Mike */}
          <motion.div
            animate={{ 
              x: currentSpeaker === "mike" ? -20 : 0,
              y: interestLevels.agent_B > 60 ? [-5, 5] : 0
            }}
            transition={{ 
              y: { 
                repeat: Infinity, 
                repeatType: "reverse", 
                duration: 2 
              }
            }}
            className="transform-gpu"
          >
            <PixelCharacter
              name="mike"
              emotion={getEmotion(interestLevels.agent_B)}
              speaking={currentSpeaker === "mike"}
              interestLevel={interestLevels.agent_B}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
} 