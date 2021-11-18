/*
Name: Chris Botuli
Email: cbotu861@mtoryal.ca
Course: COMP 3612
Assingment: 2

Limitations: Hover will not work, but clicking the credit button functionally does the same thing. Will only display the first act and first scene of the play.
             Will not switch between Acts, nor will it display players. Will not display scenes. Can't sort. Plays can sort of 'stack' on each other if view text is preseed multiple times.
*/
	
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php';

/*
 To get a specific play, add play's id property (in plays.json) via query string, 
   e.g., url = url + '?name=hamlet';
 
 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=hamlet
 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=jcaesar
 https://www.randyconnolly.com/funwebdev/3rd/api/shakespeare/play.php?name=macbeth
 
 NOTE: Only a few plays have text available. If the filename property of the play is empty, 
 then there is no play text available.
*/
 

/* note: you may get a CORS error if you test this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/


const data = JSON.parse(content);



document.addEventListener("DOMContentLoaded", function(){

  HideShowCredit();

    for (let d of data){
      populatePlayList(d);

    }
    DisplayPlayInfo();
  
})



/*Used to show the name and course once the button is clicked*/
function HideShowCredit() {
  let header = document.querySelector('header h1');
  let myName = document.createElement("p");
  myName.setAttribute('id', 'credit');
  myName.textContent = "    |Chris Botuli COMP 3612|  ";
  header.appendChild(myName);

  let btn = document.createElement("button");
  btn.innerHTML = "Credit";
  btn.setAttribute('id', 'creditButton');
  header.appendChild(btn);
  
  btn.addEventListener("click", function () {

    let toggle = document.getElementById('credit');
    setTimeout(function displayAlert() {
      toggle.style.display = 'block';
      toggle.style.display = 'inline';
    }, 0000);

    setTimeout(function hideAlert() {
      toggle.style.display = 'none';

    }, 5000);




  });
}

/*Will display information about the play*/
function DisplayPlayInfo(){

  document.querySelectorAll("#playList ul li").forEach(playInfo => {
    
    playInfo.addEventListener("click", function displayInfo() {

       /*Used to toggle the visibility of the initial interface */ 
      let toggle = document.getElementById('initialInterface');
      toggle.style.display = "block"

      const id = playInfo.getAttribute('data-id');
      displayDetails(id, data);
      displayInitialInterface(id, data);
      


    })

   })
}
 /*Will display information about the play, like the title and synopsis, gives an option to view excerpts of the play*/
function displayInitialInterface(id, data){
  for (let p of data){

    if (p.id === id){
  const select = document.querySelector('#initialInterface');
  let h1 = document.createElement('h1');
  let text = document.createElement('div');
  let space = document.createElement('p');


  let textTitle = document.createTextNode(`${p.title}`);
  h1.appendChild(textTitle);

  let synopsis = document.createTextNode(`${p.synopsis}`);
  text.appendChild(synopsis);

  select.innerHTML = h1.outerHTML + text.outerHTML + space.outerHTML;


      if (p.filename !== ""){
        //create the button. Source: https://sebhastian.com/javascript-create-button/
        let btn = document.createElement("button");
        btn.innerHTML = "View Play Text";
        btn.addEventListener("click", function (){

          
          toggleAfterViewText();
          
          fetch (api +  '?name=' + p.id)
            .then (response => response.json())
            .then(content => { const container = document.querySelector ('#playHere');



              //stringfy content from api/url
              console.log('fetch sucessful');

              let playText = JSON.stringify(content);
              const play = JSON.parse(playText);

              let { playTitle, actName, sceneName, title, direction } = writePlayInfo(play);

             let act =  populateActsMenu(play);
              let scene = populateScenesMenu(play);



              let div = writePlayText(play, act);

              container.innerHTML = playTitle.outerHTML + actName.outerHTML + sceneName.outerHTML + title.outerHTML + direction.outerHTML + div.outerHTML ;


        }
              )

        } 
        )
        select.appendChild(btn);
      }
      
    }
}
}

/* NOT WORKING: Meant to populate the 'scenes' drop down menu*/
function populateScenesMenu(play) {
  let selectScene = document.querySelector('#sceneList');

  for (let scene of play.acts) {

    let option = document.createElement('option');
    let sceneName = scene.scenes.name;
    let sceneText = document.createTextNode(sceneName);

    console.log('im in the scenes');

    option.appendChild(sceneText);

    selectScene.appendChild(option);
  }
}
/* Will populate the acts drop down menu*/
function populateActsMenu(play) {
  let selectAct = document.querySelector('#actList');

  for (let act of play.acts) {

    let option = document.createElement('option');
    let actName = act.name;
    let actText = document.createTextNode(actName);

    option.appendChild(actText);

    selectAct.appendChild(option);
  }
}

