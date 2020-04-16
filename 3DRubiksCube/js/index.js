const id = "rubiks-cube";
const COLORS  = {
  WHITE: '#FFFFFF',
  YELLOW: '#FFD500',
  RED: '#B71234',
  ORANGE: '#FF5800',
  BLUE: '#0046AD',
  GREEN: '#009B48',
  NULL: '#000000',
};

var renderer;
var scene;
var camera;
var pieces;
var rubiksCube;
var mouse = new THREE.Vector2();

let webGLExists = (Detector.webgl) ? true : false;

initApp();

function initApp() {
  if(webGLExists === true) {
    drawScene();
    drawAxes(15);
    drawRubiksCube();
    animateScene();
    
  } else if(webGLExists === false) {
    alert("Your browser doesn't support WebGL.");
  }
}

function drawScene() {
  const canvasWidth = document.getElementById(id).offsetWidth; 
  const canvasHeight = document.getElementById(id).offsetHeight;
  
  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(60, canvasWidth / canvasHeight, 0.1, 100);
  camera.position.set(-3, 3, 6);
  camera.lookAt(scene.position);
  
  // [TODO] - verify if antialias is working and what is aplha parameter
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true });
  renderer.setSize(canvasWidth, canvasHeight); // filled browser area
  renderer.setClearColor(0x606060, 1); //
  document.getElementById(id).appendChild(renderer.domElement); // add renderer to the element tree - HTML DOM (append in rubik's cube div)

  document.addEventListener("mousedown", onDocumentMouseDown);
  document.addEventListener("mouseup", onDocumentMouseUp);
  console.log("drawScene!");
}

function drawAxes(length) {
  var axes = new THREE.AxesHelper(length);
  scene.add(axes);
}

function createPiece(position, key, colors) {
  // 26 pieces - each piece is one mini cube
  // each one receives 1, 2 or 3 colors - it depends on the piece's position
  const { x, y, z } = position;
  
  // [TODO] load texture out of function?
  var textureColor = new THREE.TextureLoader().load('./images/stickerColor.png');
  var textureBump = new THREE.TextureLoader().load('./images/stickerBump.png');
  
  var geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5); // [TODO] study these 3 last parameters
  var material = new THREE.MeshBasicMaterial({
    vertexColors:THREE.VertexColors,
    // color: 0x353535,
    // map: textureColor,
    // bumpMap:textureBump,
    // bumpScale:  0.02,
    // shininess:  24,
  });

  // [TODO] study these 3 lines below
  var modifier = new THREE.SubdivisionModifier(1);
  modifier.modify(geometry);
  defineVertexUVs(geometry, colors);

  var piece = new THREE.Mesh(geometry, material);
  scene.add(piece);
  piece.position.set(x, y, z);
  piece.name = key;

  return piece;
}


