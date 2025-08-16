import { Trophy, Gift, RotateCcw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface GameCompleteScreenProps {
  finalPrize: string;
  cashedOut: boolean;
  onPlayAgain: () => void;
}

export default function GameCompleteScreen({ finalPrize, cashedOut, onPlayAgain }: GameCompleteScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-yellow via-off-white to-coral flex items-center justify-center px-4">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="flex justify-center items-center mb-6">
              <div className={`p-6 rounded-full ${cashedOut ? 'bg-coral' : 'bg-warm-yellow'}`}>
                {cashedOut ? (
                  <Heart className="text-white pulse-heart" size={56} />
                ) : (
                  <Trophy className="text-white" size={56} />
                )}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4">
              {cashedOut ? "Smart Choice!" : "Game Complete!"}
            </h1>
            
            <div className="bg-gradient-to-r from-mint/20 to-sky/20 p-6 rounded-xl border border-mint/30 mb-6">
              <p className="text-lg text-gray-600 mb-2">
                {cashedOut ? "You cashed out with:" : "Your final prize is:"}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-coral">
                {finalPrize}
              </p>
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