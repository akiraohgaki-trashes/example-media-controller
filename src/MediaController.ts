export default class MediaController {
  #mediaCollection: Set<HTMLMediaElement>;
  #primaryMedia: HTMLMediaElement;

  constructor(mediaList: Iterable<HTMLMediaElement>) {
    this.#mediaCollection = new Set(mediaList);
    this.#primaryMedia = document.createElement('video');

    for (const media of this.#mediaCollection) {
      media.controls = false;
      media.autoplay = false;
      media.loop = false;
      media.preload = 'metadata';
      media.currentTime = 0;
      media.playbackRate = 1.0;
      media.volume = 1.0;
      media.muted = false;
    }

    const checkList = new Set(this.#mediaCollection);
    const timerId = globalThis.setInterval(() => {
      for (const media of checkList) {
        if (media.readyState >= 2) {
          if ((this.#primaryMedia.duration || 0) < media.duration) {
            this.#primaryMedia = media;
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
    return this.#primaryMedia;
  }

  get duration(): number {
    return this.#primaryMedia.duration;
  }

  // deno-lint-ignore explicit-module-boundary-types
  set currentTime(time: number) {
    for (const media of this.#mediaCollection) {
      media.currentTime = Math.min(media.duration, time);
    }
  }

  get currentTime(): number {
    return this.#primaryMedia.currentTime;
  }

  // deno-lint-ignore explicit-module-boundary-types
  set playbackRate(rate: number) {
    for (const media of this.#mediaCollection) {
      media.playbackRate = rate;
    }
  }

  get playbackRate(): number {
    return this.#primaryMedia.playbackRate;
  }

  // deno-lint-ignore explicit-module-boundary-types
  set volume(volume: number) {
    for (const media of this.#mediaCollection) {
      media.volume = volume;
    }
  }

  get volume(): number {
    return this.#primaryMedia.volume;
  }

  // deno-lint-ignore explicit-module-boundary-types
  set muted(muted: boolean) {
    for (const media of this.#mediaCollection) {
      media.muted = muted;
    }
  }

  get muted(): boolean {
    return this.#primaryMedia.muted;
  }

  play(): void {
    for (const media of this.#mediaCollection) {
      if (!media.ended) {
        media.play();
      }
    }
  }

  pause(): void {
    for (const media of this.#mediaCollection) {
      media.pause();
    }
  }

  stop(): void {
    for (const media of this.#mediaCollection) {
      media.pause();
      media.currentTime = 0;
    }
  }

  onloadeddata(): void {}
}
