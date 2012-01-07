
// Global parameters

// Set some camera attributes
var CAMERA_DIST = 700; 
var CAMERA_ROTATION_STEP_AMOUNT = 5; // This is in degrees. 

// Set world dimensions
var SEQUENCER_STEP_WIDTH = 32;
var NUMBER_OF_VOICES = 8;
var NUMBER_OF_SEQUENCE_STEPS = 16;
var NUMBER_OF_GRID_NOTES = 16;
var GRID_WIDTH = NUMBER_OF_SEQUENCE_STEPS * SEQUENCER_STEP_WIDTH;
var GRID_DEPTH = NUMBER_OF_GRID_NOTES * SEQUENCER_STEP_WIDTH;
var VOICE_COLORS = colorRainbowArray(NUMBER_OF_VOICES*2,0, false, 128, 127);
var SCALE_BASE_NOTE = 57;

function Note(midiNote, step) {
	this.midiNote = midiNote;
	this.step = step;
	this.cube;
	
	this.getCube = function(cubeColor) {
		if(typeof(this.cube) != 'undefined') {
			this.cube.visible = true;
			return this.cube;
		} else return false;	
	}
	
	this.createCube = function(material) {
		// Get the note color & material
		var geometry = new THREE.CubeGeometry(SEQUENCER_STEP_WIDTH, SEQUENCER_STEP_WIDTH, SEQUENCER_STEP_WIDTH);
		this.cube = new THREE.Mesh( geometry, material );
		
		return this.cube;
	}
}

function Sequence() {
	this.notes = new Array();
}

function Voice(voiceNumber)
{
	this.voiceNumber = voiceNumber;
	this.sequence = new Sequence();
	this.color = VOICE_COLORS[voiceNumber];
	
	this.activeMaterial = new THREE.MeshBasicMaterial( { 
		color: this.color, 
		wireframe: false,
		opacity: 0.7 } );

	this.dimMaterial = new THREE.MeshBasicMaterial( { 
		color: 0x336666, 
		//color: this.color,
		wireframe: true,
		opacity: 0.5 } );

}

Marlon.prototype.setupVoices = function () {
	this.voices = new Array();
	
	for(var i=0; i<NUMBER_OF_VOICES;i++)
	{
		this.voices[i] = new Voice(i);
		this.voices[i].color = VOICE_COLORS[i];
		this.voices[i].activeMaterial
	}
	
	//Fake Data
	this.voices[0].sequence.notes.push(new Note(57, 0));
	this.voices[0].sequence.notes.push(new Note(57, 4));
	this.voices[0].sequence.notes.push(new Note(57, 8));
	this.voices[0].sequence.notes.push(new Note(57, 12));
	
	this.voices[1].sequence.notes.push(new Note(57, 0));
	this.voices[1].sequence.notes.push(new Note(57+12, 4));
	this.voices[1].sequence.notes.push(new Note(57, 8));
	this.voices[1].sequence.notes.push(new Note(57+12, 12));
	
	this.voices[2].sequence.notes.push(new Note(58, 3));
	this.voices[2].sequence.notes.push(new Note(58, 7));
	this.voices[2].sequence.notes.push(new Note(58, 11));
	this.voices[2].sequence.notes.push(new Note(58, 15));
	
	this.voices[3].sequence.notes.push(new Note(61, 2));
	this.voices[3].sequence.notes.push(new Note(61, 6));
	this.voices[3].sequence.notes.push(new Note(61, 10));
	this.voices[3].sequence.notes.push(new Note(61, 14));
}


function Marlon (marlonCanvasID)
{
	this.WIDTH = window.innerWidth - 0;
	this.HEIGHT = window.innerHeight - 0;
	
	this.rotationDegreesHorizontal = 0;
	this.rotationDegreesVertical = 45;
	this.playheadPosition = 0;
	this.currentVoice = 0;
	this.currentStep = 0;
	this.currentNote = SCALE_BASE_NOTE;
	this.debugAxesOn = false;

	
	this.init(marlonCanvasID);
	this.setupEventHandlers();
	
	this.setupVoices();
	this.setupCubes();
	this.setupCursor();
	this.setupPlayhead();
	this.dimAndUndimNotes();
	
}

