export default class MediaController {
    private _mediaCollection;
    private _primaryMedia;
    constructor(mediaList: Iterable<HTMLMediaElement>);
    get primaryMedia(): HTMLMediaElement;
    get duration(): number;
    set currentTime(time: number);
    get currentTime(): number;
    set playbackRate(rate: number);
    get playbackRate(): number;
    set volume(volume: number);
    get volume(): number;
    set muted(muted: boolean);
    get muted(): boolean;
    play(): void;
    pause(): void;
    stop(): void;
    onloadeddata(): void;
}
