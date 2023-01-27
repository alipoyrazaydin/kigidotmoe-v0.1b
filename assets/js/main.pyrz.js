var Application = document.getElementById("app");
var NavigationBar = document.getElementById("nav");
var Root = document.documentElement;

function dangerloggie(){console.log("%cPlease Stop!! >_<\n%cPlease do not edit nor steal anything from here or i'll be sad (;_;)\n\nCompany: https://cottocode.com.tr", "color:#FF2B63; font-size: x-large", "font-size: large");}
$(window).on("load", function(){
    dangerloggie();
    dangerloggie();
    dangerloggie();
    
    document.getElementById("preloader").classList.add("c");
    setTimeout(function(){document.getElementById("p1").classList.add("prldload")},0);
    setTimeout(function(){document.getElementById("p2").classList.add("prldload")},100);
    setTimeout(function(){document.getElementById("p3").classList.add("prldload")},200);
    setTimeout(function(){document.getElementById("p4").classList.add("prldload")},300);
});

function pageLoader(link){
    var Preloader = document.getElementById("preloader");
    Preloader.classList.add("pbg");
    Preloader.classList.remove("c");
    window.location=link;
};
$('a').on('click',function(event){
	if ($(this).attr('href').startsWith("#") == false){
		event.preventDefault();
		pageLoader(this.href);
	}
});
document.querySelectorAll(".navigation_bar .logo").item(1).onclick = function(){
  document.querySelectorAll(".hero > .container").item(0).classList.toggle("crev")
  document.querySelectorAll(".hero > .container").item(1).classList.toggle("crev")
}


// thanks : https://github.com/yek-org/yek-js & https://www.npmjs.com/package/jsmediatags & https://mp3tag.js.org
// NOTE [play/pause]
const $_player = query("#music-player");
const $_file = query("#file-audio");
const $_play = query("#music-play");
const $_forward = query("#music-forward");
const $_backward = query("#music-backward");
const $_seek = query("#music-seek");
const $_volume = query("#music-volume");
const $_volume_btn = query("#music-volume-btn");
const $_duration = query("#music-duration");
const $_currentTime = query("#music-current-time");
const $_cover = query("#music-cover");
const $_trackName = query("#music-title");
const $_artist = query("#music-desc");
const $_repeat = query("#music-repeat");
const $_shuffle = query("#music-shuffle");
const $_playlist_open = query("#music-playlist-open");
const $_playlist_close = query("#playlist-close-btn");
const $_playlist = query("#music-playlist");
const $_playlist_tracks = query("#playlist-tracks");
const $audio = query("#music-audio");
// is-state
const state = {
  lastVolume: 0.5,
  currentTrackIndex: 0,
  repeatCount: 2,
  isShuffle: false,
  isPlaylist: false,
  playlist: {
    currentItem: null
  }
};
const defaultTrack = {
  // id: (() => trackList.slice(-1).id + 1)(),
  cover: ``,
  title: `Unknown`,
  artist: `unknown`
};
const fixPath = `assets/music`;
// TODO : use online src link
// NOTE : artist can be array of artist [a, b, ...] also
let trackList = [
  {
    id: 0,
    title: `Lunatic`,
    src: `${fixPath}/LTEKLunatic/Lunatic.mp3`,
    artist: `Loctek`,
    cover: `${fixPath}/LTEKLunatic/artwork.jpg`
  },
  {
    id: 1,
    title: `phony (K*C*HACK bootleg)`,
    src: `${fixPath}/KAFUPhonyBootleg/phony.mp3`,
    artist: `【KAFU】, K*C*HACK`,
    cover: `${fixPath}/KAFUPhonyBootleg/artwork.jpg`
  },
  {
    id: 2,
    title: `SALMON CANNON DELUXE`,
    src: `${fixPath}/NanoraySCD/SCD.mp3`,
    artist: `NANORAY`,
    cover: `${fixPath}/NanoraySCD/artwork.jpg`
  },
  {
    id: 3,
    title: `Define Your Beats (Extended Mix)`,
    src: `${fixPath}/DefBeatEX/DEFBEATEX.mp3`,
    artist: `YUPPUN`,
    cover: `${fixPath}/DefBeatEX/artwork.jpg`
  }
];

// +++ HELPER FUNCTIONS +++ //

