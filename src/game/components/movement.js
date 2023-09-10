import { Component } from 'remiz';

export class Movement extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this.speed = config.speed;
    this.direction = 0;
    this.viewDirection = 1;
    this.isJumping = false;
  }

  clone() {
    return new Movement(this.componentName, {
      speed: this.speed,
    });
  }
}
