import { Component } from 'remiz';

export class DeathZone extends Component {
  clone(): DeathZone {
    return new DeathZone();
  }
}

DeathZone.componentName = 'DeathZone';
