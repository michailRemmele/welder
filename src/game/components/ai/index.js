import { Component } from 'remiz';

export class AI extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this.direction = config.direction;
  }

  clone() {
    return new AI(this.componentName, {
      direction: this.direction,
    });
  }
}
