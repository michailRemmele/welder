import type { Actor, ScriptOptions } from 'remiz';
import { Script } from 'remiz';
import { CollisionEnter } from 'remiz/events';
import type { CollisionEnterEvent } from 'remiz/events';

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
