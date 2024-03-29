﻿function docReady(fn) {
	// see if DOM is already available
	if (document.readyState === "complete" || document.readyState === "interactive") {
		// call on next available tick
		setTimeout(fn, 1);
	} else {
		document.addEventListener("DOMContentLoaded", fn);
	}
}
// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

const fonts = [
	{
		id: 0,
		path: "../resources/fonts/PacificoSLO.json"
	},
	{
		id: 1,
		path: "../resources/fonts/Parisienne.json"
	},
	{
		id: 2,
		path: "../resources/fonts/SatisfySL.json"
	},
	{
		id: 3,
		path: "../resources/fonts/shadows-into-light.json"
	},
]
const themes = [
	{
		id: 0,
		backgroundValue: "linear-gradient(to right, #f83600 0%, #f9d423 100%)",
	},
	{
		id: 1,
		backgroundValue: "linear-gradient(to top, #30cfd0 0%, #330867 100%)",
	},
	{
		id: 2,
		backgroundValue: "linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)",
	},
	{
		id: 3,
		backgroundValue: "linear-gradient(-20deg, #fc6076 0%, #ff9a44 100%)"
	},
	{
		id: 4,
		backgroundValue: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)"
	},
	{
		id: 5,
		backgroundValue: "linear-gradient(to top, #0ba360 0%, #3cba92 100%)",
	},
	{
		id: 6,
		backgroundValue: "linear-gradient(to top, #f43b47 0%, #453a94 100%)",
	},
	{
		id: 7,
		backgroundValue: "linear-gradient(to top, #09203f 0%, #537895 100%)",
	},
	{
		id: 8,
		backgroundValue: "linear-gradient(to top, #c71d6f 0%, #d09693 100%)"
	},
	{
		id: 9,
		backgroundValue: "linear-gradient(60deg, #29323c 0%, #485563 100%)"
	},
	{
		id: 10,
		backgroundValue: "linear-gradient(-225deg, #FF3CAC 0%, #562B7C 52%, #2B86C5 100%)"
	},
	{
		id: 11,
		backgroundValue: "linear-gradient(to bottom, #323232 0%, #3F3F3F 40%, #1C1C1C 150%), linear-gradient(to top, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.25) 200%)"
	},
	{
		id: 12,
		backgroundValue: "linear-gradient(15deg, #13547a 0%, #80d0c7 100%)"
	},
	{
		id: 13,
		backgroundValue: "linear-gradient(to top, #c79081 0%, #dfa579 100%)"
	},
	{
		id: 14,
		backgroundValue: "linear-gradient(-60deg, #16a085 0%, #f4d03f 100%)"
	},
	{
		id: 15,
		backgroundValue: "linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)"
	}
]

var selectedFontId;
var divMiddle, divBottom;
var menu, menuContainer, isMenuShowing, menuSuggestion, toggleMovingButton;
var content, contentRect;
var toggle, toggleRect;
var buttonContainer, btnLeft, btnLeftInitRect, btnRight, btnRightInitRect;
var movingButton, movingButtonRect, staticButton, staticButtonRect;
var vara, varaContainer;
var isDrawing = false;
var isInit = true;
var data, rdoMovingButtonValue;
var btnSave, txtSaveResult, btnOpenResult, btnCopyResult;

docReady(function () {
	initElements();

	var defaultData = {
		movingButton: document.getElementById('toggle-moving-button').checked ? 'left' : 'right',
		fontSize: parseInt(document.getElementById('font-size-selection').value),
		mainText: document.getElementById('main-text').value,
		btnLeftText: document.getElementById('left-button-text').value,
		btnRightText: document.getElementById('right-button-text').value,
		endText: document.getElementById('end-text').value,
		speed: parseInt(document.getElementById('speed-selection').value),
		suggestionMenu: document.getElementById('toggle-menu-suggestion').checked,
		fontId: document.getElementById('font-id').value,
		themeId: document.getElementById('theme-id').value
	}
	initMainData(defaultData);

	drawText();
});

