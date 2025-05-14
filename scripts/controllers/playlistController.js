import * as model from '../models/playlistModel.js';
import * as view from '../views/playlistView.js';

export const initApp = async () => {
  await model.loadPlaylists();
  const playlists = model.getAllPlaylists();
  view.renderPlaylists(playlists);
  setupDeleteListeners();
  setupFormListener();
  setupGenreSearch();
};

const setupGenreSearch = () => {
  const searchInput = document.getElementById('genreSearch');

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const allPlaylists = model.getAllPlaylists();
    const filtered = allPlaylists.filter((p) =>
      p.genre.toLowerCase().includes(searchTerm)
    );
    view.renderPlaylists(filtered);
    setupDeleteListeners(); // återbind knappar
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
