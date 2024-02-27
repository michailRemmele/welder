import type {
  Actor,
  ScriptOptions,
  CollisionEnterEvent,
} from 'remiz';
import {
  Script,
  CollisionEnter,
} from 'remiz';

import { Movement } from '../../components';

export class DeathZoneScript extends Script {
  private actor: Actor;

  constructor(options: ScriptOptions) {
    super();

    this.actor = options.actor;

    this.actor.addEventListener(CollisionEnter, this.handleDeath);
  }

  destroy(): void {
    this.actor.removeEventListener(CollisionEnter, this.handleDeath);
  }

  private handleDeath = (event: CollisionEnterEvent): void => {
    const { actor } = event;

    if (actor.getComponent(Movement)) {
      actor.remove();
    }
  };
}

DeathZoneScript.scriptName = 'DeathZoneScript';
