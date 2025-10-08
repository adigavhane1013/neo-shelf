import { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { BookCard } from "@/components/BookCard";
import { VideoList } from "@/components/VideoList";
import { PodcastList } from "@/components/PodcastList";
import { AuthorInfo } from "@/components/AuthorInfo";
import { AISummary } from "@/components/AISummary";
import { Loader } from "@/components/Loader";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-library.jpg";

const API_BASE_URL = "http://localhost:5000";

interface BookData {
  title: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  averageRating?: number;
  thumbnail?: string;
  pageCount?: number;
  categories?: string[];
}

interface VideoData {
  id: string;
  title: string;
}

interface PodcastData {
  id: string;
  title: string;
  thumbnail?: string;
  listennotesUrl?: string;
  publisher?: string;
}

interface AuthorData {
  name: string;
  summary?: string;
  image?: string;
  wikipediaUrl?: string;
}

const Index = () => {
  const [showHero, setShowHero] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [podcasts, setPodcasts] = useState<PodcastData[]>([]);
  const [authorData, setAuthorData] = useState<AuthorData | null>(null);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setShowHero(false);
    
    try {
      // Fetch book information
      const bookResponse = await fetch(`${API_BASE_URL}/book/${encodeURIComponent(query)}`);
      if (bookResponse.ok) {
        const book = await bookResponse.json();
        setBookData(book);

        // Fetch author information if available
        if (book.authors && book.authors.length > 0) {
          const authorResponse = await fetch(`${API_BASE_URL}/author/${encodeURIComponent(book.authors[0])}`);
          if (authorResponse.ok) {
            const author = await authorResponse.json();
            setAuthorData(author);
          }
        }
      } else {
        toast({
          title: "Book not found",
          description: "Please try a different search term.",
          variant: "destructive",
        });
      }

      // Fetch videos
      const videosResponse = await fetch(`${API_BASE_URL}/videos/${encodeURIComponent(query)}`);
      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        setVideos(videosData);
      }

      // Fetch podcasts
      const podcastsResponse = await fetch(`${API_BASE_URL}/podcasts/${encodeURIComponent(query)}`);
      if (podcastsResponse.ok) {
        const podcastsData = await podcastsResponse.json();
        setPodcasts(podcastsData);
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please ensure the backend is running on port 5000.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {showHero && (
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-hero opacity-80" />
          </div>
          
          <div className="relative z-10 text-center px-4 py-12 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 animate-fade-in">
              📚 Library Seeder
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 animate-fade-in">
              Explore books, podcasts, and videos — all in one place
            </p>
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </section>
      )}

      {!showHero && (
        <div className="sticky top-0 z-50 bg-gradient-hero shadow-strong">
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold text-primary-foreground mb-4 text-center">📚 Library Seeder</h2>
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      )}

      {isLoading && (
        <div className="container mx-auto px-4 py-12">
          <Loader message="Searching for your book..." />
        </div>
      )}

      {!isLoading && (bookData || videos.length > 0 || podcasts.length > 0) && (
        <main className="container mx-auto px-4 py-12 space-y-12">
          {bookData && <BookCard book={bookData} />}
          
          {videos.length > 0 && <VideoList videos={videos} />}
          
          {podcasts.length > 0 && <PodcastList podcasts={podcasts} />}
          
          {authorData && <AuthorInfo author={authorData} />}
          
          {bookData?.description && <AISummary bookDescription={bookData.description} />}
        </main>
      )}

      <footer className="bg-secondary/50 border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 Library Seeder. Discover books, podcasts, and videos in one place.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
