const grid = document.getElementById("grid");
const rows = 50, cols = 50;
const cells = [];
let snake = [{ row: 25, col: 25 }]; 
let direction = "right"; 
let gameInterval;
let food; // Declare food globally

function createGrid() {
    for (let r = 0; r < rows; r++) {
        cells[r] = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            grid.appendChild(cell);
            cells[r][c] = cell;
        }
    }
}

function eat(){
    let tail = { ...snake[snake.length - 1] };
    snake.push(tail);
}

function loss(){
    if(snake.length > 1){
        snake.pop(); // Removes last segment of the snake
    }
}

function updateSnake() {
    // Clear previous snake
    document.querySelectorAll(".snake").forEach(cell => cell.classList.remove("snake"));

    // Snake head movement
    let head = { ...snake[0] };
    if (direction === "up") head.row--;
    else if (direction === "down") head.row++;
    else if (direction === "left") head.col--;
    else if (direction === "right") head.col++;

    // Wrap around the grid
    if (head.row < 0) head.row = rows - 1;
    if (head.row >= rows) head.row = 0;
    if (head.col < 0) head.col = cols - 1;
    if (head.col >= cols) head.col = 0;

    // Check if snake eats food
    if (head.row === food.row && head.col === food.col) {
        eat(); // Grow the snake
        generateFood(); // Generate new food (removes old food automatically)
    } else {
        snake.pop(); // Remove last segment if no food eaten
    }

    // Add new head position
    snake.unshift(head);

    // Draw the new snake position
    snake.forEach(part => {
        cells[part.row][part.col].classList.add("snake");
    });

    // Draw new food
    cells[food.row][food.col].classList.add("food");
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "down") direction = "up";
    if (event.key === "ArrowDown" && direction !== "up") direction = "down";
    if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (event.key === "ArrowRight" && direction !== "left") direction = "right";
});

// Start Game
function startGame() {
    generateFood();
    updateSnake();
    gameInterval = setInterval(updateSnake, 100); // Move snake every 100ms
}

function stopGame() {
    clearInterval(gameInterval); 
}

function generateFood() {
    // Remove previous food
    document.querySelectorAll(".food").forEach(cell => cell.classList.remove("food"));

    let foodRow, foodCol;

    do {
        foodRow = Math.floor(Math.random() * 50); 
        foodCol = Math.floor(Math.random() * 50); 
    } while (snake.some(segment => segment.row === foodRow && segment.col === foodCol)); 

    food = { row: foodRow, col: foodCol }; 

    // Generate food
    cells[foodRow][foodCol].classList.add("food"); 
}

createGrid();

module.exports = {
    createGrid,
    updateSnake,
    generateFood,
    startGame,
    stopGame
};
