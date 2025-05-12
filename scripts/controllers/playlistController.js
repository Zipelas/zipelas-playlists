import * as model from '../models/playlistModel.js';
import * as view from '../views/playlistView.js';

export const init = () => {
    const playlists = model.getAllPlaylists();
    view.renderPlaylists(playlists);
}
