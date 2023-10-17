import { Component } from 'remiz';

export class Attack extends Component {
  lifetime: number;

  constructor() {
    super();

    this.lifetime = 100;
  }

  clone(): Attack {
    return new Attack();
  }
}

Attack.componentName = 'Attack';
