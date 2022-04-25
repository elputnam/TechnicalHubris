//Tether variables
let dance = [];
let numT;


//Brash phone variables
let swarm = [];
let pix = [];
let numBP;
let heartRate = [];
let B = 0;
let list1 = [];

//Ferious Patience Variables
//Lists of Months
let lightList = []; //lightly active minutes
let moderateList = []; //moderately active minutes
let veryList = []; //very active minutes
let sedentaryList = []; //sedentary minutes
// let stepList = []; //steps
let back = 175;

// Daily Cycle - variables for selceting and cycling throguh days
let lightActive = [];
let  moderateActive = [];
let veryActive = []; 
let notActive = [];
// let stepCount = [];
let light_data, very_data, moderate_data, sedentary_data;
let num_days; // number of days of data
let day_num = 0;
// let num_steps; //number of step intervals
// let step_num = 0;

let light, very, moderate, sedentary, steps;

//Image arrays
let sedImages = [];
let lowImages = [];
let midImages = [];
let highImages = []

function preload(){
  //Load list of heartrate json file names
  list1 = loadStrings('dataList.txt');
  //Load list of activity minute json file names
  lightList = loadStrings('lightlyActive-dataList.txt');
  moderateList = loadStrings('moderatelyActive-dataList.txt');
  veryList = loadStrings('veryActive-dataList.txt');
  sedentaryList = loadStrings('sedentary-dataList.txt');
 
  //load images
  for (let i = 1; i < 16; i++){
      sedImages[i] = loadImage("data/images/sedentary-" + i + ".png");
    } 
  for (let j = 1; j < 7; j++){
      lowImages[j] = loadImage("data/images/low-" + j + ".png");
    }  
  for (let k = 1; k < 8; k++){
      midImages[k] = loadImage("data/images/mid-" + k + ".png");
    }
  for (let l = 1; l < 19; l++){
      highImages[l] = loadImage("data/images/high-" + l + ".png");
    }   
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0, 100,10);
  frameRate(25);

  //Heart rate: select day 
  let day = int(random(1,131));
  heartRate = loadJSON(list1[day]);

  //Tether Setup
  numT = height*0.05;
  j = 0;
  for (i = 0; i < numT; i++){
    dance.push(new Element());
  }

  //BrashPhone Setup
  numBP = height*0.3;
  for (let i = 0; i < numBP; i++) {
    swarm.push(new Screen());
  }

  //Ferocious Patience Setup
  let month = int(random(18));
  print(month);
  lightActive = loadJSON(lightList[month]);
  moderateActive = loadJSON(moderateList[month]);
  veryActive = loadJSON(veryList[month]);
  notActive = loadJSON(sedentaryList[month]);


}

function draw() {
//print frameCount
  console.log(frameCount);
//Initlal play
if (frameCount < 500){
    tether();
    //scribble();
  } else {
    ferociousPatience();
}

//Loop
if (frameCount == 2000){
    reset();
  }
}

//Tether
function tether(){
  background(random(30), 10);
  for (i = 0; i < dance.length; i++){
    dance[i].display();
    dance[i].update();
    dance[i].edges();
  }

  noFill();
  for (i = 0; i < numT; i++){
    stroke(random(300,360), random(0,100), 360);
    curveTightness(random(3,6));
    curve(random(width), random(height), mouseX, mouseY, mouseX, mouseY,random(width), random(height));
  }
}

class Element{
  constructor(){
    this.loc = createVector(random(width), random(height));
    this.vel = createVector(0,0);
    this.len = random(10,30);
    //this.len = random(width*0.03, width*0.07);
    this.ts = 3;
    this.a = 0;
  }
  
  
  
  update(){
    this.a = p5.Vector.random2D();
    //this.a.mult(random(4));
    this.a.mult(this.len*.3)
    //this.a = createVector(random(-.1, .1), random(-.1, .1));
    this.vel.add(this.a);
    this.vel.limit(this.ts);
    this.loc.add(this.vel);
  }
  
  edges(){
    if (this.loc.x > width) {
      this.loc.x = 0;
    }
    if (this.loc.x < 0) {
      this.loc.x = width;
    }
    if (this.loc.y > height) {
      this.loc.y = 0;
    }
    if (this.loc.y < 0) {
      this.loc.y = height;
    }
  }

  display(){
    fill(random(200,300), random(360), random(360));
     //tethers
    stroke(random(0,100), random(0,100), 100, 50);
    line(this.loc.x, this.loc.y, mouseX, mouseY);
    //bodies
    stroke(0);
    rectMode(CENTER);
    circle(this.loc.x, this.loc.y, this.len);
  }
}

//Brash Phone
function brashPhone(){
  background(300, 50, 100);
  //screens
  for (let i = 0; i < swarm.length; i++) {
    swarm[i].run();
  }

  //heartrate data mapping
  bpm = heartRate[B].value['bpm'];
  colA = map(bpm, 60, 170, 0, 360);
  colB = map(bpm, 60, 170, 0, 100);
  len = map(bpm, 60, 170, 100, 500);
  // sw = map(bpm, 60, 170, 10, 1);
  SB1 = map(bpm, 60, 170, 40, 100);
  SB2 = map(bpm, 60, 170, 100, 40);
  B += 1;

  //pixels
  pix.push(new Pixel(createVector(mouseX, mouseY)));
  for(let i = pix.length - 1; i >= 0; i--){
    let p = pix[i];
    p.run();
    if (p.ghost()){
      pix.splice(i, 1);
   }
  }
}
class Screen {
  constructor() {
    this.loc = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.ts = 5;
    this.len = random(20);
    this.shade = random(100);
    //this.vel.mult((random(-1, 1)));
  }

