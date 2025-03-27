import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { createServerClient } from "@/lib/supabase"
import { getYoutubeVideoId, getYoutubeThumbnail } from "@/lib/utils"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { youtubeUrl, isHidden } = await request.json()

    const supabase = createServerClient()

    // If updating YouTube URL
    if (youtubeUrl) {
      const videoId = getYoutubeVideoId(youtubeUrl)
      if (!videoId) {
        return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 })
      }

      const thumbnail = getYoutubeThumbnail(videoId)

      const { data, error } = await supabase
        .from("music_videos")
        .update({
          youtube_url: youtubeUrl,
          thumbnail,
        })
        .eq("id", params.id)
        .select()

      if (error) {
        console.error("Supabase error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, data })
    }

    // If updating visibility
    if (typeof isHidden === "boolean") {
      const { data, error } = await supabase
        .from("music_videos")
        .update({ is_hidden: isHidden })
        .eq("id", params.id)
        .select()

      if (error) {
        console.error("Supabase error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, data })
    }

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Server error",
      },
      { status: 500 }
    )
  }
} 