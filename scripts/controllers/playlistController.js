import * as model from '../models/playlistModel.js';
import * as view from '../views/playlistView.js';

export const initApp = async () => {
  await model.loadPlaylists();
  view.renderPlaylists(model.getAllPlaylists());
  rebindAll();
};

// 🔁 Samlar alla event-bindningar efter varje render
const rebindAll = () => {
  setupDeleteListeners();
  setupSongDeleteListeners();
  setupSongAddListeners();
  setupSongCopyListeners();
  setupPlaylistForm();
  setupAddSongForm();
};

// 🧾 Formulär: Skapa ny spellista
const setupPlaylistForm = () => {
  const form = document.getElementById('playlistForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const playlistName = document.getElementById('playlist').value.trim();
    const genre = document.getElementById('genre').value.trim();
    const artist = document.getElementById('artist').value.trim();
    const song = document.getElementById('song').value.trim();

    if (!playlistName || !genre || !artist || !song) {
      alert('Fyll i alla fält.');
      return;
    }

    const newPlaylist = {
      name: playlistName,
      genre,
      description: `Spellista med ${artist} i genren ${genre}`,
      songs: [{ title: song, artist }],
    };

    model.addPlaylist(newPlaylist);
    view.renderPlaylists(model.getAllPlaylists());
    rebindAll();
    form.reset();
  });
};

// 🧾 Formulär: Lägg till låt i befintlig spellista
const setupAddSongForm = () => {
  const form = document.getElementById('addSongForm');
  const select = document.getElementById('playlistSelect');
  const titleInput = document.getElementById('newSongTitle');
  const artistInput = document.getElementById('newSongArtist');

  const playlists = model.getAllPlaylists();
  if (!select) return;

  // Fyll dropdown
  select.innerHTML = '<option value="">-- Välj spellista --</option>';
  playlists.forEach((p) => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = p.name;
    select.appendChild(option);
  });

  // Lägg till låt
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const playlistId = parseInt(select.value);
    const title = titleInput.value.trim();
    const artist = artistInput.value.trim();

    if (!playlistId || !title || !artist) {
      alert('Fyll i alla fält.');
      return;
    }

    model.addSongToPlaylist(playlistId, { title, artist });
    view.renderPlaylists(model.getAllPlaylists());
    rebindAll();
    form.reset();
  });
};

// 🗑️ Ta bort spellista
const setupDeleteListeners = () => {
  const buttons = document.querySelectorAll('.delete-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      model.deletePlaylist(id);
      view.renderPlaylists(model.getAllPlaylists());
      rebindAll();
    });
  });
};

// 🗑️ Ta bort låt från spellista
const setupSongDeleteListeners = () => {
  const buttons = document.querySelectorAll('.delete-song');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const playlistId = parseInt(btn.dataset.playlistId);
      const songIndex = parseInt(btn.dataset.songIndex);
      model.deleteSongFromPlaylist(playlistId, songIndex);
      view.renderPlaylists(model.getAllPlaylists());
      rebindAll();
    });
  });
};

// ➕ Duplicera låt i samma spellista
const setupSongAddListeners = () => {
  const buttons = document.querySelectorAll('.add-song');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const playlistId = parseInt(btn.dataset.playlistId);
      const songIndex = parseInt(btn.dataset.songIndex);
      const playlist = model.getAllPlaylists().find((p) => p.id === playlistId);
      const song = playlist.songs[songIndex];
      playlist.songs.push({ ...song });
      view.renderPlaylists(model.getAllPlaylists());
      rebindAll();
    });
  });
};

// ➕ Kopiera låt till annan spellista via dropdown
const setupSongCopyListeners = () => {
  const buttons = document.querySelectorAll('.add-song');
  const allPlaylists = model.getAllPlaylists();

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const originId = parseInt(btn.dataset.playlistId);
      const songIndex = parseInt(btn.dataset.songIndex);
      const dropdown = btn.nextElementSibling;

      dropdown.innerHTML = '<option value="">Välj spellista</option>';
      allPlaylists
        .filter((p) => p.id !== originId)
        .forEach((p) => {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.textContent = p.name;
          dropdown.appendChild(opt);
        });

      dropdown.classList.remove('hidden');

      dropdown.addEventListener(
        'change',
        () => {
          const targetId = parseInt(dropdown.value);
          const originPlaylist = allPlaylists.find((p) => p.id === originId);
          const song = originPlaylist.songs[songIndex];
          model.addSongToPlaylist(targetId, { ...song });

          view.renderPlaylists(model.getAllPlaylists());
          rebindAll();
        },
        { once: true }
      );
    });
  });
};
