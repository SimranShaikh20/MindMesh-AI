import { useState, useEffect, useRef } from "react";
import { Brain, Sparkles, Loader2, CheckCircle, AlertCircle, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AgentCard } from "@/components/AgentCard";
import { FinalRecommendation } from "@/components/FinalRecommendation";
import { ExampleQueries } from "@/components/ExampleQueries";
import { HowItWorks } from "@/components/HowItWorks";
import { toast } from "@/hooks/use-toast";

interface AgentResponse {
  agent: string;
  role: string;
  icon: string;
  response: string;
  color: string;
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
      // For now, simulate the agent responses until backend is set up
      // This will be replaced with actual WebSocket connection to Lovable Cloud
      simulateAgentResponses();
    } catch (err) {
      setError("Failed to connect to backend. Please ensure Lovable Cloud is enabled.");
      setIsProcessing(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the analysis service.",
        variant: "destructive",
      });
    }
  };

  const simulateAgentResponses = () => {
    // Simulate Research Agent
    setTimeout(() => {
      setCurrentStatus("📊 Research Agent analyzing...");
      setAgentResponses((prev) => [
        ...prev,
        {
          agent: "Research Agent",
          role: "Data & Statistics Analyst",
          icon: "📊",
          response:
            "Based on current market data, the decision involves multiple quantifiable factors. Recent trends show 67% positive indicators in this area, with a 23% growth rate over the past year. Industry reports suggest this aligns with emerging patterns.",
          color: "blue",
        },
      ]);
    }, 800);

    // Simulate Pro Advocate
    setTimeout(() => {
      setCurrentStatus("💡 Pro Advocate building case...");
      setAgentResponses((prev) => [
        ...prev,
        {
          agent: "Pro Advocate",
          role: "Opportunity Finder",
          icon: "💡",
          response:
            "This presents a significant opportunity for growth and development. The potential benefits include increased efficiency, better outcomes, and alignment with future trends. Taking action now could position you advantageously for upcoming opportunities.",
          color: "green",
        },
      ]);
    }, 1600);

    // Simulate Con Advocate
    setTimeout(() => {
      setCurrentStatus("😈 Con Advocate identifying risks...");
      setAgentResponses((prev) => [
        ...prev,
        {
          agent: "Con Advocate",
          role: "Risk Assessor",
          icon: "😈",
          response:
            "Important risks to consider include potential financial implications, time investment, and uncertainty in outcomes. Market volatility and changing conditions could impact results. The opportunity cost of not pursuing alternatives should be carefully weighed.",
          color: "red",
        },
      ]);
    }, 2400);

    // Simulate Bias Checker
    setTimeout(() => {
      setCurrentStatus("🎯 Checking for biases...");
      setAgentResponses((prev) => [
        ...prev,
        {
          agent: "Bias Checker",
          role: "Critical Analyst",
          icon: "🎯",
          response:
            "The Pro Advocate shows optimism bias by emphasizing benefits without quantifying probabilities. The Research Agent presents data selectively. Both perspectives exhibit confirmation bias toward predetermined conclusions. More balanced probability analysis needed.",
          color: "yellow",
        },
      ]);
    }, 3200);

    // Simulate Fact Checker
    setTimeout(() => {
      setCurrentStatus("✅ Verifying claims...");
      setAgentResponses((prev) => [
        ...prev,
        {
          agent: "Fact Checker",
          role: "Truth Verifier",
          icon: "✅",
          response:
            "The Research Agent's 67% statistic requires source verification. Pro Advocate's 'significant opportunity' claim is subjective and unquantified. Con Advocate's risk assessment lacks specific probability data. Recommend cross-referencing claims with primary sources.",
          color: "purple",
        },
      ]);
    }, 4000);

    // Simulate Synthesizer
    setTimeout(() => {
      setCurrentStatus("🎓 Synthesizing final recommendation...");
      const synthesis = `**Recommendation:** Proceed with cautious optimism, implementing a phased approach.

**Key Reasoning:**
• Market data shows positive trends, but requires validation from multiple sources
• Potential benefits outweigh risks when approached methodically
• Risk mitigation strategies can address identified concerns

**Action Steps:**
1. Conduct deeper research to verify statistical claims and data sources
2. Develop a pilot program or small-scale test to validate assumptions
3. Create contingency plans for identified risks and establish clear metrics
4. Set review milestones at 30, 60, and 90 days to assess progress

**Confidence Level:** 7/10 - Moderate confidence based on available information. Higher certainty requires additional data validation and market research.

**Important Considerations:**
Be prepared for market volatility and changing conditions. Maintain flexibility in your approach and be ready to pivot if key assumptions prove incorrect. Keep opportunity costs in mind when allocating resources.`;

      setFinalRecommendation(synthesis);
      setCurrentStatus("✅ Analysis complete!");
      setEndTime(Date.now());
      setIsProcessing(false);

      toast({
        title: "Analysis Complete",
        description: "Your multi-agent analysis is ready.",
      });
    }, 4800);
  };

  const processingTime = startTime && endTime ? ((endTime - startTime) / 1000).toFixed(1) : null;

  return (
    <div className="min-h-screen py-8 px-4">
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
              <span>Powered by AI</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Meta Llama Models</span>
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
                delay={idx * 0.1}
              />
            ))}
          </div>
        )}

        {/* Final Recommendation */}
        {finalRecommendation && (
          <FinalRecommendation
            recommendation={finalRecommendation}
            processingTime={processingTime}
            agentCount={agentResponses.length}
          />
        )}

        {/* How It Works */}
        {!isProcessing && agentResponses.length === 0 && <HowItWorks />}
      </div>
    </div>
  );
};

export default Index;
