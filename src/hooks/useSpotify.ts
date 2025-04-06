
export function useSpotify() {
  const utils = trpc.useContext();

  const searchAlbums = async (query: string, limit: number = 5) => {
    const result = await utils.spotify.search.fetch({
      query,
      limit: limit.toString(),
    });
    return result;
  };

  const getAlbum = async (params: { id?: string; artist?: string; album?: string }) => {
    const result = await utils.spotify.getAlbum.fetch(params);
    return result;
  };

  return {
    searchAlbums,
    getAlbum,
  };
} 