"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Car, BookOpen, Shield, Gauge } from "lucide-react"
import YouTubeEmbed from "@/components/YouTubeEmbed" // ✅ Correct import

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Car className="h-6 w-6" />
            <span className="text-xl font-bold">SMART AUTO SYSTEM</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">How It Works</Link>
            <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  AI-Powered Vehicle Troubleshooting & Learning
                </h1>
                <p className="text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                  Get instant solutions for vehicle issues with our AI-powered platform. Learn repair procedures with
                  interactive step-by-step tutorials and real-time visualization.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-1.5">
                      Start Troubleshooting
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">Learn More</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Repair Guide Section with YouTube Video */}
        <section id="repair-guide" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Repair Guide</h2>
              <p className="max-w-[900px] mx-auto text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                Learn how to repair your vehicle step-by-step with our interactive guides and video tutorials.
              </p>
            </div>
            <div className="mt-12">
              <Tabs defaultValue="video">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="video">Video Guide</TabsTrigger>
                  <TabsTrigger value="steps">Step-by-Step Guide</TabsTrigger>
                </TabsList>

                {/* YouTube Video Guide */}
                <TabsContent value="video" className="pt-6">
  <Card>
    <CardHeader>
      <CardTitle>Watch the Repair Guide</CardTitle>
      <CardDescription>Follow along with a professional repair tutorial.</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Direct iframe test */}
      <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/9RMoWlhb3X4"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </CardContent>
  </Card>
</TabsContent>;


                {/* Step-by-Step Repair Guide */}
                <TabsContent value="video" className="pt-6">
  <Card>
    <CardHeader>
      <CardTitle>Watch the Repair Guide</CardTitle>
      <CardDescription>Follow along with a professional repair tutorial.</CardDescription>
    </CardHeader>
    <CardContent>
      {/* Direct iframe test */}
      <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/xb-ITd4sJIY"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </CardContent>
  </Card>
</TabsContent>;

              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
