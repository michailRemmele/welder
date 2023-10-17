import {
  Vector2,
  Transform,
  RigidBody,
  ColliderContainer,
  KeyboardControl,
  System,
} from 'remiz';
import type {
  SystemOptions,
  UpdateOptions,
  GameObject,
  GameObjectObserver,
  GameObjectSpawner,
  GameObjectDestroyer,
  MessageBus,
} from 'remiz';

import {
  AI,
  Attack,
  ViewDirection,
} from '../../components';
import type { CollisionEnterMessage } from '../../../types/messages';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const LOAD_SCENE_MSG = 'LOAD_SCENE';
const ATTACK_MSG = 'ATTACK';
const ADD_IMPULSE_MSG = 'ADD_IMPULSE';

const ATTACK_TEMPLATE_ID = '2dce7f95-7a95-487a-b6e7-c84edd8f861e';

const GAME_SCENE_ID = 'b0c40931-6d56-4b56-8ac8-1832657a47da';

const PLAYER_ID = 'e117a1ef-0fbf-4cac-a0e6-a8212153245b';
const CAMERA_ID = 'ced29e41-22bf-4665-a0d9-b20a666e6afe';
const DEAD_ZONE_ID = '48f641b4-8c92-4676-910e-346cc7b31088';
const ELEVATOR_ID = '62201ef0-b40c-4433-8dd0-d7ff3ff4d04f';

const ATTACK_DISTANCE = 16;
const ATTACK_COOLDOWN = 500;

export class GameSystem extends System {
  private gameObjectObserver: GameObjectObserver;
  private attacksObserver: GameObjectObserver;
  private corpseObserver: GameObjectObserver;
  private gameObjectSpawner: GameObjectSpawner;
  private gameObjectDestroyer: GameObjectDestroyer;
  private messageBus: MessageBus;

  private attackCooldown: number;

  constructor(options: SystemOptions) {
    super();

    this.gameObjectObserver = options.createGameObjectObserver({});
    this.attacksObserver = options.createGameObjectObserver({
      components: [Attack],
    });
    this.corpseObserver = options.createGameObjectObserver({
      components: [Transform, ColliderContainer, RigidBody],
    });
    this.gameObjectSpawner = options.gameObjectSpawner;
    this.gameObjectDestroyer = options.gameObjectDestroyer;
    this.messageBus = options.messageBus;

    this.attackCooldown = 0;
  }

  updateCamera(): void {
    const player = this.gameObjectObserver.getById(PLAYER_ID) as GameObject;
    const playerTransform = player.getComponent(Transform);

    const camera = this.gameObjectObserver.getById(CAMERA_ID) as GameObject;
    const cameraTransform = camera.getComponent(Transform);

    cameraTransform.offsetX = playerTransform.offsetX;
  }

  updateAttack(deltaTime: number): void {
    this.attacksObserver.forEach((gameObject) => {
      const attackComponent = gameObject.getComponent(Attack);
      attackComponent.lifetime -= deltaTime;
      if (attackComponent.lifetime < 0) {
        this.gameObjectDestroyer.destroy(gameObject);
      }
    });

    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
      this.messageBus.deleteById(ATTACK_MSG, PLAYER_ID);
      return;
    }

    const attackMessages = this.messageBus.getById(ATTACK_MSG, PLAYER_ID);
    if (!attackMessages?.length) {
      return;
    }

    const player = this.gameObjectObserver.getById(PLAYER_ID) as GameObject;
    const playerTransform = player.getComponent(Transform);
    const playerViewDirection = player.getComponent(ViewDirection);

    const attack = this.gameObjectSpawner.spawn(ATTACK_TEMPLATE_ID);
    const attackTransform = attack.getComponent(Transform);

    attackTransform.offsetX = playerTransform.offsetX + ATTACK_DISTANCE * playerViewDirection.x;
    attackTransform.offsetY = playerTransform.offsetY;

    this.attackCooldown = ATTACK_COOLDOWN;
  }

  updateDamage(): void {
    const collisionMessages = this.messageBus.getById(
      COLLISION_ENTER_MSG,
      PLAYER_ID,
    ) as Array<CollisionEnterMessage> | undefined;
    const shouldFly = collisionMessages?.some(
      (message) => !!message.gameObject2.getComponent(AI),
    );

    const player = this.gameObjectObserver.getById(PLAYER_ID) as GameObject;
    const rigidBody = player.getComponent(RigidBody);

    if (shouldFly && !rigidBody.ghost) {
      rigidBody.ghost = true;
      player.removeComponent(KeyboardControl);
      this.messageBus.send({
        type: ADD_IMPULSE_MSG,
        value: new Vector2(0, -150),
        gameObject: player,
        id: PLAYER_ID,
      });
    }
  }

  updateGameOver(): void {
    const collisionMessages = this.messageBus.getById(
      COLLISION_ENTER_MSG,
      PLAYER_ID,
    ) as Array<CollisionEnterMessage> | undefined;
    const isGameOver = collisionMessages?.some(
      (message) => message.gameObject2.id === DEAD_ZONE_ID,
    );

    if (isGameOver) {
      this.messageBus.send({
        type: LOAD_SCENE_MSG,
        sceneId: GAME_SCENE_ID,
        unloadCurrent: true,
        clean: true,
      });
    }
  }

  updateFinish(): void {
    const collisionMessages = this.messageBus.getById(
      COLLISION_ENTER_MSG,
      PLAYER_ID,
    ) as Array<CollisionEnterMessage> | undefined;
    const isGameOver = collisionMessages?.some(
      (message) => message.gameObject2.id === ELEVATOR_ID,
    );

    if (isGameOver) {
      const player = this.gameObjectObserver.getById(PLAYER_ID) as GameObject;
      player.removeComponent(KeyboardControl);

      const elevator = this.gameObjectObserver.getById(ELEVATOR_ID) as GameObject;
      const rigidBody = elevator.getComponent(RigidBody);
      rigidBody.useGravity = true;
    }
  }

  updateDeath(): void {
    this.corpseObserver.forEach((gameObject) => {
      const collisionMessages = this.messageBus.getById(
        COLLISION_ENTER_MSG,
        gameObject.id,
      ) as Array<CollisionEnterMessage> | undefined;
      const shouldDie = collisionMessages?.some(
        (message) => message.gameObject2.id === DEAD_ZONE_ID,
      );

      if (shouldDie) {
        this.gameObjectDestroyer.destroy(gameObject);
      }
    });
  }

  update({ deltaTime }: UpdateOptions): void {
    this.updateCamera();
    this.updateAttack(deltaTime);
    this.updateDamage();
    this.updateGameOver();
    this.updateFinish();
    this.updateDeath();
  }
}

GameSystem.systemName = 'GameSystem';
