nbmine = 0;
nbcase = 0;
minesweeper = [];
nbligne = 1;
win = false;
actualnbmine =0;
realnbmine = 0;
modedrapeau = false;
debug = false;
click = 0;
function idBlock(boutonid){
	var target = document.getElementById(boutonid);
	target.setAttribute("disabled", "true");
}
function idDeblock(boutonid){
	var target = document.getElementById(boutonid);
	target.removeAttribute("disabled");
}
function createGrille(numbercase){
	var nombre=0;
	var count = 1;
	var x = 0;
	var y = 0;
	for (var i = 0; i <numbercase; i++) {
		var ligne = document.createElement("section");
		if(i % 10 == 0 ){
			ligne.id = "L"+count;
			document.getElementById("grille").appendChild(ligne);
			count++;
		}
	}
	while(nombre <= numbercase){
		var caze = document.createElement("bouton");
		caze.className = "caze"
		if(nombre != 0 && nombre % 10 == 0){
			nbligne++;
		}
		if(x > 9){
			x=0;
		}
		y=nbligne-1;
		caze.id = x+","+y;
		caze.addEventListener('click', function(id){ 
			play(this.id);});
		if(document.getElementById("L"+nbligne)){
			document.getElementById("L"+nbligne).appendChild(caze);
			document.getElementById(caze.id).innerHTML= " ";
		}
		nombre++;
		x++;
	}
	createMine();
	loadinfo();
}
function reset(){
	minesweeper=[];
	idDeblock("start")
	var papa = document.getElementById("grille");
	while (papa.firstChild) {
    papa.removeChild(papa.firstChild);
	}
	location.reload();
}
function start(){
	idDeblock("recommencer");
	idDeblock("modedrapeau");
	idBlock("start");
	time_avant= Date.now();
	timer=setInterval(function() {time_sec=Math.floor(((Date.now()-time_avant)%60000)/1000);time_sec=(time_sec+"").padStart(2, '0');time_min=Math.floor(((Date.now()-time_avant)%3600000)/60000);time_min=(time_min+"").padStart(2, '0');document.getElementById("sec").innerHTML=time_sec;document.getElementById("min").innerHTML=time_min;}, 50);
	var target =document.getElementById("menuselect");
	switch(target.value){
		case 0+"" : minesweeper = [[],[],[],[],[]];
				nbcase = 50;
				nbmine = 20
				break;
		case 1+"" : minesweeper = [[],[],[],[],[],[],[]];
				nbcase = 70;
				nbmine = 33
				break;
		case 2+"" : minesweeper = [[],[],[],[],[],[],[],[],[]];
				nbcase = 90;
				nbmine = 45
				break;
	}
	createGrille(nbcase);
}
function modeDrapeau(){
	var drapeau = document.getElementById("isdrapeau");
	var infodrapeau = document.getElementById("infodrapeau");
	if(!modedrapeau){
		modedrapeau = true;
		drapeau.innerHTML = "Drapeau : ON";
		drapeau.className = "drapeauon"
		infodrapeau.innerHTML = "Attention ! si tu met un drapeau sur une case<br> qui n'est pas une bombe, tu a perdu.</p>";

	}else{
		modedrapeau = false;
		drapeau.innerHTML = "Drapeau : OFF";
		drapeau.className = "drapeauoff"
		infodrapeau.innerHTML = "";

	}
}
function createMine(){
	for (var x = 0; x < 10; x++) {
		for (var y = 0; y < nbligne-1; y++) {
			var random = Math.floor(Math.random() * 101);
			if (random <= nbmine) {
				minesweeper[y][x] = 'M';
				actualnbmine++
			}
		}
	}
	realnbmine = actualnbmine;
}
function play(id){
	var count=0;
	var idsplit = id.split(',');
	var y = idsplit[1];
	var x = idsplit[0];
	if(!win){
		if(modedrapeau){
			if(minesweeper[y][x] == "M"){
				dessinerDrapeau(id);
				actualnbmine--;
				}else{
					win = true;
					dessinerMine();
					document.getElementById("info").innerHTML = "BOOM !!";
				}
			}
		else{
			if(minesweeper[y][x] == "M"){
				dessinerMine();
				document.getElementById("info").innerHTML = "BOOM !!";
				document.getElementById("info").className = "infofin";
				win = true;
			}else if(minesweeper[y][x] == undefined){
				dessinerEmpty(id);
			}
			if(minesweeper[y][x] == undefined){
				click++;
			}
			// ligne
			if (x-1 >=0) {
				if (minesweeper[y][x-1] == 'M') {
					count++;
				}
			}
			if (parseInt(x)+1<=10) {
				if (minesweeper[y][parseInt(x)+1] == 'M') {
					count++;
				}
			}
			// colone
			if (y-1 >=0) {
				if (minesweeper[y-1][x] == 'M') {
					count++;
				}
			}
			if (parseInt(y)+1<nbligne-1) {
				if (minesweeper[parseInt(y)+1][x] == 'M') {
					count++;
				}
			}
			// diagonal montante
			if (y-1 >=0 && parseInt(x)+1<=10 ) {
				if (minesweeper[y-1][parseInt(x)+1] == 'M') {
					count++;
				}
			}
			if (parseInt(y)+1 <nbligne-1 && x-1 >=0) {
				if (minesweeper[parseInt(y)+1][x-1] == 'M') {
					count++;
				}
			}
			// diagonal decendante
			if (y-1 >=0 && x-1>=0 ) {
				if (minesweeper[y-1][x-1] == 'M') {
					count++;
				}
			}
			if (parseInt(y)+1 <nbligne-1 && parseInt(x)+1 <=10) {
				if (minesweeper[parseInt(y)+1][parseInt(x)+1] == 'M') {
					count++;
				}
			}
			// conteur
			if(minesweeper[y][x] != "M"){
				if (count != 0) {
					minesweeper[y][x] = count;
				}else{
					minesweeper[y][x] = "E";
				}
				if (minesweeper[y][x] == count) {
					dessinerNbMine(id,count);
				}
			}
		}if(!win){
			loadinfo();
		}
	}
}
function loadinfo(){
	var info = document.getElementById("info");
	if(click != nbcase - realnbmine){
		if(actualnbmine >1){
			info.innerHTML = "il reste "+actualnbmine+" mines.";
		}else if (actualnbmine > 0){
			info.innerHTML = "il reste "+actualnbmine+" mine.";
		}else{
		}
	}else{
		info.innerHTML = "WIN !!";
		info.className = "infofin";
		win = true;
	}
}
function dessinerEmpty(id){
	var emptycaze = document.getElementById(id);
	emptycaze.className = "cazeE";
}
function dessinerNbMine(id,count){
	var countcaze = document.getElementById(id);
	countcaze.className = "cazeC";
	countcaze.innerHTML= count;
}
function dessinerDrapeau(id){
	var drapeaucaze = document.getElementById(id);

	drapeaucaze.className = "cazeD";

}
function dessinerDefault(id){
	var defaultcaze = document.getElementById(id);
	defaultcaze.className = "caze";
}
function dessinerMine(){
	for (var x = 0; x < 10; x++) {
		for (var y = 0; y < nbligne-1; y++) {
			if(minesweeper[y][x] == "M"){
				var mine = document.getElementById(+x+","+y);
				mine.className = "cazeM";
			}
		}
	}
}
function modeDebug(){
	if(!debug){
		debug = true;
		dessinerMine();
	}else{
		debug = false
		for (var x = 0; x < 10; x++) {
			for (var y = 0; y < nbligne-1; y++) {
				if(minesweeper[y][x] == "M"){
					var mine = document.getElementById(+x+","+y);
					mine.className = "caze";
				}
			}
		}
	}
}