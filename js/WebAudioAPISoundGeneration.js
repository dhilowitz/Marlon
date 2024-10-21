function JSAudioTagSoundGeneration(numVoices) {
	this.numVoices = numVoices;
	this.voices = new Array(this.numVoices);
	this.lastVoice = -1;
}

JSAudioTagSoundGeneration.prototype.init = function init()
{
	for(var voiceIndex = 0; voiceIndex < this.numVoices; voiceIndex++)
	{
		this.voices[voiceIndex] = new Audio();
		//this.voices[voiceIndex].autoplay = true;
	}
}

JSAudioTagSoundGeneration.prototype.stopAllNotes = function stopAllNotes() {
	for(var voiceIndex = 0; voiceIndex < this.numVoices; voiceIndex++)
	{
		this.voices[voiceIndex].pause();
	}
}

JSAudioTagSoundGeneration.prototype.playNote = function playNote(noteNumber)
{
	if( (this.lastVoice + 1) >= this.numVoices) 
		this.lastVoice = 0;
	else 
		this.lastVoice++;
		
	var noteURL = this.getNoteURL(noteNumber);	
	//d("playNote: " + noteNumber + " on voice " + this.lastVoice + ((noteURL != null) ? " (URL: " + this.getNoteURL(noteNumber) + ")" : ""));
	
	if(noteURL != null)
	{
		this.voices[this.lastVoice].src = "_/snd/" + noteURL;
		this.voices[this.lastVoice].play();
	}
}

JSAudioTagSoundGeneration.prototype.getNoteURL = function getNoteURL(noteNumber)
{
	noteNumber = noteNumber;
	if(noteNumber >= 48 && noteNumber <= 112)
	{
		//return "autoharp/mp3/" + zeroPad(noteNumber, 3) + ".mp3"; 
		return "moog_12_c_hendre_medium/mp3/" + encodeURIComponent(ConvertMIDINoteNumberToNoteName(noteNumber)) + ".mp3"; 
		
	}
	return null;
}