  run() {
    this.edges();
    this.update();
    this.display();
  }
  edges(){
    if (this.loc.x < 0) {
      this.loc.x = mouseX;
      this.loc.y = mouseY;
      }
    if (this.loc.x > width) {
      this.loc.x = mouseX;
      this.loc.y = mouseY;
      }
    if (this.loc.y < 0) {
      this.loc.x = mouseX;
      this.loc.y = mouseY;
      }
    if (this.loc.y > height) {
      this.loc.x = mouseX;
      this.loc.y = mouseY;
      }
  }
  update() {
    this.spot = createVector(mouseX, mouseY)
   this.force = p5.Vector.sub(this.spot, this.loc);
    this.accel = createVector(random(-2, 2), random(-2, 2));
    this.accel.sub(this.force);
    //this.force = p5.Vector.add(this.loc, this.repel);
    this.vel.add(this.accel);
    this.vel.limit(this.ts);
    this.loc.add(this.vel);
    this.force.mult(0)
  }

  display() {
    noFill();
    strokeWeight(1);
    stroke(this.shade);
    for (let i = 0; i < this.len; i++) {
      circle(this.loc.x, this.loc.y, 5 * i);
    }
  }
}

class Pixel{
  constructor(loc){
    this.hue = random(70);
    this.lum = 50;
    this.loc = loc.copy();
    // this.len = random(10, len);
    this.len = len;
  }
  run(){
    this.update();
    this.display();
  }
  
  update(){
    this.lum -= 0.5;
    this.H1 += 1;
  }
  
  display(){
    rectMode(CENTER);
    // noStroke();
    // strokeWeight(sw);
    stroke(random(100), this.lum)
    // stroke(colB, this.lum);
    fill(colA, random(100), random(100), this.lum)
    //fill(this.hue, random(100), random(100), this.lum);
    square(this.loc.x, this.loc.y, this.len);
  }
  
  ghost(){
    if (this.lum < 0.0){
      return true;
    } else {
      return false;
    }
  }
}

//Ferocious Patience
function activityMapping(){
  noStroke();
  //let s = random(100);
  //let l = random(100);
  let s = 100;
  let l = 100;
    // lightly active
    let a = map(light, 0, 1200, 175, 360);
    let alp1 = map(light, 0, 1500, 0, 100);
    let w1 = map(light, 0, 400, 0, width);
    let numA = int(random(1, 6));
    let lightImage = int(map(light, 0, 1500, 1, 6)); 
    // fill(a, s, l, w1);
    // rect(0 + w1, 0, width/2, height/2);
    tint(a, alp1, l, alp1);
    image(lowImages[lightImage], 0, 0, width/2, height/2)

    // very active
    let b = map(very, 0, 1200, 175, 360);
    let w2 = map(very, 0, 1500, 0, width);
    let numB = int(random(1, 18));
    let alp2 = map(very, 0, 1500, 0, 100);
    let veryImage = int(map(very, 0, 200, 1, 18)) 
    // fill(b, s, l, w2);
    tint(b, alp2, l, alp2)
    // rect(width/2-w2, 0, width/2, height/2);
    image(highImages[veryImage], width/2, 0, width/2, height/2)
    
   
    // sedentary
    let d = map(sedentary, 0, 1200, 175, 360);
    let w4 = map(sedentary, 0, 1500, 0, width);
    let alp4 = map(sedentary, 0, 1500, 0, 100);
    let numD = int(random(1, 15))
    let sedenImage = int(map(sedentary, 0, 1500, 1, 15)) 
    // fill(d, s, l, w4);
    tint(d, alp4, l, alp4);
    // rect(width/2-w4, height*.5, width/2, height/2);
    image(sedImages[sedenImage], width/2, height*.5, width/2, height/2);

     // moderately active
    let c = map(moderate, 0, 1200, 175, 360);
    let w3 = map(moderate, 0, 1500, 0, width);
    let alp3 = map(moderate, 0, 1500, 0, 100);
    let numC = int(random(1, 7));
    let modImage = int(map(moderate, 0, 200, 1, 7)) 
    // fill(c, s, l, w3);
    tint(c, alp3, l, alp3);
    // rect(0+w3, height*.5, width/2, height/2);
    image(midImages[modImage], 0, height*.5, width/2, height/2);
}    

function ferociousPatience(){
  if (frameCount==500){
    num_days = Object.keys(lightActive).length;
    background(0);
    textSize(50);
    fill(255);
    text('lightly active', width*.05, height*.2);
    text('very active', width*.55, height*.3);
    text('moderately active', width*.05, height*.8, 0, height*.9);
    text('sedentary', width*.55, height*.8);
  }

if (frameCount==550){
  background(0);
  }

if (frameCount > 550){
  if (frameCount > 150){
    
    light = lightActive[day_num]['value'];
    very = veryActive[day_num]['value'];
    moderate = moderateActive[day_num]['value'];
    sedentary = notActive[day_num]['value'];
    // steps = stepCount[step_num]['value'];
    back = map(very, 0, 50, 175, 0);
    // print("light:", light, "very:", very, "moderate:", moderate, "sedentary:", sedentary, "steps:", steps);
    day_num += 1;
    // step_num += 1;

    activityMapping();
    if (day_num >= num_days){
      day_num = 0;
      }
}

}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function reset(){
  frameCount = 0;
}