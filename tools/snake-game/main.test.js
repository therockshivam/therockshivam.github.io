const { createGrid, updateSnake, generateFood, startGame, stopGame } = require('./main');

describe('Snake Game', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="grid"></div>';
    createGrid();
  });

  test('should create a grid with 50 rows and 50 columns', () => {
    const grid = document.getElementById('grid');
    expect(grid.children.length).toBe(2500);
  });

  test('should generate food at a random position', () => {
    generateFood();
    const foodCell = document.querySelector('.food');
    expect(foodCell).not.toBeNull();
  });

  test('should start the game and move the snake', () => {
    startGame();
    const initialHead = { ...snake[0] };
    setTimeout(() => {
      expect(snake[0]).not.toEqual(initialHead);
      stopGame();
    }, 150);
  });
});
