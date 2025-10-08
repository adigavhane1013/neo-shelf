import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube } from "lucide-react";

interface Video {
  id: string;
  title: string;
}

interface VideoListProps {
  videos: Video[];
}

export const VideoList = ({ videos }: VideoListProps) => {
  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Youtube className="h-6 w-6 text-destructive" />
        <h2 className="text-2xl font-bold">Related Videos</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="aspect-video bg-muted">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <CardHeader>
              <CardTitle className="text-sm line-clamp-2">{video.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};