const model = {
	movingButton: 'left' | 'right',
	mainText: String,
	btnLeftText: String,
	btnRightText: String,
	endText: String,
	speed: Number,
}
function initMainData(source) {
	data = {
		fontId: source.fontId,
		fontSize: source.fontSize,
		movingButton: source.movingButton,
		mainText: source.mainText,
		btnLeftText: source.btnLeftText,
		btnRightText: source.btnRightText,
		endText: source.endText,
		speed: source.speed,
		suggestionMenu: source.suggestionMenu,
		themeId: source.themeId
	}

	btnLeft.textContent = data.btnLeftText;
	btnRight.textContent = data.btnRightText;

	btnRight.removeEventListener('click', staticButtonClick);
	movingButton = data.movingButton === 'right' ? btnRight : btnLeft;
	staticButton = data.movingButton === 'right' ? btnLeft : btnRight;
	movingButtonRect = movingButton.getBoundingClientRect();
	staticButtonRect = staticButton.getBoundingClientRect();

	movingButton.addEventListener('mouseover', move);
	movingButton.removeEventListener('click', staticButtonClick);
	movingButton.classList.remove('btn-static');

	staticButton.addEventListener('click', staticButtonClick);
	staticButton.removeEventListener('mouseover', move);
	staticButton.classList.add('btn-static');

	setTheme(data.themeId);
}
function initElements() {
	isMenuShowing = false;
	varaContainer = document.getElementById('vara-container');
	divMiddle = document.getElementById('div-middle');
	divBottom = document.getElementById('div-bottom');
	content = document.getElementById('content');
	toggle = document.getElementById('toggle-menu');
	toggle.style.animation = "blink 3s linear infinite";
	toggleRect = toggle.getBoundingClientRect();

	buttonContainer = document.getElementById('button-container');
	btnLeft = document.getElementById('btn-left');
	btnRight = document.getElementById('btn-right');

	btnPlay.addEventListener('click', refreshView);

	//menu
	menu = document.getElementById('menu');
	menuContainer = document.getElementById('menu-container');
	menuSuggestion = document.getElementById('menu-suggestion');

	toggleMovingButton = document.getElementById('toggle-moving-button');
	toggleMovingButton.addEventListener('change', changeMovingButton);
	rdoMovingButtonValue = 'right';

	//save result
	txtSaveResult = document.getElementById('save-result');
	btnSave = document.getElementById('btnSave');
	btnOpenResult = document.getElementById('btn-open-result');
	btnCopyResult = document.getElementById('btn-copy-result');
	btnSave.addEventListener('click', btnSaveClick);
	btnOpenResult.addEventListener('click', openResult);
	btnCopyResult.addEventListener('click', copyResult);
}
function setTheme(themeId) {
	const selectedTheme = themes[themeId];
	const bodyEl = document.getElementById('body-el');
	bodyEl.style.cssText = `background: ${selectedTheme.backgroundValue}; transition: all 1s ease;display: flex;flex - direction: row;	width: 100 %;	height: 100 %;	margin: 0;	font - family: Verdana, sans - serif;	font - size: 10px;`
}
function openResult() {
	var result = txtSaveResult.value;
	if (!result || result === '') return;

	window.open(result, '_blank').focus();
}
function copyResult() {
	var result = txtSaveResult.value;
	if (!result || result === '') return;
	/* Select the text field */
	txtSaveResult.select();
	txtSaveResult.setSelectionRange(0, 99999); /* For mobile devices */
	/* Copy the text inside the text field */
	document.execCommand("copy");

	btnCopyResult.textContent = 'Copied';
	setTimeout(() => {
		btnCopyResult.textContent = 'Copy';
	}, 1000);
}
function btnSaveClick() {
	btnSave.textContent = 'Saving...';
	btnSave.removeEventListener('click', btnSaveClick);
	document.getElementById('save-result-container').style.display = 'none';
	fetch('/',
		{
			method: "POST",
			body: JSON.stringify({
				'ThemeId': parseInt(document.getElementById('theme-id').value),
				'FontId': parseInt(document.getElementById('font-id').value),
				'MainText': document.getElementById('main-text').value,
				'EndText': document.getElementById('end-text').value,
				'BtnLeftText': document.getElementById('left-button-text').value,
				'BtnRightText': document.getElementById('right-button-text').value,
				'TextSize': parseInt(document.getElementById('font-size-selection').value),
				'WritingSpeed': parseInt(document.getElementById('speed-selection').value),
				'MovingButton': document.getElementById('toggle-moving-button').checked,
				'MenuSuggestion': document.getElementById('toggle-menu-suggestion').checked,
			}),
			headers: {
				'RequestVerificationToken': document.getElementsByName("__RequestVerificationToken")[0].value,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			}
		})
		.then(function (res) { return res.json(); })
		.then(function (data) {
			let result = `${window.location.origin}?id=${data}`;
			txtSaveResult.value = result;
			btnSave.textContent = 'Save & Share';
			btnSave.addEventListener('click', btnSaveClick);
			document.getElementById('save-result-container').style.display = 'flex';
		})
}

