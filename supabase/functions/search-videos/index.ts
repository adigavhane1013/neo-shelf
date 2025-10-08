import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Searching for videos:', query);

    // Using YouTube Data API v3 (public search without API key has limitations)
    // For production, you'd need a YouTube API key
    const searchQuery = `${query} book review summary`;
    const response = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from YouTube');
    }

    const html = await response.text();
    
    // Extract video IDs from the HTML (basic scraping)
    const videoIdRegex = /"videoId":"([^"]{11})"/g;
    const videoIds: string[] = [];
    let match;
    
    while ((match = videoIdRegex.exec(html)) !== null && videoIds.length < 6) {
      if (!videoIds.includes(match[1])) {
        videoIds.push(match[1]);
      }
    }

    // Extract titles
    const titleRegex = /"title":{"runs":\[{"text":"([^"]+)"/g;
    const titles: string[] = [];
    
    while ((match = titleRegex.exec(html)) !== null && titles.length < videoIds.length) {
      titles.push(match[1]);
    }

    const videos = videoIds.slice(0, 5).map((id, index) => ({
      id,
      title: titles[index] || `Video about ${query}`
    }));

    console.log('Videos found:', videos.length);

    return new Response(
      JSON.stringify(videos),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in search-videos function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
