// Global parameters

// Set some camera attributes
var CAMERA_DIST = 700; 
var CAMERA_ROTATION_STEP_AMOUNT = 5; // This is in degrees. 
var SEQUENCER_STEP_WIDTH = 32;
var NUMBER_OF_VOICES = 8;
var NUMBER_OF_SEQUENCE_STEPS = 16;
var NUMBER_OF_GRID_NOTES = 16;
var GRID_WIDTH = NUMBER_OF_SEQUENCE_STEPS * SEQUENCER_STEP_WIDTH;
var GRID_DEPTH = NUMBER_OF_GRID_NOTES * SEQUENCER_STEP_WIDTH;
var VOICE_COLORS = colorRainbowArray(16,0, false, 128, 127);
var SCALE_BASE_NOTE = 57;


// This is left over from Tito. Hmm. Do we want to have a fixed grid size?
//var GRID_WIDTH = 736;
//var GRID_HEIGHT = 449;

function Note() {
	var on = false;
	var midiNote = -1; //If this is 
	var velocity 
	var cube;
}

function Sequence() {
	this.notes = new Array();
	
	for(var i = 0; i<NUMBER_OF_SEQUENCE_STEPS; i++)
	{
		this.notes[i] = new Note();
		this.notes[i].on = false;
	}
	
	this.makeFakeData = function makeFakeData() {
		for(var i = 0; i<NUMBER_OF_SEQUENCE_STEPS; i++)
		{
			this.notes[i].midiNote = i;
		}
	}
}

function Voice(voiceNumber)
{
	this.voiceNumber = voiceNumber;
	this.sequence = new Sequence();
	this.color = 0xFF0000;
	
}

Marlon.prototype.setupVoices = function setupVoices() {
	this.voices = new Array();
	
	for(var i=0; i<NUMBER_OF_VOICES;i++)
	{
		this.voices[i] = new Voice(i);
		this.voices[i].color = VOICE_COLORS[i];
		this.voices[i].sequence.notes[i].on=true;
		//this.voices[i].sequence.notes[i].midiNote=SCALE_BASE_NOTE+i;
	}
	//Fake Data
	this.voices[0].sequence.notes[0].midiNote = 57;
	this.voices[0].sequence.notes[4].midiNote = 57;
	this.voices[0].sequence.notes[8].midiNote = 57;
	this.voices[0].sequence.notes[12].midiNote = 57;
	
	this.voices[1].sequence.notes[0].midiNote = 57;
	this.voices[1].sequence.notes[4].midiNote = 57+12;
	this.voices[1].sequence.notes[8].midiNote = 57;
	this.voices[1].sequence.notes[12].midiNote = 57+12;
	
	this.voices[2].sequence.notes[3].midiNote = 58;
	this.voices[2].sequence.notes[7].midiNote = 58;
	this.voices[2].sequence.notes[11].midiNote = 58;
	this.voices[2].sequence.notes[15].midiNote = 58;
	
	this.voices[3].sequence.notes[2].midiNote = 61;
	this.voices[3].sequence.notes[6].midiNote = 61;
	this.voices[3].sequence.notes[10].midiNote = 61;
	this.voices[3].sequence.notes[14].midiNote = 61;
}


function Marlon (marlonCanvasID)
{
	this.WIDTH = window.innerWidth - 0;
	this.HEIGHT = window.innerHeight - 0;
	
	this.rotationDegrees = -45;
	this.playheadPosition = 0;

	
	this.init(marlonCanvasID);
	this.setupEventHandlers();
	
	this.setupVoices();
	this.setupCubes();
}


