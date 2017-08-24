function FlashSoundGeneration(numVoices) {
	//this.numVoices = numVoices;
	//this.voices = new Array(this.numVoices);
	//this.lastVoice = -1;
	//this.sound_generation = null;
}

/*
	var sound_generation = null;
	
	
	
	
	function playNote(text) {   
		if(sound_generation == null) return;
		if(typeof(sound_generation) == 'undefined') return;
		//if(!isMuted)
			sound_generation.playNote(text);
	}  
	
	function toggleMute() {   
		isMuted = !isMuted;
		$('#muteButton').text((isMuted) ? "ON" : "OFF"); 
		sound_generation.setMute(isMuted);     
	}


*/

FlashSoundGeneration.prototype.init = function init()
{
	// var flashvars = {};
	// var params = {allowScriptAccess:"always"};
	// var attributes = { id: "sound_generation", name: "sound_generation" };

	// /* Create a tag in body called sound_generation */
	// this.soundGenerationDiv = document.createElement('div');
	// this.soundGenerationDiv.id = "sound_generation";
	// this.soundGenerationDiv.name = "sound_generation";
	// document.body.appendChild(this.soundGenerationDiv);
	
	// swfobject.embedSWF("_/swf/FlashSoundGeneration.swf", 
	// 				   "sound_generation", 
	// 				   "1", 
	// 				   "1", 
	// 				   "10.0.0", 
	// 				   "expressInstall.swf", 
	// 				   flashvars, 
	// 				   params, 
	// 				   attributes, 
	// 				   function callbackFn(e) {
	// 				   		sound_generation_object = e.ref;


	// 				   });
	
	

	/* 
	for(var voiceIndex = 0; voiceIndex < this.numVoices; voiceIndex++)
	{
		this.voices[voiceIndex] = new Audio();
		//this.voices[voiceIndex].autoplay = true;
	} 
	*/
}

FlashSoundGeneration.prototype.stopAllNotes = function stopAllNotes() {
	for(var voiceIndex = 0; voiceIndex < this.numVoices; voiceIndex++)
	{
		this.voices[voiceIndex].pause();
	}
}

FlashSoundGeneration.prototype.playNote = function playNote(noteNumber)
{
	if(sound_generation == null) return;
	if(typeof(sound_generation) == 'undefined') return;
		sound_generation.playNote(noteNumber);
}
