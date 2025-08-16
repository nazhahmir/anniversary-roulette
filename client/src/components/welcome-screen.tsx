import { useState } from "react";
import { Heart, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import NavigationHeader from "@/components/navigation-header";
import type { Envelope } from "@shared/schema";

interface WelcomeScreenProps {
  envelopes: Envelope[];
  onStartGame: () => void;
  onResetGame: () => void;
}

export default function WelcomeScreen({ envelopes, onStartGame, onResetGame }: WelcomeScreenProps) {
  const [showPrizes, setShowPrizes] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush via-off-white to-mint">
      <NavigationHeader />
      <div className="flex items-center justify-center px-4 pt-20">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="flex justify-center items-center mb-6">
              <div className="bg-coral p-4 rounded-full">
                <Heart className="text-white pulse-heart" size={48} />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-dark-blue mb-4">
              Anniversary Surprise
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              A special Deal or No Deal game just for you! 
              Pick envelopes to discover wonderful anniversary gifts.
            </p>
            
            <div className="flex items-center justify-center space-x-2 mb-8">
              <Sparkles className="text-warm-yellow" size={20} />
              <span className="text-lg font-medium text-gray-700">
                {envelopes.length} Amazing Prizes Await
              </span>
              <Sparkles className="text-warm-yellow" size={20} />
            </div>
          </div>

          {!showPrizes ? (
            <div className="space-y-4">
              <Button
                onClick={() => setShowPrizes(true)}
                className="bg-coral hover:bg-pink-600 text-white px-8 py-4 text-lg font-bold rounded-xl"
                data-testid="button-preview-prizes"
              >
                <Gift className="mr-2" size={20} />
                Preview Your Prizes
              </Button>
              
              <div className="text-sm text-gray-500">
                Take a peek at what's available before you start!
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-dark-blue mb-4">Your Amazing Prizes</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {envelopes.map((envelope, index) => (
                  <div 
                    key={envelope.id}
                    className="bg-gradient-to-r from-mint/20 to-sky/20 p-4 rounded-lg border border-mint/30 fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    data-testid={`prize-preview-${index + 1}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-coral text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-dark-blue font-medium">{envelope.prizeText}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={onStartGame}
                  className="bg-mint hover:bg-teal-600 text-white px-8 py-4 text-lg font-bold rounded-xl"
                  data-testid="button-start-game"
                >
                  Start Playing!
                </Button>
                
                <Button
                  onClick={onResetGame}
                  variant="outline"
                  className="border-2 border-coral text-coral hover:bg-coral hover:text-white px-8 py-4 text-lg font-bold rounded-xl"
                  data-testid="button-reset-from-welcome"
                >
                  Reset Setup
                </Button>
              </div>
            </div>
          )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}