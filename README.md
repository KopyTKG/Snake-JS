# Snake-JS
 Snake Game as school project
***
### Created By Kopy.TKG
***
### **Needed**
- **bootstrap**

***
### **Included**
- index.html
- bootstrap
- js -> jquery.js
- js.js //*Adding event listener*
- game.script.js //*main game logic*
***
### **Code**

* *Colors*
```javascript
//Colors Used in the game
const colors = {
// border
    board_border: 'rgb(0,0,0)',
    board_background: 'rgb(255,255,255)',
// snake
    snake_col: 'rgb(255,0,255)',
    snake_border: 'rgb(230,0,230)',
// food
    food_background: 'rgb(30,255,30)',
    food_border: 'rgb(0,230,0)',
// walls
    wall_background: 'rgb(255,30,30)',
    wall_border: 'rgb(0,0,0)'
}
```

* *keys*
```javascript
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
```

* **document.event()**
```javascript
document.addEventListener("keydown", change_direction);
```
* #### ***document.event() calls***
  * **change_direction()**
  ```javascript
  function change_direction(event) {
  // Prevent the snake from reversing
      if (changing_direction) return;
  // direction change
      changing_direction = true;
  // Get value of the key
      const keyPressed = event.keyCode;
    // direction of movement
      const goingUp = dy === -10;
      const goingDown = dy === 10;
      const goingRight = dx === 10;
      const goingLeft = dx === -10;
    // Direction check
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
  ```
* **Walls generation**
```javascript
let walls = gen_walls(); // generate array of location for 10 walls
```
  * **gen_walls()**
  ```javascript
  function gen_walls() {
      walls_array = [];
      for (var i = 0; i < 10; i++) {
        cords = [random(snakeboard.width - 10), random(snakeboard.height - 10)];
        walls_array.push(cords);
      }
      return walls_array;
  }
  ```
* **main()**
```javascript
// main function called repeatedly to keep the game running
function main() {
    // Endgame check
    if (has_game_ended()) {
      document.getElementById("Lose").style.visibility = "visible";
      return;
    } else {
      // Not changing direction
      changing_direction = false;
      setTimeout(function onTick() {
        // Calls
        clear_board();
        drawFood();
        move_snake();
        drawSnake();
        // Draw all walls
        for (var i = 0; i < walls.length; i++) {
          drawWalls(walls[i][0], walls[i][1]);
        }
        // Repeat
        main();
      }, 100);
    }
}
```

* #### ***Main calls***

  * **has_game_ended()**
  ```javascript
  function has_game_ended() {
    // Self hit check
      for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
      }
    // Checks for contact with wall
      for (var i = 0; i < walls.length; i++) {
        if (snake[0].x === walls[i][0] && snake[0].y === walls[i][1]) return true
      }
    // Wall hit check
      const hitLeftWall = snake[0].x < 0;
      const hitRightWall = snake[0].x > snakeboard.width - 10;
      const hitToptWall = snake[0].y < 0;
      const hitBottomWall = snake[0].y > snakeboard.height - 10;
      return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
  }
  ```

  * **clear_board()**
  ```javascript
  function clear_board() {
    //Color setting
      snakeboard_ctx.fillStyle = colors.board_background;
      snakeboard_ctx.strokestyle = colors.board_border;
    //Draw border
      snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
      snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
  }
  ```

  * **drawFood()**
  ```javascript
  function drawFood() {
    //Color settings
      snakeboard_ctx.fillStyle = colors.food_background;
      snakeboard_ctx.strokestyle = colors.food_border;
    //Draw
      snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
      snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
  }
  ```

  * **move_snake()**
  ```javascript
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
        score += adder; // adder is const on top = 1
        document.getElementById('score').innerHTML = score;
      // Generate new food location
        gen_food();
      } else {
        snake.pop();
      }
  }
  ```

  * **drawSnake()**
  ```javascript
  function drawSnake() {
    // Draw each part
      snake.forEach(drawSnakePart)
  }
  ```

  * **drawSnakePart()**
  ```javascript
    function drawSnakePart(snakePart) {
    //Color settings
        snakeboard_ctx.fillStyle = colors.snake_col;
        snakeboard_ctx.strokestyle = colors.snake_border;
    // Draw
        snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
        snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }
  ```
  * **drawWalls()**
  ```javascript
  function drawWalls(wall_X, wall_Y) {
      snakeboard_ctx.fillStyle = colors.wall_background;
      snakeboard_ctx.strokestyle = colors.wall_border;
      snakeboard_ctx.fillRect(wall_X, wall_Y, 10, 10);
      snakeboard_ctx.strokeRect(wall_X, wall_Y, 10, 10);
  }
  ```
