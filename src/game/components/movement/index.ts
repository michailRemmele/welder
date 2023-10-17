import { Component } from 'remiz';

interface MovementConfig extends Record<string, unknown> {
  speed: number
}

export class Movement extends Component {
  speed: number;
  direction: number;
  isJumping: boolean;

  constructor(config: Record<string, unknown>) {
    super();

    const { speed } = config as MovementConfig;

    this.speed = speed;
    this.direction = 0;
    this.isJumping = false;
  }

  clone(): Movement {
    return new Movement({
      speed: this.speed,
    });
  }
}

Movement.componentName = 'Movement';
