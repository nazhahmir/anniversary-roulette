import { Heart } from "lucide-react";
import { motion } from "framer-motion";

interface EnvelopeCardProps {
  id: string;
  position: number;
  prizeText: string;
  color: string;
  isFlipped: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const colorMap: Record<string, string> = {
  coral: "from-coral to-pink-400",
  mint: "from-mint to-teal-400", 
  sky: "from-sky to-blue-400",
  sage: "from-sage to-green-400",
  "warm-yellow": "from-warm-yellow to-yellow-400",
  blush: "from-blush to-pink-300",
};

const borderColorMap: Record<string, string> = {
  coral: "border-coral",
  mint: "border-mint",
  sky: "border-sky", 
  sage: "border-sage",
  "warm-yellow": "border-warm-yellow",
  blush: "border-blush",
};

const textColorMap: Record<string, string> = {
  coral: "text-coral",
  mint: "text-mint",
  sky: "text-sky",
  sage: "text-sage", 
  "warm-yellow": "text-warm-yellow",
  blush: "text-blush",
};

export default function EnvelopeCard({ 
  id, 
  position, 
  prizeText, 
  color, 
  isFlipped, 
  isDisabled, 
  onClick 
}: EnvelopeCardProps) {
  const gradientClass = colorMap[color] || "from-gray-400 to-gray-500";
  const borderClass = borderColorMap[color] || "border-gray-400";
  const textClass = textColorMap[color] || "text-gray-600";

  return (
    <motion.div
      className={`envelope-card h-32 md:h-40 ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${isFlipped ? 'flipped' : ''}`}
      onClick={isDisabled ? undefined : onClick}
      whileHover={isDisabled ? {} : { y: -4 }}
      data-testid={`envelope-card-${position}`}
    >
      <div className="envelope-inner">
        <div className={`envelope-front bg-gradient-to-br ${gradientClass} shadow-lg`}>
          <Heart 
            className="text-white pulse-heart" 
            size={32}
            data-testid={`heart-${position}`}
          />
          <span className="text-white font-semibold mt-2" data-testid={`envelope-number-${position}`}>
            {position}
          </span>
        </div>
        <div className={`envelope-back bg-white shadow-lg border-2 ${borderClass}`}>
          <div className={`${textClass} font-bold text-lg`} data-testid={`prize-text-${position}`}>
            {prizeText}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
