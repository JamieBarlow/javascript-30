/* Get our elements  */
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullScreen = player.querySelector('.fullScreen');

/* Build out our functions  */
function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
    // the above is equivalent to this:
    // if(video.paused) {
    //     video.play();
    // } else {
    //     video.pause();
    // }
}

// Toggle play and pause
function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

// Progress bar update
function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function skip() {
    // console.log(this.dataset.skip);                 // this.dataset.skip makes use of the 'data-skip property we've added to the elements'
    video.currentTime += parseFloat(this.dataset.skip);   // without parseFloat you'll get an error
}

// Volume and playbackRate sliders
function handleRangeUpdate(e) {
    video[this.name] = this.value;
    
    // console.log(this.name);       // gives us 'volume' or 'playbackRate' depending on the element 'this' is
    // console.log(this.value);
}

function scrub(e) {
    // console.log(e);   // use to examine click event and figure out the below
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

// Reset volume and playbackRate range sliders if ctrl + clicked
function ctrlClickReset(e) {
    if (e.ctrlKey) {
        this.value = 1;
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
      video.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

function changeCursor() {
    progress.style.cursor = 'pointer';
}

/* Hook up the event listeners  */
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('click', ctrlClickReset));    // e.ctrlKey seems to only work on click events
progress.addEventListener('click', scrub);
fullScreen.addEventListener('click', toggleFullScreen);

// Change pointer on hover
progress.addEventListener('mouseover', changeCursor);

// Toggle for scrub - allows dragging functionality as well as click
let mousedown = false;
progress.addEventListener('mousemove', (e) => {
    if(mousedown) {
        scrub();
    }
});
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);