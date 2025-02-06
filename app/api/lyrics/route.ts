interface GeniusHit {
  result: {
    title: string;
    primary_artist: {
      name: string;
    };
  };
 }
 
 export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '';
  const artist = searchParams.get('artist') || '';
 
  const response = await fetch(
    `https://api.genius.com/search?q=${encodeURIComponent(`${title} ${artist}`)}`,
    {
      headers: {
        'Authorization': 'Bearer m0sjtWmcieIOJ4ECaKd3HcpVkaaOPXpG62chnW5pPDlr2QgbevdVE--aK4IRw30r'
      }
    }
  );
  
  const data = await response.json();

  const exactMatch = data.response.hits.find((hit: GeniusHit) => {
    const songTitle = hit.result.title.toLowerCase().replace(/\([^)]*\)/g, '').trim();
    const searchTitle = title.toLowerCase();
    const artistName = hit.result.primary_artist.name.toLowerCase();
    const searchArtist = artist.toLowerCase().split(',')[0].trim();
    
    return songTitle === searchTitle && artistName.includes(searchArtist);
  });
 
  if (!exactMatch) {
    const fuzzyMatch = data.response.hits.find((hit: GeniusHit) => {
      const songTitle = hit.result.title.toLowerCase();
      const artistName = hit.result.primary_artist.name.toLowerCase();
      return songTitle.includes(title.toLowerCase()) && 
             artistName.includes(artist.toLowerCase().split(',')[0].trim());
    });
    return Response.json(fuzzyMatch?.result || null);
  }
 
  return Response.json(exactMatch.result);
 }