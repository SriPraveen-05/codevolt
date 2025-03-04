"use client"

import  React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Car, Loader2 } from "lucide-react"
import Link from "next/link"
import { ChatInterface } from "@/components/chat-interface"


// Placeholder 3D Visualization component
const ThreeDVisualization = () => {
  return (
    <div>
      {/* Replace this with a Three.js scene if needed */}
      3D Visualization Placeholder
    </div>
  )
}

export default function TroubleshootPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [vehicleInfo, setVehicleInfo] = useState({
    make: "",
    model: "",
    year: "",
    issue: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(2)
    }, 1500)
  }

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
                          <SelectItem value="chevrolet">Chevrolet</SelectItem>
                          <SelectItem value="bmw">BMW</SelectItem>
                          <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                          <SelectItem value="audi">Audi</SelectItem>
                          <SelectItem value="nissan">Nissan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Vehicle Model</Label>
                      <Input
                        id="model"
                        placeholder="e.g. Camry, Civic"
                        value={vehicleInfo.model}
                        onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        placeholder="e.g. 2018"
                        value={vehicleInfo.year}
                        onChange={(e) => setVehicleInfo({ ...vehicleInfo, year: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="issue">Describe the Issue</Label>
                    <Textarea
                      id="issue"
                      placeholder="Describe the problem you're experiencing in detail."
                      className="min-h-[150px]"
                      value={vehicleInfo.issue}
                      onChange={(e) => setVehicleInfo({ ...vehicleInfo, issue: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Issue...
                      </>
                    ) : (
                      "Get AI Diagnosis"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Tabs defaultValue="chat">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="chat">AI Assistant</TabsTrigger>
                  <TabsTrigger value="repair">Repair Guide</TabsTrigger>
                  <TabsTrigger value="visualization">3D Visualization</TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="pt-6">
                  <ChatInterface vehicleInfo={vehicleInfo} />
                </TabsContent>

                <TabsContent value="visualization" className="pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>3D Visualization</CardTitle>
                      <CardDescription>Interactive 3D model showing the vehicle components</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video w-full rounded-md border bg-muted flex items-center justify-center">
                        <ThreeDVisualization />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

