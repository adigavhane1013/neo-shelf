import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, ExternalLink } from "lucide-react";

interface AuthorData {
  name: string;
  summary?: string;
  image?: string;
  wikipediaUrl?: string;
}

interface AuthorInfoProps {
  author: AuthorData;
}

export const AuthorInfo = ({ author }: AuthorInfoProps) => {
  if (!author) {
    return null;
  }

  return (
    <section className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <UserCircle className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">About the Author</h2>
      </div>
      
      <Card className="shadow-medium hover:shadow-strong transition-all duration-300">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1 p-6 flex items-center justify-center">
            {author.image ? (
              <img
                src={author.image}
                alt={author.name}
                className="w-full h-auto rounded-lg shadow-soft"
              />
            ) : (
              <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
                <UserCircle className="h-20 w-20 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-2xl">{author.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {author.summary && (
                <p className="text-foreground/80 leading-relaxed">
                  {author.summary}
                </p>
              )}
              
              {author.wikipediaUrl && (
                <Button variant="outline" asChild>
                  <a href={author.wikipediaUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Read more on Wikipedia
                  </a>
                </Button>
              )}
            </CardContent>
          </div>
        </div>
      </Card>
    </section>
  );
};
