import { Component } from 'remiz';

export class ViewDirection extends Component {
  x: number;

  constructor() {
    super();
    this.x = 1;
  }

  clone(): ViewDirection {
    return new ViewDirection();
  }
}

ViewDirection.componentName = 'ViewDirection';
