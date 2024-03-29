﻿// Игра "Змейка". Автор Слугин М. В. 2024 Файл - zmey2.js
// ---------------------------------------------------------------------------------- 
// random([<minimal value>],[<maximal value>],[<previous value to escape repeating>])
// setApple()
// hereApple(position) - определение есть яблоко или нет в ячейке с коорд. xPos,yPos
// paintHead(position)
// dead(position of death) - game termination proc
// lives(<lives remain count>)	-  shows a picture of explosion, lives counter and lightbox blinker
// snakeGo_Go()		- MAIN Procedure snake movement / no arguments /
// keyboard interface	- keyboard keys EventListener
const random = (min=0, max=0, last=0.5) => {let aux1;
				    if (isNaN(min)) {min=0;}if (isNaN(max)) {max=0;} if (isNaN(last)) {last=0.5;}	   
				    if (min==max) return min; else {if (min>max) {aux1=min;min=max;max=aux1;}}
			      	    aux1=max-min+1;  const rnd =()=> min+Math.floor(Math.random()*aux1);
			      	    let first=rnd ();while (last===first){first=rnd ();}           return first;}
let clrs=['burlywood','cadetblue','chartreuse','darkgreen','yellowgreen','chocolate','coral','cornflowerblue','darkkhaki',
'darkmagenta','darkolivegreen','darkviolet','deeppink','crimson','cyan','darkorange','darkorchid','darkred','darkturquoise',
'blue','blueviolet','brown','darkblue','darkcyan','darkgoldenrod','darkseagreen','darkslateblue','mediumaquamarine','firebrick',
'forestgreen','hotpink','indianred','violet','magenta','maroon','fuchsia','gold',
'lawngreen','lightseagreen','green','greenyellow','tomato','springgreen',
'mediumspringgreen','mediumturquoise','mediumvioletred','orange','orangered','orchid','purple','rebeccapurple',
'dodgerblue','midnightblue','mistyrose','royalblue','teal',
'moccasin','navajowhite','navy','palevioletred','saddlebrown','sandybrown','mediumslateblue','olive','olivedrab',
'peru','plum','seagreen','sienna','mediumseagreen','mediumpurple','slateblue','limegreen','lime',
'red'];//0-75
let colorsArrayLength=clrs.length-1;
let xPos=random(1,20); let yPos=random(1,20); 	//snake head initial position
let position0=0;
let direction;										
if (xPos<10) {direction='Right';} else 	{direction='Left';}
let livesCount=5; 				//lives counter	setup to max value		
let apples=1;	let appleImageSrc= 'url("img/apple.gif")';
let keyRepeat=false;	//false	- no keyboard keypressed repeat		
let zmeyLength=0;	let zmey=[];   	let intervalID567;	//zmey speed timer		
					let rainbowTimeout;	//after apple rainbow mode timer									
const gameOver=document.querySelector('.finish'); 		//gameOver message block pointer
//цвет головы
let headColor='red'; 				  
//bodycolor control : constant or random cell color
let a1; 
let bodyColor='blue'; 			let rainbowMode=false;   let colorChanging=true;
if (!(rainbowMode)) {if (colorChanging) {setInterval(function(){a1=random(0,colorsArrayLength,a1);bodyColor=clrs[a1];},5000);}}	

// --------------------------- игровое поле 20 x 20 ячеек ---------------------------
let cubBorderBottom=' cubBorderBottom'; 	let cubBorderRight='';		let j=0; 
const centrDiv=document.querySelector('.playground'); 		
for (let i=0;i<400;i++){
	    		if (j===0) {cubBorderRight=' cubBorderRight';}
  	  j++;  					if (j===20){j=0;cubBorderRight='';}
	    		if (i>379) {cubBorderBottom='';}  
centrDiv.insertAdjacentHTML('beforeend','<div class="cub'+cubBorderBottom+cubBorderRight+'"><div class="cir"></div></div>');}

