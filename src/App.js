import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
   constructor(props) {
     super(props);
     this.state = {
      gridWidth: 50,
      gridHeight: 70
     }
   }

   changeGridWidth = newWidth => {
      this.setState({
        gridWidth: newWidth
      });
   };

   changeGridHeight = newHeight => {
    this.setState({
      gridHeight: newHeight
    });
   };
  
  render() {
    const cellSize = 9;
    let gridWidthSize = cellSize * this.state.gridWidth;
    let gridWidthPixels = gridWidthSize + 'px';
    const gridStyles = {
      width: gridWidthPixels
    };
    return(
      <div style={gridStyles} className="game-container">
        <Game width={this.state.gridWidth} height={this.state.gridHeight} updateHeight={this.changeGridHeight}/>
      </div>
    );
  }
};

class ControlButtons extends Component {
  constructor(props) {
    super(props);
  }

  changeHeightToOneHundred = () => {
    this.props.updateHeight(100);
  };

  render() {
    return (
        <div className="control-buttons">
          <button className="heightUpdate" onClick={this.changeHeightToOneHundred}></button>
        </div>
    );
  }
};

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridSize: this.props.width * this.props.height,
      grid: [],
      generationCount: 0
    };
  }
  
  componentWillMount() {
    this.createNewBoard();
  };
  
  //createBoard
  createNewBoard = () => {
    let initialGrid = [];
    for (var i = 0; i < this.state.gridSize; i++) {
      let element = Math.floor(Math.random() * 2);
      initialGrid.push(element);
    }
    this.setState({ 
        grid: initialGrid
    });
    setInterval(() => {this.nextGeneration()}, 500);
  };
    
  //run next generation
  nextGeneration = () => {
    let futureGrid = [];
     for (var i = 0; i < this.state.gridSize; i++) {
      futureGrid.push(this.compareCell(i));
    } 

    this.setState({
      grid: futureGrid
    });
  };
  
  //cell compare to neighbor
  compareCell = index => {
    let aliveNeighborCount = 0;
    let currentCell = this.state.grid[index];
    let currentGrid = this.state.grid;
    const row = Number(this.props.width);
    const height = Number(this.props.height);
    //check whether cell is top left corner
    if (index === 0) {
      if (currentGrid[1] === 0) aliveNeighborCount++;
      if (currentGrid[row] === 0) aliveNeighborCount++;
      if (currentGrid[row + 1] === 0) aliveNeighborCount++;
     //top right corner 
    } else if (index === row - 1) {
      if (currentGrid[row - 2] === 0) aliveNeighborCount++;
      if (currentGrid[2 * row - 2] === 0) aliveNeighborCount++;
      if (currentGrid[2 * row - 1] === 0) aliveNeighborCount++;
      
    //bottom left corner  
    } else if (index === (row * height) - row) {
      if (currentGrid[row * height - 2*row] === 0) aliveNeighborCount++;
      if (currentGrid[row * height - 2 * row + 1] === 0) aliveNeighborCount++;
      if (currentGrid[row * height - row + 1] === 0) aliveNeighborCount++;
    //bottom right corner  
    } else if (index === (row * height) - 1) {
      if (currentGrid[row * height - row - 2] === 0) aliveNeighborCount++;
      if (currentGrid[row * height - row - 1] === 0) aliveNeighborCount++;
      if (currentGrid[row * height - 2] === 0) aliveNeighborCount++;
    //check whether cell is first row
    } else if (index < row) {
      if (currentGrid[index - 1] === 0) aliveNeighborCount++;
      if (currentGrid[index + 1] === 0) aliveNeighborCount++;
      if (currentGrid[index + row - 1] === 0) aliveNeighborCount++;
      if (currentGrid[index + row] === 0) aliveNeighborCount++;
      if (currentGrid[index + row + 1] === 0) aliveNeighborCount++;
      //bottom row
    } else if (index > (row * height) - row - 1) {
      if (currentGrid[index - 1] === 0) aliveNeighborCount++;
      if (currentGrid[index + 1] === 0) aliveNeighborCount++;
      if (currentGrid[index - row - 1] === 0) aliveNeighborCount++;
      if (currentGrid[index - row] === 0) aliveNeighborCount++;
      if (currentGrid[index - row + 1] === 0) aliveNeighborCount++;
      //check left column
    } else if (index % (row) === 0) {
      if (currentGrid[index + row] === 0) aliveNeighborCount++;
      if (currentGrid[index - row] === 0) aliveNeighborCount++;
      if (currentGrid[index + row + 1] === 0) aliveNeighborCount++;
      if (currentGrid[index + 1] === 0) aliveNeighborCount++;
      if (currentGrid[index - row + 1] === 0) aliveNeighborCount++;
      //check right column
    } else if (index % row === (row - 1)) {
      if (currentGrid[index + row] === 0) aliveNeighborCount++;
      if (currentGrid[index - row] === 0) aliveNeighborCount++;
      if (currentGrid[index + row - 1] === 0) aliveNeighborCount++;
      if (currentGrid[index - 1] === 0) aliveNeighborCount++;
      if (currentGrid[index - row - 1] === 0) aliveNeighborCount++;
      //all neighbor count
    } else {
      if (currentGrid[index + row] === 0) aliveNeighborCount++;
      if (currentGrid[index - row] === 0) aliveNeighborCount++;
      if (currentGrid[index + 1] === 0) aliveNeighborCount++;
      if (currentGrid[index - 1] === 0) aliveNeighborCount++;
      if (currentGrid[index + row + 1] === 0) aliveNeighborCount++;
      if (currentGrid[index - row + 1] === 0) aliveNeighborCount++;
      if (currentGrid[index + row - 1] === 0) aliveNeighborCount++;
      if (currentGrid[index - row - 1] === 0) aliveNeighborCount++;
    }
    
    if (currentCell === 0) {
        if (aliveNeighborCount === 2 || aliveNeighborCount === 3) {
          // if 2 or 3 alive neighbors, stays alive
          return 0;
        } else {
          // else cell dies due to over/under population
          return 1;
        }
      } else if (currentCell === 1) {
        if (aliveNeighborCount === 3) {
          // if 3 alive neighbors, dead cell becomes alive
          return 0;
        } else {
          // if not exactly 3 alive neighbors, dead cell stays dead
          return 1;
        }
      }
  };
  
  render() {
    let gridStructure = '';
    if (this.state.grid !== 'undefined') {
       gridStructure = this.state.grid.map((cell, i) => {
        const cellStatus = cell === 0 ? "alive" : "dead";
        return (<Cell status={cellStatus} index={i} key={i} />)
      });
    }
    return (
     <div>{gridStructure}
     <ControlButtons updateHeight={this.props.updateHeight} updateWidth={this.changeGridWidth} />
     </div>
    );
  }
};

class Cell extends Component {
  constructor(props) {
    super();
  }
  render() {
    const cellClasses = "cell " + this.props.status + " cell" + this.props.index;
    const aliveStyle = {
      backgroundColor: 'red'
    };
    const deadStyle = {
      backgroundColor: 'white' 
    };
    return (
      <div className={cellClasses} style={this.props.status === 'alive' ? aliveStyle : deadStyle}></div>
    );
  }
};

export default App;
