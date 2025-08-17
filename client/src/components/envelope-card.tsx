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
  coral: "bg-coral",
  mint: "bg-mint", 
  sky: "bg-sky",
  sage: "bg-sage",
  "warm-yellow": "bg-warm-yellow",
  blush: "bg-blush",
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
  coral: "text-coral-dark",
  mint: "text-mint-dark",
  sky: "text-sky-dark",
  sage: "text-sage-dark", 
  "warm-yellow": "text-warm-yellow-dark",
  blush: "text-blush-dark",
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
  const solidColorClass = colorMap[color] || "bg-gray-400";
  const borderClass = borderColorMap[color] || "border-gray-400";
  const textClass = textColorMap[color] || "text-gray-600";

  return (
    <motion.div
      className={`envelope-card h-28 sm:h-32 md:h-36 lg:h-40 ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${isFlipped ? 'flipped' : ''}`}
      onClick={isDisabled ? undefined : onClick}
      whileHover={isDisabled ? {} : { y: -4 }}
      data-testid={`envelope-card-${position}`}
    >
      <div className="envelope-inner">
        <div className={`envelope-front ${solidColorClass} shadow-lg`}>
          <Heart 
            className="text-white pulse-heart w-6 h-6 sm:w-8 sm:h-8" 
            data-testid={`heart-${position}`}
          />
          <span className="text-white font-semibold mt-1 sm:mt-2 text-sm sm:text-base" data-testid={`envelope-number-${position}`}>
            {position}
          </span>
        </div>
        <div className={`envelope-back bg-white shadow-lg border-2 ${borderClass}`}>
          <div className={`${textClass} font-bold text-sm sm:text-base lg:text-lg px-2`} data-testid={`prize-text-${position}`}>
            {prizeText}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
