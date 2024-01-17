import { Component } from 'remiz';

export class FinishZone extends Component {
  clone(): FinishZone {
    return new FinishZone();
  }
}

FinishZone.componentName = 'FinishZone';
