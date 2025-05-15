import * as model from '../models/playlistModel.js';
import * as view from '../views/playlistView.js';

export const initApp = async () => {
  await model.loadPlaylists();
  view.renderPlaylists(model.getAllPlaylists());
  rebindAll();
};

// 🔁 Samlad funktion för att binda om allt efter varje render
const rebindAll = () => {
  setupDeleteListeners();
  setupSongDeleteListeners();
  setupSongAddListeners();
  setupSongCopyListeners();
  setupAddSongForm();
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

// 🗑️ Ta bort låt
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
      playlist.songs.push({ ...song }); // duplicera
      view.renderPlaylists(model.getAllPlaylists());
      rebindAll();
    });
  });
};

// 🔁 ➕ Kopiera låt till annan spellista via dropdown
const setupSongCopyListeners = () => {
  const buttons = document.querySelectorAll('.add-song');
  const allPlaylists = model.getAllPlaylists();

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const originId = parseInt(btn.dataset.playlistId);
      const songIndex = parseInt(btn.dataset.songIndex);
      const dropdown = btn.nextElementSibling;

      // Fyll dropdown med andra spellistor
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
      ); // bind bara 1 gång
    });
  });
};

// ➕ Lägg till ny låt till vald spellista via formulär
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
4