import { trpc } from '@/utils/trpc';

export function AlbumSearch() {
  // Example of using the search procedure
  const searchQuery = trpc.spotify.search.useQuery({
    query: 'The Dark Side of the Moon',
    limit: '5'
  });

  // Example of using the getAlbum procedure
  const albumQuery = trpc.spotify.getAlbum.useQuery({
    artist: 'Pink Floyd',
    album: 'The Dark Side of the Moon'
  });

  if (searchQuery.isLoading || albumQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (searchQuery.error || albumQuery.error) {
    return <div>Error: {(searchQuery.error || albumQuery.error)?.message}</div>;
  }

  return (
    <div>
      <h2>Search Results:</h2>
      <pre>{JSON.stringify(searchQuery.data, null, 2)}</pre>
      
      <h2>Album Details:</h2>
      <pre>{JSON.stringify(albumQuery.data, null, 2)}</pre>
    </div>
  );
} 