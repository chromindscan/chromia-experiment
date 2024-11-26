import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface PixelCharacterProps {
  name: "sophie" | "jake" | "mike";
  emotion: "happy" | "sad" | "angry" | "neutral" | "love";
  speaking?: boolean;
  interestLevel: number;
}

export default function PixelCharacter({ name, emotion, speaking = false, interestLevel }: PixelCharacterProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  // Random blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, Math.random() * 4000 + 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const characterColors = {
    sophie: {
      skin: "bg-amber-200",
      hair: "bg-yellow-600",
      outfit: "bg-purple-500",
    },
    jake: {
      skin: "bg-amber-300",
      hair: "bg-gray-800",
      outfit: "bg-blue-500",
    },
    mike: {
      skin: "bg-amber-400",
      hair: "bg-brown-600",
      outfit: "bg-red-500",
    },
  };

  const colors = characterColors[name];

  // Interest level effects
  const getInterestEffects = () => {
    if (interestLevel >= 75) {
      return {
        scale: [1, 1.05, 1],
        rotate: [-2, 2, -2],
      };
    }
    if (interestLevel <= 25) {
      return {
        scale: [0.95, 1, 0.95],
        rotate: [-1, 1, -1],
      };
    }
    return {};
  };

  const interestEffects = getInterestEffects();

  return (
    <div className="relative w-32 h-32">
      <motion.div
        animate={{
          ...interestEffects,
          y: speaking ? [0, -5, 0] : 0,
        }}
        transition={{ 
          repeat: Infinity, 
          duration: speaking ? 0.5 : 2 
        }}
        className="relative"
      >
        {/* Head with interest-based glow */}
        <div className={`
          w-16 h-16 
          ${colors.skin} 
          rounded-lg 
          relative 
          mx-auto
          ${interestLevel >= 75 ? 'ring-2 ring-yellow-400/50 ring-offset-2 ring-offset-transparent' : ''}
        `}>
          {/* Eyes with interest-based animations */}
          <div className="absolute top-6 left-3 flex space-x-4">
            <motion.div
              animate={
                isBlinking ? { scaleY: 0.2 } : 
                interestLevel >= 75 ? { scale: [1, 1.2, 1] } :
                interestLevel <= 25 ? { scale: 0.8 } :
                { scale: 1 }
              }
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-2 h-2 bg-gray-800 rounded-full"
            />
            <motion.div
              animate={
                isBlinking ? { scaleY: 0.2 } : 
                interestLevel >= 75 ? { scale: [1, 1.2, 1] } :
                interestLevel <= 25 ? { scale: 0.8 } :
                { scale: 1 }
              }
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-2 h-2 bg-gray-800 rounded-full"
            />
          </div>

          {/* Mouth with interest-based expressions */}
          <motion.div
            animate={{
              scaleX: emotion === "happy" || interestLevel >= 60 ? 1.2 : 1,
              scaleY: emotion === "sad" || interestLevel <= 30 ? -1 : 1,
              rotate: interestLevel >= 75 ? [-5, 5, -5] : 0,
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`
              absolute 
              bottom-4 
              left-1/2 
              -translate-x-1/2 
              w-6 h-2 
              ${emotion === "angry" || interestLevel <= 25 ? "bg-red-500" : "bg-gray-800"}
              rounded-full
            `}
          />

          {/* Interest level indicator particles */}
          {interestLevel >= 70 && (
            <motion.div
              animate={{ opacity: [0, 1, 0], y: -20 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-4 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex space-x-1">
                {"❤️✨💫".split("").map((particle, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [-10, -20, -10] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      delay: i * 0.2 
                    }}
                  >
                    {particle}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Body with interest-based movements */}
        <motion.div
          animate={interestLevel >= 75 ? {
            rotate: [-2, 2, -2],
          } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`w-20 h-24 ${colors.outfit} rounded-t-lg relative mx-auto -mt-8`}
        >
          {/* Arms with interest-based animations */}
          <motion.div
            animate={
              speaking ? { rotate: [-5, 5, -5] } :
              interestLevel >= 75 ? { rotate: [-10, 10, -10] } :
              interestLevel <= 25 ? { rotate: -20 } :
              {}
            }
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute -left-4 top-8 w-4 h-12 bg-inherit rounded-l-lg"
          />
          <motion.div
            animate={
              speaking ? { rotate: [5, -5, 5] } :
              interestLevel >= 75 ? { rotate: [10, -10, 10] } :
              interestLevel <= 25 ? { rotate: 20 } :
              {}
            }
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute -right-4 top-8 w-4 h-12 bg-inherit rounded-r-lg"
          />
        </motion.div>
      </motion.div>
    </div>
  );
} 