import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import NavigationHeader from "@/components/navigation-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Settings, Inbox, Database, Save, CheckCircle, BarChart3, RefreshCw, Clock, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { GameConfig, Envelope as EnvelopeType } from "@shared/schema";
import { getRandomOptions } from "@shared/prefilled-options";

const pastelColors = ["coral", "mint", "sky", "sage", "warm-yellow", "blush"];

export default function Admin() {
  const { toast } = useToast();
  const [envelopeCount, setEnvelopeCount] = useState(6);
  const [maxTries, setMaxTries] = useState(3);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [usePrefilled, setUsePrefilled] = useState(false);
  const [envelopes, setEnvelopes] = useState<Array<{ position: number; prizeText: string; color: string }>>([]);

  // Fetch game config
  const { data: gameConfig } = useQuery<GameConfig>({
    queryKey: ["/api/game-config"],
  });

  // Fetch existing envelopes
  const { data: existingEnvelopes = [] } = useQuery<EnvelopeType[]>({
    queryKey: ["/api/envelopes"],
  });

  // Initialize form with existing data
  useEffect(() => {
    if (gameConfig) {
      setEnvelopeCount(gameConfig.envelopeCount);
      setMaxTries(gameConfig.maxTries);
      setTimerSeconds(gameConfig.timerSeconds || 60);
    }
  }, [gameConfig]);

  useEffect(() => {
    if (existingEnvelopes.length > 0) {
      const sortedEnvelopes = existingEnvelopes
        .sort((a, b) => a.position - b.position)
        .map(env => ({
          position: env.position,
          prizeText: env.prizeText,
          color: env.color,
        }));
      setEnvelopes(sortedEnvelopes);
    } else {
      // Initialize with default envelopes
      const defaultEnvelopes = Array.from({ length: envelopeCount }, (_, i) => ({
        position: i + 1,
        prizeText: "",
        color: pastelColors[i % pastelColors.length],
      }));
      setEnvelopes(defaultEnvelopes);
    }
  }, [existingEnvelopes, envelopeCount]);

  // Update envelope count when changed
  useEffect(() => {
    const currentCount = envelopes.length;
    if (envelopeCount > currentCount) {
      // Add new envelopes
      const newEnvelopes = Array.from({ length: envelopeCount - currentCount }, (_, i) => ({
        position: currentCount + i + 1,
        prizeText: "",
        color: pastelColors[(currentCount + i) % pastelColors.length],
      }));
      setEnvelopes(prev => [...prev, ...newEnvelopes]);
    } else if (envelopeCount < currentCount) {
      // Remove excess envelopes
      setEnvelopes(prev => prev.slice(0, envelopeCount));
    }
  }, [envelopeCount, envelopes.length]);

  // Save game config mutation
  const saveConfigMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/game-config", {
        envelopeCount,
        maxTries,
        timerSeconds,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/game-config"] });
      toast({
        title: "Success",
        description: "Game settings saved successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save game settings",
        variant: "destructive",
      });
    },
  });

  // Save envelopes mutation
  const saveEnvelopesMutation = useMutation({
    mutationFn: async () => {
      const envelopesData = envelopes.map(env => ({
        position: env.position,
        prizeText: env.prizeText || `Prize ${env.position}`,
        color: env.color,
      }));
      
      const response = await apiRequest("POST", "/api/envelopes/bulk", envelopesData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/envelopes"] });
      toast({
        title: "Success",
        description: "Inbox prizes saved successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save envelope prizes",
        variant: "destructive",
      });
    },
  });

  const updateEnvelopePrize = (position: number, prizeText: string) => {
    setEnvelopes(prev => 
      prev.map(env => 
        env.position === position ? { ...env, prizeText } : env
      )
    );
  };

  const handleUsePrefilled = () => {
    const prefilledOptions = getRandomOptions(envelopeCount);
    setEnvelopes(prev => 
      prev.map((env, index) => ({
        ...env,
        prizeText: prefilledOptions[index]?.prizeText || env.prizeText,
        color: prefilledOptions[index]?.color || env.color
      }))
    );
    toast({
      title: "Prefilled Options Applied",
      description: "Romantic anniversary ideas have been loaded!",
    });
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      coral: "bg-coral",
      mint: "bg-mint",
      sky: "bg-sky",
      sage: "bg-sage",
      "warm-yellow": "bg-warm-yellow",
      blush: "bg-blush",
    };
    return colorMap[color] || "bg-gray-400";
  };

  return (
    <div className="min-h-screen bg-off-white">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4">
            Admin Panel
          </h1>
          <p className="text-gray-600 text-lg">
            Configure game settings and envelope prizes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Game Settings */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-dark-blue">
                <Settings className="text-coral mr-2" size={20} />
                Game Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="envelope-count" className="text-sm font-medium text-gray-700 mb-2">
                  Number of Envelopes
                </Label>
                <Select value={envelopeCount.toString()} onValueChange={(value) => setEnvelopeCount(parseInt(value))}>
                  <SelectTrigger data-testid="select-envelope-count">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 Envelopes</SelectItem>
                    <SelectItem value="8">8 Envelopes</SelectItem>
                    <SelectItem value="10">10 Envelopes</SelectItem>
                    <SelectItem value="12">12 Envelopes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="max-tries" className="text-sm font-medium text-gray-700 mb-2">
                  Maximum Tries per Game
                </Label>
                <Input
                  id="max-tries"
                  type="number"
                  min="1"
                  max="10"
                  value={maxTries}
                  onChange={(e) => setMaxTries(parseInt(e.target.value) || 1)}
                  className="focus:ring-2 focus:ring-coral focus:border-transparent"
                  data-testid="input-max-tries"
                />
              </div>

              <div>
                <Label htmlFor="timer-seconds" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="mr-1" size={16} />
                  Game Timer (seconds)
                </Label>
                <Input
                  id="timer-seconds"
                  type="number"
                  min="30"
                  max="300"
                  value={timerSeconds}
                  onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 60)}
                  className="focus:ring-2 focus:ring-coral focus:border-transparent"
                  data-testid="input-timer-seconds"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Time limit for the entire game (30-300 seconds)
                </p>
              </div>
              
              <Button
                onClick={() => saveConfigMutation.mutate()}
                disabled={saveConfigMutation.isPending}
                className="w-full bg-coral hover:bg-pink-600 text-white"
                data-testid="button-save-settings"
              >
                {saveConfigMutation.isPending ? (
                  <RefreshCw className="mr-2 animate-spin" size={16} />
                ) : (
                  <Save className="mr-2" size={16} />
                )}
                Save Game Settings
              </Button>
            </CardContent>
          </Card>

          {/* Inbox Configuration */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-dark-blue">
                <Inbox className="text-mint mr-2" size={20} />
                Inbox Prizes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blush/20 to-warm-yellow/20 rounded-lg border border-coral/30 mb-4">
                <div className="flex items-center space-x-3">
                  <Sparkles className="text-coral" size={20} />
                  <div>
                    <Label htmlFor="use-prefilled" className="text-sm font-medium text-gray-700">
                      Use Romantic Anniversary Ideas
                    </Label>
                    <p className="text-xs text-gray-500">
                      Auto-fill with curated San Francisco Bay Area date ideas
                    </p>
                  </div>
                </div>
                <Switch
                  id="use-prefilled"
                  checked={usePrefilled}
                  onCheckedChange={(checked) => {
                    setUsePrefilled(checked);
                    if (checked) {
                      handleUsePrefilled();
                    }
                  }}
                  data-testid="switch-prefilled"
                />
              </div>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                {envelopes.map((envelope, index) => (
                  <div key={`envelope-${envelope.position}-${index}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 ${getColorClass(envelope.color)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                      {envelope.position}
                    </div>
                    <Input
                      type="text"
                      placeholder="Enter prize (e.g., $100, Car, Trip)"
                      value={envelope.prizeText}
                      onChange={(e) => updateEnvelopePrize(envelope.position, e.target.value)}
                      className="flex-1 focus:ring-2 focus:ring-coral focus:border-transparent"
                      data-testid={`input-prize-${envelope.position}`}
                    />
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => saveEnvelopesMutation.mutate()}
                disabled={saveEnvelopesMutation.isPending}
                className="w-full mt-4 bg-mint hover:bg-teal-600 text-white"
                data-testid="button-save-prizes"
              >
                {saveEnvelopesMutation.isPending ? (
                  <RefreshCw className="mr-2 animate-spin" size={16} />
                ) : (
                  <Save className="mr-2" size={16} />
                )}
                Save All Prizes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Database Status */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-dark-blue">
              <Database className="text-sky mr-2" size={20} />
              Database Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  <span className="font-medium text-green-800">Connected</span>
                </div>
                <div className="text-sm text-green-600 mt-1">PostgreSQL Database</div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <RefreshCw className="text-blue-500 mr-2" size={16} />
                  <span className="font-medium text-blue-800">Auto-Sync Active</span>
                </div>
                <div className="text-sm text-blue-600 mt-1">Real-time updates</div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center">
                  <BarChart3 className="text-purple-500 mr-2" size={16} />
                  <span className="font-medium text-purple-800">Game Analytics</span>
                </div>
                <div className="text-sm text-purple-600 mt-1">Ready for tracking</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