function fixArtist(artist) {
  if (isType(artist, "array")) return artist.join(" & ");
  return artist;
}
function stopTrack() {
  $audio.pause();
  $audio.currentTime = 0;
  fixVariable("seek_listener_percentage", `0%`);
}
function goShuffle() {
  let shuffleIndex = fixRandom(0, trackList.length - 1);
  let selectedTrack = trackList[shuffleIndex];
  // $audio.pause();
  updateMetaData(selectedTrack.src);
  $audio.play();
  return selectedTrack;
}

function goForward() {
  if (state.isShuffle) return goShuffle();

  if (state.isPlaylist) goCurrentPlaylistItem();

  // FIXME : `$audio.pause();` should be before changes
  state.currentTrackIndex +=
    state.currentTrackIndex + 1 >= trackList.length
      ? -(trackList.length - 1)
      : 1;
  updateMetaData(trackList[state.currentTrackIndex].src);
  $audio.play();
}
function goBackward() {
  if (state.isShuffle) return goShuffle();

  if (state.isPlaylist) goCurrentPlaylistItem();

  // FIXME : `$audio.pause();` should be before changes and play
  state.currentTrackIndex -=
    state.currentTrackIndex - 1 < 0 ? -(trackList.length - 1) : 1;
  updateMetaData(trackList[state.currentTrackIndex].src);
  $audio.play();
}
function updateMetaData(src) {
  let currentTrack = trackList[state.currentTrackIndex];
  $_trackName.textContent = currentTrack.title || defaultTrack.title;
  $_artist.textContent = fixArtist(currentTrack.artist) || defaultTrack.artist;
  $_cover.setAttribute("src", currentTrack.cover || defaultTrack.cover);
  return src && $audio.setAttribute("src", src);
}
function updateRepeat({ repeatCount }) {
  // TODO : refactor
  switch (repeatCount) {
    case 2:
    default:
      $_repeat.className.indexOf("music__repeat--once") != -1 &&
        $_repeat.classList.remove("music__repeat--once");
      $_repeat.className.indexOf("music__repeat--on") == -1 &&
        $_repeat.classList.add("music__repeat--on");
      $_repeat.classList.add("music__repeat--all");
      break;
    case 0:
      $_repeat.className.indexOf("music__repeat--all") != -1 &&
        $_repeat.classList.remove("music__repeat--all");
      $_repeat.className.indexOf("music__repeat--once") != -1 &&
        $_repeat.classList.remove("music__repeat--once");
      $_repeat.className.indexOf("music__repeat--on") != -1 &&
        $_repeat.classList.remove("music__repeat--on");
      break;
    case 1:
      $_repeat.className.indexOf("music__repeat--all") != -1 &&
        $_repeat.classList.remove("music__repeat--all");
      $_repeat.className.indexOf("music__repeat--on") == -1 &&
        $_repeat.classList.add("music__repeat--on");
      $_repeat.classList.add("music__repeat--once");
      break;
  }

  return repeatCount === 1
    ? $_repeat.firstElementChild.classList.replace("fa-repeat", "fa-repeat-1")
    : $_repeat.firstElementChild.classList.replace("fa-repeat-1", "fa-repeat");
}

function goCurrentPlaylistItem() {
  let $currentItem = [...$_playlist_tracks.children].filter(
    ($track) =>
      parseInt($track.dataset.id) == trackList[state.currentTrackIndex].id
  )[0];
  [...$_playlist_tracks.children].map(
    ($track) =>
      $track.className.indexOf("playlist__track--current") != -1 &&
      $track.classList.remove("playlist__track--current")
  );
  $currentItem.className.indexOf("playlist__track--current") == -1 &&
    $currentItem.classList.add("playlist__track--current");
  $currentItem.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest"
  });
}
function muteVolume() {
  let $this = $_volume_btn.firstElementChild;
  fixVariable("volume_listener_percentage", `0%`);
  $this.classList.remove("fa-volume");
  $this.classList.add("fa-volume-mute");
  $audio.volume = 0;
}
function unMuteVolume() {
  let $this = $_volume_btn.firstElementChild;
  fixVariable(
    "volume_listener_percentage",
    `${fixFloat(state.lastVolume * 100, 3)}%`
  );
  $audio.volume = state.lastVolume;
  $this.classList.remove("fa-volume-mute");
  $this.classList.add("fa-volume");
}

