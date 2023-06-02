
let Voz = "Google español";     // Mirar lista de voces disponibles en la consola
let Idioma1 = "es-ES";  // BCP-47; es-ES | en-US
let Volumen = 1.0;     // 0.0 < 1.0
let Velocidad = 1.3;  // 0.1 < 2.0
let Tono = 1;        // 0.01 < 2.0

let FraseANT = "";

let speechVoice;

let RotacionCargando = 0;

let millisANT = 0;

let Frase = 0;

var firebaseConfig = {
  apiKey: "AIzaSyCWbugULiGuCw6QDKWoMDDrZeDQeyTqQbU",
  authDomain: "peper-smart-chatbot.firebaseapp.com",
  databaseURL: "https://peper-smart-chatbot-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "peper-smart-chatbot",
  storageBucket: "peper-smart-chatbot.appspot.com",
  messagingSenderId: "446723135680",
  appId: "1:446723135680:web:cdc418d7a70a5f512d3525",
  measurementId: "G-NLTKE1KHQM"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

  // "Continuous recognition" (as opposed to one time only)
  let continuous = true;
  // If you want to try partial recognition (faster, less accurate)
  let interimResults = false;

function preload() {
  
  speechVoice = new p5.Speech(); //callback, speech synthesis object
  
  speechVoice.onLoad = voiceReady;
  
}

  function voiceReady() {
    console.table(speechVoice.voices);
    
    speechVoice.stop();
    
    speechVoice.setVoice(Voz);
    speechVoice.setLang(Idioma1);
    speechVoice.setVolume(Volumen);
    speechVoice.setRate(Velocidad);
    speechVoice.setPitch(Tono);
    
  }

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  
  frameRate(30);
  
  textSize(height*0.03);
  
  imageMode(CENTER);
  
  Icono = loadImage("Assets/PepperIcon.png");
  
  Cargando = loadImage("Assets/CargandoIcon.png");
  
  let databaseRef = firebase.database().ref('datos Pepper respuesta habla');
  databaseRef.on('value', readFromDatabase); // Llama a readFromDatabase() cada vez que los datos cambien
  
  speechVoice.stop();
  
  // Create a Speech Recognition object with callback
  speechRec = new p5.SpeechRec('es-ES', gotSpeech);
  // This must come after setting the properties
  speechRec.start(continuous, interimResults);
}

function draw() {
  
  if (Frase == 1) {
      
    Frase = 0;
    
    speechVoice.speak("Hasta luego, espero verte pronto");
      
  } else if (Frase == 2) {
    
    Frase = 0;
    
    speechVoice.speak("Hola soy Pepper. Si tienes alguna pregunta, no dudes en preguntarme. ¿En que puedo ayudarte hoy?");
             
  }
  
  image(Icono, width/2, height*0.3, height*0.2/Icono.height*Icono.width, height*0.2);
  
  if (speechRec != null) {
  
  speechRec.onEnd = FinLisening;
     
  }
      
  push();
  
  translate(width / 2, height / 2);
  
  if (RotacionCargando >= PI) {
      
    RotacionCargando = -PI;
      
  }
    
  RotacionCargando = RotacionCargando + PI/60;

  rotate(map(sin(RotacionCargando), -1, 1, 0, TWO_PI * 4));
  
  image(Cargando, 0, 0, height*0.1/Cargando.height*Cargando.width, height*0.1);
  
  pop();
  
}

  function gotSpeech() {
    // Something is there
    // Get it as a string, you can also get JSON with more info
    console.log(speechRec);
    if (speechRec.resultValue) {
      let said = speechRec.resultString;
      // Show user
      background(255);
    
let keywords = ["oye Pepper", "oye Piper", "oye Pepe", "oye pepe", "oye Peter", "oye Viper", "oye paper", "oye peper", "oye pepper", "oye beber", "que Pepper", "que Piper", "que Pepe", "que pepe", "que Peter", "que Viper", "que paper", "que peper", "que pepper", "que beber"];

let foundKeyword = keywords.find(keyword => said.includes(keyword));
  
if (foundKeyword) {
  let index = said.indexOf(foundKeyword);
  said = said.slice(index + foundKeyword.length);
  fill(0, 255, 0);
  speechVoice.stop();
  writeToDatabase(said);
} else {
  fill(255, 255, 0);
}
  stroke(0);
  strokeWeight(displayDensity()*0.4);
  text(said, width/8, height/1.4);

    }
  }

function FinLisening() {
  
 speechRec.start(continuous, interimResults);
  
}

function mousePressed() {
  
    if (millis() > millisANT + 500) {
      
      millisANT = millis();
      
if (fullscreen()) {
      
      fullscreen(false);
      
      resizeCanvas(windowWidth, windowHeight);
      
      background(255);
      
      speechVoice.stop();
  
      Frase = 1;
    
    } else {
      
      fullscreen(true);
      
      resizeCanvas(windowWidth, windowHeight);
      
      background(255);
      
      speechVoice.stop();
      
      Frase = 2;
  
   }
      
    }
  
}

function writeToDatabase(data) {
  var ref = database.ref('datos Pepper reconocimiento voz');
  ref.set(data);
}

function readFromDatabase(dataSnapshot) {
  // Recupera los datos actualizados desde dataSnapshot
  let datos = dataSnapshot.val();
  
  console.log(datos);
  if (datos != FraseANT && millis() >= 1500) {
    
  FraseANT = datos;
    
  console.log(datos);
      
  speechVoice.speak(datos); // say something
  
  }
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}