export const renderPlaylists = (playlists) => {
    const container = document.getElementById('playlist-container');
    container.innerHTML = '';

    playlists.forEach(pl => {
        const div = document.createElement('div');
        div.className = 'playlist';
        div.innerHTML = `
            <h2>${pl.name}</h2>
            <p>${pl.description}</p>
            <ul>
            ${pl.songs
              .map((song) => `<li>${song.title} - ${song.artist}</li>`)
              .join('')}
            </ul>
        `;
        container.appendChild(div);
    });
}