// canvas from html
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const playerHP = document.querySelector("#playerHP");
const enemyHP = document.querySelector("#enemyHP");
let gameEnd = false;

// resizing
canvas.width = 1024;
canvas.height = 576;

// background
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.4;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "/img/background.png",
});

const rain = new Sprite({
  position: {
    x: 100,
    y: 100,
  },
  imageSrc: "/img/Rain.png",
  scale: 10,
  crop: 3,
});

// new player
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: 0,
    y: 0,
  },
  scale: 3,
  offset: {
    x: 120,
    y: 100,
  },
  sprites: {
    idleLeft: {
      imageSrc: "/characters/player1/_IdleLeft.png",
      framesMax: 10,
    },
    idleRight: {
      imageSrc: "/characters/player1/_IdleRight.png",
      framesMax: 10,
    },
    runRight: {
      imageSrc: "/characters/player1/_Run.png",
      framesMax: 10,
    },
    runLeft: {
      imageSrc: "/characters/player1/_RunLeft.png",
      framesMax: 10,
    },
    jumpLeft: {
      imageSrc: "/characters/player1/_JumpLeft.png",
      framesMax: 3,
    },
    jumpRight: {
      imageSrc: "/characters/player1/_JumpRight.png",
      framesMax: 3,
    },
    fallLeft: {
      imageSrc: "/characters/player1/_FallLeft.png",
      framesMax: 3,
    },
    fallRight: {
      imageSrc: "/characters/player1/_FallRight.png",
      framesMax: 3,
    },
  },
});

// new enemy
const enemy = new Fighter({
  position: {
    x: 200,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  scale: 3,
  offset: {
    x: 120,
    y: 100,
  },
});

// movement keys
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  aLeft: {
    pressed: false,
  },
  aRight: {
    pressed: false,
  },
};

timerDec();

// animation
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  player.update();
  // enemy.update();

  // player velocity
  player.velocity.x = 0;

  if (keys.a.pressed && player.lastKey == "a") {
    player.velocity.x = -4;
    player.switchSprite("runLeft");
  } else if (keys.d.pressed && player.lastKey == "d") {
    player.velocity.x = 4;
    player.switchSprite("runRight");
  } else if (player.lastKey == "a") {
    player.switchSprite("idleLeft");
  } else {
    player.switchSprite("idleRight");
  }

  if (player.velocity.y < 0 && player.lastKey == "a") {
    player.switchSprite("jumpLeft");
  } else if (player.velocity.y < 0 && player.lastKey == "d") {
    player.switchSprite("jumpRight");
  } else if (player.velocity.y > 0 && player.lastKey == "d") {
    player.switchSprite("fallRight");
  } else if (player.velocity.y > 0 && player.lastKey == "a") {
    player.switchSprite("fallLeft");
  }

  // enemy velocity
  enemy.velocity.x = 0;
  if (keys.aLeft.pressed && enemy.lastKey == "aLeft") {
    enemy.velocity.x = -4;
  } else if (keys.aRight.pressed && enemy.lastKey == "aRight") {
    enemy.velocity.x = 4;
  }

  // collision
  if (
    rectColl({
      rect1: player,
      rect2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    enemyHP.style.width = enemy.health + "%";
  }

  if (
    rectColl({
      rect1: enemy,
      rect2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    playerHP.style.width = player.health + "%";
  }

  // health based ending
  if ((player.health <= 0 || enemy.health <= 0) && gameEnd == false) {
    console.log("cipka cipka");
    winner({ player, enemy, timerID });
  }
}

animate();

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      if (player.position.y >= 400) {
        player.velocity.y = -17;
      }
      break;
    case " ":
      player.attack();
      break;

    // enemy
    case "ArrowLeft":
      keys.aLeft.pressed = true;
      enemy.lastKey = "aLeft";
      break;
    case "ArrowRight":
      keys.aRight.pressed = true;
      enemy.lastKey = "aRight";
      break;
    case "ArrowUp":
      if (enemy.position.y >= 400) {
        enemy.velocity.y = -17;
      }
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "ArrowLeft":
      keys.aLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.aRight.pressed = false;
      break;
  }
});