const circs=document.querySelectorAll('.cir');	// кружочки
const squares=document.querySelectorAll('.cub');// кубики
const scor=document.querySelector('.score'); 	// счёт	
const live=document.querySelector('.lives'); 	// жизни		
const bum=document.querySelector('.boom');				
// делает из координат X и Y номер ячейки массива кружочков / кубиков
function checkPos(xPos,yPos){R=0; let pos=R;	
			     if ((xPos<1) || (xPos>20)) {return R;}	if ((yPos<1) || (yPos>20)) {return R;}
	       xPos--;yPos--;	pos=xPos+yPos*20;	 return pos;}
//apple setting up
function setApple(position=0){ let freeCell=[]; let freeCellcount=0;	let freeFlag;   
			       let zL=zmeyLength+1;	//zmey.unshift(position0); and let zmeyLength=0;
			       circs.forEach((c,number)=>{freeFlag=true; 
							  for (let i=0;i<zL;i++){
								if (number===zmey[i]) {freeFlag=false; break;}} 
			   if (freeFlag) {freeCell.push(number);freeCellcount++;}})
		freeCellcount--;
				position=freeCell[random(0,freeCellcount,position)];
		/* ---- alternative free cells defining method (Monte-Karlo)----
		  let flagApple=true;		
		  while (flagApple){flagApple=false;	    position=random(0,399,position);     
		  zmey.forEach((i)=>{if (i===position){flagApple=true;}});}*/
				squares[position].style.background='';
				squares[position].style.backgroundImage=appleImageSrc;
}
//here was apple + включение rainbowMode на 7 секунд
function hereApple(position){	
				let appleImg=squares[position].style.backgroundImage;						
		 if (appleImg===appleImageSrc) {
						squares[position].style.backgroundImage=""; 	//removing apple from the last position						
						scor.innerHTML=`СЧЁТ: ${apples}`; apples++;
						setApple(position);				//setting up an apple	
					rainbowMode=true; clearTimeout(rainbowTimeout);
					rainbowTimeout=setTimeout(function(){rainbowMode=false;},7000);	
						    return true;}
		 else return false;
}
function makeGradient(endColor){
return `radial-gradient(circle at center, white, ${endColor} 60%, ${endColor} 69%, darkturquoise 69%)`;}

