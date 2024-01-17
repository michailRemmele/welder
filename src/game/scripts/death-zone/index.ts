import type {
  GameObject,
  GameObjectDestroyer,
  ScriptOptions,
  CollisionEnterEvent,
} from 'remiz';
import {
  Script,
  CollisionEnter,
} from 'remiz';

import { Movement } from '../../components';

export class DeathZoneScript extends Script {
  private gameObject: GameObject;
  private gameObjectDestroyer: GameObjectDestroyer;

  constructor(options: ScriptOptions) {
    super();

    this.gameObject = options.gameObject;
    this.gameObjectDestroyer = options.gameObjectDestroyer;

    this.gameObject.addEventListener(CollisionEnter, this.handleDeath);
  }

  destroy(): void {
    this.gameObject.removeEventListener(CollisionEnter, this.handleDeath);
  }

  private handleDeath = (event: CollisionEnterEvent): void => {
    const { gameObject } = event;

    if (gameObject.getComponent(Movement)) {
      this.gameObjectDestroyer.destroy(gameObject);
    }
  };
}

DeathZoneScript.scriptName = 'DeathZoneScript';
