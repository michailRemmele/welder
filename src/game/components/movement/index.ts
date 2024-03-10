import { Component } from 'remiz';

interface MovementConfig {
  speed: number
}

export class Movement extends Component {
  speed: number;
  direction: number;
  isJumping: boolean;
  isMoving: boolean;

  constructor(config: MovementConfig) {
    super();

    const { speed } = config;

    this.speed = speed;
    this.direction = 0;
    this.isJumping = false;
    this.isMoving = false;
  }

  clone(): Movement {
    return new Movement({
      speed: this.speed,
    });
  }
}

Movement.componentName = 'Movement';
