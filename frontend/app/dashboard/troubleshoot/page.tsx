"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

// Placeholder 3D Visualization component
const ThreeDVisualization = () => {
  return <div>3D Visualization Placeholder</div>;
};

const LLMAssistant = ({ vehicleInfo }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/query", { message: input });
      const botMessage = { role: "bot", content: response.data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching LLM response:", error);
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto space-y-4 border p-4 rounded-md">
      <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-gray-100 rounded-md">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span className={`p-2 rounded-md ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <Input type="text" placeholder="Ask AI Assistant..." value={input} onChange={(e) => setInput(e.target.value)} />
        <Button onClick={sendMessage} disabled={loading}>{loading ? "Loading..." : "Send"}</Button>
      </div>
    </div>
  );
};

export default function TroubleshootPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState({ make: "", model: "", year: "", issue: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Troubleshooting</h1>
            <p className="text-muted-foreground">Get AI-powered solutions for your vehicle issues</p>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Describe Your Issue</CardTitle>
                <CardDescription>Provide details about your vehicle and the problem you're experiencing</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="make">Vehicle Make</Label>
                      <Select onValueChange={(value) => setVehicleInfo({ ...vehicleInfo, make: value })} required>
                        <SelectTrigger id="make">
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="toyota">Toyota</SelectItem>
                          <SelectItem value="honda">Honda</SelectItem>
                          <SelectItem value="ford">Ford</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Vehicle Model</Label>
                      <Input id="model" placeholder="e.g. Camry, Civic" value={vehicleInfo.model} onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input id="year" placeholder="e.g. 2018" value={vehicleInfo.year} onChange={(e) => setVehicleInfo({ ...vehicleInfo, year: e.target.value })} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue">Describe the Issue</Label>
                    <Textarea id="issue" placeholder="Describe the problem you're experiencing in detail." className="min-h-[150px]" value={vehicleInfo.issue} onChange={(e) => setVehicleInfo({ ...vehicleInfo, issue: e.target.value })} required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading} className="w-full">{loading ? "Analyzing Issue..." : "Get AI Diagnosis"}</Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {step === 2 && (
            <Tabs defaultValue="chat">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat">AI Assistant</TabsTrigger>
                <TabsTrigger value="visualization">3D Visualization</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="pt-6">
                <LLMAssistant vehicleInfo={vehicleInfo} />
              </TabsContent>
              <TabsContent value="visualization" className="pt-6">
                <ThreeDVisualization />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}
