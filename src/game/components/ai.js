import { Component } from 'remiz';

export class AI extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this.direction = 1;
  }

  clone() {
    return new AI(this.componentName, {});
  }
}
