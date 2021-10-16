const fretboardKit = require("@jasonfleischer/fretboard")
const musicKit = require("@jasonfleischer/music-model-kit");
musicKit.init();

const fretboardView = fretboardKit({
	id: 'fretboard',
	width: 800,
	onClick: function(note, isOn) {
		if(isOn) {
			fretboardView.drawNote(note);
		} else {
			fretboardView.clearNote(note);
		}
	},
	hover: true,
	showLabels: true
});

document.getElementById("note_button").onclick = function() { 
	let midiValue = 45; // A2
	let note = musicKit.all_notes[midiValue];
	fretboardView.clear();
	fretboardView.drawNote(note);
};
document.getElementById("chord_button").onclick = function() {
	let midiValue = 45; // A2
	let note = musicKit.all_notes[midiValue];
	let chord = new musicKit.Chord(note, musicKit.Chord.TYPE.minor);
	fretboardView.drawChord(chord);
}
document.getElementById("scale_button").onclick = function() {
	let midiValue = 45; // A2
	let note = musicKit.all_notes[midiValue];
	let scale = new musicKit.Scale(note, musicKit.Scale.TYPE.Aeolian);
	fretboardView.drawScale(scale);
}
document.getElementById("clear_button").onclick = function() {
	fretboardView.clear();
}

document.getElementById('darkmode_checkbox').addEventListener('change', (event) => {
	let body = document.getElementsByTagName("BODY")[0];
  	if (event.currentTarget.checked) {
    	body.style.background = "#000";
  	} else {
   	 	body.style.background = "#fff";
  	}
});

new musicKit.MidiListener(
	function (midiValue, channel, velocity) { // note on
		let note = musicKit.all_notes[midiValue];
		fretboardView.drawNote(note);
	},
	function (midiValue, channel, velocity) { // note off
		let note = musicKit.all_notes[midiValue];
		fretboardView.clearNote(note);
	});
