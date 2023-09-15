import { Component } from 'remiz';

export class AIBlocker extends Component {
  clone() {
    return new AIBlocker(this.componentName, {});
  }
}
