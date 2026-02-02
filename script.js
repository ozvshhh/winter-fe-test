import { getCoordinate } from "./getCoordinate.js";

let log_data;
async function getPos() {
try {
  const loc = await getCoordinate({
    targetAccuracy: 20,
    sampleWaitMs: 10000,
    retry: 2,
    debug: true,
  });
  console.log("최종 위치:", loc);
  log_data = loc.log_data;
  const view = document.querySelector(".View");
  view.textContent = log_data;

} catch (e) {
  console.error("위치 획득 실패:", e);
}
}

console.log("은동이는 바보");
getPos();


// const TheVolunteers = {
//   name : "The Volunteers",
//   prod : "The Volunteers",
//   cover: "TheVolunteers.webp",
//   tracks: [
//     "1. Radio",
//     "2. PINKTOP",
//     "3. S.A.D",
//     "4. Medicine",
//     "5. Violet",
//     "6. Nicer",
//     "7. Let Me Go!",
//     "8. Time To Fight Back In My Way",
//     "9. Summer",
//     "10. S.A.D (English Ver.)",
//   ],
// };


// const OKComputer ={ 
//     name : "OK Computer",
//     prod : "radiohead",
//     cover : "OKComputer.webp",
//     tracks : [
//     "1. Airbag",
//     "2. Paranoid Android",
//     "3. Subterranean Homesick Alien",
//     "4. Exit Music (For a Film)",
//     "5. Let Down",
//     "6. Karma Police",
//     "7. Fitter Happier",
//     "8. Electioneering",
//     "9. Climbing Up the Walls",
//     "10. No Surprises",
//     "11. Lucky",
//     "12. The Tourist",
// ]
// }

// const Keung = {
//     name : "Keung",
//     prod : "C Jamm",
//     cover : "keang.webp",
//     tracks : [
//     "1. 가끔 난 날 안 믿어",
//     "2. 원래 난 이랬나",
//     "3. slay",
//     "4. 휙",
//     "5. 끽(feat. Yescoba)",
//     "6. ㅈ",
//     "7. 샹송",
//     "8. 코케인 러브❤ (feat. Yescoba)",
//     "9. 약빨 (feat. Yescoba)",
//     "10. 메들리",
//     "11. 포커페이스",
//     "12. 왈",
// ]
// };



// const KFlip ={
//     name : "KFlip+",
//     prod : "식케이 & Lil Moshpit",
//     cover : "KFlip+.webp",
//     tracks :  [
//     "1. K-Flip",
//     "2. KC2 (Feat. JMIN, 김하온 (HAON))",
//     "3. LALALA (Snitch Club)",
//     "4. SELF HATE (Feat. 호미들)",
//     "5. TITLE PUBLIC ENEMY (Feat. 노윤하, Wuuslime))",
//     "6. MADE IN KCOREA (1TAKEBAR)",
//     "7. LOV3 (Feat. Bryan Chase, Okasian)",
//     "8. NEW ANTHEM (Feat. PENOMECO)",
//     "9. PUBLIC ENEMY REMIX (Feat. CHANGMO, ZICO)",
//     ]
// };

// const yaho ={
//     name : "yaho",
//     prod : "EK",
//     cover : "yaho.webp",
//     tracks :  [
//         "1. YAHO",
//         "2. MollyWorld (feat. GV)",
//         "3. FLY",
//         "4. 초신성",
//         "5. Machine",
//         "6. Back In The Building (Feat. Jeremy Que$t)",
//         "7. 야관문",
//         "8. SKIT (삼각관계)",
//         "9. 똑같아 (Feat. 염따)",
//         "10. AFTER PARTY",
//         "11. 엄마잘",
//         "12. MR.P",
//         "13. SKIT (블링블링)",
//         "14. 해뜰날",
//         "15. Religion True (Feat. MILLHAM)",
//     ]
// };


// const song_img = document.querySelector(".song_img");
// const album_title = document.querySelector(".album_title");
// const prod = document.querySelector(".prod");
// const list = document.querySelector(".list");

// const TheVolunteers_album = document.querySelector(".TheVolunteers");
// const OKComputer_album = document.querySelector(".OKComputer");
// const Keung_album = document.querySelector(".Keung");
// const KFlip_album = document.querySelector(".KFlip");
// const yaho_album = document.querySelector(".yaho");

// function renderCover(album) { 
//     song_img.src = album.cover;
// }

// function renderTracks(album) {

//   list.innerHTML = album.tracks
//     .map((track) => {
//         const track_name = track.split(". ")[1];
//         return(`<a target="_blank" href="https://www.youtube.com/results?search_query=${album.name} ${track_name}"><div class="ui" href>${track}</div></a>`)
//     })
//     .join("");
// }

// function renderName(album){
//     album_title.textContent = album.name;
//     prod.textContent = album.prod;
// }



// function renderAlbum(album){
//     renderCover(album);
//     renderTracks(album);
//     renderName(album);
// }



// TheVolunteers_album.addEventListener("click",()=>{renderAlbum(TheVolunteers)});
// OKComputer_album.addEventListener("click",()=>{renderAlbum(OKComputer)});
// Keung_album.addEventListener("click",()=>{renderAlbum(Keung)});
// KFlip_album.addEventListener("click",()=>{renderAlbum(KFlip)});
// yaho_album.addEventListener("click",()=>{renderAlbum(yaho)});

// renderAlbum(TheVolunteers);



