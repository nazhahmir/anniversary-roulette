import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface GameTimerProps {
  timerSeconds: number;
  gameStarted: boolean;
  onTimeUp: () => void;
  isGameComplete: boolean;
}

export default function GameTimer({ timerSeconds, gameStarted, onTimeUp, isGameComplete }: GameTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(timerSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (gameStarted && !isGameComplete) {
      setIsActive(true);
      setTimeRemaining(timerSeconds);
    } else {
      setIsActive(false);
    }
  }, [gameStarted, isGameComplete, timerSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsActive(false);
            onTimeUp();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isActive) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    const percentage = (timeRemaining / timerSeconds) * 100;
    if (percentage <= 20) return "text-red-600 bg-red-50 border-red-200";
    if (percentage <= 50) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  if (!gameStarted || isGameComplete) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 ${getTimerColor()}`} data-testid="game-timer">
      <Clock size={20} />
      <span className="font-bold text-lg">{formatTime(timeRemaining)}</span>
      <span className="text-sm">remaining</span>
    </div>
  );
}