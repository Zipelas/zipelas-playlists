export const renderPlaylists = (playlists) => {
  const container = document.getElementById('playlists'); // OBS! matcha HTML-ID
  container.innerHTML = '';

  playlists.forEach((pl) => {
    const div = document.createElement('div');
    div.className = 'playlist bg-gray-800 text-white p-4 rounded shadow';
    div.innerHTML = `
            <h2 class="text-xl font-bold text-teal-400">${pl.name}</h2>
            <p class="italic text-gray-300">${pl.description || ''}</p>
            <p class="text-sm text-teal-300 mb-2">Genre: ${pl.genre}</p>
            <ul class="list-disc list-inside">
              ${pl.songs
                .map((song) => `<li>${song.title} - ${song.artist}</li>`)
                .join('')}
            </ul>
        `;
    container.appendChild(div);
    
  });
};
