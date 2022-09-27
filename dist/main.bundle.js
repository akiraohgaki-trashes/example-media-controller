// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class MediaController {
    #mediaCollection;
    #primaryMedia;
    constructor(mediaList){
        this.#mediaCollection = new Set(mediaList);
        this.#primaryMedia = document.createElement('video');
        for (const media of this.#mediaCollection){
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
        const timerId = globalThis.setInterval(()=>{
            for (const media of checkList){
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
    get primaryMedia() {
        return this.#primaryMedia;
    }
    get duration() {
        return this.#primaryMedia.duration;
    }
    set currentTime(time) {
        for (const media of this.#mediaCollection){
            media.currentTime = Math.min(media.duration, time);
        }
    }
    get currentTime() {
        return this.#primaryMedia.currentTime;
    }
    set playbackRate(rate) {
        for (const media of this.#mediaCollection){
            media.playbackRate = rate;
        }
    }
    get playbackRate() {
        return this.#primaryMedia.playbackRate;
    }
    set volume(volume) {
        for (const media of this.#mediaCollection){
            media.volume = volume;
        }
    }
    get volume() {
        return this.#primaryMedia.volume;
    }
    set muted(muted) {
        for (const media of this.#mediaCollection){
            media.muted = muted;
        }
    }
    get muted() {
        return this.#primaryMedia.muted;
    }
    play() {
        for (const media of this.#mediaCollection){
            if (!media.ended) {
                media.play();
            }
        }
    }
    pause() {
        for (const media of this.#mediaCollection){
            media.pause();
        }
    }
    stop() {
        for (const media of this.#mediaCollection){
            media.pause();
            media.currentTime = 0;
        }
    }
    onloadeddata() {}
}
function convertTimeToHumanReadable(time) {
    const date = new Date(Math.floor(time * 1000));
    const hours = `${date.getUTCHours()}`.padStart(2, '0');
    const minutes = `${date.getUTCMinutes()}`.padStart(2, '0');
    const seconds = `${date.getUTCSeconds()}`.padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
const player = document.body.querySelector('.player');
const controller = new MediaController(player.querySelectorAll('.preview > video'));
controller.onloadeddata = ()=>{
    const clip = player.querySelector('.clip');
    const clipSegments = [];
    for (const segment of clip.querySelectorAll('span')){
        const startTimeStr = segment.getAttribute('data-start-time');
        const endTimeStr = segment.getAttribute('data-end-time');
        if (startTimeStr && endTimeStr) {
            const startTime = parseInt(startTimeStr);
            const endTime = parseInt(endTimeStr);
            clipSegments.push([
                startTime,
                endTime
            ]);
            segment.textContent = `${convertTimeToHumanReadable(startTime)} - ${convertTimeToHumanReadable(endTime)}`;
        }
    }
    const control = player.querySelector('.control');
    const seek = control.querySelector('[data-seek]');
    seek.max = '' + controller.duration;
    const duration = control.querySelector('[data-duration]');
    duration.setAttribute('data-duration', '' + controller.duration);
    duration.textContent = convertTimeToHumanReadable(controller.duration);
    const currentTime = control.querySelector('[data-current-time]');
    currentTime.setAttribute('data-current-time', '' + controller.currentTime);
    currentTime.textContent = convertTimeToHumanReadable(controller.currentTime);
    controller.primaryMedia.addEventListener('timeupdate', ()=>{
        if (clip.querySelector('[data-play-segments]').checked) {
            let inRange = false;
            let nearbyEndTime = 0;
            let nextIndex = 0;
            for(let i = 0; i < clipSegments.length; i++){
                const [startTime, endTime] = clipSegments[i];
                if (startTime <= controller.currentTime && endTime >= controller.currentTime) {
                    inRange = true;
                    break;
                } else if (endTime < controller.currentTime && endTime > nearbyEndTime) {
                    nearbyEndTime = endTime;
                    nextIndex = clipSegments[i + 1] ? i + 1 : 0;
                }
            }
            if (!inRange) {
                controller.currentTime = clipSegments[nextIndex][0];
                return;
            }
        }
        seek.value = '' + controller.currentTime;
        currentTime.setAttribute('data-current-time', '' + controller.currentTime);
        currentTime.textContent = convertTimeToHumanReadable(controller.currentTime);
    });
    control.addEventListener('click', (event)=>{
        const target = event.target;
        if (target.hasAttribute('data-play')) {
            controller.play();
        } else if (target.hasAttribute('data-pause')) {
            controller.pause();
        } else if (target.hasAttribute('data-stop')) {
            controller.stop();
        } else if (target.hasAttribute('data-muted')) {
            controller.muted = target.getAttribute('data-muted') ? true : false;
        }
    });
    control.addEventListener('change', (event)=>{
        const target = event.target;
        if (target.hasAttribute('data-seek')) {
            controller.currentTime = parseInt(target.value);
        } else if (target.hasAttribute('data-playback-rate')) {
            controller.playbackRate = parseFloat(target.value);
        } else if (target.hasAttribute('data-volume')) {
            controller.volume = parseFloat(target.value);
        }
    });
};
