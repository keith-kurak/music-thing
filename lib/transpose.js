/*
 * Adapted from https://github.com/jroth01/TransposeJS
 *
 * transpose.js - A Javascript library for music transposition
 * Justin Roth
 * JustinCarlRoth@gmail.com
 */
var Notes =     ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];
var Keys =      {C: 0, Db: 1, D: 2, Eb: 3, E: 4, F: 5, Gb: 6, G: 7, Ab: 8, A: 9,
                  Bb: 10, B: 11};
var Modes =     ["Major", "Dorian", "Phrygian", "Lydian", "Mixolydian",
                "Aeolian", "Locrian"];

/* Default MIDI Notes are in the middle octave from C3 to B3 */
var MIDINotes = [60,61,62,63,64,65,66,67,68,69,70,71];

/* Returns note number from name */
function getNoteNumber(name) {
        return Keys[name];
}

/* Returns note name from number */
function getNoteName(index) {
        return Notes[index];
}

/* Returns the octave number of a given MIDI note
 * Follows the convention in which C3 = 60
 */
function getOctave(midiNote) {
        var octaveStart = 0;
        var octaveEnd = 11;
        for (var i = -2; i < 10; i++) {
               if (midiNote >= octaveStart && midiNote <= octaveEnd)  {
                    return i;
               }
               octaveStart += 12;
               octaveEnd += 12;
        }
}

/* Returns note object */
function getNote(noteName) {
    var noteIndex = Keys[noteName];
    var note  = {
                        name: noteName,
                        midi: MIDINotes[noteIndex],
                        octave: getOctave(MIDINotes[noteIndex])
                }
    return note;
}

/* Returns major scale */
function getMajorScale(rootNote) {
        var root = Keys[rootNote]; // root note index
        var scale =  {

           root: rootNote,
           mode: "Major",
           notes: [
                {
                        name: rootNote,
                        midi: MIDINotes[root],
                        octave: getOctave(MIDINotes[root])
                },
                {
                        name: Notes[ (root +  2) % 12 ],
                        midi: MIDINotes[root] + 2,
                        octave: getOctave( MIDINotes[root] + 2 )
                },
                {
                        name: Notes[ (root +  4) % 12 ],
                        midi: MIDINotes[root] + 4,
                        octave: getOctave( MIDINotes[root] + 4)
                },
                {
                        name: Notes[ (root +  5) % 12],
                        midi: MIDINotes[root] + 5,
                        octave: getOctave(MIDINotes[root] + 5)
                },
                {
                        name: Notes[ (root +  7) % 12],
                        midi: MIDINotes[root] + 7,
                        octave: getOctave( MIDINotes[root] + 7)
                },
                {
                        name: Notes[ (root +  9) % 12],
                        midi: MIDINotes[root] + 9,
                        octave: getOctave(MIDINotes[root] + 9)
                },
                {
                        name: Notes[(root +  11) % 12],
                        midi: MIDINotes[root] + 11,
                        octave: getOctave(MIDINotes[root] + 11)
                }

                ]
        };
        return scale;
}

