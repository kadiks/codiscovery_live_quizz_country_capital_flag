let curQuestionIdx = 0;
let questionNumber = 1;
let questionTotal = 10;
let curQuestion;
let questionEl;
let questionIndexEl;
let inputEl;
let submitBtnEl;
let nextQuestionBtnEl;
let endPanelEl;
let questionPanelEl;
let answerPanelEl;
let goodAnswersCount = 0;
let countries;

const init = async () => {

    questionEl = document.getElementById('question');
    inputEl = document.getElementById('answer');
    submitBtnEl = document.getElementById('submit');
    nextQuestionBtnEl = document.getElementById('next-question');
    questionIndexEl = document.getElementById('question-index');
    endPanelEl = document.getElementById('end-panel');
    questionPanelEl = document.getElementById('question-panel');
    answerPanelEl = document.getElementById('answer-panel');
    
    const res = await fetch('https://restcountries.eu/rest/v2/all');
    countries = await res.json();

    console.log('countries', countries);

    pickQuestion();

    inputEl.onkeypress = (evt) => {
        if (evt.keyCode === 13) {
            checkAnswer();
        }
    };
    submitBtnEl.onclick = checkAnswer;
    nextQuestionBtnEl.onclick = () => {
        inputEl.value = '';
        questionNumber++;
        if (questionNumber > questionTotal) {
            endGame();
        } else {
            pickQuestion();
        }
    };
};

const checkAnswer = () => {
    if (inputEl.value === '' || inputEl.value === ' ') {
        return;
    }
    togglePanel('answer');
    if (isValidAnswer(inputEl.value, curQuestion.answer)) {
        answerPanelEl
            .querySelector('h2').textContent = 'Good job!';
        answerPanelEl
            .querySelector('p').textContent = '';
        goodAnswersCount++;
    } else {
        answerPanelEl
            .querySelector('h2').textContent = 'Wrong answer';
        answerPanelEl
            .querySelector('p').textContent = `The answer was ${curQuestion.answer}`;
    }
};

const isValidAnswer = (userInput, answer) => {
    const cInput = getCleanAnswer(userInput);
    const cAnswer = getCleanAnswer(answer);

    return cInput === cAnswer;    
};

const getCleanAnswer = (answer) => {
    let cleanText = answer;

    cleanText = cleanText.trim();
    cleanText = cleanText.toLowerCase();
    cleanText = cleanText.replace(/\./g, '');
    cleanText = removeDiacritics(cleanText);
    
    return cleanText;
};

const togglePanel = (name) => {
    switch(name) {
        case 'question':
            questionPanelEl.style.display = 'block';
            answerPanelEl.style.display = 'none';
            endPanelEl.style.display = 'none';
            break;
        case 'answer':
            questionPanelEl.style.display = 'none';
            answerPanelEl.style.display = 'block';
            endPanelEl.style.display = 'none';
            break;
        case 'end':
        default:
            questionPanelEl.style.display = 'none';
            answerPanelEl.style.display = 'none';
            endPanelEl.style.display = 'block';
            break;
    }
};

const endGame = () =>  {
    togglePanel('end');
    endPanelEl
        .querySelector('p').textContent = `Your total score is: ${goodAnswersCount} / ${questionTotal}`
};

const pickQuestion = () => {
    togglePanel('question');

    const rand = Math.random();
    let questionType = 'capital';
    if (rand <= .1) {
        questionType = 'country';
    } else if (rand <= .4) {
        questionType = 'flag';
    }
    // const questionType = Math.random() > 0.5 ? 'country' : 'capital'; 
    curQuestionIdx = getRandomInt(0, countries.length - 1);
    questionIndexEl.textContent = `${questionNumber} / ${questionTotal}`;
    if (questionType === 'country') {
        curQuestion = {
            question: countries[curQuestionIdx].capital,
            answer: countries[curQuestionIdx].name
        };
        questionEl.textContent = `Capital: ${curQuestion.question}`;
        inputEl.placeholder = 'Country';
    } else if (questionType === 'capital') {
        curQuestion = {
            question: countries[curQuestionIdx].name,
            answer: countries[curQuestionIdx].capital
        };
        questionEl.textContent = `Country: ${curQuestion.question}`;
        inputEl.placeholder = 'Capital';
    } else {
        curQuestion = {
            question: countries[curQuestionIdx].flag,
            answer: countries[curQuestionIdx].name
        };
        questionEl.innerHTML = `<img src="${curQuestion.question}" />`;
        inputEl.placeholder = 'Country';
    }
    console.log('answer', curQuestion.answer);
};

// https://stackoverflow.com/a/1527820
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.onload = init;