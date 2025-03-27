import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { createServerClient } from "@/lib/supabase"
import { AddVideoForm } from "@/components/add-video-form"
import { VideoManagement } from "@/components/video-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"

export default async function AdminPage() {
  try {
    const session = await getServerSession()

    // If not authenticated, redirect to login
    if (!session) {
      redirect("/login")
    }

    // Fetch videos from Supabase
    const supabase = createServerClient()
    const { data: videos, error } = await supabase
      .from("music_videos")
      .select("*")
      .order("click_count", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching videos:", error)
      throw error
    }

    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid grid-cols-1 gap-6">
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
                <CardTitle>Manage Videos</CardTitle>
                <CardDescription>Edit, delete, or hide existing videos in your collection</CardDescription>
              </CardHeader>
              <CardContent>
                <VideoManagement videos={videos || []} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
                <CardDescription>How to manage your video collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">1. Adding Videos</h3>
                  <p className="text-muted-foreground">Use the form above to add new videos to your collection</p>
                </div>
                <div>
                  <h3 className="font-medium">2. Managing Videos</h3>
                  <p className="text-muted-foreground">
                    Use the management section to edit URLs, hide videos, or remove them from your collection
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">3. Tracking Engagement</h3>
                  <p className="text-muted-foreground">
                    The click count shows how many times each video has been viewed
                  </p>
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

