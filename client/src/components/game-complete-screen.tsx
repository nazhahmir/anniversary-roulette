import { Trophy, Gift, RotateCcw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface GameCompleteScreenProps {
  finalPrize: string;
  cashedOut: boolean;
  onPlayAgain: () => void;
}

export default function GameCompleteScreen({ finalPrize, cashedOut, onPlayAgain }: GameCompleteScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation when component mounts
    setShowConfetti(true);
    
    // Hide confetti after 6 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-light-pink flex items-center justify-center px-4 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                animationName: 'confetti-fall',
                animationTimingFunction: 'linear',
                animationFillMode: 'forwards',
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'][Math.floor(Math.random() * 6)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 backdrop-blur-sm relative z-10">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Gift className="w-16 h-16 text-coral mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-dark-blue mb-4">
              {cashedOut ? "Prize Claimed!" : "Game Complete!"}
            </h2>
            
            {/* Prize Display Section */}
            <div className="bg-gradient-to-r from-mint/20 to-sky/20 p-6 rounded-lg border border-mint/30 mb-6">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Gift className="text-coral" size={20} />
                <div className="text-lg font-semibold text-dark-blue">
                  {cashedOut ? "You won:" : "Your final prize:"}
                </div>
              </div>
              <div className="text-xl font-bold text-coral break-words leading-relaxed">
                {finalPrize}
              </div>
            </div>
            
            <p className="text-lg text-gray-600 mb-8">
              {cashedOut 
                ? "You made a great decision to take this prize! Sometimes it's better to secure what you have." 
                : "Congratulations! You've completed the game and this is your anniversary surprise!"
              }
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={onPlayAgain}
              className="bg-mint hover:bg-teal-600 text-white px-8 py-4 text-lg font-bold rounded-xl w-full"
              data-testid="button-play-again"
            >
              <RotateCcw className="mr-2" size={20} />
              Play Again
            </Button>
            
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <Gift size={16} />
              <span className="text-sm">Happy Anniversary!</span>
              <Gift size={16} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}