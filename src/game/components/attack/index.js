import { Component } from 'remiz';

export class Attack extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this.lifetime = 100;
  }

  clone() {
    return new Attack(this.componentName, {});
  }
}
