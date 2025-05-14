export const renderPlaylists = (playlists, searchTerm = '') => {
  const container = document.getElementById('playlists');
  container.innerHTML = '';

  const term = searchTerm.toLowerCase();

  playlists.forEach((pl) => {
    const genreMatches = pl.genre.toLowerCase().includes(term);
    const nameMatches = pl.name.toLowerCase().includes(term);
    const descriptionMatches =
      pl.description?.toLowerCase().includes(term) || false;

    let filteredSongs;

    if (!term) {
      // Ingen sökning – visa alla låtar
      filteredSongs = pl.songs;
    } else if (genreMatches || nameMatches || descriptionMatches) {
      // Om genre/spellistnamn matchar – visa alla låtar
      filteredSongs = pl.songs;
    } else {
      // Annars: filtrera låtar efter artist/titel
      filteredSongs = pl.songs.filter(
        (song) =>
          song.title.toLowerCase().includes(term) ||
          song.artist.toLowerCase().includes(term)
      );
    }

    // Om vi inte har några matchande låtar och inte genre/namn/desc → hoppa över
    if (
      filteredSongs.length === 0 &&
      !genreMatches &&
      !nameMatches &&
      !descriptionMatches
    ) {
      return;
    }

    const div = document.createElement('div');
    div.className =
      'playlist bg-gray-800 text-white p-4 rounded shadow relative';

    div.innerHTML = `
      <h2 class="text-xl font-bold text-teal-400">${pl.name}</h2>
      <p class="italic text-gray-300">${pl.description || ''}</p>
      <p class="text-sm text-teal-300 mb-2">Genre: ${pl.genre}</p>
      <ul class="list-disc list-inside mb-4 space-y-1">
        ${filteredSongs
          .map(
            (song, index) => `
          <li class="flex justify-between items-center gap-2">
            <span>${song.title} - ${song.artist}</span>
            <div class="flex gap-2">
              <button class="add-song text-teal-400 hover:text-green-400" title="Lägg till liknande låt"
                data-playlist-id="${pl.id}" data-song-index="${index}">
                ➕
              </button>
              <button class="delete-song text-teal-400 hover:text-red-500" title="Ta bort låt"
                data-playlist-id="${pl.id}" data-song-index="${index}">
                ❌
              </button>
            </div>
          </li>
        `
          )
          .join('')}
      </ul>

      <button class="delete-btn bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded" data-id="${
        pl.id
      }">
        Ta bort
      </button>
    `;

    container.appendChild(div);
  });
};
