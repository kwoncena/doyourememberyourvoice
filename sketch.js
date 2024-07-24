let mic, recorder, soundFile;
let isRecording = false;
let isPlayingDistorted = false;
let pitchValue = 1.0;
let speedValue = 1.0;
let stopRecordingButton, playDistortedButton, stopDistortedButton;
let backgroundPixels = [];

// Variables for sound wave visuals
let soundWaves = [];
let welcomeTextVisible = true;

function setup() {
  createCanvas(1512, 816);
  background(40, 40, 43); // Set background color to #28282B

  // Initialize microphone input
  mic = new p5.AudioIn();
  mic.start();

  // Initialize sound recorder
  recorder = new p5.SoundRecorder();
  recorder.setInput(mic);

  // Initialize sound file
  soundFile = new p5.SoundFile();

  // Create buttons for stopping recording and playback
  stopRecordingButton = createButton('Record');
  stopRecordingButton.position(20, height + 20);
  stopRecordingButton.mousePressed(toggleRecording);

  playDistortedButton = createButton('Play');
  playDistortedButton.position(120, height + 20);
  playDistortedButton.mousePressed(playDistortedRecording);

  // Stop button for distorted playback
  stopDistortedButton = createButton('Stop');
  stopDistortedButton.position(200, height + 20);
  stopDistortedButton.mousePressed(stopDistortedPlayback);
  stopDistortedButton.hide(); // Initially hide

  // Initialize sound wave visuals
  createInitialSoundWave();
}

function draw() {
  background(40, 40, 43); // Set background color to #28282B

  // Display sound wave visuals
  drawSoundWaves();

  // Display recording status
  fill(255);
  textSize(16);
  textAlign(LEFT, CENTER);
  if (isRecording) {
    text('Recording...', 20, height - 20);
  } else {
    text('Ready to record', 20, height - 20);
  }

  // Display welcome text if visible
  if (welcomeTextVisible) {
    fill(255, 0, 0); // Set text color to red
    textSize(20);
    textAlign(CENTER, CENTER);
    text('Do you remember your voice?', width / 2, height / 2);
  }
}

function drawSoundWaves() {
  for (let wave of soundWaves) {
    drawWave(wave);
  }
}

function drawWave(wave) {
  noFill();
  beginShape();
  strokeWeight(2);

  let radius = height / 4; // Adjust the radius as needed
  let angleIncrement = (TWO_PI / wave.length) * 2; // Adjust the speed of circular movement

  for (let i = 0; i < wave.length; i++) {
    let angle = i * angleIncrement;
    let x = width / 2 + cos(angle) * radius;
    let y = height / 2 + sin(angle) * radius + map(wave[i], -1, 1, -radius, radius);

    // Randomize colors during distorted playback
    if (isPlayingDistorted) {
      stroke(random(255), random(255), random(255));
    } else {
      stroke(255);
    }

    vertex(x, y);
  }

  endShape();
}

function createInitialSoundWave() {
  let soundWaveLength = 100; // Reduce the initial length to make it more circular
  let initialWave = new Array(soundWaveLength).fill(0);
  soundWaves.push(initialWave);
}

function toggleRecording() {
  if (!isRecording) {
    // Clear the sound wave visuals when starting a new recording
    soundWaves = [];
    createInitialSoundWave();
    welcomeTextVisible = false; // Hide welcome text when recording starts
  }
  if (isRecording) {
    // Stop recording
    recorder.stop();
  } else {
    // Start recording
    recorder.record(soundFile);
  }
  isRecording = !isRecording;
}

function playDistortedRecording() {
  // Set random distorted pitch and speed before playing
  let distortedPitch = pitchValue * random(0.5, 2.0); // Adjust pitch for distortion
  let distortedSpeed = speedValue * random(0.5, 2.0); // Adjust speed for distortion
  soundFile.setPitch(distortedPitch);
  soundFile.rate(distortedSpeed);

  // Play the distorted version of the recorded sound file
  if (soundFile.isLoaded()) {
    soundFile.play();
    isPlayingDistorted = true;

    // Show the stop button for distorted playback
    stopDistortedButton.show();

    // Add a new sound wave for each distorted playback
    let newWave = [];
    for (let i = 0; i < 100; i++) {
      newWave.push(random(-1, 1));
    }
    soundWaves.push(newWave);
  } else {
    console.log('Sound file is not yet loaded.');
  }
}

function stopDistortedPlayback() {
  // Stop distorted playback
  soundFile.stop();
  isPlayingDistorted = false;

  // Show the stop button for distorted playback
  stopDistortedButton.hide();

  // Display "Do you remember your voice?" text
  welcomeTextVisible = true; // Show welcome text
}