Marlon.prototype.drawGrid = function() {
	//Grid
	geometry = new THREE.PlaneGeometry( GRID_WIDTH, GRID_DEPTH, NUMBER_OF_SEQUENCE_STEPS, NUMBER_OF_GRID_NOTES);
    material = new THREE.MeshBasicMaterial( { color: 0x88AAFF, wireframe: true } );

    this.grid = new THREE.Mesh( geometry, material );
	this.grid.position.x = this.grid.position.y = this.grid.position.z = 0;
	this.grid.rotation.x = -Math.PI/2;
	this.grid.position.x = GRID_WIDTH/2;
	this.grid.position.z = GRID_DEPTH/2;
	
	this.scene.add( this.grid );
	
}

Marlon.prototype.dimAndUndimNotes = function() {
	if(typeof(this.voices) == 'undefined')
		return;
	
	for(var i=0; i<NUMBER_OF_VOICES;i++)
	{
		var newMaterial;
		if(i == this.currentVoice) {
			newMaterial = this.voices[i].activeMaterial;
		} else {
			newMaterial = this.voices[i].dimMaterial;
		}
		
		for(var noteIndex = 0; noteIndex<this.voices[i].sequence.notes.length; noteIndex++)
		{	
			this.voices[i].sequence.notes[noteIndex].cube.material = newMaterial;
		}
	}
}

Marlon.prototype.setupCursor = function() {
	var geometry = new THREE.CubeGeometry( SEQUENCER_STEP_WIDTH, SEQUENCER_STEP_WIDTH, SEQUENCER_STEP_WIDTH );
    var material = new THREE.MeshBasicMaterial( { color: 0x336666, wireframe: false,opacity: 0.7 } );
	this.cursorCube = new THREE.Mesh( geometry, material );
	this.scene.add( this.cursorCube);
	
	this.calculateCursorPosition();
}

Marlon.prototype.setupPlayhead = function() {
	return;
	var geometry = new THREE.CubeGeometry( SEQUENCER_STEP_WIDTH, 
		NUMBER_OF_VOICES * SEQUENCER_STEP_WIDTH, //Height
		NUMBER_OF_GRID_NOTES * SEQUENCER_STEP_WIDTH);
		
    var material = new THREE.MeshBasicMaterial( { color: 0x88AAFF, wireframe: false,opacity: 0.3 } );

	var materialFrame = new THREE.MeshBasicMaterial( { color: 0x88AAFF, wireframe: true,opacity: 0.5, doubleSided:false} );
	
	this.playhead = new THREE.Mesh( geometry, material );
	this.playheadFrame = new THREE.Mesh( geometry, materialFrame );

	this.scene.add( this.playhead);
	this.scene.add( this.playheadFrame);
	
	this.calculatePlayheadPosition();
}


Marlon.prototype.calculatePlayheadPosition =  function() {
	this.playheadFrame.position.x = this.playhead.position.x = SEQUENCER_STEP_WIDTH*this.playheadPosition + (SEQUENCER_STEP_WIDTH/2);
	this.playheadFrame.position.y = this.playhead.position.y = ((NUMBER_OF_VOICES * SEQUENCER_STEP_WIDTH)/2);
	this.playheadFrame.position.z = this.playhead.position.z = (NUMBER_OF_GRID_NOTES * SEQUENCER_STEP_WIDTH)/2;
}

