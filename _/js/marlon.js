//Global parameters
//var GRID_WIDTH = 736;
//var GRID_HEIGHT = 449;

function Ball()
{

}


function Marlon (marlonCanvasID)
{
	this.WIDTH = window.innerWidth - 0;
	this.HEIGHT = window.innerHeight - 0;
	
	this.rotationDegrees = -45;
	this.cameraDist = 20;
	this.rotationStepAmount = 5;
	this.playheadPosition = 0;
	this.stepWidth = 32;
	
	this.init(marlonCanvasID);
	this.setupEventHandlers();
}

Marlon.prototype.init = function init(marlonCanvasID) {
	this.scene = new THREE.Scene();

	// set some camera attributes
	var VIEW_ANGLE = 75,
	    ASPECT = this.WIDTH / this.HEIGHT,
	    NEAR = .1,
	    FAR = 1000;
	
	this.camera = new THREE.OrthographicCamera( this.WIDTH / -2, 							this.WIDTH / 2, this.HEIGHT / 2, this.HEIGHT / - 2, -10, 1000 );
		
	this.camera.position.y = 5;
	this.calculateCameraPosition();
	
	this.camera.updateMatrix();
	
    this.scene.add( this.camera );

    
	//Cube
	geometry = new THREE.CubeGeometry( 32, 32, 32 );
    material = new THREE.MeshBasicMaterial( { color: 0x0000FF, wireframe: true } );

    cube = new THREE.Mesh( geometry, material );
	cube.position.x = 0;
	cube.position.y = 16;
	cube.position.z = 0;
    this.scene.add( cube );

	//Grid
	geometry = new THREE.PlaneGeometry( 512, 512, 16, 16);
    material = new THREE.MeshBasicMaterial( { color: 0x88AAFF, wireframe: true } );

    this.grid = new THREE.Mesh( geometry, material );
	this.grid.position.x = this.grid.position.y = this.grid.position.z = 0;
	this.grid.rotation.x = -Math.PI/2;
	this.grid.receiveShadow = true;
	this.scene.add( this.grid );

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

    this.renderer = new THREE.CanvasRenderer();
    this.renderer.setSize(this.WIDTH, this.HEIGHT);

	//document.getElementById(marlonCanvasID).appendChild( this.renderer.domElement );
   	document.body.appendChild( this.renderer.domElement );
}
/*
Marlon.prototype.animate =  function animate() {
	requestAnimationFrame( animate );
	
    this.render();
}
*/
Marlon.prototype.render =  function render() {
	this.renderer.render( this.scene, this.camera );
}

Marlon.prototype.calculatePlayheadPosition =  function calculatePlayheadPosition() {
	this.playheadGrid.position.x = this.stepWidth*this.playheadPosition - (240);
}

Marlon.prototype.calculateCameraPosition =  function calculateCameraPosition() {
	var radians = (this.rotationDegrees / 180) * (Math.PI)
	this.camera.position.z = this.cameraDist * Math.cos(radians);
	this.camera.position.x = this.cameraDist * Math.sin(radians);
	this.camera.lookAt(this.scene.position);
}

Marlon.prototype.movePlayhead =  function movePlayhead() {
	this.playheadPosition = (this.playheadPosition < 15) ? this.playheadPosition + 1:0;
}

Marlon.prototype.setupEventHandlers = function setupEventHandlers() {
	var thisObject = this;
	$(document.body).keydown(function(event) {thisObject.onKeyDown(event);});
}

Marlon.prototype.onKeyDown = function onKeyDown(event) {
	switch(event.which) {
		case 188: //',' key
			this.rotationDegrees -= this.rotationStepAmount;
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 190: //'.' key
			this.rotationDegrees += this.rotationStepAmount;
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
			this.camera.position.y--;
			this.calculateCameraPosition();
			event.preventDefault();
			break;
		case 187: // '+' key
			this.camera.position.y++;
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
	msg += "Camera.x = " + this.camera.position.x + " / ";	
	msg += "Camera.y = " + this.camera.position.y + " / ";	
	msg += "Camera.z = " + this.camera.position.z + ".\n ";
	msg += "Camera.rotation.x = " + this.camera.rotation.x + " / ";	
	msg += "Camera.rotation.y = " + this.camera.rotation.y + " / ";	
	msg += "Camera.rotation.z = " + this.camera.rotation.z + ". ";
	d(msg);		

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