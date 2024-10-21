var sampleBaseURL = "_/snd/";

function JSAudioTagSoundGeneration(numVoices, oSample) {
	this.numVoices = numVoices;
	this.voices = new Array(this.numVoices);
	this.lastVoice = -1;
	this.oSample = oSample;
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
	var oSampleNote = this.oSample.getSampleNote(noteNumber);
	if(oSampleNote == false)
		return;

	if( (this.lastVoice + 1) >= this.numVoices) 
		this.lastVoice = 0;
	else 
		this.lastVoice++;
	
	this.voices[this.lastVoice].src = sampleBaseURL + oSampleNote.fileUrl;
	this.voices[this.lastVoice].playbackRate.value = oSampleNote.playbackRate;
	this.voices[this.lastVoice].play();
	//d("playNote: " + noteNumber + " on voice " + this.lastVoice + ((noteURL != null) ? " (URL: " + this.getNoteURL(noteNumber) + ")" : ""));

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

