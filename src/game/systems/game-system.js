import * as COMPONENTS from './components-consts';
import * as MESSAGES from './messages-consts';

const PLAYER_ID = '4148e71a-2400-4308-8412-4918b75ccc21';
const CAMERA_ID = '148f779f-2099-45b6-884a-d3d87294e011';
const HELL_ID = '2c3fa7d1-90a4-45d1-95da-c208394c492b';
const GAME_SCENE_ID = '4f3c4560-ac1d-47f1-8e26-6135e5fe1d6b';
const ELEVATOR_ID = '54a90b77-d75c-408d-84ec-3e971b29b82c';

export class GameSystem {
  constructor(options) {
    this.gameObjectObserver = options.createGameObjectObserver({});
    this.messageBus = options.messageBus;
  }

  updateCamera() {
    const player = this.gameObjectObserver.getById(PLAYER_ID);
    const camera = this.gameObjectObserver.getById(CAMERA_ID);

    const transformPlayer = player.getComponent(COMPONENTS.TRANSFORM_COMPONENT_NAME);
    const transformCamera = camera.getComponent(COMPONENTS.TRANSFORM_COMPONENT_NAME);

    transformCamera.offsetX = transformPlayer.offsetX;
  }

  updateFinish() {
    const collisionMessages = this.messageBus.getById(MESSAGES.COLLISION_ENTER_MSG, PLAYER_ID);
    const isFinish = collisionMessages?.some(
      (message) => ELEVATOR_ID === message.gameObject2.id,
    );

    if (isFinish) {
      const elevator = this.gameObjectObserver.getById(ELEVATOR_ID);
      const elevatorRigidBody = elevator.getComponent(COMPONENTS.RIGID_COMPONENT_NAME);
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

  update() {
    this.updateCamera();
    this.updateGameOver();
    this.updateFinish();
  }
}
