const TRANSFORM_COMPONENT_NAME = 'transform';
const AI_COMPONENT_NAME = 'ai';
const AI_BLOCKER_COMPONENT_NAME = 'aiBlocker';
const ATTACK_COMPONENT_NAME = 'attack';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const MOVE_LEFT_MSG = 'MOVE_LEFT';
const MOVE_RIGHT_MSG = 'MOVE_RIGHT';

export class AISystem {
  constructor(options) {
    this.gameObjectObserver = options.createGameObjectObserver({
      components: [TRANSFORM_COMPONENT_NAME, AI_COMPONENT_NAME],
    });
    this.gameObjectDestroyer = options.gameObjectDestroyer;
    this.messageBus = options.messageBus;
  }

  updateAttack(gameObject) {
    const collisionMessages = this.messageBus.getById(COLLISION_ENTER_MSG, gameObject.id);
    const shouldDie = collisionMessages?.some(
      (message) => !!message.gameObject2.getComponent(ATTACK_COMPONENT_NAME),
    );

    if (shouldDie) {
      this.gameObjectDestroyer.destroy(gameObject);
    }
  }

  updateMovement(gameObject) {
    const ai = gameObject.getComponent(AI_COMPONENT_NAME);

    const collisionMessages = this.messageBus.getById(COLLISION_ENTER_MSG, gameObject.id);
    const shouldTurn = collisionMessages?.some(
      (message) => !!message.gameObject2.getComponent(AI_BLOCKER_COMPONENT_NAME),
    );
    if (shouldTurn) {
      ai.direction = ai.direction === 'right' ? 'left' : 'right';
    }

    this.messageBus.send({
      type: ai.direction === 'right' ? MOVE_RIGHT_MSG : MOVE_LEFT_MSG,
      id: gameObject.id,
    });
  }

  update() {
    this.gameObjectObserver.forEach((gameObject) => {
      this.updateAttack(gameObject);
      this.updateMovement(gameObject);
    });
  }
}