Marlon.prototype.calculateCursorPosition = function() {
	this.cursorCube.position.x = (SEQUENCER_STEP_WIDTH/2) + this.currentStep * SEQUENCER_STEP_WIDTH;// - (256/2);
	this.cursorCube.position.y = (SEQUENCER_STEP_WIDTH/2) + this.currentVoice * SEQUENCER_STEP_WIDTH;
	var adjustedNote = this.currentNote - SCALE_BASE_NOTE;
	this.cursorCube.position.z = GRID_DEPTH - (SEQUENCER_STEP_WIDTH/2) - (adjustedNote * SEQUENCER_STEP_WIDTH);
	
	var cursorIsOnTopOfANote = false;	
	/*
	for(var i=0; i<NUMBER_OF_VOICES;i++)
		for(var j = 0; j<NUMBER_OF_SEQUENCE_STEPS; j++)
		{	
			var cursorIsOnTopOfCurrentNote = ((this.voices[i].sequence.notes[j].midiNote == this.currentNote) && (i == this.currentVoice) && (j == this.currentStep));
			
			//if(cursorIsOnTopOfCurrentNote == true)
			//	this.voices[i].sequence.notes[j].cube.material.opacity = 1;
			//else
			//	this.voices[i].sequence.notes[j].cube.material.opacity = 0.7;
			
			if(cursorIsOnTopOfCurrentNote)
				cursorIsOnTopOfANote = true;
		}

	*/cursorIsOnTopOfANote = false;
	this.cursorIsOnTopOfANote = cursorIsOnTopOfANote;
	
	if(this.cursorIsOnTopOfANote == true) {
		this.cursorCube.material.wireframe = true;
		this.cursorCube.material.opacity = 1;
	} else {
		this.cursorCube.material.wireframe = false;
		this.cursorCube.material.opacity = 0.7;
	}
}

Marlon.prototype.setupCurrentVoiceSelector = function() {
	var geometry = new THREE.CubeGeometry( GRID_WIDTH, GRID_DEPTH, SEQUENCER_STEP_WIDTH );
    var material = new THREE.MeshBasicMaterial( { color: 0x88AAFF, wireframe: false,opacity:0} );

	var materialFrame = new THREE.MeshBasicMaterial( { color: 0x336666, wireframe: true,opacity: 0.7, doubleSided:true} );

    this.currentVoiceSelector = new THREE.Mesh( geometry, material );
	this.currentVoiceSelector.rotation.x = -Math.PI/2;
	
	var geometryLeft = new THREE.PlaneGeometry( GRID_WIDTH, SEQUENCER_STEP_WIDTH, NUMBER_OF_SEQUENCE_STEPS, 1);
	this.currentVoiceSelectorLeft = new THREE.Mesh( geometryLeft, material );
	
	var geometryBack = new THREE.PlaneGeometry( GRID_WIDTH, SEQUENCER_STEP_WIDTH, NUMBER_OF_GRID_NOTES, 1);
	this.currentVoiceSelectorBack = new THREE.Mesh( geometryBack, material );
	this.currentVoiceSelectorBack.rotation.y = -Math.PI/2;
	
	var geometryBottom = new THREE.PlaneGeometry( GRID_WIDTH, GRID_DEPTH, 16, 16 );
	this.currentVoiceSelectorBottom = new THREE.Mesh( geometryBottom, material );
	this.currentVoiceSelectorBottom.rotation.x = -Math.PI/2;
	
	this.currentVoiceSelectorFrame = new THREE.Mesh( geometry, materialFrame );
	this.currentVoiceSelectorFrame.rotation.x = -Math.PI/2;
	
	this.moveCurrentVoiceSelector();
	this.scene.add( this.currentVoiceSelectorFrame );
	
	this.scene.add( this.currentVoiceSelector );
	
	// this.scene.add( this.currentVoiceSelectorBack );	
	// 	this.scene.add( this.currentVoiceSelectorLeft );
	// 	this.scene.add( this.currentVoiceSelectorBottom );		
}

