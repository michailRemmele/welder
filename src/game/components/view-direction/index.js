import { Component } from 'remiz';

export class ViewDirection extends Component {
  constructor(componentName, config) {
    super(componentName, config);
    this.x = 1;
  }

  clone() {
    return new ViewDirection(this.componentName, {});
  }
}
