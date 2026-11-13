let resetBtn = document.querySelector(".reset-btn");
let btn = document.querySelectorAll(".btn");
let msg = document.querySelector(".msg");
let newBtn = document.querySelector(".new-btn");
let winnerText = document.querySelector(".winner-text");
let twoPlayerBtn = document.querySelector(".two-player-btn");
let computerBtn = document.querySelector(".computer-btn");

let gameMode = null;
let computerThinking = false;
let computerTimer = null;

let turnO = true;
let count = 0;
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const disableBtn = () => {
  btn.forEach((box) => {
    box.disabled = true;
  });
};

let enableBtn = () => {
  clearTimeout(computerTimer);
  turnO = true;
  count = 0;
  gameOver = false;
  computerThinking = false;
  btn.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
    box.classList.remove("winner-cell");
  });
};

let twoPlayerMove = (box) => {
  if (turnO) {
    box.innerText = "O";
    turnO = false;
  } else {
    box.innerText = "X";
    turnO = true;
  }
  box.disabled = true;
  count++;
  let isWinner = checkWinner();
  if (count === 9 && !isWinner) {
    gameDraw();
  }
};

let computerPlayerMove = (box) => {
  box.innerText = "X";
  box.disabled = true;
  count++;

  let isWinner = checkWinner();
  if (isWinner) {
    return;
  }
  if (count === 9) {
    gameDraw();
    return;
  }
  computerThinking = true;
  computerTimer = setTimeout(() => {
    computerMove();
  }, 500);
};

btn.forEach((box) => {
  box.addEventListener("click", () => {
    if (gameMode === null || gameOver || computerThinking || box.disabled) {
      return;
    }

    if (gameMode === "twoPlayer") {
      twoPlayerMove(box);
    } else if (gameMode === "computer") {
      computerPlayerMove(box);
    }
  });
});
let findBestMove = (mark) => {
  for (let i = 0; i < btn.length; i++) {
    if (btn[i].innerText === "") {
      btn[i].innerText = mark;
      let isWinner = false;
      for (let pattern of winPatterns) {
        let pos1 = btn[pattern[0]].innerText;
        let pos2 = btn[pattern[1]].innerText;
        let pos3 = btn[pattern[2]].innerText;
        if (pos1 === mark && pos2 === mark && pos3 === mark) {
          isWinner = true;
          break;
        }
      }
      btn[i].innerText = "";
      if (isWinner) {
        return i;
      }
    }
  }
  return null;
};
let computerMove = () => {
  let move = findBestMove("O");

  if (move === null) {
    move = findBestMove("X");
  }
  if (move === null && btn[4].innerText === "") {
    move = 4;
  }
  if (move === null) {
    let emptyBoxes = [];
    btn.forEach((box, index) => {
      if (box.innerText === "") {
        emptyBoxes.push(index);
      }
    });
    let randomIndex = Math.floor(Math.random() * emptyBoxes.length);
    move = emptyBoxes[randomIndex];
  }

  btn[move].innerText = "O";
  btn[move].disabled = true;
  count++;

  let isWinner = checkWinner();
  if (!isWinner && count === 9) {
    gameDraw();
  }
  computerThinking = false;
};

let showWinner = (winner) => {
  winnerText.innerText = `Congratulation ! Winner is ${winner}`;
  msg.classList.remove("hide");
};
let checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1 = btn[pattern[0]].innerText;
    let pos2 = btn[pattern[1]].innerText;
    let pos3 = btn[pattern[2]].innerText;

    if (pos1 != "" && pos2 != "" && pos3 != "") {
      if (pos1 === pos2 && pos2 === pos3) {
        console.log("Winner", pos1);
        showWinner(pos1);
        disableBtn();
        return true;
      }
    }
  }
  return false;
};

let gameDraw = () => {
  gameOver = true;
  winnerText.innerText = `Game was a Draw!`;
  msg.classList.remove("hide");
};
resetBtn.addEventListener("click", () => {
  enableBtn();
  msg.classList.add("hide");
});
newBtn.addEventListener("click", () => {
  enableBtn();
  msg.classList.add("hide");
});

twoPlayerBtn.addEventListener("click", () => {
  gameMode = "twoPlayer";
  enableBtn();
});
computerBtn.addEventListener("click", () => {
  gameMode = "computer";
  enableBtn();
});
