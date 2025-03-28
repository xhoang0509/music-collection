"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { getYoutubeVideoId, getYoutubeEmbedUrl } from "@/lib/utils"
import { Play, Eye } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

interface MusicVideo {
  id: string
  youtube_url: string
  thumbnail: string
  title: string
  created_at: string
  click_count: number
}

interface MusicCardProps {
  video: MusicVideo
}

export function MusicCard({ video }: MusicCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const videoId = getYoutubeVideoId(video.youtube_url)
  const embedUrl = videoId ? getYoutubeEmbedUrl(videoId) : ""
  const router = useRouter()

  const handleClick = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      // Increment click count
      await fetch(`/api/videos?incrementClick=true&videoId=${video.id}`)
      
      // Open dialog and refresh the page to update click count
      setIsOpen(true)
      router.refresh()
    } catch (error) {
      console.error("Error incrementing click count:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-hidden group transition-all duration-300 hover:shadow-lg">
        <DialogTrigger className="w-full text-left" onClick={handleClick}>
          <div className="relative aspect-video">
            <Image
              src={video.thumbnail || "/placeholder.svg?height=720&width=1280"}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Play className="w-12 h-12 text-white" />
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium line-clamp-2">{video.title}</h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>{video.click_count || 0} views</span>
            </div>
          </CardContent>
        </DialogTrigger>
      </Card>
      <DialogContent className="sm:max-w-[800px] p-0">
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  )
}

