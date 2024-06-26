console.log('javascript')
let songs;
let current = new Audio();
async function get() {
    let s = await fetch("http://127.0.0.1:3000/music/")
    let result = await s.text();
    let div = document.createElement("div")
    div.innerHTML = result;
    let as = div.getElementsByTagName("a")
    console.log(as)
    let songs = []
    for (let i = 0; i < as.length; i++) {
        const ele = as[i];
        if (ele.href.endsWith(".mp3")) {
            songs.push(ele.href.split("/music/")[1])
        }

    }

    return songs
}
const playMusic = (track,pause=false) => {
    current.src = "/music/" + track
    if(!pause){
        current.play()
        play1.src = "svg/pause1.svg"
    }
    
    document.querySelector(".musicname").innerHTML = decodeURI(track)
    document.querySelector(".songduration").innerHTML = "0:0 / 0:0"
}
async function main() {
    songs = await get();
    playMusic(songs[0],true)
    console.log(songs)
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="songimg" src="	https://i.scdn.co/image/ab67616d00004851a7865e686c36a4adda6c9978" alt="" height="40px" width="40px">
                                        <div class="songinfo">
                                            <div class= "text2">${song.replaceAll("%20", " ")} </div>
                                            <div class = "text3"> mugdha</div>                                   
                                        </div></li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".songinfo").firstElementChild.innerHTML)
            playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML)
        })

    })

    document.querySelector(".pbtn").addEventListener("click", ()=> {
        if (current.paused) {
            playMusic(songs[0])
            play1.src = "svg/pause1.svg"
        }
        else {
            current.pause()
            play1.src = "svg/play.svg"
        }
    })

    play1.addEventListener("click", () => {
        if (current.paused) {
            current.play()
            play1.src = "svg/pause1.svg"
        }
        else {
            current.pause()
            play1.src = "svg/play.svg"
        }
    })
    previous.addEventListener("click", () => {
        current.pause()
        console.log("Previous clicked")
        let i = songs.indexOf(current.src.split("/").slice(-1)[0])
        if ((i - 1) >= 0) {
            playMusic(songs[i - 1])
        }
    })

    
    next.addEventListener("click", () => {
        current.pause()
        console.log("Next clicked")

        let i = songs.indexOf(current.src.split("/").slice(-1)[0])
        if ((i + 1) < songs.length) {
            playMusic(songs[i + 1])
        }
    })

    function convertSecondsToMinutes(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        const paddedMinutes = String(minutes).padStart(1, '0');
        const paddedSeconds = String(remainingSeconds).padStart(1, '0');

        return `${paddedMinutes}:${paddedSeconds}`;
    }

    current.addEventListener("timeupdate", () => {
        console.log(current.currentTime, current.duration)
        document.querySelector(".songduration").innerHTML = `${convertSecondsToMinutes(current.currentTime)} / ${convertSecondsToMinutes(current.duration)}`
        document.querySelector(".circle").style.left = (current.currentTime/current.duration)*100 + "%"
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        current.volume = parseInt(e.target.value) / 100
        if (current.volume>0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("svg/mute.svg", "svg/volume.svg")
        }
    })

    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("svg/volume.svg")){
            e.target.src = e.target.src.replace("svg/volume.svg", "svg/mute.svg")
            current.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("svg/mute.svg", "svg/volume.svg")
            current.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

    document.querySelector(".bar").addEventListener("click", e => {
        let per = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = per + "%";
        current.currentTime = ((current.duration) * per) / 100
    })

    document.querySelector(".ham").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%"
    })
}
main()
