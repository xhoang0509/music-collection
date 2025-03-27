import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { createServerClient } from "@/lib/supabase"
import { getYoutubeVideoId, getYoutubeThumbnail } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { youtubeUrl, title } = await request.json()

    // Validate YouTube URL
    const videoId = getYoutubeVideoId(youtubeUrl)
    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })
    }

    // Get thumbnail
    const thumbnail = getYoutubeThumbnail(videoId)

    // Insert into database
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("music_videos")
      .insert({
        youtube_url: youtubeUrl,
        thumbnail,
        title,
      })
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 },
    )
  }
}

