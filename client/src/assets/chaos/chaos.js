chaosHook();
function chaosHook() {
var WIDTH = 500;
var HEIGHT = 500;
var jumpDistance = .5;
var canvas;
var ctx;
var timer;

var currX;
var currY;
var prevVertex;
var prevprevVertex;
var vertexOptions = [];
var rule;

var running = false;

/*
Initalize on page load, set click and change handlers
*/
window.onload = init;
if (document.readyState == 'complete')
  init();
function init() {
  initValues();
  canvas = document.getElementById("mainBoard");
  ctx = canvas.getContext("2d");

  var goButton = document.getElementById("go");
  goButton.onclick = toggleStartStop;

  var clearButton = document.getElementById("clear");
  clearButton.onclick = clearCanvas;

  var skipButton = document.getElementById("skip");
  skipButton.onclick = skipAnimation;

  var polygonSelector = document.getElementById("polygons");
  polygonSelector.onchange = changeVerticiesHandler;
  changeVerticies(4);

  var ruleSelector = document.getElementById("rules");
  ruleSelector.onchange = changeRuleHandler;
  rule = 1;

  var sizeSelector = document.getElementById("sizes");
  sizeSelector.onchange = changeSizeHandler;
}

function drawfast() {
  for(var i = 0; i < 250; i++) {
    draw();
  }
}

function draw() {
  ctx.fillRect(currX, currY, 1, 1);
  var vertex;
  if(rule == 1) {
    vertex = rule1();
  } else if (rule == 2) {
    vertex = rule2();
  } else if (rule == 3) {
    vertex = rule3();
  } else if (rule == 4) {
    vertex = rule4();
  } else if (rule == 5) {
    vertex = rule5();
  }
  prevprevVertex = prevVertex;
  prevVertex = vertex;

  currX = jumpX(currX, vertex, jumpDistance);
  currY = jumpY(currY, vertex, jumpDistance);
}

/*
Rule 1: Check the previous vertex, if its the same as the previously chosen vertex, try choosing again.
*/
function rule1() {
  var vertex =  Math.floor(Math.random() * vertexOptions.length); //choose a random vertex to go towards
  while (vertex == prevVertex) { //can't choose the same vertex twice
    vertex =  Math.floor(Math.random() * vertexOptions.length); //choose a random vertex to go towards
  }
  return vertex;
}

function rule2() {
  return Math.floor(Math.random() * vertexOptions.length); //choose a random vertex to go towards
}

//vertex to the right not allowed
function rule3() {
  var vertex =  Math.floor(Math.random() * vertexOptions.length);
  while (prevVertex == (vertex + 1) % (vertexOptions.length)) {
    vertex =  Math.floor(Math.random() * vertexOptions.length);
  }
  return vertex
}

// left and right not allowed
function rule4() {
  var vertex =  Math.floor(Math.random() * vertexOptions.length);
  while (vertex == (prevVertex + 1) % (vertexOptions.length) ||
        vertex == (prevVertex - 1 + vertexOptions.length) % vertexOptions.length) {
    vertex =  Math.floor(Math.random() * vertexOptions.length);
  }
  return vertex;
}


function rule5() {
  var vertex =  Math.floor(Math.random() * vertexOptions.length);
  while (vertex == (prevVertex + 1) % (vertexOptions.length) ||
        vertex == (prevprevVertex - 1 + vertexOptions.length) % vertexOptions.length) {
    vertex =  Math.floor(Math.random() * vertexOptions.length);
  }
  return vertex;
}

function jumpX(x, vertex, jumpDistance) {
  return (vertexOptions[vertex].x + x) / 2; 
}

function jumpY(y, vertex, jumpDistance) {
  return (vertexOptions[vertex].y + y) / 2; 
}

function toggleStartStop() {
  if (!running) {
    running = true;
    this.innerHTML = "Stop";
    timer = window.setInterval(drawfast, 50);
  } else {
    running = false;
    this.innerHTML = "Go";
    window.clearInterval(timer);
    timer = null;
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  if(running) {
    running = false;
    var goButton = document.getElementById("go");
    goButton.innerHTML = "Go";
    window.clearInterval(timer);
    timer = null;
  }
  initValues();
}

function skipAnimation() {
  for (var i = 0; i < 10000; i++) {
    draw();
  }
}

function initValues() {
  currX = Math.floor(Math.random() * WIDTH);
  currY = Math.floor(Math.random() * HEIGHT);
  prevVertex = -1;
  prevprevVertex = -1;
}

function changeVerticiesHandler() {
  clearCanvas();
  vertexOptions = []; // reset vertexOptionsArray
  var vCount = this.options[this.selectedIndex].value;
  changeVerticies(vCount);
}

function getSelectedPolygonVertexCount() {
  var polygonSelector = document.getElementById("polygons");
  var vCount = polygonSelector.options[polygonSelector.selectedIndex].value;
}

function changeVerticies(sides) {
  var r = WIDTH/2;
  var initialRotation = 3 * Math.PI / 2;
  
  for (var i = 0; i < sides; i++) {
    var rotation = initialRotation + (i * Math.PI * 2)/sides;
    var x = Math.floor(r * Math.cos(rotation) + r);
    var y = Math.floor(r * Math.sin(rotation) + r);
    vertexOptions[i] = {x: x, y: y};
  }
}

function changeRuleHandler() {
  clearCanvas();
  rule = this.options[this.selectedIndex].value;
}

function changeSizeHandler() {
  HEIGHT = parseInt(this.options[this.selectedIndex].value);
  WIDTH = HEIGHT;
  var canvasDom = document.getElementById("mainBoard");
  canvasDom.height = HEIGHT;
  canvasDom.width = WIDTH;
  clearCanvas();

  // Redraw verticies
  var polygonSelector = document.getElementById("polygons");
  var vCount = polygonSelector.options[polygonSelector.selectedIndex].value;
  vertexOptions = [];
  changeVerticies(vCount);
}
}
