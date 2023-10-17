import { Component } from 'remiz';

export class AIBlocker extends Component {
  clone(): AIBlocker {
    return new AIBlocker();
  }
}

AIBlocker.componentName = 'AIBlocker';
