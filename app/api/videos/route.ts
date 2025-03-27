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
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession()

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { videoIds } = await request.json()

    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid video IDs" },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    const { error } = await supabase
      .from("music_videos")
      .delete()
      .in("id", videoIds)

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
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

export async function GET(request: Request) {
  try {
    const session = await getServerSession()
    const supabase = createServerClient()

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const incrementClick = searchParams.get("incrementClick")
    const videoId = searchParams.get("videoId")

    // If incrementing click count
    if (incrementClick === "true" && videoId) {
      const { data, error } = await supabase
        .rpc("increment_click_count", { video_id: videoId })

      if (error) {
        console.error("Supabase error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, data })
    }

    // Get all videos
    const { data, error } = await supabase
      .from("music_videos")
      .select("*")
      .order("click_count", { ascending: false })
      .order("created_at", { ascending: false })

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
      { status: 500 }
    )
  }
}