Marlon.prototype.moveCurrentVoiceSelector = function() {
	this.currentVoiceSelector.position.x = GRID_WIDTH/2;
	this.currentVoiceSelector.position.y = SEQUENCER_STEP_WIDTH/2 + this.currentVoice*SEQUENCER_STEP_WIDTH;
	this.currentVoiceSelector.position.z = GRID_DEPTH/2;
	
	this.currentVoiceSelectorFrame.position.x = this.currentVoiceSelector.position.x;
	this.currentVoiceSelectorFrame.position.y = this.currentVoiceSelector.position.y;
	this.currentVoiceSelectorFrame.position.z = this.currentVoiceSelector.position.z;
	
	this.currentVoiceSelectorLeft.position.x = this.currentVoiceSelector.position.x;
	this.currentVoiceSelectorLeft.position.y = this.currentVoiceSelector.position.y;
	this.currentVoiceSelectorLeft.position.z = 0;
	
	this.currentVoiceSelectorBack.position.x = GRID_WIDTH;
	this.currentVoiceSelectorBack.position.y = this.currentVoiceSelector.position.y;
	this.currentVoiceSelectorBack.position.z = this.currentVoiceSelector.position.z;
	
	this.currentVoiceSelectorBottom.position.x = this.currentVoiceSelector.position.x;
	this.currentVoiceSelectorBottom.position.y = this.currentVoiceSelector.position.y - SEQUENCER_STEP_WIDTH/2;
	this.currentVoiceSelectorBottom.position.z = this.currentVoiceSelector.position.z;
	
	this.dimAndUndimNotes();
}

Marlon.prototype.init = function (marlonCanvasID) {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	// Set up stats
	this.stats = new Stats();
	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.top = '0px';
	container.appendChild( this.stats.domElement );
	
	this.scene = new THREE.Scene();

	this.drawDebugAxes();	
	
	// Setup camera
	this.camera = new THREE.PerspectiveCamera(45, this.WIDTH / this.HEIGHT, 1, 2000);
	this.camera.position.y = this.cameraHeight = 860;
	this.camera.rotation.x = this.rotationDegreesHorizontal * (Math.PI / 180);
    this.scene.add( this.camera );

    this.drawGrid();
	this.setupCurrentVoiceSelector();
	
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

		for(var noteIndex=0; noteIndex < currentVoice.sequence.notes.length; noteIndex++)
		{
			currentNote = currentVoice.sequence.notes[noteIndex];
			if(currentNote.getCube() == false)
				currentNote.createCube(currentVoice.activeMaterial);
			
			this.positionCube(currentNote.cube, voiceIndex, currentNote.midiNote, currentNote.step);
			
		    this.scene.add( currentNote.cube );
		}
		
	}
}

Marlon.prototype.render =  function() {
	this.renderer.render( this.scene, this.camera );
	this.stats.update();
}


Marlon.prototype.calculateCameraPosition =  function() {
	
	var radiansHorizontal = (this.rotationDegreesHorizontal / 180) * Math.PI;
	var radiansVertical = (this.rotationDegreesVertical / 180) * Math.PI;
	
	this.camera.position.x = CAMERA_DIST * Math.sin(radiansHorizontal) + GRID_WIDTH/2;
	this.camera.position.z = CAMERA_DIST * Math.cos(radiansHorizontal) + GRID_DEPTH/2;
	
	this.camera.position.y = this.cameraHeight;
	
	//this.camera.position.y = CAMERA_DIST * Math.sin(radiansVertical) + GRID_WIDTH/2;
	//this.camera.position.z = CAMERA_DIST * Math.cos(radiansVertical) + GRID_DEPTH/2;
	
	if(typeof(this.grid) != 'undefined')
		this.camera.lookAt(this.grid.position);
	else
		this.camera.lookAt(this.scene.position);
}

Marlon.prototype.movePlayhead =  function() {
	this.playheadPosition = (this.playheadPosition < 15) ? this.playheadPosition + 1:0;
}

