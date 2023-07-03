const TRANSFORM_COMPONENT_NAME = 'transform';
const AI_COMPONENT_NAME = 'ai';
const ATTACK_COMPONENT_NAME = 'attack';
const VIEW_DIRECTION_COMPONENT_NAME = 'viewDirection';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const LOAD_SCENE_MSG = 'LOAD_SCENE';
const ATTACK_MSG = 'ATTACK';

const ATTACK_TEMPLATE_ID = '2dce7f95-7a95-487a-b6e7-c84edd8f861e';

const GAME_SCENE_ID = 'b0c40931-6d56-4b56-8ac8-1832657a47da';

const PLAYER_ID = 'e117a1ef-0fbf-4cac-a0e6-a8212153245b';
const CAMERA_ID = 'ced29e41-22bf-4665-a0d9-b20a666e6afe';
const DEAD_ZONE_ID = '48f641b4-8c92-4676-910e-346cc7b31088';
const ELEVATOR_ID = '62201ef0-b40c-4433-8dd0-d7ff3ff4d04f';

const RESTART_ZONES = [DEAD_ZONE_ID, ELEVATOR_ID];

const ATTACK_DISTANCE = 16;
const ATTACK_COOLDOWN = 500;

export class GameSystem {
  constructor(options) {
    this.gameObjectObserver = options.createGameObjectObserver({});
    this.attacksObserver = options.createGameObjectObserver({
      components: [ATTACK_COMPONENT_NAME],
    });
    this.gameObjectSpawner = options.gameObjectSpawner;
    this.gameObjectDestroyer = options.gameObjectDestroyer;
    this.messageBus = options.messageBus;

    this.attackCooldown = 0;
  }

  updateCamera() {
    const player = this.gameObjectObserver.getById(PLAYER_ID);
    const playerTransform = player.getComponent(TRANSFORM_COMPONENT_NAME);

    const camera = this.gameObjectObserver.getById(CAMERA_ID);
    const cameraTransform = camera.getComponent(TRANSFORM_COMPONENT_NAME);

    cameraTransform.offsetX = playerTransform.offsetX;
  }

  updateAttack(deltaTime) {
    this.attacksObserver.forEach((gameObject) => {
      const attackComponent = gameObject.getComponent(ATTACK_COMPONENT_NAME);
      attackComponent.lifetime -= deltaTime;
      if (attackComponent.lifetime < 0) {
        this.gameObjectDestroyer.destroy(gameObject);
      }
    });

    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
      return;
    }

    const attackMessages = this.messageBus.getById(ATTACK_MSG, PLAYER_ID);
    if (!attackMessages?.length) {
      return;
    }

    const player = this.gameObjectObserver.getById(PLAYER_ID);
    const playerTransform = player.getComponent(TRANSFORM_COMPONENT_NAME);
    const playerViewDirection = player.getComponent(VIEW_DIRECTION_COMPONENT_NAME);

    const attack = this.gameObjectSpawner.spawn(ATTACK_TEMPLATE_ID);
    const attackTransform = attack.getComponent(TRANSFORM_COMPONENT_NAME);

    attackTransform.offsetX = playerTransform.offsetX + ATTACK_DISTANCE * playerViewDirection.x;
    attackTransform.offsetY = playerTransform.offsetY;

    this.attackCooldown = ATTACK_COOLDOWN;
  }

  updateGameOver() {
    const collisionMessages = this.messageBus.getById(COLLISION_ENTER_MSG, PLAYER_ID);
    if (!collisionMessages?.length) {
      return;
    }

    let isGameOver = collisionMessages.some(
      (message) => RESTART_ZONES.includes(message.gameObject2.id),
    );
    isGameOver ||= collisionMessages.some(
      (message) => !!message.gameObject2.getComponent(AI_COMPONENT_NAME),
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

  update({ deltaTime }) {
    this.updateCamera();
    this.updateAttack(deltaTime);
    this.updateGameOver();
  }
}
