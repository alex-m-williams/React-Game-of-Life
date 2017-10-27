import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
   constructor(props) {
     super(props);
   }
  
  render() {
    const titleStyle = {
        fontSize: '48px',
        textAlign: 'center'
    };
    return(
      <div>
        <div className="title" style={titleStyle}>Conway's Game of Life</div>
        <Game />
      </div>
    );
  }
};

class ControlButtons extends Component {
  constructor(props) {
    super(props);
  }

  changeSpecs = (width, height) => {
    this.props.updateSpecs(width, height);
  };

  render() {
    return (
        <div className="control-buttons">
          <button className="heightUpdate" onClick={() => this.changeSpecs(70, 50)}>70x50</button>
          <button className="heightUpdate" onClick={() => this.changeSpecs(50, 30)}>50x30</button>
          <button className="heightUpdate" onClick={() => this.changeSpecs(50, 50)}>50x50</button>
          <button className="pauseToggle" onClick={() => this.props.pause()}>{this.props.pauseToggle ? "Resume" : "Pause"}</button>
          <button className="clear" onClick={() => this.props.clear()}>{this.props.boardCleared ? "Start" : "Clear"}</button>
        </div>
    );
  }
};

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridWidth: 70,
      gridHeight: 50,
      gridSize: 3500,
      grid: [],
      generationCount: 0,
      iterationSpeed: 250,
      timer: null,
      pauseToggle: false,
      boardCleared: false
    };
  }
  
  componentWillMount() {
    this.createNewBoard();
  };

  updateGameGridSize = (width, height) => {
    clearInterval(this.state.timer);
    this.setState({
      grid: [],
      gridWidth: width,
      gridHeight: height,
      gridSize: width * height,
      timer: null,
      pauseToggle: false
    });
    setTimeout(() => { 
      this.createNewBoard();
    }, 1000);
  };

  clear = () => {
    if (this.state.boardCleared) {
      let timer = setInterval(() => {this.nextGeneration()}, this.state.iterationSpeed);

      this.setState({
        timer: timer,
        boardCleared: false
      });
    } else {
      clearInterval(this.state.timer);
      let emptiedGrid = [...this.state.grid];
      for (var i = 0; i < emptiedGrid.length; i++) {
        emptiedGrid[i] = 1;
      }
      this.setState({
        grid: emptiedGrid,
        timer: null,
        pauseToggle: false,
        boardCleared: true
      });
    }
  };

  togglePause = () => {
    if (this.state.pauseToggle) {
      let timer = setInterval(() => {this.nextGeneration()}, this.state.iterationSpeed);

      this.setState({
        timer: timer
      });
    } else {
      clearInterval(this.state.timer);
      this.setState({
        pauseToggle: !this.state.pauseToggle
      });
    }
  };
  
  //createBoard
  createNewBoard = () => {
    let grid = [];
    for (var i = 0; i < this.state.gridSize; i++) {
      let element = Math.floor(Math.random() * 2);
      grid.push(element);
    }
    
    this.setState({
        grid: grid,
        generationCount: 0
    });

    let timer = setInterval(() => {this.nextGeneration()}, this.state.iterationSpeed);

    this.setState({
      timer: timer
    });
  };
    
  //run next generation
  nextGeneration = () => {
    let futureGrid = [...this.state.grid];
    for (var i = 0; i < this.state.gridSize; i++) {
      futureGrid[i] = this.compareCell(i);
    }

    this.setState({
      grid: futureGrid,
      generationCount: this.state.generationCount + 1
    });
  };
  
  //cell compare to neighbor
  compareCell = index => {
    let aliveNeighborCount = 0;
    let currentCell = this.state.grid[index];
    let currentGrid = this.state.grid;
    const row = Number(this.state.gridWidth);
    const height = Number(this.state.gridHeight);
    if (index < row || index > (row * height) - row - 1) {
      //check whether cell is top left corner
        if (index === 0) {
          if (currentGrid[1] === 0 || currentGrid[1] === 2) aliveNeighborCount++;
          if (currentGrid[row] === 0 || currentGrid[row] === 2) aliveNeighborCount++;
          if (currentGrid[row + 1] === 0 || currentGrid[row + 1] === 2) aliveNeighborCount++;
         //top right corner 
        } else if (index === row - 1) {
          if (currentGrid[row - 2] === 0 || currentGrid[row - 2] === 2) aliveNeighborCount++;
          if (currentGrid[2 * row - 2] === 0 || currentGrid[2 * row - 2] === 2) aliveNeighborCount++;
          if (currentGrid[2 * row - 1] === 0 || currentGrid[2 * row - 1] === 2) aliveNeighborCount++;
          
        //bottom left corner  
        } else if (index === (row * height) - row) {
          if (currentGrid[row * height - 2 * row] === 0 || currentGrid[row * height - 2 * row] === 2) aliveNeighborCount++;
          if (currentGrid[row * height - 2 * row + 1] === 0 || currentGrid[row * height - 2 * row + 1] === 2) aliveNeighborCount++;
          if (currentGrid[row * height - row + 1] === 0 || currentGrid[row * height - row + 1] === 2) aliveNeighborCount++;
        //bottom right corner  
        } else if (index === (row * height) - 1) {
          if (currentGrid[row * height - row - 2] === 0 || currentGrid[row * height - row - 2] === 2) aliveNeighborCount++;
          if (currentGrid[row * height - row - 1] === 0 || currentGrid[row * height - row - 1] === 2) aliveNeighborCount++;
          if (currentGrid[row * height - 2] === 0 || currentGrid[row * height - 2] === 2) aliveNeighborCount++;
        //check whether cell is first row
        } else if (index < row) {
          if (currentGrid[index - 1] === 0 || currentGrid[index - 1] === 2) aliveNeighborCount++;
          if (currentGrid[index + 1] === 0 || currentGrid[index + 1] === 2) aliveNeighborCount++;
          if (currentGrid[index + row - 1] === 0 || currentGrid[index + row - 1] === 2) aliveNeighborCount++;
          if (currentGrid[index + row] === 0 || currentGrid[index + row] === 2) aliveNeighborCount++;
          if (currentGrid[index + row + 1] === 0 || currentGrid[index + row + 1] === 2) aliveNeighborCount++;
          //bottom row
        } else if (index > (row * height) - row - 1) {
          if (currentGrid[index - 1] === 0 || currentGrid[index - 1] === 2) aliveNeighborCount++;
          if (currentGrid[index + 1] === 0 || currentGrid[index + 1] === 2) aliveNeighborCount++;
          if (currentGrid[index - row - 1] === 0 || currentGrid[index - row - 1] === 2) aliveNeighborCount++;
          if (currentGrid[index - row] === 0 || currentGrid[index - row] === 2) aliveNeighborCount++;
          if (currentGrid[index - row + 1] === 0 || currentGrid[index - row + 1] === 2) aliveNeighborCount++;
        } 
      } else {
        //check left column
        if (index % (row) === 0) {
          if (currentGrid[index + row] === 0 || currentGrid[index + row] === 2) aliveNeighborCount++;
          if (currentGrid[index - row] === 0 || currentGrid[index - row] === 2) aliveNeighborCount++;
          if (currentGrid[index + row + 1] === 0 || currentGrid[index + row + 1] === 2) aliveNeighborCount++;
          if (currentGrid[index + 1] === 0 || currentGrid[index + 1] === 2) aliveNeighborCount++;
          if (currentGrid[index - row + 1] === 0 || currentGrid[index - row + 1] === 2) aliveNeighborCount++;
          //check right column
        } else if (index % row === (row - 1)) {
          if (currentGrid[index + row] === 0 || currentGrid[index + row] === 2) aliveNeighborCount++;
          if (currentGrid[index - row] === 0 || currentGrid[index - row] === 2) aliveNeighborCount++;
          if (currentGrid[index + row - 1] === 0 || currentGrid[index + row - 1] === 2) aliveNeighborCount++;
          if (currentGrid[index - 1] === 0 || currentGrid[index - 1] === 2) aliveNeighborCount++;
          if (currentGrid[index - row - 1] === 0 || currentGrid[index - row - 1] === 2) aliveNeighborCount++;
          //all neighbor count
        } else {
          if (currentGrid[index + row] === 0 || currentGrid[index + row] === 2) aliveNeighborCount++;
          if (currentGrid[index - row] === 0 || currentGrid[index - row] === 2) aliveNeighborCount++;
          if (currentGrid[index + 1] === 0 || currentGrid[index + 1] === 2) aliveNeighborCount++;
          if (currentGrid[index - 1] === 0 || currentGrid[index - 1] === 2) aliveNeighborCount++;
          if (currentGrid[index + row + 1] === 0 || currentGrid[index + row + 1] === 2) aliveNeighborCount++;
          if (currentGrid[index - row + 1] === 0 || currentGrid[index - row + 1] === 2) aliveNeighborCount++;
          if (currentGrid[index + row - 1] === 0 || currentGrid[index + row - 1] === 2) aliveNeighborCount++;
          if (currentGrid[index - row - 1] === 0 || currentGrid[index - row - 1] === 2) aliveNeighborCount++;
        }
      }
    
    if (currentCell === 0) {
        if (aliveNeighborCount === 2 || aliveNeighborCount === 3) {
          // if 2 or 3 alive neighbors, stays alive
          return 0;
        } else {
          // else cell dies due to over/under population
          return 1;
        }
    } else if (currentCell === 2) {
        if (aliveNeighborCount === 2 || aliveNeighborCount === 3) {
          return 0;
        } else {
          // else cell dies due to over/under population
          return 1;
        }
    } else if (currentCell === 1) {
        if (aliveNeighborCount === 3) {
          // if 3 alive neighbors, dead cell becomes alive
          return 2;
        } else {
          // if not exactly 3 alive neighbors, dead cell stays dead
          return 1;
        }
    }
  };

  modifyCell = index => {
    if (this.state.boardCleared) {
      let currentCell = this.state.grid[index];
      let currentGrid = this.state.grid;
      let modifiedGrid = [...this.state.grid];
      if (currentCell === 0) {
        modifiedGrid[index] = 1;
      } else {
        modifiedGrid[index] = 0;
      }
      this.setState({
        grid: modifiedGrid
      });
    }
  };
  
  render() {
    const cellSize = 9;
    let gridWidthSize = cellSize * this.state.gridWidth;
    let gridHeightSize = cellSize * this.state.gridHeight;
    let gridWidthPixels = gridWidthSize + 'px';
    let gridHeightPixels = gridHeightSize + 'px';
    const gridStyles = {
      width: gridWidthPixels,
      height: gridHeightPixels
    };
    const generatingMessageStyles = {
      height: gridHeightPixels,
      textAlign: 'center',
      fontSize: '40px',
      paddingTop: gridHeightSize / 2
    }

    let gridStructure = '';
    
    const aliveStyle = {
      backgroundColor: 'red'
    };

    const deadStyle = {
      backgroundColor: 'beige' 
    };

    const aliveOldStyle = {
      backgroundColor: 'purple'
    };

    if (this.state.grid.length === 0) {
      gridStructure = (<div style={generatingMessageStyles}>Generating new board</div>);
    } else {
      gridStructure = this.state.grid.map((cell, i) => {
          const cellStatus = cell === 0 ? "alive" : cell === 1 ? "dead" : "old alive";
          const cellClasses = "cell " + cellStatus;
          const cellStyle = cellStatus === 'alive' ? aliveStyle : cellStatus === 'old alive' ? aliveOldStyle : deadStyle;
          return (<div key={i} className={cellClasses} style={cellStyle} onClick={() => this.modifyCell(i)}></div>)
      });
    }
    return (
     <div style={gridStyles} className="game-container">
        <div className="game-cells" key="grid-struc" style={gridStyles}>{gridStructure}</div>
        <ControlButtons updateSpecs={this.updateGameGridSize} pause={this.togglePause} pauseToggle={this.state.pauseToggle} clear={this.clear} boardCleared={this.state.boardCleared}/>
        <span>Generation: {this.state.generationCount}</span>
     </div>
    );
  }
};

export default App;
