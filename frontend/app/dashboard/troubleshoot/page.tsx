"use client"

import type React from "react"

import { useState } from "react"
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

// Placeholder for 3D Visualization component
const ThreeDVisualization = () => {
  return (
    <div>
      {/* Placeholder for 3D visualization */}
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
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
                <CardDescription>
                  Provide details about your vehicle and the problem you're experiencing
                </CardDescription>
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
                      placeholder="Describe the problem you're experiencing in detail. Include any symptoms, when it occurs, and any relevant information."
                      className="min-h-[150px]"
                      value={vehicleInfo.issue}
                      onChange={(e) => setVehicleInfo({ ...vehicleInfo, issue: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Car className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      You can also connect your OBD-II scanner for more accurate diagnostics
                    </span>
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

                <TabsContent value="repair" className="pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Step-by-Step Repair Guide</CardTitle>
                      <CardDescription>
                        Follow these steps to diagnose and fix the issue with your {vehicleInfo.year} {vehicleInfo.make}{" "}
                        {vehicleInfo.model}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            1
                          </div>
                          <h3 className="font-bold">Verify the Check Engine Light</h3>
                        </div>
                        <p className="text-muted-foreground ml-12">
                          Confirm that the check engine light is illuminated on your dashboard. This indicates that the
                          vehicle's onboard diagnostic system has detected an issue.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            2
                          </div>
                          <h3 className="font-bold">Locate the Oxygen Sensor</h3>
                        </div>
                        <p className="text-muted-foreground ml-12">
                          The oxygen sensor is typically located in the exhaust manifold or exhaust pipe. Your vehicle
                          has multiple oxygen sensors. The OBD-II scanner has indicated that the issue is with the Bank
                          1 Sensor 1.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            3
                          </div>
                          <h3 className="font-bold">Inspect the Sensor and Wiring</h3>
                        </div>
                        <p className="text-muted-foreground ml-12">
                          Check the oxygen sensor and its wiring for any visible damage, corrosion, or loose
                          connections. Ensure the connector is securely attached.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            4
                          </div>
                          <h3 className="font-bold">Replace the Oxygen Sensor</h3>
                        </div>
                        <p className="text-muted-foreground ml-12">
                          If the sensor is faulty, it will need to be replaced. Use an oxygen sensor socket or wrench to
                          remove the old sensor. Apply anti-seize compound to the threads of the new sensor before
                          installation.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            5
                          </div>
                          <h3 className="font-bold">Clear the Error Code</h3>
                        </div>
                        <p className="text-muted-foreground ml-12">
                          After replacing the sensor, use an OBD-II scanner to clear the error code. This will turn off
                          the check engine light if the issue has been resolved.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Print Guide</Button>
                      <Button>Mark as Complete</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="visualization" className="pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>3D Visualization</CardTitle>
                      <CardDescription>Interactive 3D model showing the location of the oxygen sensor</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video w-full rounded-md border bg-muted flex items-center justify-center">
                        <ThreeDVisualization />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button variant="outline">Toggle AR View</Button>
                    </CardFooter>
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

