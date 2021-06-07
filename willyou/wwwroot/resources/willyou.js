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
var movingButton, movingButtonRect, staticButton, staticButtonRect;
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

	staticButtonRect = btnLeft;
	staticButtonRect = staticButton.getBoundingClientRect();

	isMenuShowing = false;

	btnPlay.addEventListener('click', refreshView);

	//menu
	var rdoLeft = document.getElementById('rdo-left');
	var rdoRight = document.getElementById('rdo-right');
	rdoLeft.addEventListener('change', changeMovingButton);
	rdoRight.addEventListener('change', changeMovingButton);
}
function initButtonsPosition() {
	buttonContainer.style.display = 'initial';
	var divBottomRect = divBottom.getBoundingClientRect();
	var middleX = Math.round(divBottomRect.width / 2);
	var paddingLeft = 0;
	if (isMenuShowing) {
		paddingLeft = divBottomRect.x - 10;
	}
	btnRight.style.top = divBottomRect.y + 50;
	btnRight.style.left = paddingLeft + middleX + 10;
	btnLeft.style.top = divBottomRect.y + 50;
	btnLeft.style.left = paddingLeft + middleX - btnLeft.getBoundingClientRect().width - 10;
	btnRightInitRect = btnRight.getBoundingClientRect();
	btnLeftInitRect = btnLeft.getBoundingClientRect();

	if (movingButton === btnLeft) {
		staticButton = btnRight;
		staticButtonRect = btnRightInitRect;
	} else {
		staticButton = btnLeft;
		staticButtonRect = btnLeft;
	}
}
function refreshView() {
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
function showVaraEnd(text) {
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
function staticButtonClick() {
	setTimeout(() => {
		movingButton.focus();
		showVaraEnd('Sorry, too late!!!');
	}, 300);
}
function move() {
	var newPos = calculateNewPosToMove();

	movingButton.style.position = 'absolute';
	movingButton.style.top = newPos.newY + 'px';
	movingButton.style.left = newPos.newX + 'px';

	movingButton.style.animation = 'Move_Effect 2s 1';
	setTimeout(() => {
		movingButton.style.animation = '';
	}, 2000);
}
function calculateNewPosToMove() {
	const textRect = document.getElementById('vara-container').getBoundingClientRect();
	document.getElementById('vara-container').style.border = '1px solid blue';
	const staticBtnRect = staticButton.getBoundingClientRect();
	const movingBtnRect = movingButton.getBoundingClientRect();
	contentRect = content.getBoundingClientRect();

	const moveableZones = [
		{ id: 1, minX: contentRect.x, maxX: textRect.x, minY: 50, maxY: window.innerHeight - movingBtnRect.height }
		, { id: 2, minX: textRect.x, maxX: contentRect.width / 2, minY: 10, maxY: textRect.y - movingBtnRect.height }
		, { id: 3, minX: contentRect.width / 2, maxX: textRect.x + textRect.width - movingBtnRect.width, minY: 10, maxY: textRect.y - movingBtnRect.height }
		, { id: 4, minX: textRect.x - 50 + textRect.width, maxX: window.innerWidth - movingBtnRect.width, minY: 10, maxY: window.innerHeight - movingBtnRect.height }
		, { id: 5, minX: contentRect.width / 2, maxX: textRect.x + textRect.width - movingBtnRect.width, minY: textRect.y + textRect.height, maxY: window.innerHeight - movingBtnRect.height - 30 }
		, { id: 6, minX: textRect.x, maxX: contentRect.width / 2, minY: textRect.y + textRect.height + staticBtnRect.height + 50, maxY: window.innerHeight - movingBtnRect.height - 30 }
	];
	let mvBtnInCurrentZone = 1;
	let foundZone = false;
	moveableZones.forEach((zone) => {
		if (movingBtnRect.x >= zone.minX && movingBtnRect.x <= zone.maxX && movingBtnRect.y >= zone.minY && movingBtnRect.y <= zone.maxY) {
			mvBtnInCurrentZone = zone.id;
			foundZone = true;
		}
	});

	let potentialZones = moveableZones.filter(x => x.id !== mvBtnInCurrentZone);
	let chooseAPosition = getRandomInt(0, potentialZones.length - 1);

	const newX = getRandomInt(potentialZones[chooseAPosition].minX, potentialZones[chooseAPosition].maxX);
	const newY = getRandomInt(potentialZones[chooseAPosition].minY, potentialZones[chooseAPosition].maxY);
	return { newX: newX, newY: newY };
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