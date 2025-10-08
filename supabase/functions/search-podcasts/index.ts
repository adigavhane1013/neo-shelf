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

    console.log('Searching for podcasts:', query);

    // Using iTunes Podcast Search API (free, no API key required)
    const searchQuery = `${query} book podcast`;
    const response = await fetch(
      `https://itunes.apple.com/search?media=podcast&entity=podcast&term=${encodeURIComponent(searchQuery)}&limit=5`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch podcasts');
    }

    const data = await response.json();

    const podcasts = data.results?.map((podcast: any) => ({
      id: podcast.collectionId?.toString() || '',
      title: podcast.collectionName || podcast.trackName || 'Unknown Podcast',
      thumbnail: podcast.artworkUrl600 || podcast.artworkUrl100 || '',
      listennotesUrl: podcast.collectionViewUrl || '',
      publisher: podcast.artistName || 'Unknown Publisher'
    })) || [];

    console.log('Podcasts found:', podcasts.length);

    return new Response(
      JSON.stringify(podcasts),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in search-podcasts function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
