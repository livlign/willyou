function docReady(fn) {
	// see if DOM is already available
	if (document.readyState === "complete" || document.readyState === "interactive") {
		// call on next available tick
		setTimeout(fn, 1);
	} else {
		document.addEventListener("DOMContentLoaded", fn);
	}
}

var menu;
var menuContainer;
var content;
var contentRect;
var toggle;
var toggleRect;
var isMenuShowing;
var vara;
var isDrawing = false;
var btnLeft;
var btnLeftInitRect;
var btnRight;
var btnRightInitRect;
var movingButton;
var movingButtonRect;
var buttonContainer;
var isInit = true;

docReady(function () {
	initElements();

	drawText();
});

function initElements() {
	menu = document.getElementById('menu');
	menuContainer = document.getElementById('menu-container');
	content = document.getElementById('content');
	toggle = document.getElementById('toggle');
	toggleRect = toggle.getBoundingClientRect();

	btnLeft = document.getElementById('btn-left');
	btnRight = document.getElementById('btn-right');
	btnLeftInitRect = btnLeft.getBoundingClientRect();
	btnRightInitRect = btnRight.getBoundingClientRect();

	movingButton = btnRight;
	movingButtonRect = movingButton.getBoundingClientRect();
	movingButton.addEventListener('mouseover', move);

	buttonContainer = document.getElementById('button-container');
	isMenuShowing = false;

	btnPlay.addEventListener('click', drawText);

	//menu
	var rdoLeft = document.getElementById('rdo-left');
	var rdoRight = document.getElementById('rdo-right');
	rdoLeft.addEventListener('change', changeMovingButton);
	rdoRight.addEventListener('change', changeMovingButton);
}

function initVara(text) {
	ResetButtonPos();
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
function drawText() {
	var text = document.getElementById("txtMain").value;
	isDrawing = true;
	initVara(text);

	setTimeout(() => {
		vara.playAll();
		ResetButtonPos();
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
		drawText();
	}, 500);
}
function move() {
	contentRect = content.getBoundingClientRect();


	var skipCheckLeft = false;
	var top = getRandomInt(window.innerHeight - contentRect.height + 50, window.innerHeight - movingButtonRect.height - 50);
	var left = getRandomInt(window.innerWidth - contentRect.width + 50, window.innerWidth - movingButtonRect.width - 50);
	var retry = 1;
	while (retry < 1000 && (isNewPosInMainText(top, left) || isNewPosTooClose(top, left))) {
		top = getRandomInt(window.innerHeight - contentRect.height + 50, window.innerHeight - movingButtonRect.height - 50);
		left = getRandomInt(window.innerWidth - contentRect.width + 50, window.innerWidth - movingButtonRect.width - 50);
		retry++;
	}
	console.log(retry);
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
	if (event.target.value == 'left') {
		btnRight.classList.add('btn-static');
		btnRight.removeEventListener('mouseover', move);
		movingButton = btnLeft;
		btnLeft.classList.remove('btn-static');
	} else {
		btnLeft.classList.add('btn-static')
		btnLeft.removeEventListener('mouseover', move);
		movingButton = btnRight;
		btnRight.classList.remove('btn-static');
	}
	movingButton.addEventListener('mouseover', move);
	ResetButtonPos();
}
function ResetButtonPos() {
	if (btnLeftInitRect) {
		btnLeft.style.position = 'initial';
		btnLeft.style.left = btnLeftInitRect.x;
		btnLeft.style.top = btnLeftInitRect.y;
	}
	if (btnRightInitRect) {
		btnRight.style.position = 'initial';
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