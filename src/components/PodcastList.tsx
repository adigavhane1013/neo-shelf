import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, ExternalLink } from "lucide-react";

interface Podcast {
  id: string;
  title: string;
  thumbnail?: string;
  listennotesUrl?: string;
  publisher?: string;
}

interface PodcastListProps {
  podcasts: Podcast[];
}

export const PodcastList = ({ podcasts }: PodcastListProps) => {
  if (!podcasts || podcasts.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Headphones className="h-6 w-6 text-accent" />
        <h2 className="text-2xl font-bold">Related Podcasts</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {podcasts.map((podcast) => (
          <Card key={podcast.id} className="overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300">
            {podcast.thumbnail && (
              <div className="aspect-square bg-muted overflow-hidden">
                <img
                  src={podcast.thumbnail}
                  alt={podcast.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-sm line-clamp-2">{podcast.title}</CardTitle>
              {podcast.publisher && (
                <p className="text-xs text-muted-foreground mt-1">{podcast.publisher}</p>
              )}
            </CardHeader>
            {podcast.listennotesUrl && (
              <CardContent className="pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <a href={podcast.listennotesUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Listen Now
                  </a>
                </Button>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
};
