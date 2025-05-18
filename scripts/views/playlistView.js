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
      filteredSongs = pl.songs;
    } else if (genreMatches || nameMatches || descriptionMatches) {
      filteredSongs = pl.songs;
    } else {
      filteredSongs = pl.songs.filter(
        (song) =>
          song.title.toLowerCase().includes(term) ||
          song.artist.toLowerCase().includes(term)
      );
    }

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
      <button class="delete-btn absolute top-2 right-2 text-teal-400 text-xl hover:text-red-500"
              title="Ta bort spellista" data-id="${pl.id}">
        ❌
      </button>

      <h2 class="text-xl font-bold text-teal-400">${pl.name}</h2>
      <p class="italic text-gray-300">${pl.description || ''}</p>
      <p class="text-sm text-teal-300 mb-2">Genre: ${pl.genre}</p>

      <ul class="list-disc list-inside mb-4 space-y-1">
        ${filteredSongs
          .map(
            (song, index) => `
          <li class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span>${song.title} - ${song.artist}</span>
            <div class="flex items-center gap-2">

              <button class="add-song text-teal-400 hover:text-green-400 text-lg"
                      title="Kopiera låt"
                      data-playlist-id="${pl.id}" data-song-index="${index}">
                ➕
              </button>

              <select class="playlist-target hidden bg-gray-700 text-white p-1 rounded text-sm"
                      data-song-index="${index}" data-origin-id="${pl.id}">
              </select>

              <button class="delete-song text-teal-400 hover:text-red-500 text-lg"
                      title="Ta bort låt"
                      data-playlist-id="${pl.id}" data-song-index="${index}">
                ❌
              </button>

            </div>
          </li>
        `
          )
          .join('')}
      </ul>
    `;

    container.appendChild(div);
  });
};
