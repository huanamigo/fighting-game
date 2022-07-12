// collision between players
function rectColl({ rect1, rect2 }) {
  return (
    rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
    rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
    rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
    rect1.attackBox.position.y <= rect2.position.y + rect2.height
  );
}

// who wins
function winner({ player, enemy, timerID }) {
  clearTimeout(timerID);
  if (player.health === enemy.health) {
    document.querySelector(".result").innerHTML = "Tie";
    document.querySelector(".result").style = "display: flex";
    gameEnd = true;
  } else if (player.health > enemy.health) {
    document.querySelector(".result").innerHTML = "Player 1 Wins";
    document.querySelector(".result").style = "display: flex";
    gameEnd = true;
  } else if (enemy.health > player.health) {
    document.querySelector(".result").innerHTML = "Player 2 Wins";
    document.querySelector(".result").style = "display: flex";
    gameEnd = true;
  }
}

// timer
let timerEl = document.querySelector("#timer");
timerNum = timerEl.innerHTML;
let timerID;

function timerDec() {
  if (timerNum > 0) {
    timerID = setTimeout(timerDec, 1000);
    timerNum--;
    timerEl.innerHTML = timerNum;
  }

  if (timerNum === 0) {
    winner({ player, enemy });
  }
}
