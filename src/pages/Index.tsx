import { useState, useEffect, useRef } from "react";
import { Brain, Sparkles, Loader2, CheckCircle, AlertCircle, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AgentCard } from "@/components/AgentCard";
import { FinalRecommendation } from "@/components/FinalRecommendation";
import { ExampleQueries } from "@/components/ExampleQueries";
import { HowItWorks } from "@/components/HowItWorks";
import { ConfidenceMeter } from "@/components/ConfidenceMeter";
import { HistorySidebar } from "@/components/HistorySidebar";
import { SmartFollowUps } from "@/components/SmartFollowUps";
import { SpeedBanner } from "@/components/SpeedBanner";
import { toast } from "@/hooks/use-toast";

interface AgentResponse {
  agent: string;
  role: string;
  icon: string;
  response: string;
  color: string;
  model?: string;
}

interface HistoryItem {
  id: string;
  query: string;
  timestamp: number;
  agentResponses: AgentResponse[];
  finalRecommendation: string;
  processingTime: string | null;
}

const Index = () => {
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [agentResponses, setAgentResponses] = useState<AgentResponse[]>([]);
  const [finalRecommendation, setFinalRecommendation] = useState("");
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleAnalyze = async () => {
    if (!query.trim()) return;

    setIsProcessing(true);
    setAgentResponses([]);
    setFinalRecommendation("");
    setError("");
    setCurrentStatus("🚀 Activating agent swarm...");
    setStartTime(Date.now());
    setEndTime(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-query`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ query }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to connect to analysis service');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'status') {
                setCurrentStatus(data.message);
              } else if (data.type === 'agent_response') {
                setAgentResponses((prev) => [...prev, data.data]);
              } else if (data.type === 'final_response') {
                setFinalRecommendation(data.data.response);
                setEndTime(Date.now());
              } else if (data.type === 'complete') {
                setCurrentStatus(data.message);
                setIsProcessing(false);
                toast({
                  title: "Analysis Complete",
                  description: "Your multi-agent analysis is ready.",
                });
              } else if (data.type === 'error') {
                setError(data.message);
                setIsProcessing(false);
                toast({
                  title: "Error",
                  description: data.message,
                  variant: "destructive",
                });
              }
            } catch (e) {
              console.error('Failed to parse SSE message:', e);
            }
          }
        }
      }

    } catch (err) {
      setError("Failed to connect to analysis service. Please try again.");
      setIsProcessing(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the analysis service.",
        variant: "destructive",
      });
      console.error('Analysis error:', err);
    }
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setQuery(item.query);
    setAgentResponses(item.agentResponses);
    setFinalRecommendation(item.finalRecommendation);
    setError("");
    setIsProcessing(false);
    // Calculate times for display
    if (item.processingTime) {
      const time = parseFloat(item.processingTime) * 1000;
      setStartTime(Date.now() - time);
      setEndTime(Date.now());
    }
    toast({
      title: "History Loaded",
      description: "Previous analysis restored.",
    });
  };

  const handleSelectFollowUp = (question: string) => {
    setQuery(question);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast({
      title: "Follow-up Selected",
      description: "Click 'Activate Agent Swarm' to analyze.",
    });
  };

  const processingTime = startTime && endTime ? ((endTime - startTime) / 1000).toFixed(1) : null;

  return (
    <div className="min-h-screen py-8 px-4">
      {/* History Sidebar */}
      <HistorySidebar
        onLoadHistory={handleLoadHistory}
        currentQuery={query}
        currentResponses={agentResponses}
        currentRecommendation={finalRecommendation}
        currentProcessingTime={processingTime}
        isProcessing={isProcessing}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-fadeIn">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-16 h-16 text-primary animate-pulse-slow" />
            <Sparkles className="w-8 h-8 text-secondary -ml-4 -mt-8 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">MindMesh AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Multi-Agent AI Research System
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Powered by Gemini AI</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>FREE until Oct 6</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
              <Users className="w-4 h-4 text-pink-400" />
              <span>6 Specialized Agents</span>
            </div>
          </div>
        </header>

        {/* Query Input */}
        <div className="max-w-3xl mx-auto mb-12 animate-slideUp">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <label className="block text-lg font-semibold mb-3">
              Ask a Complex Question
            </label>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Should I switch careers to AI/ML engineering?"
              className="min-h-[120px] bg-input border-border text-foreground resize-none mb-4"
              disabled={isProcessing}
            />
            <Button
              onClick={handleAnalyze}
              disabled={isProcessing || !query.trim()}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold py-6 text-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Activate Agent Swarm
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Example Queries */}
        {!isProcessing && agentResponses.length === 0 && (
          <ExampleQueries onSelectQuery={setQuery} />
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-destructive/10 border border-destructive/50 rounded-xl flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-destructive font-semibold">Connection Error</p>
              <p className="text-sm text-destructive/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Status Bar */}
        {isProcessing && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-card border border-primary/50 rounded-xl flex items-center gap-3 animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <p className="text-sm font-medium">{currentStatus}</p>
          </div>
        )}

        {/* Agent Responses Grid */}
        {agentResponses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {agentResponses.map((agent, idx) => (
              <AgentCard
                key={idx}
                agent={agent.agent}
                role={agent.role}
                icon={agent.icon}
                response={agent.response}
                color={agent.color}
                model={agent.model}
                delay={idx * 0.1}
              />
            ))}
          </div>
        )}

        {/* Speed Banner - Show after completion */}
        {processingTime && finalRecommendation && !isProcessing && (
          <SpeedBanner 
            processingTime={processingTime} 
            agentCount={agentResponses.length || 6} 
          />
        )}

        {/* Final Recommendation */}
        {finalRecommendation && (
          <>
            {/* Confidence Meter */}
            <div className="max-w-4xl mx-auto">
              <ConfidenceMeter recommendation={finalRecommendation} />
            </div>

            <FinalRecommendation
              recommendation={finalRecommendation}
              processingTime={processingTime}
              agentCount={agentResponses.length}
            />

            {/* Smart Follow-ups */}
            <div className="max-w-4xl mx-auto mb-12">
              <SmartFollowUps
                query={query}
                recommendation={finalRecommendation}
                onSelectFollowUp={handleSelectFollowUp}
              />
            </div>
          </>
        )}

        {/* How It Works */}
        {!isProcessing && agentResponses.length === 0 && <HowItWorks />}
      </div>
    </div>
  );
};

export default Index;
