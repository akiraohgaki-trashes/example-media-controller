import MediaController from './MediaController.js';
function convertTimeToHumanReadable(time) {
    const date = new Date(Math.floor(time * 1000));
    const hours = `${date.getUTCHours()}`.padStart(2, '0');
    const minutes = `${date.getUTCMinutes()}`.padStart(2, '0');
    const seconds = `${date.getUTCSeconds()}`.padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
const player = document.body.querySelector('.player');
const controller = new MediaController(player.querySelectorAll('video'));
controller.onloadeddata = () => {
    const control = player.querySelector('.control');
    const seek = control.querySelector('[data-seek]');
    seek.max = '' + controller.duration;
    const duration = control.querySelector('[data-duration]');
    duration.setAttribute('data-duration', '' + controller.duration);
    duration.textContent = convertTimeToHumanReadable(controller.duration);
    const currentTime = control.querySelector('[data-current-time]');
    currentTime.setAttribute('data-current-time', '' + controller.currentTime);
    currentTime.textContent = convertTimeToHumanReadable(controller.currentTime);
    controller.primaryMedia.addEventListener('timeupdate', () => {
        seek.value = '' + controller.currentTime;
        currentTime.setAttribute('data-current-time', '' + controller.currentTime);
        currentTime.textContent = convertTimeToHumanReadable(controller.currentTime);
    });
    control.addEventListener('click', (event) => {
        const target = event.target;
        if (target.hasAttribute('data-play')) {
            controller.play();
        }
        else if (target.hasAttribute('data-pause')) {
            controller.pause();
        }
        else if (target.hasAttribute('data-stop')) {
            controller.stop();
        }
        else if (target.hasAttribute('data-muted')) {
            controller.muted = target.getAttribute('data-muted') ? true : false;
        }
    });
    control.addEventListener('change', (event) => {
        const target = event.target;
        if (target.hasAttribute('data-seek')) {
            controller.currentTime = parseInt(target.value);
        }
        else if (target.hasAttribute('data-playback-rate')) {
            controller.playbackRate = parseFloat(target.value);
        }
        else if (target.hasAttribute('data-volume')) {
            controller.volume = parseFloat(target.value);
        }
    });
};
//# sourceMappingURL=main.js.map