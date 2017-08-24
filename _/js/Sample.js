function Sample() {
	this.data = [];

	this.getSampleNote = function getSampleNote(noteNumber) {
		if(noteNumber in this.data) {
			var oNote = new SampleNote();
			oNote.fileUrl = this.data[noteNumber].fileUrl;
			oNote.playbackRate = this.data[noteNumber].playbackRate;
			return oNote;
		} 
		return false;
	}
}

function SampleNote() {
	var fileUrl = null;
	var playbackRate = 1.0;
	var volume = 1;
}