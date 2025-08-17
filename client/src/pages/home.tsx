import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import NavigationHeader from "@/components/navigation-header";
import EnvelopeCard from "@/components/envelope-card";
import ConfirmationModal from "@/components/confirmation-modal";
import CashOutModal from "@/components/cash-out-modal";
import WelcomeScreen from "@/components/welcome-screen";
import GameCompleteScreen from "@/components/game-complete-screen";
import GameTimer from "@/components/game-timer";
import TimeUpModal from "@/components/time-up-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { GameState, Envelope, GameConfig } from "@shared/schema";

interface DisplayEnvelope extends Envelope {
  displayPosition: number;
}

export default function Home() {
  const { toast } = useToast();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [showCashOutModal, setShowCashOutModal] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [selectedEnvelopeForCashOut, setSelectedEnvelopeForCashOut] = useState<string | null>(null);

  // Fetch game state
  const { data: gameState, isLoading: gameStateLoading } = useQuery<GameState>({
    queryKey: ["/api/game-state"],
  });

  // Fetch envelopes
  const { data: envelopes = [], isLoading: envelopesLoading } = useQuery<Envelope[]>({
    queryKey: ["/api/envelopes"],
  });

  // Fetch game config for timer
  const { data: gameConfig } = useQuery<GameConfig>({
    queryKey: ["/api/game-config"],
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
        description: "Setup cleared. Configure your prizes in the admin panel!",
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

  // Start game mutation
  const startGameMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/game-state/start");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/game-state"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start game",
        variant: "destructive",
      });
    },
  });

  // Cash out mutation
  const cashOutMutation = useMutation({
    mutationFn: async (envelopeId: string) => {
      const response = await apiRequest("POST", "/api/game-state/cash-out", {
        envelopeId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/game-state"] });
      setShowCashOutModal(false);
      setSelectedEnvelopeForCashOut(null);
      toast({
        title: "Congratulations!",
        description: "You've cashed out with your prize!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cash out",
        variant: "destructive",
      });
    },
  });

  // Time up mutation
  const timeUpMutation = useMutation({
    mutationFn: async (finalPrize: string) => {
      const response = await apiRequest("POST", "/api/game-state/time-up", {
        finalPrize
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/game-state"] });
      // The GameCompleteScreen will show since isGameComplete is true
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete game",
        variant: "destructive",
      });
    }
  });

  const handleEnvelopeClick = (envelopeId: string) => {
    if (!gameState) return;
    
    // Show final confirmation modal if this is the last try
    if (gameState.remainingTries === 1) {
      setShowFinalModal(true);
      return;
    }
    
    // Select the envelope first
    selectEnvelopeMutation.mutate(envelopeId, {
      onSuccess: () => {
        // After selection, show cash out modal if there are tries remaining
        if (gameState.remainingTries > 1) {
          setSelectedEnvelopeForCashOut(envelopeId);
          setShowCashOutModal(true);
        }
      }
    });
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

  const handleStartGame = () => {
    startGameMutation.mutate();
  };

  const handleCashOut = () => {
    if (selectedEnvelopeForCashOut) {
      cashOutMutation.mutate(selectedEnvelopeForCashOut);
    }
  };

  const handleContinueGame = () => {
    setShowCashOutModal(false);
    setSelectedEnvelopeForCashOut(null);
  };

  const handleTimeUp = () => {
    // When time runs out, the last selected envelope becomes the final prize
    if (gameState && gameState.selectedEnvelopes && gameState.selectedEnvelopes.length > 0) {
      const lastSelectedEnvelopeId = gameState.selectedEnvelopes[gameState.selectedEnvelopes.length - 1];
      const lastSelectedEnvelope = envelopes.find(env => env.id === lastSelectedEnvelopeId);
      
      if (lastSelectedEnvelope) {
        // Show the Time's Up modal
        setShowTimeUpModal(true);
        // Complete the game with the last selected envelope's prize
        timeUpMutation.mutate(lastSelectedEnvelope.prizeText);
      }
    }
  };

  // Get the prize text for the cash-out modal
  const getCashOutPrize = () => {
    if (!selectedEnvelopeForCashOut) return "";
    const envelope = envelopes.find(e => e.id === selectedEnvelopeForCashOut);
    return envelope?.prizeText || "";
  };

  // Create display envelopes with shuffled prizes but static positions
  const getDisplayEnvelopes = (): DisplayEnvelope[] => {
    if (!gameState?.gameStarted || !gameState.shuffledOrder.length) {
      return envelopes.map((envelope, index) => ({
        ...envelope,
        displayPosition: index + 1,
        color: ["coral", "mint", "sky", "sage", "warm-yellow", "blush"][index % 6]
      }));
    }
    
    // Create envelopes with static positions but shuffled prize content
    const shuffledEnvelopes = gameState.shuffledOrder
      .map(id => envelopes.find(e => e.id === id))
      .filter(Boolean) as Envelope[];
    
    return shuffledEnvelopes.map((envelope, index) => ({
      ...envelope,
      displayPosition: index + 1,
      color: ["coral", "mint", "sky", "sage", "warm-yellow", "blush"][index % 6]
    }));
  };

  if (gameStateLoading || envelopesLoading) {
    return (
      <div className="min-h-screen bg-light-pink">
        <NavigationHeader />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <div className="text-2xl font-bold text-dark-blue">Loading game...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show welcome screen if game hasn't started or no envelopes configured
  if (!gameState?.gameStarted || envelopes.length === 0) {
    if (envelopes.length === 0) {
      return (
        <div className="min-h-screen bg-light-pink">
          <NavigationHeader />
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-dark-blue mb-4">No Prizes Configured</h1>
              <p className="text-gray-600 mb-6">
                Please go to the Admin Panel to set up your prizes before starting the game.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <WelcomeScreen 
        envelopes={envelopes}
        onStartGame={handleStartGame}
        onResetGame={handleResetGame}
      />
    );
  }

  // Show game completion screen if game is complete
  if (gameState?.isGameComplete && !showTimeUpModal) {
    return (
      <GameCompleteScreen
        finalPrize={gameState.finalPrize || "A wonderful anniversary surprise!"}
        cashedOut={gameState.cashedOut}
        onPlayAgain={handleResetGame}
      />
    );
  }

  const displayEnvelopes = getDisplayEnvelopes();

  // Calculate optimal grid layout
  const calculateGridLayout = (envelopeCount: number) => {
    if (envelopeCount <= 0) return { cols: 1, rows: 1 };
    
    // For 6 envelopes: 2x3, for 10: 2x5, for 12: 3x4
    if (envelopeCount === 6) return { cols: 3, rows: 2 };
    if (envelopeCount === 10) return { cols: 5, rows: 2 };
    if (envelopeCount === 12) return { cols: 4, rows: 3 };
    
    // For other counts, find the closest square root and distribute evenly
    const sqrt = Math.sqrt(envelopeCount);
    const cols = Math.ceil(sqrt);
    const rows = Math.ceil(envelopeCount / cols);
    
    return { cols, rows };
  };

  const gridLayout = calculateGridLayout(displayEnvelopes.length);
  
  // Map column counts to Tailwind classes
  const getGridColsClass = (cols: number) => {
    const gridMap: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2', 
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12'
    };
    return gridMap[cols] || 'grid-cols-3';
  };
  
  const gridColsClass = getGridColsClass(gridLayout.cols);

  return (
    <div className="min-h-screen bg-light-pink">
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

          {/* Game Timer */}
          <div className="flex justify-center mb-6">
            <GameTimer
              timerSeconds={gameConfig?.timerSeconds || 60}
              gameStarted={gameState?.gameStarted || false}
              onTimeUp={handleTimeUp}
              isGameComplete={gameState?.isGameComplete || false}
            />
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
        <div className={`grid ${gridColsClass} gap-4 md:gap-6 mb-8`}>
          {displayEnvelopes.map((envelope) => (
            <EnvelopeCard
              key={envelope.id}
              id={envelope.id}
              position={envelope.displayPosition}
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

      {/* Cash Out Modal */}
      <CashOutModal
        isOpen={showCashOutModal}
        prizeText={getCashOutPrize()}
        remainingTries={gameState?.remainingTries || 0}
        onCashOut={handleCashOut}
        onContinue={handleContinueGame}
      />

      {/* Time Up Modal */}
      <TimeUpModal
        isOpen={showTimeUpModal}
        onClose={() => {
          setShowTimeUpModal(false);
          // The GameCompleteScreen will show since isGameComplete is true
        }}
      />
    </div>
  );
}
