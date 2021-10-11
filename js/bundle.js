(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){const fretboardKit=require("@jasonfleischer/fretboard");const musicKit=require("@jasonfleischer/music-model-kit");musicKit.init();const fretboardView=fretboardKit({id:"fretboard",width:325,onClick:function(note,isOn){if(isOn){fretboardView.drawNote(note)}else{fretboardView.clearNote(note)}},hover:true});document.getElementById("note_button").onclick=function(){let midiValue=45;let note=musicKit.all_notes[midiValue];fretboardView.clear();fretboardView.drawNote(note)};document.getElementById("chord_button").onclick=function(){let midiValue=60;let note=musicKit.all_notes[midiValue];let chord=new musicKit.Chord(note,musicKit.Chord.TYPE.minor);fretboardView.drawChord(chord)};document.getElementById("scale_button").onclick=function(){let midiValue=62;let note=musicKit.all_notes[midiValue];let scale=new musicKit.Scale(note,musicKit.Scale.TYPE.Aeolian);fretboardView.drawScale(scale)};document.getElementById("clear_button").onclick=function(){fretboardView.clear()};new musicKit.MidiListener(function(midiValue,channel,velocity){let note=musicKit.all_notes[midiValue];fretboardView.drawNote(note)},function(midiValue,channel,velocity){let note=musicKit.all_notes[midiValue];fretboardView.clearNote(note)})},{"@jasonfleischer/fretboard":2,"@jasonfleischer/music-model-kit":8}],2:[function(require,module,exports){const FretboardView=require("./lib/fretboard_view.js");const log=require("@jasonfleischer/log");function fretboardBuilder(options){var id=options.id;if(id===undefined){log.e("id not provided for fretboard");return}if(document.getElementById(id)===undefined){log.e("no fretboard DIV exists with id: "+id);return}var width=1e3;if(options.width!==undefined){width=options.width}var hover=false;if(options.hover!==undefined){hover=options.hover}return new FretboardView(id,width,options.onClick,hover)}module.exports=fretboardBuilder},{"./lib/fretboard_view.js":3,"@jasonfleischer/log":7}],3:[function(require,module,exports){const TWO_PI=2*Math.PI;const musicKit=require("@jasonfleischer/music-model-kit");const Line=require("./line.js");const Point=require("./point.js");const Polygon=require("./polygon.js");class FretboardView{constructor(id="fretboard_view_id",width=1e3,onClick,hover=false){this.id=id;this.hover=hover;this.WIDTH=1e3;this.HEIGHT=230;this.note_positions=[];this.noteValueToNotePositionsDict={};this.radius=this.HEIGHT*.06;this.root_view=document.getElementById(this.id);this.root_view.style.position="relative";this.root_view.style.width=this.WIDTH+"px";this.root_view.style.height=this.HEIGHT+"px";this.root_view.width=this.WIDTH;this.root_view.height=this.HEIGHT;this.buildCanvases();this.draw_background();this.resize(width);if(onClick!==undefined){this.addClickEventListeners(onClick)}if(this.hover){this.addHoverEventListeners()}}buildCanvases(){this.canvas=this.buildCanvas("fretboard_canvas_"+this.id,this.WIDTH,this.HEIGHT);this.canvas_background=this.buildCanvas("fretboard_background_canvas_"+this.id,this.WIDTH,this.HEIGHT)}buildCanvas(id,width,height){var canvas=document.createElement("canvas");canvas.id=id;canvas.style.position="absolute";canvas.style.left="0px";canvas.style.right="0px";canvas.style.width=width+"px";canvas.style.height=height+"px";canvas.width=width;canvas.height=height;this.root_view.appendChild(canvas);return canvas}resize(newWidth){var newWidth=Math.min(newWidth,1e3);var newHeight=newWidth*(230/1e3);this.root_view.style.height=newHeight+"px";this.canvas_background.style.height=newHeight+"px";this.canvas.style.height=newHeight+"px";this.root_view.style.width=newWidth+"px";this.canvas_background.style.width=newWidth+"px";this.canvas.style.width=newWidth+"px"}draw_background(){let canvas=this.canvas_background;var ctx=canvas.getContext("2d");ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);var topMargin=Math.round(this.HEIGHT*.08);var bottomMargin=Math.round(this.HEIGHT*.15);var leftMargin=Math.round(this.WIDTH*.037);var rightMargin=Math.round(this.WIDTH*.01);var color="#000";ctx.beginPath();ctx.lineWidth=6;ctx.strokeStyle=color;ctx.rect(leftMargin,topMargin,this.WIDTH-(rightMargin+leftMargin),this.HEIGHT-(bottomMargin+topMargin));ctx.stroke();const number_of_frets=20;ctx.lineWidth=3;ctx.strokeStyle="#999";var i;var k=21;var prev_buffer=0;for(i=1;i<=number_of_frets;i++){ctx.beginPath();var buffer=Math.round(k+prev_buffer);if(i<12)k=k-3;var x=Math.round(i*((this.WIDTH-(rightMargin+leftMargin))/number_of_frets)+buffer);ctx.moveTo(x+leftMargin,topMargin);ctx.lineTo(x+leftMargin,this.HEIGHT-bottomMargin);ctx.stroke();prev_buffer=buffer}var note_x_positions=[this.radius+2,(this.WIDTH-(leftMargin+rightMargin))*.078,(this.WIDTH-(leftMargin+rightMargin))*.146,(this.WIDTH-(leftMargin+rightMargin))*.214,(this.WIDTH-(leftMargin+rightMargin))*.278,(this.WIDTH-(leftMargin+rightMargin))*.337,(this.WIDTH-(leftMargin+rightMargin))*.396,(this.WIDTH-(leftMargin+rightMargin))*.451,(this.WIDTH-(leftMargin+rightMargin))*.502,(this.WIDTH-(leftMargin+rightMargin))*.55,(this.WIDTH-(leftMargin+rightMargin))*.596,(this.WIDTH-(leftMargin+rightMargin))*.638,(this.WIDTH-(leftMargin+rightMargin))*.677,(this.WIDTH-(leftMargin+rightMargin))*.714,(this.WIDTH-(leftMargin+rightMargin))*.751,(this.WIDTH-(leftMargin+rightMargin))*.789,(this.WIDTH-(leftMargin+rightMargin))*.826,(this.WIDTH-(leftMargin+rightMargin))*.864,(this.WIDTH-(leftMargin+rightMargin))*.901,(this.WIDTH-(leftMargin+rightMargin))*.9385,(this.WIDTH-(leftMargin+rightMargin))*.976];var high_e_string_y_position=topMargin;var b_string_y_position=(this.HEIGHT-(topMargin+bottomMargin))*.2+topMargin;var g_string_y_position=(this.HEIGHT-(topMargin+bottomMargin))*.4+topMargin;var d_string_y_position=(this.HEIGHT-(topMargin+bottomMargin))*.6+topMargin;var a_string_y_position=(this.HEIGHT-(topMargin+bottomMargin))*.8+topMargin;var e_string_y_position=(this.HEIGHT-(topMargin+bottomMargin))*1+topMargin;var note_y_positions=[high_e_string_y_position,b_string_y_position,g_string_y_position,d_string_y_position,a_string_y_position,e_string_y_position];var diameter=this.HEIGHT*.02;var HEIGHT=this.HEIGHT;var WIDTH=this.WIDTH;var marker_color="#ccc";function draw_single_dot_fret_markers(ctx,fret){ctx.beginPath();ctx.fillStyle=marker_color;ctx.lineWidth=0;ctx.arc(note_x_positions[fret],(g_string_y_position+d_string_y_position)/2,diameter,0,TWO_PI);ctx.fill();ctx.beginPath();ctx.fillStyle=marker_color;ctx.lineWidth=0;ctx.arc(note_x_positions[fret],HEIGHT-bottomMargin*.25,diameter,0,TWO_PI);ctx.fill()}draw_single_dot_fret_markers(ctx,3);draw_single_dot_fret_markers(ctx,5);draw_single_dot_fret_markers(ctx,7);draw_single_dot_fret_markers(ctx,9);draw_single_dot_fret_markers(ctx,15);draw_single_dot_fret_markers(ctx,17);function draw_double_dot_fret_markers(fret){ctx.beginPath();ctx.fillStyle=marker_color;ctx.lineWidth=0;ctx.arc(note_x_positions[fret],(d_string_y_position+a_string_y_position)/2,diameter,0,TWO_PI);ctx.fill();ctx.beginPath();ctx.fillStyle=marker_color;ctx.lineWidth=0;ctx.arc(note_x_positions[fret],(g_string_y_position+b_string_y_position)/2,diameter,0,TWO_PI);ctx.fill();var seperation=WIDTH*.008;ctx.beginPath();ctx.fillStyle=marker_color;ctx.lineWidth=0;ctx.arc(note_x_positions[fret]-seperation,HEIGHT-bottomMargin*.25,diameter,0,TWO_PI);ctx.fill();ctx.beginPath();ctx.fillStyle=marker_color;ctx.lineWidth=0;ctx.arc(note_x_positions[fret]+seperation,HEIGHT-bottomMargin*.25,diameter,0,TWO_PI);ctx.fill()}draw_double_dot_fret_markers(12);const number_of_string=6;var j;ctx.strokeStyle="#555";ctx.lineWidth=1;for(j=0;j<number_of_string;j++){ctx.beginPath();ctx.lineWidth=j*1.2;var y=j*((this.HEIGHT-(bottomMargin+topMargin))/(number_of_string-1));ctx.moveTo(leftMargin,y+topMargin);ctx.lineTo(this.WIDTH,y+topMargin);ctx.stroke()}ctx.beginPath();ctx.lineWidth=6;ctx.strokeStyle="#000";ctx.rect(leftMargin,topMargin,3,this.HEIGHT-(bottomMargin+topMargin));ctx.stroke();var note_positions=[];var i;for(i=0;i<note_y_positions.length;i++){var j;for(j=0;j<note_x_positions.length;j++){note_positions.push([note_x_positions[j],note_y_positions[i]])}}this.note_positions=note_positions;this.noteValueToNotePositionsDict={40:[note_positions[105]],41:[note_positions[106]],42:[note_positions[107]],43:[note_positions[108]],44:[note_positions[109]],45:[note_positions[110],note_positions[84]],46:[note_positions[111],note_positions[85]],47:[note_positions[112],note_positions[86]],48:[note_positions[113],note_positions[87]],49:[note_positions[114],note_positions[88]],50:[note_positions[115],note_positions[89],note_positions[63]],51:[note_positions[116],note_positions[90],note_positions[64]],52:[note_positions[117],note_positions[91],note_positions[65]],53:[note_positions[118],note_positions[92],note_positions[66]],54:[note_positions[119],note_positions[93],note_positions[67]],55:[note_positions[120],note_positions[94],note_positions[68],note_positions[42]],56:[note_positions[121],note_positions[95],note_positions[69],note_positions[43]],57:[note_positions[122],note_positions[96],note_positions[70],note_positions[44]],58:[note_positions[123],note_positions[97],note_positions[71],note_positions[45]],59:[note_positions[124],note_positions[98],note_positions[72],note_positions[46],note_positions[21]],60:[note_positions[125],note_positions[99],note_positions[73],note_positions[47],note_positions[22]],61:[note_positions[100],note_positions[74],note_positions[48],note_positions[23]],62:[note_positions[101],note_positions[75],note_positions[49],note_positions[24]],63:[note_positions[102],note_positions[76],note_positions[50],note_positions[25]],64:[note_positions[103],note_positions[77],note_positions[51],note_positions[26],note_positions[0]],65:[note_positions[104],note_positions[78],note_positions[52],note_positions[27],note_positions[1]],66:[note_positions[79],note_positions[53],note_positions[28],note_positions[2]],67:[note_positions[80],note_positions[54],note_positions[29],note_positions[3]],68:[note_positions[81],note_positions[55],note_positions[30],note_positions[4]],69:[note_positions[82],note_positions[56],note_positions[31],note_positions[5]],70:[note_positions[83],note_positions[57],note_positions[32],note_positions[6]],71:[note_positions[58],note_positions[33],note_positions[7]],72:[note_positions[59],note_positions[34],note_positions[8]],73:[note_positions[60],note_positions[35],note_positions[9]],74:[note_positions[61],note_positions[36],note_positions[10]],75:[note_positions[62],note_positions[37],note_positions[11]],76:[note_positions[38],note_positions[12]],77:[note_positions[39],note_positions[13]],78:[note_positions[40],note_positions[14]],79:[note_positions[41],note_positions[15]],80:[note_positions[16]],81:[note_positions[17]],82:[note_positions[18]],83:[note_positions[19]],84:[note_positions[20]]}}getNotePositionsFromNoteType(note_type){let NOTE_TYPE=musicKit.Note.Name.TYPE;var note_positions=this.note_positions;switch(note_type){case NOTE_TYPE.C:return[note_positions[113],note_positions[87],note_positions[125],note_positions[99],note_positions[73],note_positions[47],note_positions[22],note_positions[59],note_positions[34],note_positions[8],note_positions[20]];case NOTE_TYPE.C_sharp:return[note_positions[114],note_positions[88],note_positions[100],note_positions[74],note_positions[48],note_positions[23],note_positions[60],note_positions[35],note_positions[9]];case NOTE_TYPE.D:return[note_positions[115],note_positions[89],note_positions[63],note_positions[101],note_positions[75],note_positions[49],note_positions[24],note_positions[61],note_positions[36],note_positions[10]];case NOTE_TYPE.D_sharp:return[note_positions[116],note_positions[90],note_positions[64],note_positions[102],note_positions[76],note_positions[50],note_positions[25],note_positions[62],note_positions[37],note_positions[11]];case NOTE_TYPE.E:return[note_positions[105],note_positions[117],note_positions[91],note_positions[65],note_positions[103],note_positions[77],note_positions[51],note_positions[26],note_positions[0],note_positions[38],note_positions[12]];case NOTE_TYPE.F:return[note_positions[106],note_positions[118],note_positions[92],note_positions[66],note_positions[104],note_positions[78],note_positions[52],note_positions[27],note_positions[1],note_positions[39],note_positions[13]];case NOTE_TYPE.F_sharp:return[note_positions[107],note_positions[119],note_positions[93],note_positions[67],note_positions[79],note_positions[53],note_positions[28],note_positions[2],note_positions[40],note_positions[14]];case NOTE_TYPE.G:return[note_positions[108],note_positions[120],note_positions[94],note_positions[68],note_positions[42],note_positions[80],note_positions[54],note_positions[29],note_positions[3],note_positions[41],note_positions[15]];case NOTE_TYPE.G_sharp:return[note_positions[109],note_positions[121],note_positions[95],note_positions[69],note_positions[43],note_positions[81],note_positions[55],note_positions[30],note_positions[4],note_positions[16]];case NOTE_TYPE.A:return[note_positions[110],note_positions[84],note_positions[122],note_positions[96],note_positions[70],note_positions[44],note_positions[82],note_positions[56],note_positions[31],note_positions[5],note_positions[17]];case NOTE_TYPE.A_sharp:return[note_positions[111],note_positions[85],note_positions[123],note_positions[97],note_positions[71],note_positions[45],note_positions[83],note_positions[57],note_positions[32],note_positions[6],note_positions[18]];case NOTE_TYPE.B:return[note_positions[112],note_positions[86],note_positions[124],note_positions[98],note_positions[72],note_positions[46],note_positions[21],note_positions[58],note_positions[33],note_positions[7],note_positions[19]]}}drawNote(note){let canvas=this.canvas;var ctx=canvas.getContext("2d");ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);this.drawNoteWithColor(note)}drawNoteWithColor(note,label){let canvas=this.canvas;var ctx=canvas.getContext("2d");var note_positions=this.noteValueToNotePositionsDict[note.midi_value];var i;for(i=0;i<note_positions.length;i++){ctx.beginPath();ctx.fillStyle=note.note_name.color;ctx.strokeStyle="#000";ctx.lineWidth=1;ctx.arc(note_positions[i][0],note_positions[i][1],this.radius,0,TWO_PI);ctx.fill();ctx.stroke();if(label!=undefined){ctx.fillStyle="black";ctx.font=this.radius+"px san-serif";ctx.textAlign="center";ctx.fillText(label,note_positions[i][0],note_positions[i][1]+this.radius*.3,this.radius*2)}}}drawInterval(interval){var play_type=interval.play_type;let higher_note=interval.getHigherNote(musicKit.all_notes);var first_note=play_type==musicKit.Interval.PLAY_TYPE.ASCENDING?interval.lower_note:higher_note;let canvas=this.canvas;var ctx=canvas.getContext("2d");ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);this.drawNoteWithColor(first_note);setTimeout(()=>{var second_note=play_type==musicKit.Interval.PLAY_TYPE.ASCENDING?higher_note:interval.lower_note;this.drawNoteWithColor(second_note)},interval.play_type==musicKit.Interval.PLAY_TYPE.HARMONIC?0:interval.delay_in_ms)}drawChord(chord){let canvas=this.canvas;var ctx=canvas.getContext("2d");ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);let note_array=chord.getNoteArray(musicKit.all_notes,model.range);var j;for(j=0;j<note_array.length;j++){var note=note_array[j];var label=chord.note_labels[j];this.drawNotePlaceholder(note,label);if(label=="R"){this.drawNoteWithColor(note,label)}else{this.drawNoteWithWhite(note,label)}}}drawNotePlaceholder(note,label){let canvas=this.canvas;var ctx=canvas.getContext("2d");var note_positions=this.getNotePositionsFromNoteType(note.note_name.type);var i;for(i=0;i<note_positions.length;i++){ctx.beginPath();ctx.fillStyle="#555";ctx.strokeStyle="#000";ctx.lineWidth=1;ctx.arc(note_positions[i][0],note_positions[i][1],this.radius,0,TWO_PI);ctx.fill();ctx.stroke();ctx.fillStyle="white";ctx.font=this.radius+"px san-serif";ctx.textAlign="center";ctx.fillText(label,note_positions[i][0],note_positions[i][1]+this.radius*.3,this.radius*2)}}drawNoteWithWhite(note,label){let canvas=this.canvas;var ctx=canvas.getContext("2d");var note_positions=this.noteValueToNotePositionsDict[note.midi_value];var i;for(i=0;i<note_positions.length;i++){ctx.beginPath();ctx.fillStyle="#fff";ctx.strokeStyle="#000";ctx.lineWidth=1;ctx.arc(note_positions[i][0],note_positions[i][1],this.radius,0,TWO_PI);ctx.fill();ctx.stroke();ctx.fillStyle="black";ctx.font=this.radius+"px san-serif";ctx.textAlign="center";ctx.fillText(label,note_positions[i][0],note_positions[i][1]+this.radius*.3,this.radius*2)}}addClickEventListeners(onClick){let view=this.root_view;view.style.cursor="pointer";let self=this;view.addEventListener("click",function(event){let position=self.getPosition(view);let x=(event.clientX-position.x)*(WIDTH/width);let y=(event.clientY-position.y)*(WIDTH/width)})}addHoverEventListeners(){}getPosition(element){const rect=element.getBoundingClientRect();return{x:rect.left,y:rect.top}}}module.exports=FretboardView},{"./line.js":4,"./point.js":5,"./polygon.js":6,"@jasonfleischer/music-model-kit":8}],4:[function(require,module,exports){class Line{constructor(pt1,pt2){this.pt1=pt1;this.pt2=pt2}draw(ctx,color="#000"){ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=10;ctx.moveTo(this.pt1.x,this.pt1.y);ctx.lineTo(this.pt2.x,this.pt2.y);ctx.stroke()}getIntersectionPtBetweenTwoLines(other_line){var l1=this;var l2=other_line;var a1=l1.pt2.y-l1.pt1.y;var b1=l1.pt1.x-l1.pt2.x;var c1=a1*l1.pt1.x+b1*l1.pt1.y;var a2=l2.pt2.y-l2.pt1.y;var b2=l2.pt1.x-l2.pt2.x;var c2=a2*l2.pt1.x+b2*l2.pt1.y;var delta=a1*b2-a2*b1;var pt=new Point((b2*c1-b1*c2)/delta,(a1*c2-a2*c1)/delta);return pt}}module.exports=Line},{}],5:[function(require,module,exports){class Point{constructor(x,y){this.x=x;this.y=y}draw(ctx,diameter,color="#000"){if(this.isValid){ctx.beginPath();ctx.fillStyle=color;ctx.lineWidth=0;ctx.arc(this.x,this.y,diameter,0,TWO_PI);ctx.fill()}}isValid(){return this.x>=0&&this.y>=0}}module.exports=Point},{}],6:[function(require,module,exports){class Polygon{constructor(array_of_pts){this.points=array_of_pts}draw(ctx,color="#eee"){var i;ctx.beginPath();if(color=="clear")ctx.globalCompositeOperation="destination-out";ctx.lineWidth=0;ctx.fillStyle=color;var first_pt=this.points[0];ctx.moveTo(first_pt.x,first_pt.y);for(i=1;i<this.points.length;i++){var pt=this.points[i];ctx.lineTo(pt.x,pt.y)}ctx.closePath();ctx.fill();if(color=="clear")ctx.globalCompositeOperation="source-over"}}module.exports=Polygon},{}],7:[function(require,module,exports){var LOG_NON_ERROR_MESSAGES=true;const log={};log.i=function(msg){if(LOG_NON_ERROR_MESSAGES)console.log(msg)};log.e=function(msg){console.log("%c ERROR: "+msg,"background: red; color: white; display: block;")};log.turnOffNonErrorLogs=function(){LOG_NON_ERROR_MESSAGES=false};module.exports=log},{}],8:[function(require,module,exports){const Note=require("./lib/note.js");const Chord=require("./lib/chord.js");const Scale=require("./lib/scale.js");const Interval=require("./lib/interval.js");const MidiListener=require("./lib/midi_listener.js");const midi_range={min:0,max:127};const piano_range={min:21,max:108};const guitar_range={min:40,max:84};var all_notes=[];function init(){function build_all_notes(){let ALL_NOTE_NAME_TYPES=Note.ALL_NOTE_NAME_TYPES;var midi_value=0;const octaves=9;var octave=0;for(octave=-1;octave<=octaves;octave++){var j;for(j=0;j<ALL_NOTE_NAME_TYPES.length;j++){var note_name=ALL_NOTE_NAME_TYPES[j].sharp_name;var note=new Note(ALL_NOTE_NAME_TYPES[j],midi_value,octave);all_notes.push(note);midi_value++;if(midi_value>midi_range.max)break}}}build_all_notes()}module.exports={init:init,Note:Note,Chord:Chord,Scale:Scale,Interval:Interval,MidiListener:MidiListener,all_notes:all_notes,piano_range:piano_range,guitar_range:guitar_range}},{"./lib/chord.js":9,"./lib/interval.js":10,"./lib/midi_listener.js":11,"./lib/note.js":12,"./lib/scale.js":13}],9:[function(require,module,exports){const log=require("@jasonfleischer/log");class Chord{static TYPE=Object.freeze({Major:"Major",minor:"minor",Aug:"augmented",Dim:"diminished",Major7:"Major 7",minor7:"minor 7",Dom7:"Dominant 7"});static INVERSION_TYPE=Object.freeze({Root:"Root",First:"first inversion",Second:"second inversion",Third:"third inversion"});static PLAY_TYPE=Object.freeze({HARMONIC:"Harmonic",ARPEGGIATE:"Arpeggiate"});constructor(root_note,chord_type=Chord.TYPE.Major,play_type=Chord.PLAY_TYPE.HARMONIC,inversion=Chord.INVERSION_TYPE.Root){this.root_note=root_note;this.delay_in_ms=500;this.name=root_note.note_name.type+" "+chord_type;this.inversion=inversion;this.type=chord_type;this.play_type=play_type;function replaceAll(str,find,replace){return str.replace(new RegExp(find,"g"),replace)}this.file_name=root_note.note_name.file_name.concat(["audio/chords/"+replaceAll(replaceAll(this.type.toLowerCase()," ","_"),"7","seventh")+".mp3"]);switch(chord_type){case Chord.TYPE.Major:if(this.inversion==Chord.INVERSION_TYPE.Root){this.note_sequence=[0,4,7]}else if(this.inversion==Chord.INVERSION_TYPE.First){this.note_sequence=[-8,-5,0]}else{this.note_sequence=[-5,0,4]}break;case Chord.TYPE.minor:if(this.inversion==Chord.INVERSION_TYPE.Root){this.note_sequence=[0,3,7]}else if(this.inversion==Chord.INVERSION_TYPE.First){this.note_sequence=[-9,-5,0]}else{this.note_sequence=[-5,0,3]}break;case Chord.TYPE.Aug:this.inversion=Chord.INVERSION_TYPE.Root;this.note_sequence=[0,4,8];break;case Chord.TYPE.Dim:this.inversion=Chord.INVERSION_TYPE.Root;this.note_sequence=[0,3,6];break;case Chord.TYPE.Major7:if(this.inversion==Chord.INVERSION_TYPE.Root){this.note_sequence=[0,4,7,11]}else if(this.inversion==Chord.INVERSION_TYPE.First){this.note_sequence=[-8,-5,-1,0]}else if(this.inversion==Chord.INVERSION_TYPE.Second){this.note_sequence=[-5,-1,0,4]}else{this.note_sequence=[-1,0,4,7]}this.file_name=root_note.note_name.file_name.concat(["audio/chords/major_seventh.mp3"]);break;case Chord.TYPE.minor7:if(this.inversion==Chord.INVERSION_TYPE.Root){this.note_sequence=[0,3,7,10]}else if(this.inversion==Chord.INVERSION_TYPE.First){this.note_sequence=[-9,-5,-2,0]}else if(this.inversion==Chord.INVERSION_TYPE.Second){this.note_sequence=[-5,-2,0,3]}else{this.note_sequence=[-2,0,3,7]}this.file_name=root_note.note_name.file_name.concat(["audio/chords/minor_seventh.mp3"]);break;case Chord.TYPE.Dom7:if(this.inversion==Chord.INVERSION_TYPE.Root){this.note_sequence=[0,4,7,10]}else if(this.inversion==Chord.INVERSION_TYPE.First){this.note_sequence=[-8,-5,-2,0]}else if(this.inversion==Chord.INVERSION_TYPE.Second){this.note_sequence=[-5,-2,0,4]}else{this.note_sequence=[-2,0,4,7]}break}this.note_labels=this.getLabels();this.structure=this.getStructure()}getLabels(){let result=[];let all_labels=["R","m2","M2","m3","M3","P4","TT","P5","m6","M6","m7","M7"];var i;for(i=0;i<=this.note_sequence.length;i++){var sequence=this.note_sequence[i];if(sequence<0){sequence=12+sequence}result.push(all_labels[sequence])}return result}getStructure(){let result=[];let all_labels=["Root","minor 2nd","Mahor 2nd","minor 3rd","Major 3rd","Fourth","Tritone","Fifth","minor 6th","Major 6th","minor 7th","Major 7th"];var i;for(i=0;i<=this.note_sequence.length;i++){var sequence=this.note_sequence[i];if(sequence<0){sequence=12+sequence}result.push(all_labels[sequence])}return result}toString(){return"CHORD: "+this.name+", "+this.structure+", ",this.note_sequence}isWithinRange(range){return this.root_note.midi_value+this.note_sequence[0]>=range.min&&this.root_note.midi_value+this.note_sequence[this.note_sequence.length-1]<=range.max}getNoteArray(all_notes,range){function isNoteWithinRange(midi_number,range){return midi_number>=range.min&&midi_number<=range.max}var note_array=[];var i;for(i=0;i<this.note_sequence.length;i++){let midi_number=this.root_note.midi_value+this.note_sequence[i];if(isNoteWithinRange(midi_number,range)){note_array.push(all_notes[midi_number])}}if(note_array.length==0){log.e("no notes found for chord")}return note_array}static ALL_TYPES=[Chord.TYPE.Major,Chord.TYPE.minor,Chord.TYPE.Aug,Chord.TYPE.Dim,Chord.TYPE.Major7,Chord.TYPE.minor7,Chord.TYPE.Dom7];static ALL_PLAY_TYPES=[Chord.PLAY_TYPE.HARMONIC,Chord.PLAY_TYPE.ARPEGGIATE];static generateRandom(all_notes,range,types=ALL_TYPES,play_types=ALL_PLAY_TYPES,three_note_inversion_types=[Chord.INVERSION_TYPE.Root,Chord.INVERSION_TYPE.First,Chord.INVERSION_TYPE.Second],four_note_inversion_types=[Chord.INVERSION_TYPE.Root,Chord.INVERSION_TYPE.First,Chord.INVERSION_TYPE.Second,Chord.INVERSION_TYPE.Third]){let min=range.min;let max=range.max;function randomInteger(min,max){return Math.floor(Math.random()*(max-min+1)+min)}function is_type_three_notes(type){return type==Chord.TYPE.Major||type==Chord.TYPE.minor||type==Chord.TYPE.Aug||type==Chord.TYPE.Dim}var random_note=all_notes[randomInteger(min,max)];var play_type=play_types[randomInteger(0,play_types.length-1)];var random_chord_type=types[randomInteger(0,types.length-1)];var inversion=Chord.INVERSION_TYPE.Root;if(is_type_three_notes(random_chord_type)){inversion=three_note_inversion_types[randomInteger(0,three_note_inversion_types.length-1)]}else{inversion=four_note_inversion_types[randomInteger(0,four_note_inversion_types.length-1)]}return new Chord(random_note,random_chord_type,play_type,inversion)}}module.exports=Chord},{"@jasonfleischer/log":7}],10:[function(require,module,exports){class Interval{static TYPE=Object.freeze({MINOR_SECOND:"minor 2nd",MAJOR_SECOND:"Major 2nd",MINOR_THIRD:"minor 3rd",MAJOR_THIRD:"Major 3rd",PERFECT_FOURTH:"Fourth",TRITONE:"Tritone",PERFECT_FIFTH:"Fifth",MINOR_SIXTH:"minor 6th",MAJOR_SIXTH:"Major 6th",MINOR_SEVENTH:"minor 7th",MAJOR_SEVENTH:"Major 7th",OCTAVE:"Octave"});static PLAY_TYPE=Object.freeze({ASCENDING:"Ascending",DESCENDING:"Descending",HARMONIC:"Harmonic"});constructor(type,note,play_type){this.type=type;this.lower_note=note;this.delay_in_ms=500;this.play_type=play_type;function replaceAll(str,find,replace){return str.replace(new RegExp(find,"g"),replace)}this.audio_file_name="audio/intervals/"+replaceAll(this.type," ","_")+".mp3";this.higher_note_midi_value=note.midi_value+this.getIntervalStep();if(this.higher_note_midi_value>128){log.e("todo: out of bounds error")}}toString(){return"INTERVAL: "+this.type+": "+this.getIntervalStep()}isWithinRange(min,max){return this.lower_note.midi_value>=min&&this.lower_note.midi_value<=max&&this.higher_note_midi_value>=min&&this.higher_note_midi_value<=max}getHigherNote(all_notes){return all_notes[this.higher_note_midi_value]}getIntervalStep=function(){switch(this.type){case Interval.TYPE.MINOR_SECOND:return 1;case Interval.TYPE.MAJOR_SECOND:return 2;case Interval.TYPE.MINOR_THIRD:return 3;case Interval.TYPE.MAJOR_THIRD:return 4;case Interval.TYPE.PERFECT_FOURTH:return 5;case Interval.TYPE.TRITONE:return 6;case Interval.TYPE.PERFECT_FIFTH:return 7;case Interval.TYPE.MINOR_SIXTH:return 8;case Interval.TYPE.MAJOR_SIXTH:return 9;case Interval.TYPE.MINOR_SEVENTH:return 10;case Interval.TYPE.MAJOR_SEVENTH:return 11;case Interval.TYPE.OCTAVE:return 12}};static ALL_TYPES=[Interval.TYPE.MINOR_SECOND,Interval.TYPE.MAJOR_SECOND,Interval.TYPE.MINOR_THIRD,Interval.TYPE.MAJOR_THIRD,Interval.TYPE.PERFECT_FOURTH,Interval.TYPE.TRITONE,Interval.TYPE.PERFECT_FIFTH,Interval.TYPE.MINOR_SIXTH,Interval.TYPE.MAJOR_SIXTH,Interval.TYPE.MINOR_SEVENTH,Interval.TYPE.MAJOR_SEVENTH,Interval.TYPE.OCTAVE];static ALL_PLAY_TYPES=[Interval.PLAY_TYPE.ASCENDING,Interval.PLAY_TYPE.DESCENDING,Interval.PLAY_TYPE.HARMONIC];static generateRandom(all_notes,range,types=ALL_TYPES,play_types=ALL_PLAY_TYPES){let min=range.min;let max=range.max;function randomInteger(min,max){return Math.floor(Math.random()*(max-min+1)+min)}var rand=randomInteger(0,types.length-1);var type=types[rand];var note=all_notes[randomInteger(min,max)];var rand=randomInteger(0,play_types.length-1);var play_type=play_types[rand];var interval=new Interval(type,note,play_type);while(!interval.isWithinRange(min,max)){note=all_notes[randomInteger(min,max)];interval=new Interval(type,note,play_type)}return interval}}module.exports=Interval},{}],11:[function(require,module,exports){const log=require("@jasonfleischer/log");class MidiListener{constructor(noteOn,noteOff){this.noteOn=noteOn;this.noteOff=noteOff;let self=this;if(!navigator.requestMIDIAccess){log.e("this browser does not support midi");return}navigator.permissions.query({name:"midi",sysex:true}).then(function(result){if(result.state=="granted"){log.i("Midi permissions granted")}else if(result.state=="prompt"){log.i("Midi permissions prompt")}else{log.i("Midi permissions denied")}});navigator.requestMIDIAccess({sysex:true}).then(function(access){if(access.inputs.size>0){self.connectToFirstDevice(Array.from(access.inputs.values()))}else{log.i("no midi devices found")}access.onstatechange=function(e){log.i("Midi state changed, number of devices: "+access.inputs.size);if(access.inputs.size>0){self.connectToFirstDevice(Array.from(access.inputs.values()))}}},function(){log.e("Midi request access failure")})}connectToFirstDevice(devices){if(devices.length>0){this.connectToDevice(devices[0])}else{log.e("connectToFirstDevice: no midi inputs")}}connectToDevice(device){if(this.connectedDevice!==undefined&&device.id==this.connectedDevice.id){log.i("Device already connected");return}log.i("Connecting to device: "+this.deviceToString(device));this.connectedDevice=device;let noteOn=this.noteOn;let noteOff=this.noteOff;let NOTE_ON=9;let NOTE_OFF=8;device.onmidimessage=function(m){const[command,message,velocity]=m.data;let midi_value=message;let channel=command&15;let opCode=(command&240)>>4;if(opCode===NOTE_ON){noteOn(midi_value,channel,velocity)}else if(opCode===NOTE_OFF){noteOff(midi_value,channel,velocity)}}}deviceToString(device){return device.name+" "+device.manufacturer}}module.exports=MidiListener},{"@jasonfleischer/log":7}],12:[function(require,module,exports){const log=require("@jasonfleischer/log");class Note{constructor(note_name,midi_value,octave){this.note_name=note_name;this.midi_value=midi_value;this.octave=octave;this.frequency=this.getEqualTemperedFrequency();if(!this.isWithinRange({min:0,max:127})){log.e("can only create notes with midi values between 0 and 127")}}toString(){return"NOTE: "+this.note_name.type+" "+this.midi_value+" "+this.octave}getEqualTemperedFrequency(){return 440*Math.pow(2,(this.midi_value-69)/12)}isWithinRange(range){return this.midi_value>=range.min&&this.midi_value<=range.max}static getRandom(all_notes,range){function randomInteger(min,max){return Math.floor(Math.random()*(max-min+1)+min)}return all_notes[randomInteger(range.min,range.max)]}}Note.Name=class{static TYPE=Object.freeze({C:"C",C_sharp:"C# / Db",D:"D",D_sharp:"D# / Eb",E:"E",F:"F",F_sharp:"F# / Gb",G:"G",G_sharp:"G# / Ab",A:"A",A_sharp:"A# / Bb",B:"B"});constructor(type){function get_associated_midi_values(row){var base_array=[0,12,24,36,48,60,72,84,96,108,120];var result=[];var i;for(i=0;i<base_array.length;i++){var value=base_array[i]+row;if(value>127)break;result.push(value)}return result}this.type=type;switch(type){case Note.Name.TYPE.C:this.is_sharp_or_flat=false;this.sharp_name=this.type;this.flat_name=this.type;this.file_name=["audio/notes/C.mp3"];this.color="#ff0000";this.associated_midi_values=get_associated_midi_values(0);break;case Note.Name.TYPE.C_sharp:this.is_sharp_or_flat=true;this.sharp_name="C#";this.flat_name="Db";this.file_name=["audio/notes/C_sharp.mp3","audio/notes/or.mp3","audio/notes/D_flat.mp3"];this.color="#ff8000";this.associated_midi_values=get_associated_midi_values(1);break;case Note.Name.TYPE.D:this.is_sharp_or_flat=false;this.sharp_name=this.type;this.flat_name=this.type;this.file_name=["audio/notes/D.mp3"];this.color="#ffff00";this.associated_midi_values=get_associated_midi_values(2);break;case Note.Name.TYPE.D_sharp:this.is_sharp_or_flat=true;this.sharp_name="D#";this.flat_name="Eb";this.file_name=["audio/notes/D_sharp.mp3","audio/notes/or.mp3","audio/notes/E_flat.mp3"];this.color="#7fff00";this.associated_midi_values=get_associated_midi_values(3);break;case Note.Name.TYPE.E:this.is_sharp_or_flat=false;this.sharp_name=this.type;this.flat_name=this.type;this.file_name=["audio/notes/E.mp3"];this.color="#00ff00";this.associated_midi_values=get_associated_midi_values(4);break;case Note.Name.TYPE.F:this.is_sharp_or_flat=false;this.sharp_name=this.type;this.flat_name=this.type;this.file_name=["audio/notes/F.mp3"];this.color="#00ff80";this.associated_midi_values=get_associated_midi_values(5);break;case Note.Name.TYPE.F_sharp:this.is_sharp_or_flat=true;this.sharp_name="F#";this.flat_name="Gb";this.file_name=["audio/notes/F_sharp.mp3","audio/notes/or.mp3","audio/notes/G_flat.mp3"];this.color="#00ffff";this.associated_midi_values=get_associated_midi_values(6);break;case Note.Name.TYPE.G:this.is_sharp_or_flat=false;this.sharp_name=this.type;this.flat_name=this.type;this.file_name=["audio/notes/G.mp3"];this.color="#007fff";this.associated_midi_values=get_associated_midi_values(7);break;case Note.Name.TYPE.G_sharp:this.is_sharp_or_flat=true;this.sharp_name="G#";this.flat_name="Ab";this.file_name=["audio/notes/G_sharp.mp3","audio/notes/or.mp3","audio/notes/A_flat.mp3"];this.color="#0000ff";this.associated_midi_values=get_associated_midi_values(8);break;case Note.Name.TYPE.A:this.is_sharp_or_flat=false;this.sharp_name=this.type;this.flat_name=this.type;this.file_name=["audio/notes/A.mp3"];this.color="#8000ff";this.associated_midi_values=get_associated_midi_values(9);break;case Note.Name.TYPE.A_sharp:this.is_sharp_or_flat=true;this.sharp_name="A#";this.flat_name="Bb";this.file_name=["audio/notes/A_sharp.mp3","audio/notes/or.mp3","audio/notes/B_flat.mp3"];this.color="#ff00ff";this.associated_midi_values=get_associated_midi_values(10);break;case Note.Name.TYPE.B:this.is_sharp_or_flat=false;this.sharp_name=this.type;this.flat_name=this.type;this.file_name=["audio/notes/B.mp3"];this.color="#ff007f";this.associated_midi_values=get_associated_midi_values(11);break}}};Note.ALL_NOTE_NAME_TYPES=[new Note.Name(Note.Name.TYPE.C),new Note.Name(Note.Name.TYPE.C_sharp),new Note.Name(Note.Name.TYPE.D),new Note.Name(Note.Name.TYPE.D_sharp),new Note.Name(Note.Name.TYPE.E),new Note.Name(Note.Name.TYPE.F),new Note.Name(Note.Name.TYPE.F_sharp),new Note.Name(Note.Name.TYPE.G),new Note.Name(Note.Name.TYPE.G_sharp),new Note.Name(Note.Name.TYPE.A),new Note.Name(Note.Name.TYPE.A_sharp),new Note.Name(Note.Name.TYPE.B)];module.exports=Note},{"@jasonfleischer/log":7}],13:[function(require,module,exports){const log=require("@jasonfleischer/log");class Scale{static TYPE=Object.freeze({minor_Pentatonic:"minor pentatonic",Major_Pentatonic:"Major pentatonic",Ionian:"Ionian",Dorian:"Dorian",Phrygian:"Phrygian",Lydian:"Lydian",Mixolydian:"Mixolydian",Aeolian:"Aeolian",Locrian:"Locrian",minor_Triad:"minor triad",Major_Triad:"Major triad"});constructor(root_note,scale_type=Scale.TYPE.Major){this.root_note=root_note;this.type=scale_type;function replaceAll(str,find,replace){return str.replace(new RegExp(find,"g"),replace)}this.file_name=root_note.note_name.file_name.concat(["audio/scale/"+replaceAll(this.type.toLowerCase()," ","_")+".mp3"]);this.alternate_names="none";switch(scale_type){case Scale.TYPE.Ionian:this.note_sequence=[0,2,4,5,7,9,11];this.alternate_names="Major";break;case Scale.TYPE.Dorian:this.note_sequence=[0,2,3,5,7,9,10];break;case Scale.TYPE.Phrygian:this.note_sequence=[0,1,3,5,7,8,10];break;case Scale.TYPE.Lydian:this.note_sequence=[0,2,4,6,7,9,11];break;case Scale.TYPE.Mixolydian:this.note_sequence=[0,2,4,5,7,9,10];break;case Scale.TYPE.Aeolian:this.note_sequence=[0,2,3,5,7,8,10];this.alternate_names="minor";break;case Scale.TYPE.Locrian:this.note_sequence=[0,1,3,5,6,8,10];break;case Scale.TYPE.minor_Pentatonic:this.note_sequence=[0,3,5,7,10];break;case Scale.TYPE.Major_Pentatonic:this.note_sequence=[0,2,4,7,9];break;case Scale.TYPE.minor_Triad:this.note_sequence=[0,3,7];break;case Scale.TYPE.Major_Triad:this.note_sequence=[0,4,7];break}this.note_labels=this.getLabels();this.structure=this.getStructure()}getNoteArray(all_notes,range){var note_names=this.getUniqueNoteName(all_notes,range);var note_array=[];var i;for(i=range.min;i<=range.max;i++){var note=all_notes[i];if(note_names.has(note.note_name.type)){note_array.push(note)}}if(note_array.length==0){log.e("no notes found for scale")}return note_array}getUniqueNoteName(all_notes,range){function isNoteWithinRange(midi_number,range){return midi_number>=range.min&&midi_number<=range.max}const noteNames=new Set;var i;for(i=0;i<this.note_sequence.length;i++){let midi_number=this.root_note.midi_value+this.note_sequence[i];if(isNoteWithinRange(midi_number,range)){noteNames.add(all_notes[midi_number].note_name.type)}}for(i=this.note_sequence.length-1;i>=0;i--){let midi_number=this.root_note.midi_value-(12-this.note_sequence[i]);if(isNoteWithinRange(midi_number,range)){noteNames.add(all_notes[midi_number].note_name.type)}}return noteNames}getLabels(){let result=[];let all_labels=["R","m2","M2","m3","M3","P4","TT","P5","m6","M6","m7","M7"];var i;for(i=0;i<=this.note_sequence.length;i++){result.push(all_labels[this.note_sequence[i]])}return result}getStructure(){let result=[];let all_labels=["Root","minor 2nd","Mahor 2nd","minor 3rd","Major 3rd","Fourth","Tritone","Fifth","minor 6th","Major 6th","minor 7th","Major 7th"];var i;for(i=0;i<=this.note_sequence.length;i++){result.push(all_labels[this.note_sequence[i]])}return result}toString(){return"SCALE: "+this.root_note.note_name.type+": "+this.structure}}module.exports=Scale},{"@jasonfleischer/log":7}]},{},[1]);