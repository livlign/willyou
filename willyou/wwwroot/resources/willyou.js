function docReady(fn) {
	// see if DOM is already available
	if (document.readyState === "complete" || document.readyState === "interactive") {
		// call on next available tick
		setTimeout(fn, 1);
	} else {
		document.addEventListener("DOMContentLoaded", fn);
	}
}

var divBottom;
var menu, menuContainer, isMenuShowing;
var content, contentRect;
var toggle, toggleRect;
var buttonContainer, btnLeft, btnLeftInitRect, btnRight, btnRightInitRect;
var movingButton, movingButtonRect;
var vara;
var isDrawing = false;
var isInit = true;

docReady(function () {
	initElements();
	setTimeout(() => {
		drawText();
	}, 200);
});

function initElements() {
	divBottom = document.getElementById('div-bottom');
	menu = document.getElementById('menu');
	menuContainer = document.getElementById('menu-container');
	content = document.getElementById('content');
	toggle = document.getElementById('toggle');
	toggleRect = toggle.getBoundingClientRect();

	buttonContainer = document.getElementById('button-container');
	btnLeft = document.getElementById('btn-left');
	btnRight = document.getElementById('btn-right');
	initButtonsPosition();

	movingButton = btnRight;
	movingButtonRect = movingButton.getBoundingClientRect();
	movingButton.addEventListener('mouseover', move);
	btnLeft.addEventListener('click', staticButtonClick);
	
	isMenuShowing = false;

	btnPlay.addEventListener('click', refreshView);

	//menu
	var rdoLeft = document.getElementById('rdo-left');
	var rdoRight = document.getElementById('rdo-right');
	rdoLeft.addEventListener('change', changeMovingButton);
	rdoRight.addEventListener('change', changeMovingButton);
}
function initButtonsPosition(){
	buttonContainer.style.display = 'initial';
	var divBottomRect = divBottom.getBoundingClientRect();
	var middleX = Math.round(divBottomRect.width / 2);
	var paddingLeft = 0;
	if(isMenuShowing){
		paddingLeft = divBottomRect.x - 10;
	}
	btnRight.style.top = divBottomRect.y;
	btnRight.style.left = paddingLeft + middleX + 10;
	btnLeft.style.top = divBottomRect.y;
	btnLeft.style.left =  paddingLeft + middleX - btnLeft.getBoundingClientRect().width - 10;	
	btnRightInitRect = btnRight.getBoundingClientRect();
	btnLeftInitRect = btnLeft.getBoundingClientRect();
}
function refreshView(){
	initButtonsPosition();
	drawText();
}
function initVara(text) {	
	buttonContainer.style.opacity = 0;
	var element = document.getElementsByTagName('svg');
	if (element && element[0]) {
		element[0].remove();
	}
	vara = new Vara("#vara-container", "../resources/fonts/SatisfySL.json", [{
		autoAnimation: false,
		text: text,
		textAlign: "center",
		fontSize: 100,
		strokeWidth: 1,
		color: "#fff",
		duration: 5000,
	}]);

	vara.animationEnd(function (i, o) {
		isDrawing = false;
		setTimeout(() => {
			buttonContainer.style.opacity = 1;
			buttonContainer.style.transition = 'all 1s ease-in-out';
		}, 200);
	});
}
function showVaraEnd(text){
	buttonContainer.style.opacity = 0;
	buttonContainer.style.display = 'none';
	var element = document.getElementsByTagName('svg');
	if (element && element[0]) {
		element[0].remove();
	}
	vara = new Vara("#vara-container", "../resources/fonts/SatisfySL.json", [{
		autoAnimation: false,
		text: text,
		textAlign: "center",
		fontSize: 100,
		strokeWidth: 1,
		color: "#fff",
		duration: 5000,
	}]);

	setTimeout(() => {
		vara.playAll();		
	}, 100);
}
function drawText() {
	var text = document.getElementById("txtMain").value;
	isDrawing = true;
	initVara(text);
	
	setTimeout(() => {
		vara.playAll();		
	}, 100);
}
function toggleMenu() {
	if (isMenuShowing) {
		content.style.width = '100%';
		menu.style.width = toggleRect.width + 10;
		menu.style.backgroundColor = 'transparent';
		menuContainer.style.display = 'none';
		toggle.style.animation = "blink 1s linear infinite";
		setTimeout(() => {
			toggle.textContent = '>>>';
		}, 600);
	}
	else {
		content.style.width = '80%';
		menu.style.width = '20%';
		menu.style.backgroundColor = 'blue';
		menuContainer.style.display = 'inherit';
		setTimeout(() => {
			toggle.textContent = '<<<';
			toggle.style.animation = "";
		}, 600);
	}
	isMenuShowing = !isMenuShowing;	
	setTimeout(() => {
		isInit = true;
		initButtonsPosition();
		drawText();
	}, 500);
}
function staticButtonClick(){
	setTimeout(() => {
		movingButton.focus();	
		showVaraEnd('Sorry, too late!!!');
	}, 300);
}
function move() {
	contentRect = content.getBoundingClientRect();
	var top = getRandomInt(window.innerHeight - contentRect.height + 50, window.innerHeight - movingButtonRect.height - 50);
	var left = getRandomInt(window.innerWidth - contentRect.width + 50, window.innerWidth - movingButtonRect.width - 50);
	var retry = 1;
	while (retry < 1000 && (isNewPosInMainText(top, left) || isNewPosTooClose(top, left))) {
		top = getRandomInt(window.innerHeight - contentRect.height + 50, window.innerHeight - movingButtonRect.height - 50);
		left = getRandomInt(window.innerWidth - contentRect.width + 50, window.innerWidth - movingButtonRect.width - 50);
		retry++;
	}
	movingButton.style.position = 'absolute';
	movingButton.style.top = top + 'px';
	movingButton.style.left = left + 'px';

	movingButton.style.animation = 'mymove 2s 1';
	setTimeout(() => {
		movingButton.style.animation = '';
	}, 2000);
}
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function changeMovingButton(event) {
	initButtonsPosition();
	if (event.target.value == 'left') {
		btnRight.classList.add('btn-static');
		btnRight.addEventListener('click', staticButtonClick);
		btnRight.removeEventListener('mouseover', move);
		movingButton = btnLeft;
		btnLeft.classList.remove('btn-static');
	} else {
		btnLeft.classList.add('btn-static')
		btnLeft.addEventListener('click', staticButtonClick);
		btnLeft.removeEventListener('mouseover', move);
		movingButton = btnRight;
		btnRight.classList.remove('btn-static');
	}
	setTimeout(() => {
		movingButton.addEventListener('mouseover', move);
		movingButton.removeEventListener('click', staticButtonClick);
	}, 200);
}
function ResetButtonPos() {
	if (btnLeftInitRect && btnRightInitRect) {
		btnLeft.style.left = btnLeftInitRect.x;
		btnLeft.style.top = btnLeftInitRect.y;
		
		btnRight.style.left = btnRightInitRect.x;
		btnRight.style.top = btnRightInitRect.y;
	}	
}
function isNewPosInMainText(top, left) {
	var textRect = document.getElementById("vara-container").getBoundingClientRect();
	var result = (top >= textRect.top && top <= textRect.height && left >= textRect.left && left <= textRect.width);
	return result;
}
function isNewPosTooClose(top, left) {
	movingButtonRect = movingButton.getBoundingClientRect();
	var result = (Math.abs(top - movingButtonRect.y) <= 100 || Math.abs(left - movingButtonRect.x) <= 100);
	return result;
}
