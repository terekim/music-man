
// Establish all variables that your Analyser will use
var audio, canvas, ctx, source, analyser, fbc_array, bars, bar_x, bar_width, bar_height, avg_bass, avg_mid, avg_high;
var duration;
var sampleRate = 44100;
// Initialize the MP3 player after the page loads all of its HTML into the window
// window.addEventListener("load", initMp3Player, false);
// document.getElementById("play").addEventListener("click", initAudio, false);

$(document).ready(function (){
  adjustPositions();
});

function adjustPositions() {
  setTimelineWidth();
  setContentMargin();
}

function setContentMargin() {
  var contentMarginTop = window.innerHeight* 0.06;
 $(".content").css("margin-top", contentMarginTop);

}

function setTimelineWidth(){
  var timelineWidth = window.innerWidth - 150;
 $("#timeline").css("width", timelineWidth);

}

$(".upload-button").on("change", doSomething);


$("#fileselect").on("change", initAudio);

function animateOverlay() {
  $(".upload-overlay").animate({ "top": "100%" }, "slow" );
}


function doSomething() {

  animateOverlay();
  audio = new Audio();
  audio.controls = false;
  audio.loop = true;
  audio.autoplay = false;
  audio.src = URL.createObjectURL($('.upload-button')[0].files[0]);
  initMp3Player(audio);
}

function initAudio(){
  console.log("yo")
  audio = {};


  audio = new Audio();
  audio.controls = false;
  audio.loop = true;
  audio.autoplay = false;
  audio.src = URL.createObjectURL($('#fileselect')[0].files[0]);
  initMp3Player(audio);
}

function initMp3Player(audio){
  $('#controls audio').remove();
  var context = new AudioContext(); // AudioContext object instance
  $('#controls').append(audio);


  audio.addEventListener("loadeddata", function() {
    console.log("data laoded")
    duration = this.duration;
    init();
    timeUpdate();
    pButton.className = "";
    pButton.className = "play";


  });



  // pButton.className = "";
  // pButton.className = "play";

  analyser = context.createAnalyser(); // AnalyserNode method

  // Re-route audio playback into the processing graph of the AudioContext
  source = context.createMediaElementSource(audio); 
  source.connect(analyser);
  analyser.connect(context.destination);
  analyser.fftSize = 1024;
  frameLooper();
}
// frameLooper() animates any style of graphics you wish to the audio frequency
// Looping at the default frame rate that the browser provides(approx. 60 FPS)
function frameLooper(){
  window.requestAnimationFrame(frameLooper);
  //instantiating array of with same size as analyser frequency bin count

  //analyser.frequencyBinCount = 0 - 256
  fbc_array = new Uint8Array(analyser.frequencyBinCount);
  frequencies = new Float32Array(analyser.frequencyBinCount);
  analyser.getFloatFrequencyData(frequencies);
  // frequency = calculateHertz(frequencies);
  //values here are from 0-255
  //converting the analyser frequency into javascript array
  analyser.getByteFrequencyData(fbc_array);

  changeBackground(fbc_array);
  animateBody(fbc_array);
  animateMouth(fbc_array);
  animateHead(fbc_array);
    animateEars(fbc_array);

  animateSnapBack(fbc_array);
  animatePupils(fbc_array);
  animateChest(fbc_array);
  animateArms(fbc_array);
  animateLegs(fbc_array);

  // animateEyes(frequency)
  // console.log(fbc_array[0]);
}

function animateHead(fbc){
  
  var avg_bass = (fbc[0] + fbc[1])/2; 
  var headBassScale = (parseFloat(avg_bass)/210); //180 seems reasonably normalish

  if(headBassScale >= 1) {
    $(".head").css("transform", "scale(" + (headBassScale) + ")");
  }
}

function animateBody(fbc){
  var avg_bass = (fbc[0] + fbc[1])/2; 
  var bodyBassScale = (parseFloat(avg_bass)/230); //180 seems reasonably normalish

  if(bodyBassScale >= 1) {
    // $(".upperbody").css("transform", "scale(" + bodyBassScale + ")");
    $(".lowerbody").css("transform", "scale(" + bodyBassScale + ")");
  }
}

function animateEars(fbc){
  var avg_bass = (fbc[0] + fbc[1])/2; 
  var earBassScale = (parseFloat(avg_bass)/200); //180 seems reasonably normalish

  if(earBassScale >= 1) {
    $(".ear").css("transform", "scale(" + (earBassScale) + ")");
  }
}

