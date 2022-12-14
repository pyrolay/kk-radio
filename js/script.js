const $ = (selector) => document.querySelector(selector)

const $music = $("#audio")
const $btnPausePlay = $(".btnPausePlay")
const $btnPause = $(".btn-pause")
const $btnPlay = $(".btn-play")
const $btnForward = $(".btn-forward")
const $btnBackward = $(".btn-backward")
const $currentTime = $(".current-time")
const $songDurationTime = $(".song-duration-time")
const $slide = $("#slide")
const $img = $(".main-img")
const $songName = $(".song-name")
const $btnShuffle = $(".btn-shuffle")
const $btnVolume = $(".volume-button")
const $volumeContainer = $(".volume-container")
const $volumeSlider = $(".volume-input")
const $volumeIcon = $(".volume-icon")

const BASE_URL = "https://acnhapi.com/v1/songs/"

const getMusicInfo = () => {
    fetch(BASE_URL)
        .then((res => res.json()))
        .then(data => {
            trackList(data)
        })
}

let currentMusic = 0
let musicList
const trackList = (data) => {
    const trackList = []
    for (const song of Object.keys(data)) {
        const { id, image_uri, music_uri, name } = data[song]
        trackList.push({
            track: id,
            name: name["name-EUen"],
            image: image_uri,
            music: music_uri
        })
    }
    return musicList = trackList
}

const setVisual = (i) => {
    const trackList = musicList
    const img = trackList[i].image
    $img.src = img
    $music.src = trackList[i].music
    $songName.innerHTML = trackList[i].name
}

const setMusic = (i) => {
    setVisual(i)
    $slide.value = i

    let song = musicList[i]
    $music.src = song.music
    currentMusic = i

    $currentTime.innerHTML = '00:00'
    $music.addEventListener('loadeddata', () => {
        $slide.max = $music.duration
        $songDurationTime.innerHTML = formatTime($music.duration)
  })
}

const formatTime = (time) => {
    let min = Math.floor(time / 60)
    if (min < 10) min = `0${min}`

    let sec = Math.floor(time % 60)
    if (sec < 10) sec = `0${sec}`

    return `${min}:${sec}`
}

setInterval(() => {
    $slide.value = $music.currentTime
    $currentTime.innerHTML = formatTime($music.currentTime)
    if (Math.floor($music.currentTime) === Math.floor($slide.max)) {
        $btnForward.click()
    }
}, 500)

const playMusic = () => {
    $music.play()
    $btnPause.classList.remove("hidden")
    $btnPlay.classList.add("hidden")
}

const shuffleList = () => {
    for (let i = musicList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        let temp = musicList[i];
        musicList[i] = musicList[j];
        musicList[j] = temp;
    }
    const randomTrack = Math.floor(Math.random() * musicList.length - 1)
    return randomTrack
}

const chengeVolumeIcon = (value) => {
    const icons = ["fa-volume-xmark", "fa-volume-low", "fa-volume-high"]
    const volumeNumber = Number(value)
    if (volumeNumber === 0) {
        for (const icon of icons) {
            $(`.${icon}`).classList.add("hidden")
            $(".fa-volume-xmark").classList.remove("hidden")
        }
    } else if (volumeNumber > 0 && volumeNumber <= 50) {
        for (const icon of icons) {
            $(`.${icon}`).classList.add("hidden")
            $(".fa-volume-low").classList.remove("hidden")
        }
    } else {
        for (const icon of icons) {
            $(`.${icon}`).classList.add("hidden")
            $(".fa-volume-high").classList.remove("hidden")
        }
    }
}

window.addEventListener("load", () => {
    getMusicInfo()
    setTimeout(() => {
        setMusic(0)
    }, 500)
})

$btnPausePlay.addEventListener("click", () => {
    $btnPause.classList.toggle("hidden")
    $btnPlay.classList.toggle("hidden")
    if ($btnPlay.className.includes("hidden")) $music.play()
    else $music.pause()
})

$btnForward.addEventListener("click", () => {
    if (currentMusic >= musicList.length - 1) {
        currentMusic = 0
    } else {
        currentMusic++
    }
    setMusic(currentMusic)
    playMusic()
})

$btnBackward.addEventListener("click", () => {
    currentMusic = currentMusic - 1
    if (currentMusic < 0) {
        currentMusic = musicList.length - 1
    }
    setMusic(currentMusic)
    playMusic()
})

$slide.addEventListener("change", () => $music.currentTime = $slide.value)

$btnVolume.addEventListener("click", () => {
    $volumeContainer.classList.toggle("hidden")
})

$volumeSlider.addEventListener("input", (e) => {
    $music.volume = e.currentTarget.value / 100
    chengeVolumeIcon(e.currentTarget.value)
})

$btnShuffle.addEventListener("click", () => {
    shuffleList()
    setMusic(0)
    playMusic()
})