Marlon.prototype.init = function init(marlonCanvasID) {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	
	this.stats = new Stats();
	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.top = '0px';
	container.appendChild( this.stats.domElement );
	
	this.scene = new THREE.Scene();

	this.drawDebugAxes();	
	
	this.camera = new THREE.PerspectiveCamera(45, this.WIDTH / this.HEIGHT, 1, 2000);
	this.camera.position.y = 290;
	this.camera.rotation.x = -45 * (Math.PI / 180);
    this.scene.add( this.camera );

    //Grid
	geometry = new THREE.PlaneGeometry( GRID_WIDTH, GRID_DEPTH, NUMBER_OF_SEQUENCE_STEPS, NUMBER_OF_GRID_NOTES);
    material = new THREE.MeshBasicMaterial( { color: 0x88AAFF, wireframe: true } );

    this.grid = new THREE.Mesh( geometry, material );
	this.grid.position.x = this.grid.position.y = this.grid.position.z = 0;
	this.grid.rotation.x = -Math.PI/2;
	this.grid.position.x = GRID_WIDTH/2;
	this.grid.position.z = GRID_DEPTH/2;
	
	this.scene.add( this.grid );
	
	
/*

	//Playhead Grid
	geometry = new THREE.PlaneGeometry( 32, 512, 1, 16);
    material = new THREE.MeshBasicMaterial( { color: 0x0000FF, wireframe: true });

    this.playheadGrid = new THREE.Mesh( geometry, material );
	this.playheadGrid.position.x = this.grid.position.z = 0;
	this.grid.position.y = -1;
	this.xTriggered = 0;
	
	this.playheadGrid.rotation.x = -Math.PI/2;
	this.calculatePlayheadPosition();
	this.scene.add( this.playheadGrid );
*/
    this.renderer = new THREE.CanvasRenderer();
	this.renderer.domElement.style.position = 'absolute';
	this.renderer.domElement.style.top = '0';
    this.renderer.setSize(this.WIDTH, this.HEIGHT);

	//document.getElementById(marlonCanvasID).appendChild( this.renderer.domElement );
	this.calculateCameraPosition();
   	container.appendChild( this.renderer.domElement );
}

Marlon.prototype.setupCubes = function() {

	for(var voiceIndex=0; voiceIndex<NUMBER_OF_VOICES;voiceIndex++)
	{
		var currentVoice = this.voices[voiceIndex];
		var currentVoiceSequence
		for(var stepIndex=0; stepIndex < currentVoice.sequence.notes.length; stepIndex++)
		{
			currentNote = currentVoice.sequence.notes[stepIndex];
			if(currentNote.midiNote == -1) continue;
			
			//Cube
			var geometry = new THREE.CubeGeometry( SEQUENCER_STEP_WIDTH, SEQUENCER_STEP_WIDTH, SEQUENCER_STEP_WIDTH );
		    var material = new THREE.MeshBasicMaterial({
			        color: currentVoice.color,
			        opacity: 0.7,
			        wireframe: false
			    })
			currentNote.cube = new THREE.Mesh( geometry, material );
			currentNote.cube.position.x = (SEQUENCER_STEP_WIDTH/2) + stepIndex * SEQUENCER_STEP_WIDTH;// - (256/2);
			currentNote.cube.position.y = (SEQUENCER_STEP_WIDTH/2) + voiceIndex * SEQUENCER_STEP_WIDTH;
			
			var adjustedNote = currentNote.midiNote - SCALE_BASE_NOTE;
			currentNote.cube.position.z = GRID_DEPTH - (SEQUENCER_STEP_WIDTH/2) - (adjustedNote * SEQUENCER_STEP_WIDTH);
			
		    this.scene.add( currentNote.cube );
		
			//d("Adding a cube for " + dump(currentNote))
		}
		
	}
}

/*
Marlon.prototype.animate =  function animate() {
	requestAnimationFrame( animate );
	
    this.render();
}
*/
Marlon.prototype.render =  function() {
//	this.movePlayhead(); this.calculatePlayheadPosition();
//	this.rotationDegrees += 1;
//	this.calculateCameraPosition();
	this.renderer.render( this.scene, this.camera );
	this.stats.update();
}

Marlon.prototype.calculatePlayheadPosition =  function() {
	this.playheadGrid.position.x = SEQUENCER_STEP_WIDTH*this.playheadPosition - (240);
}

