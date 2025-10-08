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
    const { author } = await req.json();
    
    if (!author) {
      return new Response(
        JSON.stringify({ error: 'Author parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Searching for author:', author);

    // Search Wikipedia for the author
    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(author)}&srlimit=1&origin=*`
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to search Wikipedia');
    }

    const searchData = await searchResponse.json();

    if (!searchData.query?.search || searchData.query.search.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Author not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const pageTitle = searchData.query.search[0].title;

    // Get page details
    const pageResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&exintro=true&explaintext=true&piprop=original&titles=${encodeURIComponent(pageTitle)}&origin=*`
    );

    if (!pageResponse.ok) {
      throw new Error('Failed to fetch author details');
    }

    const pageData = await pageResponse.json();
    const pages = pageData.query?.pages;
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    const authorData = {
      name: page.title || author,
      summary: page.extract || 'No information available',
      image: page.original?.source || '',
      wikipediaUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle)}`
    };

    console.log('Author found:', authorData.name);

    return new Response(
      JSON.stringify(authorData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in author-info function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
