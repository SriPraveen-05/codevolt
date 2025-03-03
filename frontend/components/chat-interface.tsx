"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Send, User, Bot, Loader2 } from 'lucide-react'
import { diagnosticsAPI } from "@/lib/api-client"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface VehicleInfo {
  id: string
  make: string
  model: string
  year: string
  issue: string
}

export function ChatInterface({ vehicleInfo }: { vehicleInfo: VehicleInfo }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [diagnosis, setDiagnosis] = useState<any>(null)
  const [issueId, setIssueId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Get initial diagnosis when component mounts
  useEffect(() => {
    const getDiagnosis = async () => {
      if (!vehicleInfo.issue || !vehicleInfo.id) return;
      
      setLoading(true);
      try {
        const result = await diagnosticsAPI.diagnoseIssue({
          vehicle_id: vehicleInfo.id,
          issue_description: vehicleInfo.issue
        });
        
        setDiagnosis(result.diagnosis);
        setIssueId(result.issue_id);
        
        // Create initial message from AI
        const initialMessage = formatDiagnosisMessage(result.diagnosis);
        setMessages([
          {
            role: "assistant",
            content: initialMessage
          }
        ]);
      } catch (error) {
        console.error("Error getting diagnosis:", error);
        setMessages([
          {
            role: "assistant",
            content: "I'm sorry, I encountered an error while analyzing your vehicle issue. Please try again."
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    getDiagnosis();
  }, [vehicleInfo]);
  
  // Format diagnosis into a readable message
  const formatDiagnosisMessage = (diagnosis: any) => {
    if (!diagnosis) return "I couldn't analyze your issue. Please try again.";
    
    const severityMap: Record<string, string> = {
      "low": "low severity",
      "medium": "medium severity",
      "high": "high severity",
      "critical": "critical severity"
    };
    
    const severityText = severityMap[diagnosis.severity] || diagnosis.severity;
    
    let message = `I've analyzed your ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} and the issue you described: "${vehicleInfo.issue}".\n\n`;
    
    message += `Based on the symptoms, I've identified this as a **${severityText}** issue.\n\n`;
    
    if (diagnosis.likely_causes && diagnosis.likely_causes.length > 0) {
      message += "Likely causes:\n";
      diagnosis.likely_causes.forEach((cause: string, index: number) => {
        message += `- ${cause}\n`;
      });
      message += "\n";
    }
    
    if (diagnosis.explanation) {
      message += `${diagnosis.explanation}\n\n`;
    }
    
    if (diagnosis.recommended_actions && diagnosis.recommended_actions.length > 0) {
      message += "Recommended actions:\n";
      diagnosis.recommended_actions.forEach((action: string, index: number) => {
        message += `- ${action}\n`;
      });
      message += "\n";
    }
    
    message += "I've prepared a step-by-step repair guide. Would you like to see it, or do you have any questions about the diagnosis?";
    
    return message;
  };
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === "" || loading) return
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: input }])
    const userQuestion = input;
    setInput("")
    setLoading(true)
    
    try {
      // Check if user is asking for repair guide
      if (
        userQuestion.toLowerCase().includes("guide") || 
        userQuestion.toLowerCase().includes("steps") || 
        userQuestion.toLowerCase().includes("how to fix") ||
        userQuestion.toLowerCase().includes("repair")
      ) {
        if (issueId) {
          const repairGuide = await diagnosticsAPI.getRepairGuide(issueId, vehicleInfo.id);
          
          let response = "Here's a step-by-step repair guide:\n\n";
          
          if (repairGuide.raw_guide) {
            response += repairGuide.raw_guide;
          } else {
            // Format structured repair guide
            if (repairGuide["Safety Precautions"]) {
              response += "**Safety Precautions:**\n";
              response += repairGuide["Safety Precautions"] + "\n\n";
            }
            
            if (repairGuide["Tools Required"]) {
              response += "**Tools Required:**\n";
              response += repairGuide["Tools Required"] + "\n\n";
            }
            
            if (repairGuide["Parts Required"]) {
              response += "**Parts Required:**\n";
              response += repairGuide["Parts Required"] + "\n\n";
            }
            
            if (repairGuide["Step-by-Step Instructions"]) {
              response += "**Step-by-Step Instructions:**\n";
              response += repairGuide["Step-by-Step Instructions"] + "\n\n";
            }
            
            if (repairGuide["Estimated Time"]) {
              response += "**Estimated Time:**\n";
              response += repairGuide["Estimated Time"] + "\n\n";
            }
            
            if (repairGuide["Tips and Warnings"]) {
              response += "**Tips and Warnings:**\n";
              response += repairGuide["Tips and Warnings"];
            }
          }
          
          setMessages(prev => [...prev, { role: "assistant", content: response }]);
        } else {
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: "I'm sorry, I don't have a repair guide available for this issue yet." 
          }]);
        }
      } else {
        // For other questions, use the LLM directly
        // In a real app, you would send this to your backend
        // This is a simplified example
        let response = "";
        
        if (userQuestion.toLowerCase().includes("cost") || userQuestion.toLowerCase().includes("price")) {
          response = "The cost to replace an oxygen sensor typically ranges from $150 to $300, including parts and labor. The sensor itself costs between $50 and $150, while labor can be $100 to $150. If you're comfortable with DIY repairs, you could save on labor costs by replacing it yourself.";
        } else if (userQuestion.toLowerCase().includes("time") || userQuestion.toLowerCase().includes("long")) {
          response = "Replacing an oxygen sensor usually takes about 30-60 minutes for a professional mechanic. If you're doing it yourself and have limited experience, it might take 1-2 hours. The most time-consuming part can be locating the correct sensor, as modern vehicles have multiple oxygen sensors.";
        } else if (userQuestion.toLowerCase().includes("diy") || userQuestion.toLowerCase().includes("myself")) {
          response = "Yes, replacing an oxygen sensor is a relatively straightforward DIY job if you have basic mechanical skills. You'll need an oxygen sensor socket or wrench, which has a cutout to accommodate the sensor's wiring. Make sure the engine is cool before starting, and apply anti-seize compound to the threads of the new sensor before installation. I can provide more detailed steps if you'd like to proceed with a DIY repair.";
        } else {
          response = "Based on your question, I recommend checking the repair guide I've prepared. It provides step-by-step instructions for diagnosing and replacing the oxygen sensor. The guide includes visual references to help you locate the sensor and perform the replacement correctly. Would you like more specific information about any part of the repair process?";
        }
        
        setMessages(prev => [...prev, { role: "assistant", content: response }]);
      }
    } catch (error) {
      console.error("Error processing question:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I encountered an error while processing your question. Please try again." 
      }]);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Card className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
              <Avatar className="h-8 w-8">
                {message.role === "user" ? (
                  <>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/placeholder-bot.jpg" />
                    <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className={`rounded-lg px-4 py-2 ${
                message.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              }`}>
                {message.role === "assistant" && index === 0 && diagnosis && (
                  <div className="mb-2">
                    <Badge 
                      variant={diagnosis.severity === "high" || diagnosis.severity === "critical" ? "destructive" : "outline"} 
                      className="mb-1 flex w-fit items-center gap-1"
                    >
                      {(diagnosis.severity === "high" || diagnosis.severity === "critical") && (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      {diagnosis.severity.charAt(0).toUpperCase() + diagnosis.severity.slice(1)} Severity
                    </Badge>
                  </div>
                )}
                <div className="whitespace-pre-line">{message.content}</div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-bot.jpg" />
                <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <div className="rounded-lg px-4 py-2 bg-muted flex items-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Ask a question about your vehicle issue..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}