Marlon.prototype.setHorizontalRotation = function(degrees) {
	degrees = degrees % 360;
	if(degrees < -225)
		degrees += 360;
	if(degrees > 135)
		degrees -= 360;
	
	this.rotationDegreesHorizontal = degrees;
}

Marlon.prototype.setupEventHandlers = function() {
	var thisObject = this;
	$(document.body).keydown(function(event) {thisObject.onKeyDown(event);});
	$(document.body).mousedown(function(event) {thisObject.onMouseDown(event);});
	$(document.body).mouseout(function(event) {thisObject.onMouseUp(event);});
}

Marlon.prototype.onMouseDown = function(event)
{
	
	this.mouseXOnMouseDown = event.pageX;
	this.mouseYOnMouseDown = event.pageY;
	d("mouseXOnMouseDown: " + this.mouseXOnMouseDown);
	this.rotationDegreesHorizontalOnMouseDown = this.rotationDegreesHorizontal;
	d('onMouseDown');
	
	var thisObject = this;
	$(document.body).bind('mousemove', function(event) {thisObject.onMouseMove(event);});
	$(document.body).bind('mouseup',function(event) {thisObject.onMouseUp(event);});
}

Marlon.prototype.onMouseMove = function (event)
{
	this.mouseX = event.pageX;
	var mouseRotationSensitivity = 0.2;
	var mouseXDelta = (this.mouseX - this.mouseXOnMouseDown);
	this.setHorizontalRotation(this.rotationDegreesHorizontalOnMouseDown - (mouseXDelta * mouseRotationSensitivity));
	this.calculateCameraPosition();
}

Marlon.prototype.onMouseUp = function (event)
{
	var thisObject = this;
	$(document.body).unbind('mousemove');
}

Marlon.prototype.onMouseClick = function(evt)
{
	//$('#mouseX').text(mouseX);
	//$('#mouseY').text(mouseY);
}

Marlon.prototype.toggleNote = function (voice, note, step) {

	// If the note is on, we need to turn it off
	// Go through all of the notes for this voice and see if any of them match the note and step.
	var notesFoundAndRemoved = this.deleteNote(voice, note, step);
	
	if(notesFoundAndRemoved) {
		return 'delete';
	} else if(!notesFoundAndRemoved) {
		this.addNote(voice, note, step);
		return 'add';
	}
}

Marlon.prototype.positionCube = function(cube, voice, note, step) {
	cube.position.x = (SEQUENCER_STEP_WIDTH/2) + step * SEQUENCER_STEP_WIDTH;// - (256/2);
	cube.position.y = (SEQUENCER_STEP_WIDTH/2) + voice * SEQUENCER_STEP_WIDTH;
	var adjustedNote = note - SCALE_BASE_NOTE;
	cube.position.z = GRID_DEPTH - (SEQUENCER_STEP_WIDTH/2) - (adjustedNote * SEQUENCER_STEP_WIDTH);		
}

Marlon.prototype.addNote = function (voice, note, step, preventDuplicates) {
	if(preventDuplicates != true) preventDuplicates = false;
	
	if(preventDuplicates == true) {
		if(this.findNote(voice, note, step) == true)
			return;
	}

	var newNote = new Note(note, step);
	var voiceColor = this.voices[voice].color;
	
	if(newNote.getCube() == false)
		newNote.createCube(this.voices[voice].activeMaterial);
	
	this.positionCube(newNote.cube, voice, note, step);
	
	this.voices[voice].sequence.notes.push(newNote);
	
	this.scene.add( newNote.cube );
}

Marlon.prototype.findNote = function (voice, note, step) {
	// Go through all of the notes for this voice and see if any of them match the note and step.
	var notesFoundAndRemoved = false;
	for(var noteIndex = 0; noteIndex < this.voices[voice].sequence.notes.length; noteIndex++) {
		var currentNote = this.voices[voice].sequence.notes[noteIndex];
		if(currentNote.step == step && currentNote.midiNote == note) {
			return true;
		}
	}
	
	return false;
}