/* Used to toggle on and off, the various interfaces */
function toggleAfterViewText() {
  let toggle = document.getElementById('initialInterface');
  toggle.style.display = "none";

  let toggle2 = document.getElementById('playDetails');
  toggle2.style.display = "none";

  let toggle3 = document.getElementById('interface');
  toggle3.style.display = "block";

  let toggle4 = document.getElementById('playHere');
  toggle4.style.display = "block";

  let toggle5 = document.getElementById('btnClose');
  toggle5.style.display = "block";
}

/* Displays intitial play information */
function writePlayInfo(play) {
  let playTitle = document.querySelector('#playHere h2');
  let textTitle = document.createTextNode(`${play.title}`);
  playTitle.appendChild(textTitle);

  let actName = document.querySelector('#actHere h3');
  let actText = document.createTextNode(`${play.acts[0].name}`);
  actName.appendChild(actText);

  let sceneName = document.querySelector('#sceneHere h4');
  let sceneText = document.createTextNode(`${play.acts[0].scenes[0].name}`);
  sceneName.appendChild(sceneText);

  let title = document.querySelector('.title');
  let titleText = document.createTextNode(`${play.acts[0].scenes[0].title}`);
  title.appendChild(titleText);

  let direction = document.querySelector('.direction');
  let directionText = document.createTextNode(`${play.acts[0].scenes[0].stageDirection}`);
  direction.appendChild(directionText);
  return { playTitle, actName, sceneName, title, direction };
}

/*Writes out the play text*/ 
function writePlayText(play, act) {
  let div = document.createElement('div');
let i=0;
if (act === 'ACT II'){
  i = 1
}
if (act === 'ACT III'){
  i = 2
}

  for (s of play.acts[i].scenes[i].speeches) {
    let speaker = s.speaker;
    let lines = s.lines;
    let p = document.createElement('p');
    let p2 = document.createElement('p');


    let speakerText = document.createTextNode(speaker);
    let lineText = document.createTextNode(lines);
    p.appendChild(speakerText);
    p2.appendChild(lineText);
    div.appendChild(p);
    div.appendChild(p2);
  }
  return div;
}


function displayDetails(id, data){
  for (let p of data){
        
    if (p.id === id){
        
        const select = document.querySelector('#playDetails');
        
        let h2 = document.createElement('h2');
        let h3 = document.createElement('h2');
        let h4 = document.createElement('h2');
        let wikiLink = document.createElement('a');
        let gutenLink = document.createElement('a');
        let shakeLink = document.createElement('a');
        let desc = document.createElement('div');
        let space = document.createElement('p');
        
        let textTitle = document.createTextNode(`${p.title}`);
        h2.appendChild(textTitle);
         
        let textDate = document.createTextNode(`${p.likelyDate}`);
        h3.appendChild(textDate);

        let textGenre = document.createTextNode(`${p.genre}`);
        h4.appendChild(textGenre);

        let descText = document.createTextNode(`${p.desc}`);
        desc.appendChild(descText);

        let textWiki = document.createTextNode('Wikipedia');
        wikiLink.href = `${p.wiki}`;
        wikiLink.appendChild(textWiki);

        let textGuten = document.createTextNode('Gutenberg');
        gutenLink.href = `${p.gutenberg}`;
        gutenLink.appendChild(textGuten);

        let textShakespeare = document.createTextNode('Shakespere Org');
        shakeLink.href = `${p.shakespeareOrg}`;
        shakeLink.appendChild(textShakespeare);


        /* Replaces the previous play's info with the current one */
        select.innerHTML = h2.outerHTML + h3.outerHTML + h4.outerHTML + wikiLink.outerHTML + space.outerHTML +  gutenLink.outerHTML + space.outerHTML + shakeLink.outerHTML + desc.outerHTML; 

        console.log('I got to here!');
      
    }
       
  }
}

/* Populates the playlist*/
function populatePlayList(play) {
  let titles = document.createElement("li");
  titles.textContent = play.title;
  titles.setAttribute('data-id', play.id);
  let select = document.querySelector('#playList ul');
  select.append(titles);
}



