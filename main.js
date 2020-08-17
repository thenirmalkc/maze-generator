let cellSize = 16;
let size = 36;
let width = cellSize * size + 40;
let height = cellSize * size + 40;
let maze = [];
let stack = [];
let mazeType = 1;
let mazeTypeName = 'Dead Ends Maze';

const generateMaze = () => {
  for (let row = 0; row < size; row++) {
    maze.push([]);
    for (let col = 0; col < size; col++) {
      maze[row].push({
        row,
        col,
        visited: false,
        topWall: true,
        downWall: true,
        leftWall: true,
        rightWall: true
      });
    }
  }
};

const getNeighbours = ({ row, col }) => {
  const neighbours = [];
  if (row > 0) neighbours.push(maze[row - 1][col]);
  if (row < size - 1) neighbours.push(maze[row + 1][col]);
  if (col > 0) neighbours.push(maze[row][col - 1]);
  if (col < size - 1) neighbours.push(maze[row][col + 1]);
  return neighbours;
};

const getdeadEndCell = () => {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      let count = 0;
      const { topWall, downWall, leftWall, rightWall } = maze[row][col];
      if (topWall) count++;
      if (downWall) count++;
      if (leftWall) count++;
      if (rightWall) count++;
      if (count > 2) return maze[row][col];
    }
  }
};

const getWallRemovableNeighbours = ({ row, col, topWall, downWall, leftWall, rightWall }) => {
  const wallRemovableNeighbours = [];
  if (row > 0 && topWall) wallRemovableNeighbours.push(maze[row - 1][col]);
  if (row < size - 1 && downWall) wallRemovableNeighbours.push(maze[row + 1][col]);
  if (col > 0 && leftWall) wallRemovableNeighbours.push(maze[row][col - 1]);
  if (col < size - 1 && rightWall) wallRemovableNeighbours.push(maze[row][col + 1]);
  return wallRemovableNeighbours;
};

const getRandomWallRemovableNeighbour = ({ row, col, topWall, downWall, leftWall, rightWall }) => {
  const randomWallRemovableNeighbours = getWallRemovableNeighbours({ row, col, topWall, downWall, leftWall, rightWall });
  return randomWallRemovableNeighbours[floor(random() * randomWallRemovableNeighbours.length)];
};

const getUnvsitedNeighbours = ({ row, col }) => {
  const unvisitedNeighbours = [];
  const neighbours = getNeighbours({ row, col });
  for (const neighbour of neighbours) {
    if (!neighbour.visited) unvisitedNeighbours.push(neighbour);
  }
  return unvisitedNeighbours;
};

const getRandomUnvisitedNeighbour = ({ row, col }) => {
  const unvisitedNeighbours = getUnvsitedNeighbours({ row, col });
  return unvisitedNeighbours[floor(random() * unvisitedNeighbours.length)];
};

const drawWalls = () => {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const { topWall, downWall, leftWall, rightWall } = maze[row][col];
      fillCell({ row, col }, 'white');
      stroke('gray');
      if (topWall) line(col * cellSize + 20, row * cellSize + 20, col * cellSize + cellSize + 20, row * cellSize + 20);
      if (downWall) line(col * cellSize + 20, row * cellSize + cellSize + 20, col * cellSize + cellSize + 20, row * cellSize + cellSize + 20);
      if (leftWall) line(col * cellSize + 20, row * cellSize + 20, col * cellSize + 20, row * cellSize + cellSize + 20);
      if (rightWall) line(col * cellSize + cellSize + 20, row * cellSize + 20, col * cellSize + cellSize + 20, row * cellSize + cellSize + 20);
    }
  }
};

const fillCell = ({ row, col }, color) => {
  noStroke();
  fill(color);
  rect(col * cellSize + 20, row * cellSize + 20, cellSize, cellSize);
};

const drawWall = ({ row, col, topWall, downWall, leftWall, rightWall }) => {
  stroke('gray');
  if (topWall) line(col * cellSize + 20, row * cellSize + 20, col * cellSize + cellSize + 20, row * cellSize + 20);
  if (downWall) line(col * cellSize + 20, row * cellSize + cellSize + 20, col * cellSize + cellSize + 20, row * cellSize + cellSize + 20);
  if (leftWall) line(col * cellSize + 20, row * cellSize + 20, col * cellSize + 20, row * cellSize + cellSize + 20);
  if (rightWall) line(col * cellSize + cellSize + 20, row * cellSize + 20, col * cellSize + cellSize + 20, row * cellSize + cellSize + 20);
};

const removeWall = (previousCell, currentCell) => {
  const row = currentCell.row - previousCell.row;
  const col = currentCell.col - previousCell.col;
  if (row == -1) {
    previousCell.topWall = false;
    currentCell.downWall = false;
  } else if (row == 1) {
    previousCell.downWall = false;
    currentCell.topWall = false;
  } else if (col == -1) {
    previousCell.leftWall = false;
    currentCell.rightWall = false;
  } else if (col == 1) {
    previousCell.rightWall = false;
    currentCell.leftWall = false;
  }
};

const dfs = () => {
  const top = stack[stack.length - 1];
  top.visited = true;
  const unvisitedNeighbour = getRandomUnvisitedNeighbour(top);
  if (unvisitedNeighbour) {
    stack.push(unvisitedNeighbour);
    removeWall(top, unvisitedNeighbour);
    fillCell(top, 'lime');
    fillCell(unvisitedNeighbour, 'orangered');
    drawWall(top);
    drawWall(unvisitedNeighbour);
  } else {
    const poped = stack.pop();
    fillCell(poped, 'white');
    drawWall(poped);
  }
};

const removeDeadEnd = deadEndCell => {
  const randomWallRemovableNeighbour = getRandomWallRemovableNeighbour(deadEndCell);
  removeWall(deadEndCell, randomWallRemovableNeighbour);
  fillCell(deadEndCell, 'white');
  fillCell(randomWallRemovableNeighbour, 'white');
  drawWall(deadEndCell);
  drawWall(randomWallRemovableNeighbour);
};

function setup() {
  const canvas = createCanvas(width, height);
  canvas.position(windowWidth / 2 - width / 2, 10);
  background('silver');
  textSize(18);
  textAlign('center');
  noStroke();
  fill('DarkSlateGray');
  text(mazeTypeName, width / 2, 16);
  generateMaze();
  drawWalls();
  stack.push(maze[0][0]);
  const top = stack[stack.length - 1];
  removeWall(maze[2][0], maze[1][0]);
}

function draw() {
  if (mazeType == 1) {
    if (stack.length) return dfs();
    setTimeout(() => {
      maze = [];
      mazeType = 2;
      mazeTypeName = 'No Dead Ends Maze';
      setup();
    }, 2000);
    mazeType = null;
  } else if (mazeType == 2) {
    if (stack.length) return dfs();
    const deadEndCell = getdeadEndCell();
    if (deadEndCell) return removeDeadEnd(deadEndCell);
    setTimeout(() => {
      maze = [];
      mazeType = 1;
      mazeTypeName = 'Dead Ends Maze';
      setup();
    }, 2000);
    mazeType = null;
  }
}
