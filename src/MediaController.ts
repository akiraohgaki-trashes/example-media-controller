export default class MediaController {

  private _mediaCollection: Set<HTMLMediaElement>;
  private _primaryMedia: HTMLMediaElement;

  constructor(mediaList: Iterable<HTMLMediaElement>) {
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

  get primaryMedia(): HTMLMediaElement {
    return this._primaryMedia;
  }

  get duration(): number {
    return this._primaryMedia.duration;
  }

  set currentTime(time: number) {
    for (const media of this._mediaCollection) {
      media.currentTime = Math.min(media.duration, time);
    }
  }

  get currentTime(): number {
    return this._primaryMedia.currentTime;
  }

  set playbackRate(rate: number) {
    for (const media of this._mediaCollection) {
      media.playbackRate = rate;
    }
  }

  get playbackRate(): number {
    return this._primaryMedia.playbackRate;
  }

  set volume(volume: number) {
    for (const media of this._mediaCollection) {
      media.volume = volume;
    }
  }

  get volume(): number {
    return this._primaryMedia.volume;
  }

  set muted(muted: boolean) {
    for (const media of this._mediaCollection) {
      media.muted = muted;
    }
  }

  get muted(): boolean {
    return this._primaryMedia.muted;
  }

  play(): void {
    for (const media of this._mediaCollection) {
      if (!media.ended) {
        media.play();
      }
    }
  }

  pause(): void {
    for (const media of this._mediaCollection) {
      media.pause();
    }
  }

  stop(): void {
    for (const media of this._mediaCollection) {
      media.pause();
      media.currentTime = 0;
    }
  }

  onloadeddata(): void { }

}
