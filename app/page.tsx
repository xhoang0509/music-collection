import { createServerClient } from "@/lib/supabase"
import { MusicCard } from "@/components/music-card"
import { SiteHeader } from "@/components/site-header"

export const revalidate = 0

interface MusicVideo {
  id: string
  youtube_url: string
  thumbnail: string
  title: string
  created_at: string
  click_count: number
  is_hidden: boolean
}

export default async function HomePage() {
  const supabase = createServerClient()

  const { data: videos, error } = await supabase
    .from("music_videos")
    .select("*")
    .eq("is_hidden", false)
    .order("click_count", { ascending: false })
    .order("created_at", { ascending: false })

  const musicVideos = (videos as MusicVideo[]) || []

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold mb-8">My Music Collection</h1>

        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
            Failed to load music videos: {error.message}
          </div>
        )}

        {musicVideos.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-muted-foreground">No music videos in your collection yet</h2>
            <p className="mt-2 text-muted-foreground">Videos added by the admin will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {musicVideos.map((video) => (
              <MusicCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