function defineVertexUVs(geometry, colors) {
  var color1 = colors[0];
  var color2 = colors[1];
  var color3 = colors[2];
  var color4 = colors[3];
  var color5 = colors[4];
  var color6 = colors[5];
  geometry.computeBoundingBox();
  var max     = geometry.boundingBox.max;
  var min     = geometry.boundingBox.min;
  var offset  = new THREE.Vector3(0 - min.x, 0 - min.y, 0 - min.z);
  var range   = new THREE.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
  geometry.faceVertexUvs[0] = [];
  var faces = geometry.faces;
  for (var i = 0; i < geometry.faces.length ; i++) {
      var v1 = geometry.vertices[faces[i].a];
      var v2 = geometry.vertices[faces[i].b];
      var v3 = geometry.vertices[faces[i].c];
      if (faces[i].normal.z <= -0.5)
      {
          faces[i].vertexColors[0] = new THREE.Color(color1);
          faces[i].vertexColors[1] = new THREE.Color(color1);
          faces[i].vertexColors[2] = new THREE.Color(color1);
          geometry.faceVertexUvs[0].push([

              new THREE.Vector2(( v1.x + offset.x ) / range.x, ( v1.y + offset.y ) / range.y),
              new THREE.Vector2(( v2.x + offset.x ) / range.x, ( v2.y + offset.y ) / range.y),
              new THREE.Vector2(( v3.x + offset.x ) / range.x, ( v3.y + offset.y ) / range.y)
          ]);
      }
      if (faces[i].normal.z >= 0.5)
      {
          faces[i].vertexColors[0] = new THREE.Color(color2);
          faces[i].vertexColors[1] = new THREE.Color(color2);
          faces[i].vertexColors[2] = new THREE.Color(color2);
          geometry.faceVertexUvs[0].push([
              new THREE.Vector2(( v1.x + offset.x ) / range.x, ( v1.y + offset.y ) / range.y),
              new THREE.Vector2(( v2.x + offset.x ) / range.x, ( v2.y + offset.y ) / range.y),
              new THREE.Vector2(( v3.x + offset.x ) / range.x, ( v3.y + offset.y ) / range.y)
          ]);
      }
      if (faces[i].normal.x <= -0.5)
      {
          faces[i].vertexColors[0] = new THREE.Color(color3);
          faces[i].vertexColors[1] = new THREE.Color(color3);
          faces[i].vertexColors[2] = new THREE.Color(color3);
          geometry.faceVertexUvs[0].push([
              new THREE.Vector2(( v1.y + offset.y ) / range.y, ( v1.z + offset.z ) / range.z),
              new THREE.Vector2(( v2.y + offset.y ) / range.y, ( v2.z + offset.z ) / range.z),
              new THREE.Vector2(( v3.y + offset.y ) / range.y, ( v3.z + offset.z ) / range.z)
          ]);
      }
      if (faces[i].normal.x >= 0.5)
      {
          faces[i].vertexColors[0] = new THREE.Color(color4);
          faces[i].vertexColors[1] = new THREE.Color(color4);
          faces[i].vertexColors[2] = new THREE.Color(color4);
          geometry.faceVertexUvs[0].push([
              new THREE.Vector2( ( v1.y + offset.y ) / range.y ,  ( v1.z + offset.z ) / range.z),
              new THREE.Vector2( ( v2.y + offset.y ) / range.y ,  ( v2.z + offset.z ) / range.z),
              new THREE.Vector2( ( v3.y + offset.y ) / range.y ,  ( v3.z + offset.z ) / range.z)
          ]);
      }
      if (faces[i].normal.y <= -0.5)
      {
          faces[i].vertexColors[0] = new THREE.Color(color5);
          faces[i].vertexColors[1] = new THREE.Color(color5);
          faces[i].vertexColors[2] = new THREE.Color(color5);
          geometry.faceVertexUvs[0].push([
              new THREE.Vector2(( v1.x + offset.x ) / range.x, ( v1.z + offset.z ) / range.z),
              new THREE.Vector2(( v2.x + offset.x ) / range.x, ( v2.z + offset.z ) / range.z),
              new THREE.Vector2(( v3.x + offset.x ) / range.x, ( v3.z + offset.z ) / range.z)
          ]);
      }
      if (faces[i].normal.y >= 0.5)
      {
          faces[i].vertexColors[0] = new THREE.Color(color6);
          faces[i].vertexColors[1] = new THREE.Color(color6);
          faces[i].vertexColors[2] = new THREE.Color(color6);
          geometry.faceVertexUvs[0].push([
              new THREE.Vector2(( v1.x + offset.x ) / range.x, ( v1.z + offset.z ) / range.z),
              new THREE.Vector2(( v2.x + offset.x ) / range.x, ( v2.z + offset.z ) / range.z),
              new THREE.Vector2(( v3.x + offset.x ) / range.x, ( v3.z + offset.z ) / range.z)
          ]);
      }
  }
  geometry.uvsNeedUpdate = true;
}

