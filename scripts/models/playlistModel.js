let playlists = [];

export const getAllPlaylists = () => playlists;

export const loadPlaylists = async () => {
  const res = await fetch('../../data/musicData.json');
  playlists = await res.json();
};

export const addPlaylist = (playlist) => {
  playlists.push({
    id: playlists.length + 1,
    ...playlist,
  });
};

export const deletePlaylist = (id) => {
  playlists = playlists.filter((pl) => pl.id !== id);
};

export const addSongToPlaylist = (playlistId, song) => {
  const playlist = playlists.find((p) => p.id === playlistId);
  if (playlist) {
    playlist.songs.push(song);
  }
};

export const deleteSongFromPlaylist = (playlistId, songIndex) => {
  const playlist = playlists.find((p) => p.id === playlistId);
  if (playlist && playlist.songs[songIndex]) {
    playlist.songs.splice(songIndex, 1);
  }
};
