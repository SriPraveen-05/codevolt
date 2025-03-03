import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Car, AlertTriangle, Gauge, ArrowRight, Info } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Car className="h-6 w-6" />
            <span className="text-xl font-bold">SMART AUTO SUPPORT SYSTEM</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
              Dashboard
            </Link>
            <Link href="/dashboard/history" className="text-sm font-medium hover:underline underline-offset-4">
              History
            </Link>
            <Link href="/dashboard/vehicles" className="text-sm font-medium hover:underline underline-offset-4">
              My Vehicles
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Gauge className="mr-2 h-4 w-4" />
              Connect OBD-II
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Manage your vehicles and troubleshoot issues</p>
          </div>

          <Tabs defaultValue="troubleshoot">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="troubleshoot">Troubleshoot</TabsTrigger>
              <TabsTrigger value="vehicles">My Vehicles</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="troubleshoot" className="space-y-6 pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Start New Troubleshooting</CardTitle>
                    <CardDescription>Describe your vehicle issue and get AI-powered solutions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/dashboard/troubleshoot">
                      <Button className="w-full">
                        Start Troubleshooting
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Connect OBD-II Scanner</CardTitle>
                    <CardDescription>Get more accurate diagnostics by connecting your OBD-II scanner</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Gauge className="mr-2 h-4 w-4" />
                      Connect Scanner
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Recent Issues</h2>
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="flex items-center gap-2">
                      Engine Check Light
                      <Badge variant="destructive">High Severity</Badge>
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      <p>Toyota Camry 2018 - Reported 2 days ago</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-muted-foreground">Oxygen sensor malfunction detected</span>
                        <Link href="/dashboard/issues/1">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </AlertDescription>
                  </Alert>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle className="flex items-center gap-2">
                      Brake Noise
                      <Badge variant="outline">Low Severity</Badge>
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                      <p>Toyota Camry 2018 - Reported 1 week ago</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-muted-foreground">Squeaking noise when braking</span>
                        <Link href="/dashboard/issues/2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="vehicles" className="space-y-6 pt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Toyota Camry</CardTitle>
                    <CardDescription>2018 • Sedan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Mileage</span>
                          <span>45,230 mi</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Last Service</span>
                          <span>2 months ago</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Badge variant="outline" className="px-2 py-1">
                          <AlertTriangle className="mr-1 h-3 w-3 text-amber-500" />1 Active Issue
                        </Badge>
                        <Link href="/dashboard/vehicles/1">
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Honda Civic</CardTitle>
                    <CardDescription>2020 • Sedan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Mileage</span>
                          <span>28,450 mi</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Last Service</span>
                          <span>1 month ago</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <Badge variant="outline" className="px-2 py-1 text-green-500">
                          No Issues
                        </Badge>
                        <Link href="/dashboard/vehicles/2">
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle>Add New Vehicle</CardTitle>
                    <CardDescription>Register a new vehicle to your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      Add Vehicle
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6 pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Troubleshooting History</h2>
                  <Button variant="outline" size="sm">
                    Export History
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Engine Check Light</h3>
                        <p className="text-sm text-muted-foreground">Toyota Camry • March 15, 2023</p>
                      </div>
                      <Badge variant="destructive">High Severity</Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">Oxygen sensor malfunction detected</p>
                      <div className="flex justify-end mt-2">
                        <Link href="/dashboard/history/1">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Brake Noise</h3>
                        <p className="text-sm text-muted-foreground">Toyota Camry • March 8, 2023</p>
                      </div>
                      <Badge variant="outline">Low Severity</Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">Squeaking noise when braking</p>
                      <div className="flex justify-end mt-2">
                        <Link href="/dashboard/history/2">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Oil Change Reminder</h3>
                        <p className="text-sm text-muted-foreground">Honda Civic • February 20, 2023</p>
                      </div>
                      <Badge variant="outline">Maintenance</Badge>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">Regular maintenance reminder</p>
                      <div className="flex justify-end mt-2">
                        <Link href="/dashboard/history/3">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

