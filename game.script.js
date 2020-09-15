const snakeboard = document.getElementById("snakeboard");
const snakeboard_ctx = snakeboard.getContext("2d");

document.addEventListener("keydown", change_direction);
// Snake and his body
let snake = [
  {x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200},
  {x: 160, y: 200}
]
// Colors used in game
const colors = {
  board_border: 'rgb(0,0,0)', // Black
  board_background: 'rgb(255,255,255)', // White
  snake_col: 'rgb(255,0,255)', // Purple
  snake_border: 'rgb(230,0,230)', // DarkPurple
  food_background: 'rgb(30,255,30)', // LightGreen
  food_border: 'rgb(0,230,0)',// DarkGreen
  wall_background: 'rgb(255,30,30)', // LightGreen
  wall_border: 'rgb(0,0,0)'// DarkGreen
}

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
}
// Score
const adder = 1;
let score = 0;
let lastScore = 0;
// True if changing direction
let changing_direction = false;
/* --- Food ---*/
let food_x;
let food_y;
/* --- Movement --- */
// Horizontal velocity
let dx = 10;
// Vertical velocity
let dy = 0;
let walls = gen_walls();
// Start game
gen_food();
// main function called repeatedly to keep the game running
function main() {
  // Endgame check
  if (has_game_ended()) {
    document.getElementById("Lose").style.visibility = "visible";
    return;
  } else {
    changing_direction = false;
    if(walls.length == score + 1) walls.push(gen_walls());
    setTimeout(function onTick() {
      clear_board();
      drawFood();
      move_snake();
      drawSnake();
      for (var i = 0; i < walls.length; i++) {
        drawWalls(walls[i][0], walls[i][1]);
      }
      // Repeat
      main();
    }, 100);
  }
}

// draw a border around the canvas
function clear_board() {
  //  Select the colour to fill the drawing
  snakeboard_ctx.fillStyle = colors.board_background;
  //  Select the colour for the border of the canvas
  snakeboard_ctx.strokestyle = colors.board_border;
  // Draw a "filled" rectangle to cover the entire canvas
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  // Draw a "border" around the entire canvas
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function drawWalls(wall_X, wall_Y) {
  snakeboard_ctx.fillStyle = colors.wall_background;
  snakeboard_ctx.strokestyle = colors.wall_border;
  snakeboard_ctx.fillRect(wall_X, wall_Y, 10, 10);
  snakeboard_ctx.strokeRect(wall_X, wall_Y, 10, 10);
}
// Draw the snake on the canvas
function drawSnake() {
  // Draw each part
  snake.forEach(drawSnakePart)
}

function drawFood() {
  snakeboard_ctx.fillStyle = colors.food_background;
  snakeboard_ctx.strokestyle = colors.food_border;
  snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
  snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

function gen_walls() {
  cords = [random(snakeboard.width - 10), random(snakeboard.height - 10)];
  return cords;
}

// Draw one snake part
function drawSnakePart(snakePart) {
  // Set the colour of the snake part
  snakeboard_ctx.fillStyle = colors.snake_col;
  // Set the border colour of the snake part
  snakeboard_ctx.strokestyle = colors.snake_border;
  // Draw a "filled" rectangle to represent the snake part at the coordinates
  // the part is located
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  // Draw a border around the snake part
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function has_game_ended() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
  }
  for (var i = 0; i < walls.length; i++) {
    if (snake[0].x === walls[i][0] && snake[0].y === walls[i][1]) return true
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeboard.width - 10;
  const hitToptWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeboard.height - 10;
  return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

function random(max) {
  return Math.round((Math.random() * (max-0) + 0) / 10) * 10;
}

function gen_food() {
  food_x = random(snakeboard.width - 20);
  food_y = random(snakeboard.height - 20);
  // if the new food location is where the snake currently is, generate a new food location
  snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) gen_food();
  });
}

function change_direction(event) {
// Prevent the snake from reversing
  if (changing_direction) return;
  changing_direction = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (keyPressed === keys.left && !goingRight || keyPressed === keys.a && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === keys.up && !goingDown || keyPressed === keys.w && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === keys.right && !goingLeft || keyPressed === keys.d && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === keys.down && !goingUp || keyPressed === keys.s && !goingUp) {
    dx = 0;
    dy = 10;
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
