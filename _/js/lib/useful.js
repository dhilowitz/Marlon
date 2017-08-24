//By David Hilowitz

/*** DEBUGGING FUNCTIONS ***/

/*** PROFILING ***/
function startProfiling()
{
	if(typeof(console.profile) != 'undefined')
		console.profile();
}

function stopProfiling()
{
	if(typeof(console.profileEnd) != 'undefined')
		console.profileEnd();
}


//Console Output
function d(outputMessage)
{
	//return;
	
	if(typeof(window.console) != 'undefined')
		if(typeof(window.console.log) != 'undefined')
			window.console.log(outputMessage);
}

function randomIntInRange(lowerRange, higherRange)
{
	var returnVal = Math.min(lowerRange, higherRange) + Math.round(Math.random() * (Math.abs(higherRange - lowerRange)));
	d(returnVal);
	return returnVal;
}

//Audio -- Notes and MIDI

function ConvertMIDINoteNumberToFrequency (midiNoteNumber)
{
	return 440.0 * Math.pow(2,((midiNoteNumber-69.0)/12));
}



function ConvertNoteNameToMIDINoteNumber (noteName)
{
	var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
	
	var firstLetter = noteName.substr(0,1);
	var firstAndSecondLetters = noteName.substr(0,2);
	var noteNumberComponent;
	
	var noteIndex;
	for(noteIndex = 0; noteIndex < 12 ; noteIndex++)
	{
		if(firstAndSecondLetters == noteStrings[noteIndex])
		{
			noteNumberComponent = parseInt(noteName.substr(2));
			break;
		}
	}
	
	if(noteIndex == 12)
	{
		for(noteIndex = 0; noteIndex < 12 ; noteIndex++)
		{
			if(firstLetter == noteStrings[noteIndex])
			{
				noteNumberComponent = parseInt(noteName.substr(1));
				break;
			}
		}
	}
	
	

	if(noteIndex == 12) return 60;
	
	
	return (noteNumberComponent+1)*12 + noteIndex;
}

function ConvertMIDINoteNumberToNoteName (noteNumber)
{
	if( !(noteNumber > 0 && noteNumber < 255))
		return;
		
	var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
	
	var octave = (noteNumber / 12) - 1;
	var noteIndex = (noteNumber % 12);
	var note = noteStrings[noteIndex] + Math.floor(octave);
	return note;
}

// GRAPHICS - HIT DETECTIOn
function pointInRect(pointX, pointY, rectX1, rectY1, rectX2, rectY2)
{
	if(	(pointX >= rectX1) && 
		(pointX <= rectX2) &&
		(pointY >= rectY1) && 
		(pointY <= rectY2))
	{
		return true;
	}
}

/**
 * Function : dump()
 * Arguments: The data - array,hash(associative array),object
 *    The level - OPTIONAL
 * Returns  : The textual representation of the array.
 * This function was inspired by the print_r function of PHP.
 * This will accept some data as the argument and return a
 * text that will be a more readable version of the
 * array/hash/object that is given.
 * Docs: http://www.openjs.com/scripts/others/dump_function_php_print_r.php
 */
function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}

//Color stuff
// Taken from here: http://www.krazydad.com/makecolors.php
function byte2Hex(n)
  {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }

function RGB2Color(r,g,b)
  {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
  }

function RGB20xColor(r,g,b)
  {
    return '0x' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
  }

function colorRainbowArray(numberOfColors,phase, htmlColor, center, width)
{
	returnArray = new Array();
    if (phase == undefined) phase = 0;
  center = 128;
  width = 127;
  frequency = Math.PI*2/numberOfColors;
  for (var i = 0; i < numberOfColors; ++i)
  {
     red   = Math.sin(frequency*i+2+phase) * width + center;
     green = Math.sin(frequency*i+0+phase) * width + center;
     blue  = Math.sin(frequency*i+4+phase) * width + center;
	if(htmlColor)
		returnArray.push(RGB2Color(red,green,blue));
	else
		returnArray.push(RGB20xColor(red,green,blue));
  }
	return returnArray;
}

// TEXT MANIPULATION
//From http://sujithcjose.blogspot.com/2007/10/zero-padding-in-java-script-to-add.html
function zeroPad(num,count)
{
	var numZeropad = num + '';
	while(numZeropad.length < count) {
		numZeropad = "0" + numZeropad;
	}
	return numZeropad;
}
