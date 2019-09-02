import React, { Component } from "react";

class Maze extends Component {
  state = {
    gridsX: 0,
    gridsY: 0,
    coordinates: [],
    center: 0,
    moves: 0,
    playStarted: false
  };

  componentDidMount = () => {
    let width;
    let height;
    if (this.state.coordinates.length <= 0 && !this.state.playStarted) {
      if (this.state.gridsX <= 0) {
        width = parseInt(prompt("Please enter board width"));
      }
      if (this.state.gridsY <= 0) {
        height = parseInt(prompt("Please enter board height"));
      }
      if (width !== null && height !== null && width > 0 && height > 0) {
        let center = Math.floor(this.weightedRandom(width * height - 1, 10));
        let coordinates = [];
        while (coordinates.length < Math.floor((width + height) / 2)) {
          let random = Math.floor(Math.random() * width * height);
          if (!coordinates.includes(random) && random !== center) {
            coordinates.push(random);
          }
        }
        this.setState(prevState => ({
          gridsX: width,
          gridsY: height,
          coordinates,
          center,
          playStarted: true
        }));
      }
      document.addEventListener("keydown", this.handleKeyDown);
    }
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.handleKeyDown);
  };

  handleKeyDown = event => {
    if (this.state.coordinates.length > 0) {
      switch (event.keyCode) {
        case 38:
          if (this.state.center - this.state.gridsX >= 0) {
            this.setState(
              prevState => ({
                center: prevState.center - this.state.gridsX,
                moves: prevState.moves + 1
              }),
              this.removeGreenDot(this.state.center)
            );
          }
          break;
        case 39:
          if ((this.state.center + 1) % this.state.gridsX !== 0) {
            this.setState(
              prevState => ({
                center: prevState.center + 1,
                moves: prevState.moves + 1
              }),
              this.removeGreenDot(this.state.center)
            );
          }
          break;
        case 40:
          if (
            this.state.center <
            this.state.gridsX * this.state.gridsY - this.state.gridsX
          ) {
            this.setState(
              prevState => ({
                center: prevState.center + this.state.gridsX,
                moves: prevState.moves + 1
              }),
              this.removeGreenDot(this.state.center)
            );
          }
          break;
        case 37:
          if (
            this.state.center !== 0 &&
            this.state.center % this.state.gridsX !== 0
          ) {
            this.setState(
              prevState => ({
                center: prevState.center - 1,
                moves: prevState.moves + 1
              }),
              this.removeGreenDot(this.state.center)
            );
          }
          break;
        default:
          break;
      }
    }
  };

  removeGreenDot = center => {
    let greenDots = this.state.coordinates;
    let newGreenDots = greenDots.filter(dot => dot !== center);
    this.setState(
      {
        coordinates: newGreenDots
      },
      function() {
        if (this.state.coordinates.length <= 0) {
          alert(`Total moves: ${this.state.moves}.`);
        }
      }
    );
  };

  weightedRandom = (max, numDice) => {
    let num = 0;
    for (let i = 0; i < numDice; i++) {
      num += Math.random() * (max / numDice);
    }
    return num;
  };

  totalGrids = () => {
    if (this.state.gridsX * this.state.gridsY > 0) {
      return this.state.gridsX * this.state.gridsY;
    }
    return 0;
  };

  totalGreenDots = () => {
    if (this.state.gridsX + this.state.gridsY >= 4) {
      return Math.floor((this.state.gridsX + this.state.gridsY) / 2);
    }
    return 0;
  };

  centerGrid = axis => {
    if (axis === "Y") {
      return `${Math.ceil(this.state.gridsX / 2)} / ${Math.ceil(
        this.state.gridsX / 2
      ) + 1}`;
    }
    return `${Math.ceil(this.state.gridsY / 2)} / ${Math.ceil(
      this.state.gridsY / 2
    ) + 1}`;
  };

  startGame = () => {
    this.setState({
      playStarted: false
    });
  };

  render() {
    return (
      <div
        className="maze-grid"
        style={{
          gridTemplateColumns: `repeat(${this.state.gridsX}, minmax(40px, 1fr))`,
          gridTemplateRows: `repeat(${this.state.gridsY}, minmax(40px, 1fr))`
        }}
      >
        {Array(this.totalGrids())
          .fill(null)
          .map((u, i) => (
            <div className="grid" key={i}>
              {i === this.state.center ? <div className="red-dot"></div> : null}
              {this.state.coordinates.includes(i) ? (
                <div className="green-dot"></div>
              ) : null}
            </div>
          ))}
      </div>
    );
  }
}

export default Maze;
