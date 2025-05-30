let generatedPlate = "";
let hasSolution = false;
let timer;
let timeLeft = 30;
let solutions = [];
let score = 0; // 連続正解数
let parenOpen = true; // 括弧ボタンの状態（(と)交互）

function generatePlate() {
  clearInterval(timer);
  const number = Math.floor(Math.random() * 10000);
  generatedPlate = number.toString().padStart(4, "0");
  document.getElementById("plateDisplay").textContent = generatedPlate;
  document.getElementById("result").textContent = "";
  document.getElementById("userInput").value = "";
  timeLeft = 30;
  solutions = findSolutions(generatedPlate);
  hasSolution = solutions.length > 0;
  updateTimer();
  updateScore();
  startTimer();

  // 括弧ボタンリセット
  parenOpen = true;
  const parenBtn = document.getElementById("parenBtn");
  parenBtn.textContent = "(";
}

function updateTimer() {
  document.getElementById("timer").textContent = `残り時間: ${timeLeft}秒`;
}

function updateScore() {
  document.getElementById("score").textContent = `連続正解数: ${score}`;
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      score = 0; // 時間切れでスコアリセット
      updateScore();
      showAnswerExample();
    }
  }, 1000);
}

function getDigits(str) {
  return str.split("").sort();
}

function getUsedDigits(expr) {
  return expr.replace(/[^0-9]/g, "").split("").sort();
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function checkInput() {
  if (timeLeft <= 0) return;

  const userInput = document.getElementById("userInput").value.trim();

  if (userInput === "答えがない") {
    if (!hasSolution) {
      clearInterval(timer);
      document.getElementById("result").textContent = "正解！この数字では10は作れません。";
      document.getElementById("result").style.color = "green";
      score++;
      updateScore();
      setTimeout(generateNextProblem, 2000);
    } else {
      document.getElementById("result").textContent = "実は解があります！もう一度考えてみてください。";
      document.getElementById("result").style.color = "red";
    }
    return;
  }

  try {
    // 入力記号をJSで計算できる形に変換
    const sanitized = userInput.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");
    const userDigits = getUsedDigits(userInput);
    const targetDigits = getDigits(generatedPlate);

    if (!arraysEqual(userDigits, targetDigits)) {
      document.getElementById("result").textContent = "すべての数字を一度ずつ使ってください。";
      document.getElementById("result").style.color = "orange";
      return;
    }

    const result = Function(`"use strict"; return (${sanitized})`)();

    if (Math.abs(result - 10) < 0.0001) {
      clearInterval(timer);
      document.getElementById("result").textContent = "正解！10になりました！";
      document.getElementById("result").style.color = "green";
      timeLeft += 30; // 正解で30秒追加
      score++;
      updateScore();
      setTimeout(generateNextProblem, 2000);
    } else {
      document.getElementById("result").textContent = `残念、結果は ${result} でした。`;
      document.getElementById("result").style.color = "red";
    }
  } catch (e) {
    document.getElementById("result").textContent = "
