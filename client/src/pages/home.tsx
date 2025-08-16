import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import NavigationHeader from "@/components/navigation-header";
import EnvelopeCard from "@/components/envelope-card";
import ConfirmationModal from "@/components/confirmation-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { GameState, Envelope } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);

  // Fetch game state
  const { data: gameState, isLoading: gameStateLoading } = useQuery<GameState>({
    queryKey: ["/api/game-state"],
  });

  // Fetch envelopes
  const { data: envelopes = [], isLoading: envelopesLoading } = useQuery<Envelope[]>({
    queryKey: ["/api/envelopes"],
  });

  // Select envelope mutation
  const selectEnvelopeMutation = useMutation({
    mutationFn: async (envelopeId: string) => {
      const response = await apiRequest("POST", "/api/game-state/select-envelope", {
        envelopeId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/game-state"] });
      if (data.isGameComplete) {
        toast({
          title: "Game Complete!",
          description: "You've used all your tries. Start a new game to play again.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to select envelope",
        variant: "destructive",
      });
    },
  });

  // Reset game mutation
  const resetGameMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/game-state/reset");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/game-state"] });
      toast({
        title: "Game Reset",
        description: "Starting a new game. Good luck!",
      });
      setShowResetModal(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reset game",
        variant: "destructive",
      });
    },
  });

  const handleEnvelopeClick = (envelopeId: string) => {
    if (!gameState) return;
    
    // Show final confirmation modal if this is the last try
    if (gameState.remainingTries === 1) {
      setShowFinalModal(true);
      return;
    }
    
    selectEnvelopeMutation.mutate(envelopeId);
  };

  const handleConfirmFinalSelection = () => {
    const lastEnvelope = envelopes.find(env => !gameState?.selectedEnvelopes.includes(env.id));
    if (lastEnvelope) {
      selectEnvelopeMutation.mutate(lastEnvelope.id);
    }
    setShowFinalModal(false);
  };

  const handleResetGame = () => {
    resetGameMutation.mutate();
  };

  if (gameStateLoading || envelopesLoading) {
    return (
      <div className="min-h-screen bg-off-white">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-dark-blue">Loading game...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4">
            Choose Your Envelopes
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Pick your envelopes carefully! You have limited tries to find the best prizes.
          </p>
          
          <div className="flex items-center justify-center space-x-6 mb-6">
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  Remaining Tries
                </div>
                <div className="text-2xl font-bold text-coral" data-testid="remaining-tries">
                  {gameState?.remainingTries || 0}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 uppercase tracking-wide">
                  Selected
                </div>
                <div className="text-2xl font-bold text-mint" data-testid="selected-count">
                  {gameState?.selectedEnvelopes.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Button
            onClick={() => setShowResetModal(true)}
            className="bg-sky hover:bg-blue-600 text-white"
            data-testid="button-reset-game"
          >
            <RotateCcw className="mr-2" size={16} />
            Reset Game
          </Button>
        </div>

        {/* Envelopes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {envelopes.map((envelope) => (
            <EnvelopeCard
              key={envelope.id}
              id={envelope.id}
              position={envelope.position}
              prizeText={envelope.prizeText}
              color={envelope.color}
              isFlipped={gameState?.selectedEnvelopes.includes(envelope.id) || false}
              isDisabled={
                (gameState?.remainingTries || 0) <= 0 || 
                gameState?.selectedEnvelopes.includes(envelope.id) || false ||
                selectEnvelopeMutation.isPending
              }
              onClick={() => handleEnvelopeClick(envelope.id)}
            />
          ))}
        </div>
        
        {/* Final Selection Section */}
        {gameState?.remainingTries === 1 && !gameState?.isGameComplete && (
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-dark-blue mb-4">Final Selection</h3>
              <p className="text-gray-600 mb-6">This is your last try! Choose wisely.</p>
              <Button
                onClick={() => setShowFinalModal(true)}
                className="bg-coral hover:bg-pink-600 text-white px-8 py-3 text-lg font-bold"
                data-testid="button-final-selection"
              >
                Make Final Choice
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={showResetModal}
        title="Confirm Reset"
        message="Are you sure you want to reset the game? This will clear all your progress."
        onConfirm={handleResetGame}
        onCancel={() => setShowResetModal(false)}
      />

      {/* Final Selection Confirmation Modal */}
      <ConfirmationModal
        isOpen={showFinalModal}
        title="Final Selection"
        message="This is your last try! Are you ready to make your final choice?"
        onConfirm={handleConfirmFinalSelection}
        onCancel={() => setShowFinalModal(false)}
      />
    </div>
  );
}
