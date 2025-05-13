import * as model from '../models/playlistModel.js';
import * as view from '../views/playlistView.js';

// Startar appen
export const initApp = async () => {
  await model.loadPlaylists(); // 👈 Ladda från JSON-fil
  const playlists = model.getAllPlaylists();
  view.renderPlaylists(playlists);
  setupFormListener();
};

// Lyssnar på formuläret
const setupFormListener = () => {
  const form = document.getElementById('playlistForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Hämta inputvärden
    const genre = document.getElementById('genre').value.trim();
    const artist = document.getElementById('artist').value.trim();
    const song = document.getElementById('song').value.trim();

    // Validering
    if (!genre || !artist || !song) {
      alert('Fyll i alla fält.');
      return;
    }

    // Skapa spellista med EN låt
    const newPlaylist = {
      genre,
      name: `${genre} – ${artist}`,
      description: `Spellista med ${artist} i genren ${genre}`,
      songs: [{ title: song, artist: artist }],
    };

    // Lägg till och rendera
    model.addPlaylist(newPlaylist);
    view.renderPlaylists(model.getAllPlaylists());

    // Rensa formulär
    form.reset();
  });
};