/* Gets scale of a given mode */
function getScale(rootNote, mode) {

        // Begin with a major scale, and change intervals as necessary
        var scale = getMajorScale(rootNote);
        var root = Keys[rootNote]; // root note index

        switch (mode) {
            case "Ionian":
                break;
            case "Dorian":
                scale.mode = "Dorian";
                scale.notes[2] = shiftNote(scale.notes[2], -1); // flat 3
                scale.notes[6] = shiftNote(scale.notes[6], -1); // flat 7
                break;
            case "Phrygian":
                scale.mode = "Phrygian"
                scale.notes[1] = shiftNote(scale.notes[1], -1); // flat 2
                scale.notes[2] = shiftNote(scale.notes[2], -1); // flat 3
                scale.notes[5] = shiftNote(scale.notes[5], -1); // flat 6
                scale.notes[6] = shiftNote(scale.notes[6], -1); // flat 7
                break;
            case "Lydian":
                scale.mode = "Lydian"
                scale.notes[3] = shiftNote(scale.notes[3], +1); // sharp 4
                break;
            case "Mixolydian" || "Dominant":
                scale.mode = "Mixolydian";
                scale.notes[6] = shiftNote(scale.notes[6], -1); // flat 7
                break;
            case "Aeolian" || "Minor":
                scale.mode = "Aeolian";
                scale.notes[5] = shiftNote(scale.notes[5], -1); // flat 6
                scale.notes[2] = shiftNote(scale.notes[2], -1); // flat 3
                scale.notes[6] = shiftNote(scale.notes[6], -1); // flat 7
                break;
            case "Locrian":
                scale.mode = "Locrian";
                scale.notes[1] = shiftNote(scale.notes[1], -1); // flat 2
                scale.notes[2] = shiftNote(scale.notes[2], -1); // flat 3
                scale.notes[4] = shiftNote(scale.notes[4], -1); // flat 5
                scale.notes[5] = shiftNote(scale.notes[5], -1); // flat 6
                scale.notes[6] = shiftNote(scale.notes[6], -1); // flat 7
                break;
        }

        return scale;
}

Number.prototype.mod = function(n) {
    return ((this%n)+n)%n;
};
/* Returns the name of a note shifted by n semitones */
function shiftNote(note, semitones) {
        var index = Keys[note.name];
        var offset = index + semitones;
        var shift = offset.mod(12);
        var newNote = Notes[shift];
        return {
                name: newNote,
                midi: MIDINotes[index] + semitones,
                octave: getOctave(MIDINotes[index] + semitones)
        }
}

/* Returns the original scale transposed by a number of semitones */
function shiftScale(scale, semitones) {
        for (var i = 0; i < scale.notes.length; i++) {
                scale.notes[i] = shiftNote(scale.notes[i], semitones);
                var originalMidi = scale.notes[i].midi;
                var newMidi = scale.notes[i].midi + semitones;
                scale.notes[i].midi += semitones;
                var octaveChange = (originalMidi + newMidi) % 12;
                if (octaveChange == 0) {
                        if (semitones < 0) {
                                scale.notes[i].octave -= semitones /12;
                        } else {
                                scale.notes[i].octave +=  semitones / 12;
                        }
                }
        }
        scale.root = scale.notes[0].name
        return scale;
}

/* Renders the scale to the DOM */
function scaleToTable(scale) {
        $('#keyName').text(scale.root + " " + scale.mode)
        for (var i = 0; i < scale.notes.length; i++) {
                $('#note' + i).text(scale.notes[i].name);
                $('#midi' + i).text(scale.notes[i].midi);
                $('#oct' + i).text(scale.notes[i].octave);
        }
}

/* Returns mode number from name */
function getModeNum(modeName) {
        for (var i = 0; i < Modes.length; i++) {
                if (Modes[i] === modeName) {
                        return i;
                }
        }
}

/* Get chord based off scale tones */
function getChord(scale, type) {
        var chord = [];
        switch(type) {
                case "triad" :
                        chord.push(scale.notes[0]);
                        chord.push(scale.notes[2]);
                        chord.push(scale.notes[4]);
                        break;
                case "seventh":
                        chord.push(scale.notes[0]);
                        chord.push(scale.notes[2]);
                        chord.push(scale.notes[4]);
                        chord.push(scale.notes[6]);
                        break;
        }

}

/* Get modes */
function getModes(scale) {
        var modeStart = getModeNum(scale.mode);
        var list = [];
        var mode;
        for (var i = modeStart + 1; i < modeStart + 7; i++) {
                mode = getScale(scale.notes[i % 7].name, Modes[i % 7]);
                list.push(mode);
        }

        var modeObj = {
                name : "Modes of " + scale.root + " " + scale.mode,
                modes: list
        }
        return modeObj;
}

export {
  getNote,
  shiftNote,
}