"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getYoutubeVideoId } from "@/lib/utils"

interface Video {
  id: string
  title: string
  youtube_url: string
  thumbnail: string
  is_hidden: boolean
  click_count: number
}

export function VideoManagement({ videos }: { videos: Video[] }) {
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [newUrl, setNewUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSelectVideo = (videoId: string) => {
    setSelectedVideos(prev =>
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    )
  }

  const handleSelectAll = () => {
    setSelectedVideos(prev =>
      prev.length === videos.length
        ? []
        : videos.map(v => v.id)
    )
  }

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video)
    setNewUrl(video.youtube_url)
  }

  const handleUpdateVideo = async () => {
    if (!editingVideo) return

    const videoId = getYoutubeVideoId(newUrl)
    if (!videoId) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/videos/${editingVideo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl: newUrl }),
      })

      if (!response.ok) throw new Error("Failed to update video")

      toast({
        title: "Success!",
        description: "Video URL updated successfully",
      })

      setEditingVideo(null)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update video",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteVideos = async () => {
    if (selectedVideos.length === 0) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/videos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoIds: selectedVideos }),
      })

      if (!response.ok) throw new Error("Failed to delete videos")

      toast({
        title: "Success!",
        description: "Selected videos deleted successfully",
      })

      setSelectedVideos([])
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete videos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleVisibility = async (videoId: string, isHidden: boolean) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden }),
      })

      if (!response.ok) throw new Error("Failed to update video visibility")

      toast({
        title: "Success!",
        description: `Video ${isHidden ? "hidden" : "unhidden"} successfully`,
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update video visibility",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Videos</h2>
        <div className="flex items-center gap-4">
          <Button
            variant="destructive"
            onClick={handleDeleteVideos}
            disabled={selectedVideos.length === 0 || isLoading}
          >
            Delete Selected ({selectedVideos.length})
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectedVideos.length === videos.length}
            onCheckedChange={handleSelectAll}
          />
          <Label htmlFor="select-all">Select All</Label>
        </div>

        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <Checkbox
                id={`video-${video.id}`}
                checked={selectedVideos.includes(video.id)}
                onCheckedChange={() => handleSelectVideo(video.id)}
              />
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-24 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-medium">{video.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Clicks: {video.click_count}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Switch
                checked={video.is_hidden}
                onCheckedChange={(checked) => handleToggleVisibility(video.id, checked)}
                disabled={isLoading}
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => handleEditVideo(video)}
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Video URL</DialogTitle>
                    <DialogDescription>
                      Update the YouTube URL for this video
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="youtube-url">YouTube URL</Label>
                      <Input
                        id="youtube-url"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleUpdateVideo}
                      disabled={isLoading || !newUrl}
                    >
                      {isLoading ? "Updating..." : "Update URL"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 