// listener(window, 'load', () => ($audio.volume = 0.5));

// TODO : playlist
function generatePlaylist(tracks = trackList) {
  const playlistItem = ({ id, src, cover, title, artist }) => {
    const bem = "playlist";
    return createElement(
      "li",
      {
        class: `${bem}__track`,
        id: `playlist-track-${id}`,
        "data-src": src,
        "data-id": id
      },
      [
        createElement("img", {
          src: cover,
          class: `${bem}__cover`,
          alt: `cover of ${title} from ${fixArtist(artist)}`
        }),
        createElement("div", { class: `${bem}__meta` }, [
          // TOGGLE : [h3:strong]
          createElement("strong", { class: `${bem}__title` }, title),
          createElement("span", { class: `${bem}__artist` }, fixArtist(artist))
        ])
      ]
    );
  };
  let $tracks = tracks.map((track) => playlistItem(track));
  $tracks.map(($track) => append($_playlist_tracks, $track));
  return goCurrentPlaylistItem();
}

// +++ EVENT HANDLERS +++ //
// [repeat-btn]:click
listener($_repeat, "click", () => {
  state.repeatCount -= state.repeatCount - 1 < 0 ? -2 : 1;
  updateRepeat(state);
});
// [shuffle-btn]:click
listener($_shuffle, "click", () => {
  $_shuffle.classList.toggle("music__shuffle--on");
  state.isShuffle = !state.isShuffle;
});

// [file]:change
listener($_file, "change", () => {
  // $audio.pause();
  [...Array($_file.files.length).keys()].forEach((index) => {
    let file = $_file.files[index];
    let src = URL.createObjectURL(file);
    fetchMetadata(file, (tags) => {
      let track = {
        id: (() => trackList[trackList.length - 1].id + 1)(),
        title: tags.title,
        cover: tags.picture && fetchCover(tags.picture),
        artist: tags.artist,
        src
      };
      trackList.push(track);
    });
    updateMetaData(src);
  });
  $audio.play();
});

// ALT
/*
listener($_file, 'change', () => {
  $audio.pause();
  [...Array($_file.files.length).keys()].forEach((index) => {
    let file = $_file.files[index];
    let src = URL.createObjectURL(file);
    fetchMetadata2(file, (tags) => {
      let track = {
        id: (() => trackList[trackList.length - 1].id + 1)(),
        title: tags.title,
        cover: tags.v2.APIC[0] && fetchCover(tags.v2.APIC[0]),
        artist: tags.v2.TPE1,
        src,
      };
      trackList.push(track);
    });
    updateMetaData(src);
  });
  $audio.play();
});
*/

// [file]:drag/drop
window.ondragenter = (e) => {
  // $audio.pause();
  $_file.classList.add("music__uploader--show");
  $_player.classList.add("music--upload");
};
$_player.ondrop = () => {
  $audio.play();
  $_file.classList.remove("music__uploader--show");
  $_player.classList.remove("music--upload");
};

// [audio]:play
listener($audio, "playing", () => updateMetaData());

// [audio]:canplaythrough
listener(
  $audio,
  "durationchange",
  () => ($_duration.textContent = fixMoment($audio.duration))
);

// [audio]:time-update
listener(
  $audio,
  "timeupdate",
  () => ($_currentTime.textContent = fixMoment($audio.currentTime))
);

// [auido]:time-update
listener($audio, "timeupdate", () => {
  let percentage = fixPercentage(
    parseFloat($audio.currentTime),
    parseFloat($audio.duration)
  );
  fixVariable("seek_listener_percentage", `${percentage}%`);
});

// [seek]:seeked
listener($_seek, "mousedown", () => $audio.pause());
listener($_seek, "mouseup", () => $audio.play());
listener($_seek, "click", (ev) => {
  let { offsetX: value } = ev;
  let { offsetWidth: max } = $_seek;
  // calc motion
  let percentage = fixPercentage(value, max);
  // TOGGLE
  fixVariable("seek_listener_percentage", `${percentage}%`);
  // calc value
  let amount = fixFloat((percentage / 100) * parseFloat($audio.duration), 3);
  $audio.currentTime = amount;
});