function drawRubiksCube() {
  const { WHITE, YELLOW, RED, ORANGE, BLUE, GREEN, NULL } = COLORS;
  pieces = [
    createPiece(new THREE.Vector3(0, 1, 0), 'centerW', [NULL, NULL, NULL, NULL, NULL, WHITE]),
    createPiece(new THREE.Vector3(0, -1, 0), 'centerY', [NULL, NULL, NULL, NULL, YELLOW, NULL]),
    createPiece(new THREE.Vector3(0, 0, 1), 'centerR', [NULL, RED, NULL, NULL, NULL, NULL]),
    createPiece(new THREE.Vector3(0, 0, -1), 'centerO', [ORANGE, NULL, NULL, NULL, NULL, NULL]),
    createPiece(new THREE.Vector3(1, 0, 0), 'centerG', [NULL, NULL, NULL, GREEN, NULL, NULL]),
    createPiece(new THREE.Vector3(-1, 0, 0), 'centerB', [NULL, NULL, BLUE, NULL, NULL, NULL]),
    
    createPiece(new THREE.Vector3(-1, 1, 1), 'cornerRBW', [NULL, RED, BLUE, NULL, NULL, WHITE]),
    createPiece(new THREE.Vector3(-1, 1, -1), 'cornerOBW', [ORANGE, NULL, BLUE, NULL, NULL, WHITE]),
    createPiece(new THREE.Vector3(1, 1, 1), 'cornerRGW', [NULL, RED, NULL, GREEN, NULL, WHITE]),
    createPiece(new THREE.Vector3(1, 1, -1), 'cornerOGW', [ORANGE, NULL, NULL, GREEN, NULL, WHITE]),
    createPiece(new THREE.Vector3(-1, -1, 1), 'cornerRBY', [NULL, RED, BLUE, NULL, YELLOW, NULL]),
    createPiece(new THREE.Vector3(-1, -1, -1), 'cornerOBY', [ORANGE, NULL, BLUE, NULL, YELLOW, NULL]),
    createPiece(new THREE.Vector3(1, -1, 1), 'cornerRGY', [NULL, RED, NULL, GREEN, YELLOW, NULL]),
    createPiece(new THREE.Vector3(1, -1, -1), 'cornerOGY', [ORANGE, NULL, NULL, GREEN, YELLOW, NULL]),
    
    createPiece(new THREE.Vector3(1, 1, 0), 'edgeGW', [NULL, NULL, NULL, GREEN, NULL, WHITE]),
    createPiece(new THREE.Vector3(-1, 1, 0), 'edgeBW', [NULL, NULL, BLUE, NULL, NULL, WHITE]),
    createPiece(new THREE.Vector3(0, 1, 1), 'edgeRW', [NULL, RED, NULL, NULL, NULL, WHITE]),
    createPiece(new THREE.Vector3(0, 1, -1), 'edgeOW', [ORANGE, NULL, NULL, NULL, NULL, WHITE]),
    createPiece(new THREE.Vector3(1, 0, 1), 'edgeRG', [NULL, RED, NULL, GREEN, NULL, NULL]),
    createPiece(new THREE.Vector3(-1, 0, 1), 'edgeRB', [NULL, RED, BLUE, NULL, NULL, NULL]),
    createPiece(new THREE.Vector3(1, 0, -1), 'edgeOG', [ORANGE, NULL, NULL, GREEN, NULL, NULL]),
    createPiece(new THREE.Vector3(-1, 0, -1), 'edgeOB', [ORANGE, NULL, BLUE, NULL, NULL, NULL]),
    createPiece(new THREE.Vector3(1, -1, 0), 'edgeGY', [NULL, NULL, NULL, GREEN, YELLOW, NULL]),
    createPiece(new THREE.Vector3(-1, -1, 0), 'edgeBY', [NULL, NULL, BLUE, NULL, YELLOW, NULL]),
    createPiece(new THREE.Vector3(0, -1, 1), 'edgeRY', [NULL, RED, NULL, NULL, YELLOW, NULL]),
    createPiece(new THREE.Vector3(0, -1, -1), 'edgeOY', [ORANGE, NULL, NULL, NULL, YELLOW, NULL]),
  ]

  rubiksCube = new THREE.Object3D();
  pieces.map(piece => rubiksCube.add(piece));
  scene.add(rubiksCube);
}

function onDocumentMouseDown(event) {
  if(event.button === THREE.MOUSE.LEFT) {
    event.preventDefault();

    // transform to normalized coordinates:
    //    xAxis -> maxLeft -1 to maxRight 1
    //    yAxis -> maxTop 1 to maxBottom -1
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log('mouse click! POSITION:', mouse);
  }
}

function onDocumentMouseUp(event) {
  if(event.button === THREE.MOUSE.LEFT) {
    console.log('stop spinning face!'); //defined some conditions (analyze 'rotandoCara' and 'bloqueo' variables)
  }
}

function animateScene() {
  requestAnimationFrame(animateScene);
  renderer.render(scene, camera);
};
animateScene();