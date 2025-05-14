import * as model from '../models/playlistModel.js';
import * as view from '../views/playlistView.js';

export const initApp = async () => {
  await model.loadPlaylists();
  const playlists = model.getAllPlaylists();
  view.renderPlaylists(playlists);
  setupDeleteListeners();
  setupFormListener();
  setupSearch();
  setupSongAddListeners();
};

const setupSongAddListeners = () => {
  const addButtons = document.querySelectorAll('.add-song');

  addButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const playlistId = parseInt(btn.dataset.playlistId);
      const songIndex = parseInt(btn.dataset.songIndex);

      const playlists = model.getAllPlaylists();
      const playlist = playlists.find((p) => p.id === playlistId);
      const song = playlist.songs[songIndex];

      if (song) {
        playlist.songs.push({ ...song }); // duplicera låten
        view.renderPlaylists(playlists);
        setupDeleteListeners();
        setupSongDeleteListeners();
        setupSongAddListeners(); // <-- viktigt att re-binda
      }
    });
  });
};

const setupSearch = () => {
  const searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const allPlaylists = model.getAllPlaylists();

    const filtered = allPlaylists.filter((playlist) => {
      const matchGenre = playlist.genre.toLowerCase().includes(searchTerm);
      const matchName = playlist.name.toLowerCase().includes(searchTerm);
      const matchDescription =
        playlist.description?.toLowerCase().includes(searchTerm) || false;
      const matchSongs = playlist.songs.some(
        (song) =>
          song.artist.toLowerCase().includes(searchTerm) ||
          song.title.toLowerCase().includes(searchTerm)
      );

      return matchGenre || matchName || matchDescription || matchSongs;
    });

    view.renderPlaylists(filtered, searchTerm); // 👈 skickar söktermen till vyn
    setupDeleteListeners();
  });
};


const setupFormListener = () => {
  const form = document.getElementById('playlistForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const genre = document.getElementById('genre').value.trim();
    const artist = document.getElementById('artist').value.trim();
    const song = document.getElementById('song').value.trim();

    if (!genre || !artist || !song) {
      alert('Fyll i alla fält.');
      return;
    }

    const newPlaylist = {
      genre,
      name: `${genre} – ${artist}`,
      description: `Spellista med ${artist} i genren ${genre}`,
      songs: [{ title: song, artist }],
    };

    model.addPlaylist(newPlaylist);
    view.renderPlaylists(model.getAllPlaylists());
    setupDeleteListeners();
    form.reset();
  });
};

const setupDeleteListeners = () => {
  const buttons = document.querySelectorAll('.delete-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      model.deletePlaylist(id);
      view.renderPlaylists(model.getAllPlaylists());
      setupDeleteListeners(); // bind knappar igen efter re-render
    });
  });
};
