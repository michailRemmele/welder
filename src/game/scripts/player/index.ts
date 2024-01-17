import type {
  Scene,
  GameObject,
  GameObjectSpawner,
  GameObjectDestroyer,
  UpdateOptions,
  GameObjectEvent,
  CollisionEnterEvent,
  ScriptOptions,
} from 'remiz';
import {
  Vector2,
  Transform,
  RigidBody,
  KeyboardControl,
  AddImpulse,
  CollisionEnter,
  LoadScene,
  Script,
} from 'remiz';

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
  private gameObject: GameObject;
  private gameObjectSpawner: GameObjectSpawner;
  private gameObjectDestroyer: GameObjectDestroyer;

  private attackCooldown: number;
  private activeAttacks: Array<GameObject>;

  constructor(options: ScriptOptions) {
    super();

    this.scene = options.scene;
    this.gameObject = options.gameObject;
    this.gameObjectSpawner = options.gameObjectSpawner;
    this.gameObjectDestroyer = options.gameObjectDestroyer;

    this.attackCooldown = 0;
    this.activeAttacks = [];

    this.gameObject.addEventListener(EventType.Attack, this.handleAttack);
    this.gameObject.addEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  destroy(): void {
    this.gameObject.removeEventListener(EventType.Attack, this.handleAttack);
    this.gameObject.removeEventListener(CollisionEnter, this.handleCollisionEnter);
  }

  private handleAttack = (event: GameObjectEvent): void => {
    if (this.attackCooldown > 0) {
      return;
    }

    const { target } = event;

    const playerTransform = target.getComponent(Transform);
    const playerViewDirection = target.getComponent(ViewDirection);

    const attack = this.gameObjectSpawner.spawn(ATTACK_TEMPLATE_ID);
    const attackTransform = attack.getComponent(Transform);

    attackTransform.offsetX = playerTransform.offsetX + ATTACK_DISTANCE * playerViewDirection.x;
    attackTransform.offsetY = playerTransform.offsetY;

    this.attackCooldown = ATTACK_COOLDOWN;
    this.activeAttacks.push(attack);
  };

  private handleCollisionEnter = (event: CollisionEnterEvent): void => {
    const { gameObject, target } = event;

    const shouldFly = !!gameObject.getComponent(AI);
    const rigidBody = target.getComponent(RigidBody);

    if (shouldFly && !rigidBody.ghost) {
      rigidBody.ghost = true;
      target.removeComponent(KeyboardControl);
      target.emit(AddImpulse, {
        value: new Vector2(0, -150),
      });
    }

    const isGameOver = !!gameObject.getComponent(DeathZone);
    if (isGameOver) {
      this.scene.emit(LoadScene, {
        sceneId: GAME_SCENE_ID,
        unloadCurrent: true,
        clean: true,
        loaderId: null,
        levelId: null,
      });
    }

    const isFinish = !!gameObject.getComponent(FinishZone);
    if (isFinish) {
      target.removeComponent(KeyboardControl);

      const elevatorRigidBody = gameObject.getComponent(RigidBody);
      elevatorRigidBody.useGravity = true;
    }
  };

  private updateAttack(deltaTime: number): void {
    this.activeAttacks = this.activeAttacks.filter((gameObject) => {
      const attackComponent = gameObject.getComponent(Attack);
      attackComponent.lifetime -= deltaTime;
      if (attackComponent.lifetime < 0) {
        this.gameObjectDestroyer.destroy(gameObject);
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
