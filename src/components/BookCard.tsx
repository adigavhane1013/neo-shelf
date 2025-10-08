import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, User } from "lucide-react";

interface BookInfo {
  title: string;
  authors?: string[];
  publishedDate?: string;
  description?: string;
  averageRating?: number;
  thumbnail?: string;
  pageCount?: number;
  categories?: string[];
}

interface BookCardProps {
  book: BookInfo;
}

export const BookCard = ({ book }: BookCardProps) => {
  return (
    <Card className="overflow-hidden shadow-medium hover:shadow-strong transition-all duration-300 animate-scale-in">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 p-6 flex items-center justify-center bg-secondary/30">
          {book.thumbnail ? (
            <img
              src={book.thumbnail}
              alt={book.title}
              className="w-full h-auto max-h-64 object-contain rounded-lg shadow-soft"
            />
          ) : (
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">No cover available</span>
            </div>
          )}
        </div>
        
        <div className="md:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-2xl font-bold">{book.title}</CardTitle>
              {book.averageRating && (
                <Badge variant="secondary" className="flex items-center gap-1 shrink-0">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  {book.averageRating.toFixed(1)}
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
              {book.authors && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{book.authors.join(", ")}</span>
                </div>
              )}
              {book.publishedDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{book.publishedDate}</span>
                </div>
              )}
            </div>

            {book.categories && book.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {book.categories.map((category, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </CardHeader>

          <CardContent>
            {book.description && (
              <p className="text-foreground/80 leading-relaxed">
                {book.description.length > 500
                  ? `${book.description.substring(0, 500)}...`
                  : book.description}
              </p>
            )}
            
            {book.pageCount && (
              <p className="mt-4 text-sm text-muted-foreground">
                {book.pageCount} pages
              </p>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
};