function animateMouth(fbc){

  var tot_mid = 0;
  for(var i = 10; i < 27; i++) {
    tot_mid = tot_mid + fbc[i];
  }
  // console.log(tot_mid)
  var avg_mid = tot_mid/17;

  var midScale = (parseFloat(avg_mid)/180); //180 seems reasonably normalish
  if (midScale >= 0.7) {
    $(".inside-mouth").css("height", (0 + Math.pow(1+midScale, 5)));
  }
  if (midScale == 0 && ($(".inside-mouth").css("height") !== 2)) {
    $(".inside-mouth").animate({ "height": 2 }, "fast" )
  }

}

function animateSnapBack(fbc) {
  var tot_high = 0;
  for(var i = 50; i < 150; i++) {
    tot_high = tot_high + fbc[i];
  }

   // console.log(tot_mid)
  var avg_high = tot_high/100;

  // console.log(avg_high);
  var highScale = (parseFloat(avg_high)/180); //180 seems reasonably normalish
  if (highScale >= 0.6) {
    // var weird = highScale - 0.7
    $(".snapback-body").css("background-color", "hsl(" +(((highScale-0.6)*(340-207)/0.6) + 207) + ",75%, 60%)");
  }
  if (highScale == 0) {
    $(".inside-mouth").animate({ "background-color": "steelblue" }, "fast" )
  }
}

function animatePupils(fbc) {
  var tot_high = 0;
  for(var i = 50; i < 150; i++) {
    tot_high = tot_high + fbc[i];
  }

   // console.log(tot_mid)
  var avg_high = tot_high/100;

  // console.log(avg_high);
  var highScale = (parseFloat(avg_high)/180); //180 seems reasonably normalish
  if (highScale >= 0.6) {
    // var weird = highScale - 0.7
    $(".pupil").css("background-color", "hsl(100,"+ (((highScale-0.6)*(80)/0.6))+ "%, 60%)");
  }
  // if (highScale == 0) {
  //   $(".inside-mouth").animate({ "background-color": "steelblue" }, "fast" )
  // }
}

function animateChest(fbc) {
  var avg_bass = (fbc[0] + fbc[1])/2; 
  var chestBassScale = (parseFloat(avg_bass)/220); //180 seems reasonably normalish

  if(chestBassScale >= 1) {
    $(".chest").css("transform", "scale(" + (chestBassScale) + ")");
  }

  var tot_high = 0;
  for(var i = 50; i < 150; i++) {
    tot_high = tot_high + fbc[i];
  }

   // console.log(tot_mid)
  var avg_high = tot_high/100;

  // console.log(avg_high);
  var highScale = (parseFloat(avg_high)/180); //180 seems reasonably normalish
  if (highScale >= 0.6) {
    // var weird = highScale - 0.7
    $(".chest").css("background-color", "hsl(" +(((highScale-0.6)*(0-182)/0.6) + 182) + "," + (((highScale-0.6)*(100-25)/0.6) + 25) + "%, 50%)");
    $(".chest").css("border-color", "hsl(" +(((highScale-0.6)*(0-182)/0.6) + 182) + "," + (((highScale-0.6)*(100-25)/0.6) + 25) + "%, 50%)");
  }

}

function animateArms(fbc) {
  var avg_bass = (fbc[0] + fbc[1])/2; 
  var armBassScale = (parseFloat(avg_bass)/240); //180 seems reasonably normalish
  var rotatingDegree = 8+Math.pow(armBassScale, 40);
  if(armBassScale >= 1) {
    $(".left-arm").css("transform", "rotateZ(" + rotatingDegree+"deg) scale(" + (armBassScale) + ")");
    $(".right-arm").css("transform", "rotateZ(-" + rotatingDegree+"deg) scale(" + (armBassScale) + ")");
  }
  var tot_high = 0;
  for(var i = 50; i < 150; i++) {
    tot_high = tot_high + fbc[i];
  }

   // console.log(tot_mid)
  var avg_high = tot_high/100;

  // console.log(avg_high);
  var highScale = (parseFloat(avg_high)/150); //180 seems reasonably normalish
  if (highScale >= 0.6) {
    // var weird = highScale - 0.7
    $(".arm").css("background-color", "hsl(" +(((highScale-0.6)*(0-100)/0.6)) + "," + (((highScale-0.6)*(100-68)/0.6) + 68) + "%, 42%)");
  }

}