function initButtonsPosition() {
	buttonContainer.style.display = 'initial';
	var varaRect = varaContainer.getBoundingClientRect();
	var divBottomRect = content.getBoundingClientRect();
	var middleX = divBottomRect.width / 2;
	var paddingLeft = 0;
	var divMenu = document.getElementById('menu');
	if (isMenuShowing) {
		paddingLeft = divMenu.getBoundingClientRect().width;
	} else {
		paddingLeft = toggleRect.width;
	}

	btnLeft.style.top = varaRect.y + varaRect.height + 20;
	btnLeft.style.left = paddingLeft + middleX - btnLeft.getBoundingClientRect().width - 10;
	btnRight.style.top = varaRect.y + varaRect.height + 20;
	btnRight.style.left = btnLeft.getBoundingClientRect().x + btnLeft.getBoundingClientRect().width + 10;

	btnRightInitRect = btnRight.getBoundingClientRect();
	btnLeftInitRect = btnLeft.getBoundingClientRect();
}
function refreshView() {
	const mainText = document.getElementById('main-text').value;
	const endText = document.getElementById('end-text').value;
	const fontSize = document.getElementById('font-size-selection').value;
	const speed = document.getElementById('speed-selection').value;
	const leftText = document.getElementById('left-button-text').value;
	const rightText = document.getElementById('right-button-text').value;
	const suggestionMenu = document.getElementById('toggle-menu-suggestion').checked;
	const fontId = document.getElementById('font-id').value;
	const themeId = document.getElementById('theme-id').value;
	var data = {
		fontId: fontId,
		movingButton: rdoMovingButtonValue,
		fontSize: fontSize,
		mainText: mainText,
		btnLeftText: leftText,
		btnRightText: rightText,
		endText: endText,
		speed: speed,
		suggestionMenu: suggestionMenu,
		themeId: themeId
	}
	initMainData(data);

	setTimeout(() => {
		drawText();
	}, 200);
}
function initVara() {
	buttonContainer.style.opacity = 0;
	menuSuggestion.style.opacity = 0;
	var element = document.getElementsByTagName('svg');
	if (element && element[0]) {
		element[0].remove();
	}
	vara = new Vara("#vara-container", fonts[data.fontId].path, [{
		autoAnimation: false,
		text: data.mainText,
		textAlign: "center",
		fontSize: data.fontSize,
		strokeWidth: 1,
		color: "#fff",
		duration: 15000 - data.speed,
	}]);

	vara.animationEnd(function (i, o) {
		isDrawing = false;
		initButtonsPosition();
		setTimeout(() => {
			buttonContainer.style.opacity = 1;
			buttonContainer.style.transition = 'all 1s ease-in-out';
		}, 200);
		setTimeout(() => {
			if (data.suggestionMenu) {
				menuSuggestion.style.opacity = 100;
			}
		}, 1000);
	});
}
function showVaraEnd() {
	buttonContainer.style.opacity = 0;
	buttonContainer.style.display = 'none';
	var element = document.getElementsByTagName('svg');
	if (element && element[0]) {
		element[0].remove();
	}
	vara = new Vara("#vara-container", fonts[data.fontId].path, [{
		autoAnimation: false,
		text: data.endText,
		textAlign: "center",
		fontSize: data.fontSize,
		strokeWidth: 1,
		color: "#fff",
		duration: data.speed,
	}]);
	setTimeout(() => {
		vara.playAll();
	}, 100);
}
function drawText() {
	isDrawing = true;
	initVara();

	setTimeout(() => {
		vara.playAll();
	}, 500);
}
function toggleMenu() {
	if (isMenuShowing) {
		content.style.width = '100%';
		menu.style.width = toggleRect.width + 10;
		menu.style.borderRight = "hidden";
		menuContainer.style.display = 'none';
		toggle.style.animation = "blink 3s linear infinite";
		setTimeout(() => {
			toggle.textContent = '>>>';
			toggle.style.color = 'white';
		}, 600);
	}
	else {
		content.style.width = '80%';
		menu.style.width = '20%';
		menu.style.borderRight = "2px solid white";
		menuContainer.style.display = 'inherit';
		menuSuggestion.style.opacity = 0;
		setTimeout(() => {
			toggle.textContent = '<<<';
			toggle.style.animation = "";
			toggle.style.color = "#4a4a4a";
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
		showVaraEnd(data.endText);
	}, 300);
}

//TODO: use requestAnimatedFrame
//var rafId, start, newPos;
//var movingStep = 30;
// let movingFunction = function (timestamp){
// 	start = !start ? Math.round(timestamp) : start;
// 	var cx = Math.round(movingButton.getBoundingClientRect().x);
// 	var cy = Math.round(movingButton.getBoundingClientRect().y);
// 	var distanceX = newPos.newX - cx;
// 	var distanceY = newPos.newY - cy;
// 	console.log(start, Math.round(timestamp), cx, cy, newPos.newX, newPos.newY, distanceX, distanceY);	

// 	// if(cx >= newPos.newX + movingStep || cx <= newPos.X - movingStep){
// 	// 	var n = cx > newPos.newX ? -1 * movingStep : 1 * movingStep;
// 	// 	movingButton.style.left = cx + n + 'px';
// 	// 	rafId = requestAnimationFrame(movingFunction);
// 	// }
// 	// else{
// 	// 	cancelAnimationFrame(rafId);
// 	// }
// }

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
	moveableZones.forEach((zone) => {
		if (movingBtnRect.x >= zone.minX && movingBtnRect.x <= zone.maxX && movingBtnRect.y >= zone.minY && movingBtnRect.y <= zone.maxY) {
			mvBtnInCurrentZone = zone.id;
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
function changeMovingButton() {
	initButtonsPosition();

	if (toggleMovingButton.checked) {
		movingButton = btnLeft;
		staticButton = btnRight;
		rdoMovingButtonValue = 'left'
	} else {
		movingButton = btnRight;
		staticButton = btnLeft;
		rdoMovingButtonValue = 'right';
	}
	staticButton.classList.add('btn-static');
	staticButton.removeEventListener('mouseover', move);
	staticButton.addEventListener('click', staticButtonClick);

	movingButton.classList.remove('btn-static');
	movingButton.removeEventListener('click', staticButtonClick);
	movingButton.addEventListener('mouseover', move);
}