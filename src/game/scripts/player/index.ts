import type {
  Scene,
  Actor,
  ActorSpawner,
  UpdateOptions,
  ActorEvent,
  ScriptOptions,
} from 'remiz';
import {
  Vector2,
  Transform,
  RigidBody,
  KeyboardControl,
  Script,
} from 'remiz';
import { AddImpulse, CollisionEnter, LoadScene } from 'remiz/events';
import type { CollisionEnterEvent } from 'remiz/events';

import {
  AI,
  Attack,
  ViewDirection,
  DeathZone,
  FinishZone,
} from '../../components';
import * as EventType from '../../events';

const ATTACK_TEMPLATE_ID = '2dce7f95-7a95-487a-b6e7-c84edd8f861e';
const GAME_SCENE_ID = 'b0c40931-6d56-4b56-8ac8-1832657a47da';

const ATTACK_DISTANCE = 16;
const ATTACK_COOLDOWN = 500;

export class PlayerScript extends Script {
  private scene: Scene;
  private actor: Actor;
  private actorSpawner: ActorSpawner;

  private attackCooldown: number;
  private activeAttacks: Array<Actor>;

  constructor(options: ScriptOptions) {
    super();

    this.scene = options.scene;
    this.actor = options.actor;
    this.actorSpawner = options.actorSpawner;

    this.attackCooldown = 0;
    this.activeAttacks = [];

    this.actor.addEventListener(EventType.Attack, this.handleAttack);
    this.actor.addEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  destroy(): void {
    this.actor.removeEventListener(EventType.Attack, this.handleAttack);
    this.actor.removeEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  private handleAttack = (event: ActorEvent): void => {
    if (this.attackCooldown > 0) {
      return;
    }

    const { target } = event;

    const playerTransform = target.getComponent(Transform);
    const playerViewDirection = target.getComponent(ViewDirection);

    const attack = this.actorSpawner.spawn(ATTACK_TEMPLATE_ID);
    const attackTransform = attack.getComponent(Transform);

    attackTransform.offsetX = playerTransform.offsetX + ATTACK_DISTANCE * playerViewDirection.x;
    attackTransform.offsetY = playerTransform.offsetY;

    this.attackCooldown = ATTACK_COOLDOWN;
    this.activeAttacks.push(attack);

    this.scene.appendChild(attack);

    this.actor.dispatchEvent(EventType.AttackStart);
  };

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    const { actor, target } = event;

    const shouldFly = !!actor.getComponent(AI);
    const rigidBody = target.getComponent(RigidBody);

    if (shouldFly && !rigidBody.ghost) {
      rigidBody.ghost = true;
      target.removeComponent(KeyboardControl);
      target.dispatchEvent(AddImpulse, {
        value: new Vector2(0, -150),
      });
    }

    const isGameOver = !!actor.getComponent(DeathZone);
    if (isGameOver) {
      this.scene.dispatchEvent(LoadScene, {
        sceneId: GAME_SCENE_ID,
        unloadCurrent: true,
        clean: true,
        loaderId: null,
        levelId: null,
      });
    }

    const isFinish = !!actor.getComponent(FinishZone);
    if (isFinish) {
      target.removeComponent(KeyboardControl);

      const elevatorRigidBody = actor.getComponent(RigidBody);
      elevatorRigidBody.useGravity = true;
    }
  };

  private updateAttack(deltaTime: number): void {
    this.activeAttacks = this.activeAttacks.filter((actor) => {
      const attackComponent = actor.getComponent(Attack);
      attackComponent.lifetime -= deltaTime;
      if (attackComponent.lifetime < 0) {
        actor.remove();
        return false;
      }

      return true;
    });

    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
    }
  }

  update(options: UpdateOptions): void {
    this.updateAttack(options.deltaTime);
  }
}

PlayerScript.scriptName = 'PlayerScript';