function animateLegs(fbc) {
  var tot_high = 0;
  for(var i = 50; i < 150; i++) {
    tot_high = tot_high + fbc[i];
  }

   // console.log(tot_mid)
  var avg_high = tot_high/100;

  // console.log(avg_high);
  var highScale = (parseFloat(avg_high)/130); //180 seems reasonably normalish
  if (highScale >= 0.6) {
    // $(".legs").css("background-color", "hsl(180,25%," + (((highScale-0.6)*(0-25)/0.6) + 25) + "%)");
    $(".legs").css("background-color", "hsl(" +(((highScale-0.6)*(360-180)/0.6) + 180) + "," + (((highScale-0.6)*(100-25)/0.6) + 25) + "%, 25%)");

  }

}

function changeBackground(fbc) {
  var tot_high = 0;
  for(var i = 50; i < 250; i++) {
    tot_high = tot_high + fbc[i];
  }

   // console.log(tot_mid)
  var avg_high = tot_high/200;

  // console.log(avg_high);
  var highScale = (parseFloat(avg_high)/180); //180 seems reasonably normalish
  if (highScale >= 0.6) {
    // $(".legs").css("background-color", "hsl(180,25%," + (((highScale-0.6)*(0-25)/0.6) + 25) + "%)");
    $("body").css("background-color", "hsl(" +(((highScale-0.6)*(0-340)/0.6) + 340) + ",60%, 65%)");
    $(".thigh-gap").css("background-color", "hsl(" +(((highScale-0.6)*(0-340)/0.6) + 340) + ",60%, 65%)");

  }
}

var music, duration, pButton, playhead, timeline, timelineWidth;
  // Boolean value so that mouse is moved on mouseUp only when the playhead is released 
  var onplayhead = false;


function init(){


  // music = document.getElementById('controls').getElementsByTagName('audio')[0]; // play button
  music = audio;
  // console.log(audio);
  // console.log(document.getElementById('controls').getElementsByTagName('audio')[0]);
  duration = music.duration;  

  // console.log(duration);
  pButton = document.getElementById('pButton'); // play button

  playhead = document.getElementById('playhead'); // playhead

  timeline = document.getElementById('timeline'); // timeline
  // timeline width adjusted for playhead
  timelineWidth = timeline.offsetWidth - playhead.offsetWidth;



  // timeupdate event listener
  music.addEventListener("timeupdate", timeUpdate, false);

  //Makes timeline clickable
  timeline.addEventListener("click", function (event) {
    moveplayhead(event);
    console.log(duration)
    music.currentTime = duration * clickPercent(event);
  }, false);

  // Makes playhead draggable 
  playhead.addEventListener('mousedown', mouseDown, false);
  window.addEventListener('mouseup', mouseUp, false);



  // play(music);
}

// returns click as decimal (.77) of the total timelineWidth
function clickPercent(e) {
  return (e.pageX - timeline.offsetLeft) / timelineWidth;
}

// mouseDown EventListener
function mouseDown() {
  onplayhead = true;
  window.addEventListener('mousemove', moveplayhead, true);
  music.removeEventListener('timeupdate', timeUpdate, false);
}
// mouseUp EventListener
// getting input from all mouse clicks
function mouseUp(e) {
  if (onplayhead == true) {
    moveplayhead(e);
    window.removeEventListener('mousemove', moveplayhead, true);
    // change current time
    music.currentTime = duration * clickPercent(e);
    music.addEventListener('timeupdate', timeUpdate, false);
  }
  onplayhead = false;
}
// mousemove EventListener
// Moves playhead as user drags
function moveplayhead(e) {
  var newMargLeft = e.pageX - timeline.offsetLeft;
  if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
    playhead.style.marginLeft = newMargLeft + "px";
  }
  if (newMargLeft < 0) {
    playhead.style.marginLeft = "0px";
  }
  if (newMargLeft > timelineWidth) {
    playhead.style.marginLeft = timelineWidth + "px";
  }
}

// timeUpdate 
// Synchronizes playhead position with current point in audio 
function timeUpdate() {
  console.log("word")
  var playPercent = timelineWidth * (music.currentTime / music.duration);
  console.log(music.duration)
  console.log(music.currentTime)
  playhead.style.marginLeft = playPercent + "px";
  if (music.currentTime == duration) {
    pButton.className = "";
    pButton.className = "play";
  }
}

//Play and Pause
function play() {
  //concole.
  // start music
  if (music.paused) {
    music.play();
    // remove play, add pause
    pButton.className = "";
    pButton.className = "pause";
  } else { // pause music
    music.pause();
    // remove pause, add play
    pButton.className = "";
    pButton.className = "play";
  }
}

window.onresize = function() {
  adjustPositions();
}
