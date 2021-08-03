import Song from "./song";

export interface InitialPlaybackState {
    playing: boolean,
    currentAudio: Song
}