function paintHead(position){  	circs[position].style.background=makeGradient(headColor);
			  	circs[position].innerHTML=`<img src="img/face.GIF" class="face">`;	
}
//окончание игры  z - position number where cuicide committed
function dead(z){let flagBoomBlink=true;	let flagGameOverSlowFlash=true;
		 rainbowMode=false; 		bodyColor='black';
clearInterval(intervalID567);
		 squares.forEach((item1,count)=>{if (count!=z) {item1.style.opacity='0.5';}});
                 circs.forEach((item1,count)=>  {item1.style.opacity='0.5';});
gameOver.style.opacity='1';
	setInterval(function (){gameOver.style.color=clrs[random(0,colorsArrayLength)];
				if (flagGameOverSlowFlash){gameOver.style.opacity='0.3';} 
						     else {gameOver.style.opacity='1';}
				flagGameOverSlowFlash=!flagGameOverSlowFlash;},1100);
//голову разрывает взрывом (от досады) при укусе собственного хвоста 						
	  if (z){live.innerHTML=`Укус за хвост`;
		 circs[z].style.background='';	squares[z].style.opacity='1';
		 setInterval(function (){flagBoomBlink=!flagBoomBlink; 
			if (flagBoomBlink) {squares[z].style.background='';} 
			else {squares[z].style.backgroundImage="url('img/boom.gif')";}},500);}
//голова синеет после смерти, если смерть наступила в результате удара об стену, а не суицида
	  else {headColor='blue';}
}						
//boom + счётчик жизней + мигалка
function lives(){
//---------------------------------- boom ----------------------------------
//взрыв при столкновении со стенкой, углы не обрабатываются		
		let vert; let horz; 	let lastHeadColor=headColor;
		switch (xPos) {	case 1:horz=-2.5;	vert=yPos*5.05-5.5; 	break;	//левая стенка
	    			case 20:horz=97.5;	vert=yPos*5.05-5.5; 	break;	//правая стенка
	    			default:horz=xPos*5-5; 
		    	switch (yPos) {	case 1: vert=-2;	break;	//потолок
					case 20:vert=97;}		//пол
	   		      }
	   bum.style.top=`${vert}%`; 
	   bum.style.left=`${horz}%`; bum.style.display='block'; 
//голова слегка синеет на некоторое время после удара об стену
	 headColor='#48D1CC';	setTimeout(function(){headColor=lastHeadColor;},500);
//---------------------------------- lives ----------------------------------
		livesCount--;	live.innerHTML=`Жизни: ${livesCount}`;			
		/*lightbox blinker*/ 
		live.style.fontWeight="600";	live.style.background="black";	live.style.color="red";
		setTimeout(function(){		live.style.background="red";	live.style.color="white";
			  setTimeout(function(){live.style.fontWeight="";	live.style.background="";
						live.style.color="";
						},100);
				     },100);	      	
		if (livesCount<1) {dead(0);} 
//удаление рисунка взрыва, если игра не окончена
	else {setTimeout(function(){bum.style.display='';},300);
}						 
}
//--------------------------------------------   MAIN   --------------------------------------------
function snakeGo_Go(){let explosion;	//for boom and lives count control	
		      let noTailBit;	//inverted collision state	
intervalID567=setInterval(function(){		   		       		
//previous cell smile removing 	
		circs[checkPos(xPos,yPos)].innerHTML='';
explosion=0;		
switch (direction) {case 'Up':   yPos--;	if (yPos<1)  {yPos=1; explosion=1; } break;
		    case 'Down': yPos++;	if (yPos>20) {yPos=20;explosion=1; } break;
		    case 'Right':xPos++;	if (xPos>20) {xPos=20;explosion=2; } break;
		    case 'Left': xPos--;	if (xPos<1)  {xPos=1; explosion=2; } 
		    }				    		  
//boom and lives count control implementation
if (explosion) {lives();
		//разрешение направления при столкновении со стенкой, при движении вдоль стенки направление не менять
		switch (explosion) {case 1:if (xPos>10) {direction='Left';} else {direction='Right';} break;
			    	    case 2:if (yPos>10) {direction='Up';  } else {direction='Down'; }}	}
else {	
//если длина > яблок - удалять последний шарик
      	if (zmeyLength<apples) {zmeyLength++;} else {circs[zmey[zmeyLength]].style.background='';zmey.pop();}
//new head position
	zmey.unshift(checkPos(xPos,yPos));
}	
//eating apple if it is and setup new one
	hereApple(zmey[0]);	

//tail bit detection and body colorizing
  noTailBit=true;
  for (let i=1;i<apples;i++){if (zmey[0]===zmey[i]) {noTailBit=false;}
			     if (rainbowMode) {a1=random(0,colorsArrayLength,a1);bodyColor=clrs[a1];}
			     circs[zmey[i]].style.background=makeGradient(bodyColor);}
//if no tail bit - paint head in current position, else dead in current position
  if (noTailBit) {paintHead(zmey[0]);} else {dead(zmey[0]);}			 			
//zmey speed timer
},300);		}	
				
//keyboard interface			    
document.addEventListener('keydown', function(event) {
if (!(event.repeat)||(keyRepeat)) {								
switch (event.code){case 'ArrowUp':   if ((direction!='Down')&&(yPos>1))  {direction='Up';} 	break;
		    case 'ArrowDown': if ((direction!='Up') && (yPos<20)) {direction='Down';} 	break;
		    case 'ArrowRight':if ((direction!='Left')&&(xPos<20)) {direction='Right';} 	break;
		    case 'ArrowLeft': if ((direction!='Right')&&(xPos>1)) {direction='Left';} 

		    }
}					});		
//initial snake and apple position
position0=checkPos(xPos,yPos);
paintHead(position0); 	zmey.unshift(position0);	setApple(position0);
//initial score and lives displays setup	
scor.innerHTML=`СЧЁТ: 0`;	live.innerHTML=`Жизни: ${livesCount}`;
//пуск
snakeGo_Go(); 
























