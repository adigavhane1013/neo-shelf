import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Loader } from "./Loader";

interface AISummaryProps {
  bookDescription?: string;
}

export const AISummary = ({ bookDescription }: AISummaryProps) => {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateSummary = async () => {
    if (!bookDescription) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: bookDescription }),
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary || "Unable to generate summary.");
        setHasGenerated(true);
      } else {
        setSummary("Failed to generate summary. Please try again.");
      }
    } catch (error) {
      setSummary("Error connecting to the server. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-accent" />
        <h2 className="text-2xl font-bold">AI-Generated Summary</h2>
      </div>
      
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Get an intelligent summary of this book</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasGenerated && !isLoading && (
            <Button
              variant="default"
              onClick={generateSummary}
              disabled={!bookDescription}
              className="w-full sm:w-auto"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate AI Summary
            </Button>
          )}
          
          {isLoading && <Loader message="Generating summary..." />}
          
          {summary && !isLoading && (
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground/80 leading-relaxed bg-secondary/30 p-4 rounded-lg border border-border">
                {summary}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};