// [volume]:seeked
listener($_volume, "click", (ev) => {
  let { offsetX: value } = ev;
  let { offsetWidth: max } = $_volume;
  // calc motion
  let percentage = fixPercentage(value, max);
  // TOGGLE
  fixVariable("volume_listener_percentage", `${percentage}%`);
  // calc value
  let amount = fixFloat(percentage / 100, 3);
  if ($audio.volume <= 0.1) return muteVolume();
  $audio.volume = amount;
});
listener($audio, "volumechange", () => {
  $_volume.setAttribute(`title`, `${fixFloat($audio.volume * 100, 3)}%`);
});
listener($_volume_btn, "click", () => {
  $_volume_btn.firstElementChild.className.indexOf(`fa-volume-mute`) != -1
    ? unMuteVolume()
    : (() => {
        state.lastVolume = $audio.volume >= 0.1 ? $audio.volume : 0.1;
        muteVolume();
      })();
});

// [backward]:click
listener($_backward, "click", () => goBackward());

// [forward]:click
listener($_forward, "click", () => goForward());

listener(
  $audio,
  "ended",
  () =>
    // repeat-all-track
    (state.repeatCount === 2 && $audio.play()) ||
    // repeat-once-track
    (state.repeatCount !== 1 && goForward()) ||
    // dont-repeat
    stopTrack()
);

// [play]:click
listener($_play, "click", () =>
  $audio.paused ? $audio.play() : $audio.pause()
);

// [audio]:play
listener($audio, "play", () => {
  $_play.setAttribute("title", "play");
  $_play.classList.replace(`music__btn--pause`, `music__btn--play`);
  $_play.children.item(0).classList.replace("fa-play", "fa-pause");
});

// [audio]:pause
listener($audio, "pause", () => {
  $_play.setAttribute("title", "pause");
  $_play.classList.replace(`music__btn--play`, `music__btn--pause`);
  $_play.children.item(0).classList.replace("fa-pause", "fa-play");
});

// +++ VENDORS +++ //

// NOTE : src from `https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js`
function fetchMetadata(audio, cb) {
  jsmediatags.read(audio, {
    onSuccess: ({ tags }) => cb(tags),
    onError: function (error) {
      console.log(error);
    }
  });
}

// FIXME : need to sync with other codes
// NOTE : src from `https://cdn.jsdelivr.net/npm/mp3tag.js@latest/dist/mp3tag.min.js`
function fetchMetadata2(url, cb) {
  const reader = new FileReader();
  reader.onload = function () {
    const buffer = this.result;
    // MP3Tag Usage
    const mp3tag = new MP3Tag(buffer);
    mp3tag.read();
    cb(mp3tag.tags);
  };
  reader.readAsArrayBuffer(url);
}

function fetchCover({ data, format }) {
  let base64String = "";
  for (let item of data) {
    base64String += String.fromCharCode(item);
  }
  return `data:${data.format};base64,${window.btoa(base64String)}`;
}

function fixFloat(value, decimals) {
  return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
}

function fixPad(number) {
  let num = parseInt(number);
  return num >= 0 && num <= 9 ? `0${num}` : num;
}

function fixPercentage(value, total) {
  return fixFloat((value / total) * 100, 3);
}

function fixMoment(time) {
  let $time = moment.duration(parseInt(time), "seconds");
  let hour = $time.hours();
  let min = $time.minutes();
  let sec = $time.seconds();
  let _hour = hour > 0 ? `${fixPad(hour)} : ` : ``;
  let _min_sec = `${fixPad(min)} : ${fixPad(sec)}`;
  return `${_hour}${_min_sec}`;
}

function fixVariable(variable, value) {
  document.documentElement.style.setProperty(`--${variable}`, value);
}

// FIXME : need to use new methods
function fixBase64(url, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = `blob` || "arraybuffer";
  xhr.onload = function () {
    // NOTE : metadata as callback, response is `arrayBuffer`
    if (xhr.status === 200) return cb(xhr.response);
    return console.log(`[fixBase64] : xhr error!`);
  };
  xhr.onerror = () => console.log(`[fixBase64] : network error!`);
  xhr.send();
}

function fixRandom(min, max) {
  let _min = max ? min : 0;
  let _max = max || min;
  return Math.floor(Math.random() * (_max - _min + 1)) + _min;
}
updateMetaData(trackList[0].src)