Marlon.prototype.calculateCameraPosition =  function() {
	var radians = (this.rotationDegrees / 180) * (Math.PI);
	this.camera.position.z = CAMERA_DIST * Math.cos(radians) + GRID_DEPTH/2;
	this.camera.position.x = CAMERA_DIST * Math.sin(radians) + GRID_WIDTH/2;
	
	if(typeof(this.grid) != 'undefined')
		this.camera.lookAt(this.grid.position);
	else
		this.camera.lookAt(this.scene.position);
}

Marlon.prototype.movePlayhead =  function() {
	this.playheadPosition = (this.playheadPosition < 15) ? this.playheadPosition + 1:0;
}

Marlon.prototype.setupEventHandlers = function() {
	var thisObject = this;
	$(document.body).keydown(function(event) {thisObject.onKeyDown(event);});
}

Marlon.prototype.onKeyDown = function onKeyDown(event) {
	switch(event.which) {
		case 188: //',' key
			this.rotationDegrees -= CAMERA_ROTATION_STEP_AMOUNT;
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 190: //'.' key
			this.rotationDegrees += CAMERA_ROTATION_STEP_AMOUNT;
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 37: //left arrow
			event.preventDefault();
			break;
		case 39: //right arrow
			event.preventDefault();
			break;
		case 38: //up arrow
			event.preventDefault();
			break;
		case 40: // down arrow
			event.preventDefault();
			break;
		case 189: // '-' key
			this.camera.position.y-=10;
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 187: // '+' key
			this.camera.position.y+=10;
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 32: //space bar
			this.movePlayhead();
			this.calculatePlayheadPosition();
			event.preventDefault();
			break;
	}


	this.xTriggered++;

	var msg = "Handler for .keypress() called " + this.xTriggered + " time(s). Keycode was " + event.which + "\n";
	msg += "Camera:\n";
	msg += "Angle: " + this.rotationDegrees + " ";	
	msg += "x: " + this.camera.position.x + " / ";	
	msg += "y: " + this.camera.position.y + " / ";	
	msg += "z: " + this.camera.position.z + ".\n";
	msg += "rotation.x = " + this.camera.rotation.x + " / ";	
	msg += "rotation.y = " + this.camera.rotation.y + " / ";	
	msg += "rotation.z = " + this.camera.rotation.z + ".";
	d(msg);		

}


Marlon.prototype.drawDebugAxes = function drawDebugAxes(){           
    //Axes array[x,y,z]
    var axisLength = 800;
    
    var info = [
			[-axisLength, 0, 0, axisLength,0,0,0xff0000],
			[0,-axisLength,0,0,axisLength,0,0x00ff00],
			[0,0,-axisLength,0,0,axisLength,0x0000ff]
		];
    
    //Draw some helpful axes
    for(var i=0;i<3;i++){
        material = new THREE.MeshBasicMaterial({color: 0xffffff});
        geometry = new THREE.Geometry();
        
        //Define the start point
        particle = new THREE.Particle(material);
        particle.position.x = info[i][0];
        particle.position.y = info[i][1];
        particle.position.z = info[i][2];
        
        //Add the new particle to the scene
        this.scene.add(particle);
        
        //Add the particle position into the geometry object
        geometry.vertices.push(new THREE.Vertex(particle.position));
        
        //Create the second point
        particle = new THREE.Particle(material);
        particle.position.x = info[i][3];
        particle.position.y = info[i][4];
        particle.position.z = info[i][5];
        
        //Add the new particle to the scene
        this.scene.add(particle);
        
        //Add the particle position into the geometry object
        geometry.vertices.push(new THREE.Vertex(particle.position));
        
        //Create the line between points
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: info[i][6], opacity: 0.8, linewidth: 1}));
        this.scene.add(line);
    }
}


Marlon.prototype.onMouseMove = function onMouseMove(evt)
{
	d('mouseMove');
}

Marlon.prototype.onMouseClick = function onMouseClick(evt)
{
	//$('#mouseX').text(mouseX);
	//$('#mouseY').text(mouseY);
}