let playlists = [];

export const getAllPlaylists = () => playlists;

export const addPlaylist = (playlist) => {
  playlists.push({
    id: playlists.length + 1,
    ...playlist,
  });
};

export const loadPlaylists = async () => {
  const res = await fetch('../../data/musicData.json');
  playlists = await res.json();
};
