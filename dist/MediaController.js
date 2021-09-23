export default class MediaController {
    constructor(mediaList) {
        this._mediaCollection = new Set(mediaList);
        this._primaryMedia = document.createElement('video');
        for (const media of this._mediaCollection) {
            media.controls = false;
            media.autoplay = false;
            media.loop = false;
            media.preload = 'metadata';
            media.currentTime = 0;
            media.playbackRate = 1.0;
            media.volume = 1.0;
            media.muted = false;
        }
        const checkList = new Set(this._mediaCollection);
        const timerId = window.setInterval(() => {
            for (const media of checkList) {
                if (media.readyState >= 2) {
                    if ((this._primaryMedia.duration || 0) < media.duration) {
                        this._primaryMedia = media;
                    }
                    checkList.delete(media);
                }
            }
            if (!checkList.size) {
                clearInterval(timerId);
                this.onloadeddata();
            }
        }, 100);
    }
    get primaryMedia() {
        return this._primaryMedia;
    }
    get duration() {
        return this._primaryMedia.duration;
    }
    set currentTime(time) {
        for (const media of this._mediaCollection) {
            media.currentTime = Math.min(media.duration, time);
        }
    }
    get currentTime() {
        return this._primaryMedia.currentTime;
    }
    set playbackRate(rate) {
        for (const media of this._mediaCollection) {
            media.playbackRate = rate;
        }
    }
    get playbackRate() {
        return this._primaryMedia.playbackRate;
    }
    set volume(volume) {
        for (const media of this._mediaCollection) {
            media.volume = volume;
        }
    }
    get volume() {
        return this._primaryMedia.volume;
    }
    set muted(muted) {
        for (const media of this._mediaCollection) {
            media.muted = muted;
        }
    }
    get muted() {
        return this._primaryMedia.muted;
    }
    play() {
        for (const media of this._mediaCollection) {
            if (!media.ended) {
                media.play();
            }
        }
    }
    pause() {
        for (const media of this._mediaCollection) {
            media.pause();
        }
    }
    stop() {
        for (const media of this._mediaCollection) {
            media.pause();
            media.currentTime = 0;
        }
    }
    onloadeddata() { }
}
//# sourceMappingURL=MediaController.js.map