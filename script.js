const splashPage = document.getElementById('splash-page');
const countDownPage = document.getElementById('countdown-page');
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const startForm = document.querySelector('form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInPuts = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
const countDown = document.querySelector('.countdown');
const itemContainer = document.querySelector('.item-container');
const finalTimeElement = document.querySelector('.final-time');
const baseTimeElement = document.querySelector('.base-time');
const penaltyTimeElement = document.querySelector('.penalty-time');
const playAGainButton = document.querySelector('.play-again');

let questionAmount;
let equationsArray = new Array();
let playerGuesses = new Array();
let bestScoresArray = new Array();

let firstNumber = 0;
let secondNumber = 0;
let equationObject = new Object();
const wrongFormat = new Array();

let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

let scrollDownY = 0;

function bestScoresToDOM() {
	bestScores.forEach((bestScore, i) => {
		const bestScoreElement = bestScore;

		bestScoreElement.textContent = `${bestScoresArray[i].bestScore}s`;
	});
};

function getSavedBestScores() {
	if (localStorage.getItem('bestScores')) {
		bestScoresArray = JSON.parse(localStorage.getItem('bestScores'));
	} else {
		bestScoresArray = [
			{questions: 10, bestScore: finalTimeDisplay},
			{questions: 25, bestScore: finalTimeDisplay},
			{questions: 50, bestScore: finalTimeDisplay},
			{questions: 99, bestScore: finalTimeDisplay}
		];

		localStorage.setItem('bestScores', JSON.stringify(bestScoresArray));
	};

	bestScoresToDOM();
};

function upDateBestScores() {
	bestScoresArray.forEach((score, i) => {
		if (questionAmount === score.questions) {
			const savedBestScore = Number(bestScoresArray[i].bestScore);

			if (savedBestScore === 0 || savedBestScore > finalTime) {
				bestScoresArray[i].bestScore = finalTimeDisplay;
			};
		};
	});

	bestScoresToDOM();
	localStorage.setItem('bestScores', JSON.stringify(bestScoresArray));
};

function playAGain() {
	scorePage.hidden = true;
	splashPage.hidden = false;
	equationsArray = [];
	playerGuesses = [];
	scrollDownY = 0;
	playAGainButton.hidden = true;
};

function showScorePage() {
	setTimeout(() => {playAGainButton.hidden = false}, 1000);

	gamePage.hidden = true;
	scorePage.hidden = false;
};

function scoresToDOM() {
	baseTime = timePlayed.toFixed(1);
	penaltyTime = penaltyTime.toFixed(1);
	finalTimeDisplay = finalTime.toFixed(1);

	baseTimeElement.textContent = `Base Time ${baseTime}s`;
	penaltyTimeElement.textContent = `Penalty: +${penaltyTime}s`;
	finalTimeElement.textContent = `${finalTimeDisplay}s`;

	upDateBestScores();
	itemContainer.scrollTo({top: 0, behavior: 'instant'});
	showScorePage();
};

function checkTime() {
	if (playerGuesses.length === questionAmount) {
		clearInterval(timer);

		equationsArray.forEach((equation, i) => {
			if (equation.evaluated === playerGuesses[i]) {}
			else {
				penaltyTime += 0.5;
			};
		});

		finalTime = timePlayed + penaltyTime;

		scoresToDOM();
	};
};

function addTime() {
	timePlayed += 0.1;

	checkTime();
};

function startTimer() {
	timePlayed = 0;
	penaltyTime = 0;
	finalTime = 0;
	timer = setInterval(addTime, 100);
};

function select(guess) {
	scrollDownY += 80;

	itemContainer.scroll(0, scrollDownY);

	return guess === true ? playerGuesses.push('true') : playerGuesses.push('false');
};

function showGamePage() {
	gamePage.hidden = false;
	countDownPage.hidden = true;

	startTimer();
};

function getRandomInteger(maximum) {
	return Math.floor(Math.random() * Math.floor(maximum));
};

function createEquations() {
	const rightEquations = getRandomInteger(questionAmount);
	const wrongEquations = questionAmount - rightEquations;

	for (let i = 0; i < rightEquations; i++) {
		firstNumber = getRandomInteger(9);
		secondNumber = getRandomInteger(9);

		const equationValue = firstNumber * secondNumber;
		const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;

		equationObject = {value: equation, evaluated: 'true'};

		equationsArray.push(equationObject);
	};

	for (let i = 0; i < wrongEquations; i++) {
		firstNumber = getRandomInteger(9);
		secondNumber = getRandomInteger(9);

		const equationValue = firstNumber * secondNumber;

		wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
		wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
		wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;

		const formatChoice = getRandomInteger(3);
		const equation = wrongFormat[formatChoice];

		equationObject = {value: equation, evaluated: 'false'};

		equationsArray.push(equationObject);
	};

	shuffle(equationsArray);
};

function equationsToDOM() {
	equationsArray.forEach(equation => {
		const item = document.createElement('div');

		item.classList.add('item');

		const equationText = document.createElement('h1');

		equationText.textContent = equation.value;

		item.appendChild(equationText);
		itemContainer.appendChild(item);
	});
};

function populateGamePage() {
	itemContainer.textContent = '';

	const topSpacer = document.createElement('div');

	topSpacer.classList.add('height-240');

	const selectedItem = document.createElement('div');

	selectedItem.classList.add('selected-item');
	itemContainer.append(topSpacer, selectedItem);

	createEquations();
	equationsToDOM();

	const bottomSpacer = document.createElement('div');

	bottomSpacer.classList.add('height-500');
	itemContainer.appendChild(bottomSpacer);
};

function startCountDown() {
	let count = 3;

	countDown.textContent = count;

	const countdownTime = setInterval(() => {
		count--;

		if (count === 0) {
			countDown.textContent = 'GO';
		} else if (count === -1) {
			showGamePage();
			clearInterval(countdownTime);
		} else {
			countDown.textContent = count;
		};
	}, 1000);
};

function showCountDown() {
	countDownPage.hidden = false;
	splashPage.hidden = true;

	populateGamePage();
	startCountDown();
};

function getRadioValue() {
	let radioValue;

	radioInPuts.forEach(inPut => {
		if (inPut.checked) {
			radioValue = inPut.value;
		};
	});

	return Number(radioValue);
};

function selectQuestionAmount(event) {
	event.preventDefault();

	questionAmount = getRadioValue();

	if (questionAmount) {
		showCountDown();
	};
};

startForm.addEventListener('click', () => {
	radioContainers.forEach(radio => {
		radio.classList.remove('selected-label');
		
		if (radio.children[1].checked) {
			radio.classList.add('selected-label');
		};
	});
});
startForm.addEventListener('submit', selectQuestionAmount);

getSavedBestScores();