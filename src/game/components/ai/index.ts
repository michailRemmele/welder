import { Component } from 'remiz';

export class AI extends Component {
  direction: number;

  constructor() {
    super();

    this.direction = 1;
  }

  clone(): AI {
    return new AI();
  }
}

AI.componentName = 'AI';
