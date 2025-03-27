import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { AddVideoForm } from "@/components/add-video-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"

export default async function AdminPage() {
  try {
    const session = await getServerSession()

    // If not authenticated, redirect to login
    if (!session) {
      redirect("/login")
    }

    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Music Video</CardTitle>
                <CardDescription>Enter a YouTube URL and title to add a new video to your collection</CardDescription>
              </CardHeader>
              <CardContent>
                <AddVideoForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>How to add videos to your collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">1. Find a YouTube video</h3>
                  <p className="text-muted-foreground">Search for your favorite music video on YouTube</p>
                </div>
                <div>
                  <h3 className="font-medium">2. Copy the video URL</h3>
                  <p className="text-muted-foreground">
                    Copy the full URL from your browser address bar or from the share button
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">3. Add a descriptive title</h3>
                  <p className="text-muted-foreground">
                    Enter a title that will help you identify the video in your collection
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">4. Submit the form</h3>
                  <p className="text-muted-foreground">Click the "Add to Collection" button to save the video</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error("Admin page error:", error)
    redirect("/login?error=ServerError")
  }
}