Marlon.prototype.deleteNote = function (voice, note, step) {
	// Go through all of the notes for this voice and see if any of them match the note and step.
	var notesFoundAndRemoved = false;
	for(var noteIndex = 0; noteIndex < this.voices[voice].sequence.notes.length; noteIndex++) {
		var currentNote = this.voices[voice].sequence.notes[noteIndex];
		if(currentNote.step == step && currentNote.midiNote == note) {
			d("About to remove a note");

			// We need to turn this note off.
			this.scene.remove(this.voices[voice].sequence.notes[noteIndex].cube);
			this.voices[voice].sequence.notes.splice(noteIndex, 1);
			notesFoundAndRemoved = true;
		}
	}
	
	return notesFoundAndRemoved;
}

Marlon.prototype.handleShiftKey = function() {
	if(this.shiftMeans == 'add') {
		this.addNote(this.currentVoice, this.currentNote, this.currentStep, true);
	} else if (this.shiftMeans == 'delete') {
		this.deleteNote(this.currentVoice, this.currentNote, this.currentStep);
	} else {
		this.toggleNote(this.currentVoice, this.currentNote, this.currentStep);
	}
}

Marlon.prototype.moveCurrentStepUp = function() {
	if(this.currentStep + 1 < NUMBER_OF_SEQUENCE_STEPS) {
		this.currentStep++;	
		this.calculateCursorPosition();
	}
}

Marlon.prototype.moveCurrentStepDown = function() {
	if(this.currentStep  > 0) {
		this.currentStep--;	
		this.calculateCursorPosition();
	}
}

Marlon.prototype.moveCurrentNoteUp = function() {
	if(this.currentNote + 1 < NUMBER_OF_GRID_NOTES + SCALE_BASE_NOTE) {
		this.currentNote++;	
		this.calculateCursorPosition();
	}
}

Marlon.prototype.moveCurrentNoteDown = function() {
	if(this.currentNote > SCALE_BASE_NOTE){
		this.currentNote--;	
		this.calculateCursorPosition();
	}
}

