import { Vector2 } from 'remiz';

import * as COMPONENTS from './components-consts';
import * as MESSAGES from './messages-consts';

const PLAYER_ID = '4148e71a-2400-4308-8412-4918b75ccc21';
const CAMERA_ID = '148f779f-2099-45b6-884a-d3d87294e011';
const HELL_ID = '2c3fa7d1-90a4-45d1-95da-c208394c492b';
const GAME_SCENE_ID = '4f3c4560-ac1d-47f1-8e26-6135e5fe1d6b';
const ELEVATOR_ID = '54a90b77-d75c-408d-84ec-3e971b29b82c';

const ATTACK_TEMPLATE_ID = '691a828a-ee6f-42aa-9291-33b0b393c2d4';

const ATTACK_DISTANCE = 16;
const ATTACK_COOLDOWN = 500;

export class GameSystem {
  constructor(options) {
    this.gameObjectObserver = options.createGameObjectObserver({});
    this.corpseObserver = options.createGameObjectObserver({
      components: [COMPONENTS.COLLIDER_COMPONENT_NAME, COMPONENTS.RIGID_BODY_COMPONENT_NAME],
    });
    this.attackObserver = options.createGameObjectObserver({
      components: [COMPONENTS.ATTACK_COMPONENT_NAME],
    });
    this.gameObjectSpawner = options.gameObjectSpawner;
    this.gameObjectDestroyer = options.gameObjectDestroyer;
    this.messageBus = options.messageBus;

    this.attackCooldown = 0;
  }

  updateCamera() {
    const player = this.gameObjectObserver.getById(PLAYER_ID);
    const camera = this.gameObjectObserver.getById(CAMERA_ID);

    const transformPlayer = player.getComponent(COMPONENTS.TRANSFORM_COMPONENT_NAME);
    const transformCamera = camera.getComponent(COMPONENTS.TRANSFORM_COMPONENT_NAME);

    transformCamera.offsetX = transformPlayer.offsetX;
  }

  updateAttack(deltaTime) {
    this.attackObserver.forEach((gameObject) => {
      const attack = gameObject.getComponent(COMPONENTS.ATTACK_COMPONENT_NAME);
      attack.lifetime -= deltaTime;
      if (attack.lifetime <= 0) {
        this.gameObjectDestroyer.destroy(gameObject);
      }
    });

    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
      this.messageBus.deleteById(MESSAGES.ATTACK_MSG, PLAYER_ID);
      return;
    }

    const attackMessages = this.messageBus.getById(MESSAGES.ATTACK_MSG, PLAYER_ID);
    if (!attackMessages?.length) {
      return;
    }

    const player = this.gameObjectObserver.getById(PLAYER_ID);
    const playerTransform = player.getComponent(COMPONENTS.TRANSFORM_COMPONENT_NAME);
    const playerMovement = player.getComponent(COMPONENTS.MOVEMENT_COMPONENT_NAME);

    const attack = this.gameObjectSpawner.spawn(ATTACK_TEMPLATE_ID);
    const attackTransform = attack.getComponent(COMPONENTS.TRANSFORM_COMPONENT_NAME);

    attackTransform.offsetX = playerTransform.offsetX
      + ATTACK_DISTANCE * playerMovement.viewDirection;
    attackTransform.offsetY = playerTransform.offsetY;

    this.attackCooldown = ATTACK_COOLDOWN;
  }

  updatePlayerDamage() {
    const collisionMessages = this.messageBus.getById(MESSAGES.COLLISION_ENTER_MSG, PLAYER_ID);
    const shouldDamaged = collisionMessages?.some(
      (message) => message.gameObject2.getComponent(COMPONENTS.AI_COMPONENT_NAME),
    );

    if (!shouldDamaged) {
      return;
    }

    const player = this.gameObjectObserver.getById(PLAYER_ID);
    player.removeComponent(COMPONENTS.CONTROL_COMPONENT_NAME);

    const rigidBody = player.getComponent(COMPONENTS.RIGID_BODY_COMPONENT_NAME);
    rigidBody.ghost = true;

    this.messageBus.send({
      type: MESSAGES.ADD_IMPULSE_MSG,
      value: new Vector2(0, -150),
      gameObject: player,
      id: player.id,
    });
  }

  updateFinish() {
    const collisionMessages = this.messageBus.getById(MESSAGES.COLLISION_ENTER_MSG, PLAYER_ID);
    const isFinish = collisionMessages?.some(
      (message) => ELEVATOR_ID === message.gameObject2.id,
    );

    if (isFinish) {
      const elevator = this.gameObjectObserver.getById(ELEVATOR_ID);
      const elevatorRigidBody = elevator.getComponent(COMPONENTS.RIGID_BODY_COMPONENT_NAME);
      elevatorRigidBody.useGravity = true;

      const player = this.gameObjectObserver.getById(PLAYER_ID);
      player.removeComponent(COMPONENTS.CONTROL_COMPONENT_NAME);
    }
  }

  updateGameOver() {
    const collisionMessages = this.messageBus.getById(MESSAGES.COLLISION_ENTER_MSG, PLAYER_ID);
    const isGameOver = collisionMessages?.some(
      (message) => HELL_ID === message.gameObject2.id,
    );

    if (isGameOver) {
      this.messageBus.send({
        type: MESSAGES.LOAD_SCENE_MSG,
        sceneId: GAME_SCENE_ID,
        unloadCurrent: true,
        clean: true,
      });
    }
  }

  updateDeath() {
    this.corpseObserver.forEach((gameObject) => {
      const collisionMessages = this.messageBus.getById(
        MESSAGES.COLLISION_ENTER_MSG,
        gameObject.id,
      );
      const shouldDie = collisionMessages?.some(
        (message) => message.gameObject2.id === HELL_ID,
      );

      if (shouldDie) {
        this.gameObjectDestroyer.destroy(gameObject);
      }
    });
  }

  update({ deltaTime }) {
    this.updateCamera();
    this.updateAttack(deltaTime);
    this.updatePlayerDamage();
    this.updateGameOver();
    this.updateFinish();
    this.updateDeath();
  }
}
