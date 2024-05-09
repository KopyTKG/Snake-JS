const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctx = snakeboard.getContext("2d");

/* --- Game --- */
const blockSize = 30;


document.addEventListener("keydown", change_direction);
// Snake and his body
let snake = [
  {x: blockSize, y: blockSize},
];
// Colors used in game
const colors = {
  board_border: 'rgb(0,0,0)', // Black
  board_background: 'rgb(255,255,255)', // White
  snake_col: 'rgb(255,0,255)', // Purple
  snake_border: 'rgb(0,0,0)', // DarkPurple
  food_background: 'rgb(30,255,30)', // LightGreen
  food_border: 'rgb(0,0,0)',// DarkGreen
  wall_background: 'rgb(255,30,30)', // LightGreen
  wall_border: 'rgb(0,0,0)'// DarkGreen
};

// Keys used for playing
const keys = {
  up: 38,
  right: 39,
  down: 40,
  left: 37,
  w: 87,
  d: 68,
  s: 83,
  a: 65
};

function drawBlock(x, y, fill, stroke) {
  snakeboard_ctx.fillStyle = fill;
  snakeboard_ctx.strokestyle = stroke;
  snakeboard_ctx.fillRect(x, y, blockSize, blockSize);
  snakeboard_ctx.strokeRect(x, y, blockSize, blockSize);
}


// Score
let adder = parseInt(document.getElementById("scoreAdder").value);
let score = 0;
// True if changing direction
let changing_direction = false;
/* --- Food ---*/
let food_x;
let food_y;
/* --- Movement --- */
// Horizontal velocity
let dx = blockSize * 1;
// Vertical velocity
let dy = 0;
let walls = gen_walls();
// Start game
gen_food();
// main function called repeatedly to keep the game running
function main() {
  // Debug from HTML
  let speed = document.getElementById("tickrate").value;
  adder = parseInt(document.getElementById("scoreAdder").value);

  // Endgame check
  if (has_game_ended()) {
    document.getElementById("Lose").style.visibility = "visible";
    return;
  } else {
    changing_direction = false;
    if(walls.length == score + 1) walls.push(gen_walls());
    else {
      if(walls.length < score + 1) walls.push(gen_walls());
    }
    setTimeout(function onTick() {
      clear_board();
      for (var i = 0; i < walls.length; i++) {
        drawBlock(walls[i][0], walls[i][1], colors.wall_background, colors.wall_border);
      }
      drawBlock(food_x, food_y, colors.food_background, colors.food_border);
      snake.forEach(part => drawBlock(part.x, part.y, colors.snake_col, colors.snake_border));
      move_snake();
      main();
    }, speed);
  }
}

// draw a border around the canvas
function clear_board() {
  snakeboard_ctx.fillStyle = colors.board_background;
  snakeboard_ctx.strokestyle = colors.board_border;
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}


// Generate a wall inside of the canvas
function gen_walls() {
  let wall_gen_x = random(blockSize,snakeboard.width - blockSize);
  let wall_gen_y = random(blockSize,snakeboard.width - blockSize);
  cords = [wall_gen_x,wall_gen_y];
  return cords;
}




function has_game_ended() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  for (var i = 0; i < walls.length; i++) {
    if (snake[0].x === walls[i][0] && snake[0].y === walls[i][1]) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.width - blockSize;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - blockSize;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function random(min, max) {
  return Math.round((Math.random() * (max-min) + min) / blockSize) * blockSize;
}

function gen_food() {
  let inArray = false;
  let temp_food_x = random(blockSize,snakeboard.width - blockSize);
  let temp_food_y = random(blockSize,snakeboard.height - blockSize);
  for (var position = 0; position < walls.length; position++) {
    if(inArray) break;
    if(walls[position][0] == temp_food_x && walls[position][1] == temp_food_y) {
       inArray = true;
       break;
    } else {
      inArray = false;
    }
  }
  if(!inArray) {
    food_x = temp_food_x;
    food_y = temp_food_y;
    snake.forEach(function has_snake_eaten_food(part) {
      const has_eaten = part.x == food_x && part.y == food_y;
      if (has_eaten) gen_food();
    });
  } else {
    gen_food();
  }
}

function change_direction(event) {
// Prevent the snake from reversing
  if (changing_direction) return;
  changing_direction = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -blockSize;
  const goingDown = dy === blockSize;
  const goingRight = dx === blockSize;
  const goingLeft = dx === -blockSize;
  if (keyPressed === keys.left && !goingRight || keyPressed === keys.a && !goingRight) {
    dx = -blockSize;
    dy = 0;
  }
  if (keyPressed === keys.up && !goingDown || keyPressed === keys.w && !goingDown) {
    dx = 0;
    dy = -blockSize;
  }
  if (keyPressed === keys.right && !goingLeft || keyPressed === keys.d && !goingLeft) {
    dx = blockSize;
    dy = 0;
  }
  if (keyPressed === keys.down && !goingUp || keyPressed === keys.s && !goingUp) {
    dx = 0;
    dy = blockSize;
  }
}

function move_snake() {
  // Create the new Snake's head
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };
  // Add the new head to the beginning of snake body
  snake.unshift(head);
  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    score += adder;
    document.getElementById('score').innerHTML = score;
    // Generate new food location
    gen_food();
  } else {
    snake.pop();
  }
}

function prepBoard() {
  drawBlock(0, 0, colors.snake_col, colors.snake_border);
}