Marlon.prototype.onKeyDown = function(event) {
	switch(event.which) {
		case 188: //',' key
			this.setHorizontalRotation(this.rotationDegreesHorizontal - CAMERA_ROTATION_STEP_AMOUNT);
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 190: //'.' key
			this.setHorizontalRotation(this.rotationDegreesHorizontal + CAMERA_ROTATION_STEP_AMOUNT);
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 37: //left arrow
			if(this.rotationDegreesHorizontal >= -225 && this.rotationDegreesHorizontal < -135)
				this.moveCurrentStepUp();
			if(this.rotationDegreesHorizontal >= -135 && this.rotationDegreesHorizontal < -45)
				this.moveCurrentNoteUp();
			if(this.rotationDegreesHorizontal >= -45 && this.rotationDegreesHorizontal < 45)
				this.moveCurrentStepDown();
			if(this.rotationDegreesHorizontal >= 45 && this.rotationDegreesHorizontal < 135)
				this.moveCurrentNoteDown();
					
			if(event.shiftKey) this.handleShiftKey();
			
			event.preventDefault();
			break;
		case 39: //right arrow
			if(this.rotationDegreesHorizontal >= -225 && this.rotationDegreesHorizontal < -135)
				this.moveCurrentStepDown();
			if(this.rotationDegreesHorizontal >= -135 && this.rotationDegreesHorizontal < -45)
				this.moveCurrentNoteDown();
			if(this.rotationDegreesHorizontal >= -45 && this.rotationDegreesHorizontal < 45)
				this.moveCurrentStepUp();
			if(this.rotationDegreesHorizontal >= 45 && this.rotationDegreesHorizontal < 135)
				this.moveCurrentNoteUp();
			
			if(event.shiftKey) this.handleShiftKey();
			
			event.preventDefault();
			break;
		case 38: //up arrow
			if(this.rotationDegreesHorizontal >= -225 && this.rotationDegreesHorizontal < -135)
				this.moveCurrentNoteDown();
			if(this.rotationDegreesHorizontal >= -135 && this.rotationDegreesHorizontal < -45)
				this.moveCurrentStepUp();
			if(this.rotationDegreesHorizontal >= -45 && this.rotationDegreesHorizontal < 45)
				this.moveCurrentNoteUp();
			if(this.rotationDegreesHorizontal >= 45 && this.rotationDegreesHorizontal < 135)
				this.moveCurrentStepDown();
				
			if(event.shiftKey) this.handleShiftKey();
			
			event.preventDefault();
			break;
		case 40: // down arrow
			if(this.rotationDegreesHorizontal >= -225 && this.rotationDegreesHorizontal < -135)
				this.moveCurrentNoteUp();
			if(this.rotationDegreesHorizontal >= -135 && this.rotationDegreesHorizontal < -45)
				this.moveCurrentStepDown();
			if(this.rotationDegreesHorizontal >= -45 && this.rotationDegreesHorizontal < 45)
				this.moveCurrentNoteDown();
			if(this.rotationDegreesHorizontal >= 45 && this.rotationDegreesHorizontal < 135)
				this.moveCurrentStepUp();
			
			if(event.shiftKey) this.handleShiftKey();
				
			event.preventDefault();
			break;
		case 48: // '0' arrow
			this.rotationDegreesHorizontal = -45;
			this.cameraHeight = 290;
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 49: // '1' arrow
			this.setHorizontalRotation(0);
			this.cameraHeight = 860;
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 50: // '2' arrow
			this.setHorizontalRotation(90);
			this.cameraHeight = 860;
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 51: // '3' arrow
			this.setHorizontalRotation(180);
			this.cameraHeight = 860;
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 52: // '4' arrow
			this.setHorizontalRotation(270);
			this.cameraHeight = 860;
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 16:
			this.shiftMeans = this.toggleNote(this.currentVoice, this.currentNote, this.currentStep);
			event.preventDefault();
			break;
			
		case 32: //space bar
			this.toggleNote(this.currentVoice, this.currentNote, this.currentStep);
			event.preventDefault();
			break;
		case 88: // 'x' arrow
				if(this.currentVoice < NUMBER_OF_VOICES - 1) {
					this.currentVoice++;
					this.moveCurrentVoiceSelector();
					this.calculateCursorPosition();
				}
				event.preventDefault();
				break;
		case 90: // 'z' arrow
				if(this.currentVoice > 0) {
					this.currentVoice--;
					this.moveCurrentVoiceSelector();
					this.calculateCursorPosition();
				}
				
				event.preventDefault();
				break;
		case 189: // '-' key
			//this.rotationDegreesVertical -= CAMERA_ROTATION_STEP_AMOUNT;
			this.cameraHeight -= 10;
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 187: // '+' key
			//this.rotationDegreesVertical += CAMERA_ROTATION_STEP_AMOUNT;
			this.cameraHeight += 10;
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 18: // option key
			this.playing = !this.playing;
			event.preventDefault();
			break;
	}


	this.xTriggered++;

	var msg = "Handler for .keypress() called " + this.xTriggered + " time(s). Keycode was " + event.which + "\n";
	msg += "Camera:\n";
	msg += "Angle: " + this.rotationDegreesHorizontal + " ";	
	msg += "x: " + this.camera.position.x + " / ";	
	msg += "y: " + this.camera.position.y + " / ";	
	msg += "z: " + this.camera.position.z + ".\n";
	msg += "rotation.x = " + this.camera.rotation.x + " / ";	
	msg += "rotation.y = " + this.camera.rotation.y + " / ";	
	msg += "rotation.z = " + this.camera.rotation.z + ".";
	d(msg);		

}

Marlon.prototype.drawDebugAxes = function(){
	if(!this.debugAxesOn) return;
	
	           
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
