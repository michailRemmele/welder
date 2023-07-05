import { Vector2 } from 'remiz';

const TRANSFORM_COMPONENT_NAME = 'transform';
const AI_COMPONENT_NAME = 'ai';
const AI_BLOCKER_COMPONENT_NAME = 'aiBlocker';
const ATTACK_COMPONENT_NAME = 'attack';
const RIGID_BODY_COMPONENT_NAME = 'rigidBody';

const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const MOVE_LEFT_MSG = 'MOVE_LEFT';
const MOVE_RIGHT_MSG = 'MOVE_RIGHT';
const ADD_IMPULSE_MSG = 'ADD_IMPULSE';

export const FLY_IMPULSE = 150;

export class AISystem {
  constructor(options) {
    this.gameObjectObserver = options.createGameObjectObserver({
      components: [TRANSFORM_COMPONENT_NAME, AI_COMPONENT_NAME],
    });
    this.messageBus = options.messageBus;
  }

  updateMovement(gameObject) {
    const ai = gameObject.getComponent(AI_COMPONENT_NAME);

    const collisionMessages = this.messageBus.getById(COLLISION_ENTER_MSG, gameObject.id);
    const shouldTurn = collisionMessages?.some(
      (message) => !!message.gameObject2.getComponent(AI_BLOCKER_COMPONENT_NAME),
    );
    if (shouldTurn) {
      ai.direction *= -1;
    }

    this.messageBus.send({
      type: ai.direction === 1 ? MOVE_RIGHT_MSG : MOVE_LEFT_MSG,
      id: gameObject.id,
    });
  }

  updateAttack(gameObject) {
    const collisionMessages = this.messageBus.getById(COLLISION_ENTER_MSG, gameObject.id);
    const collision = collisionMessages?.find(
      (message) => !!message.gameObject2.getComponent(ATTACK_COMPONENT_NAME),
    );

    if (collision) {
      const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME);
      rigidBody.ghost = true;
      gameObject.removeComponent(AI_COMPONENT_NAME);
      this.messageBus.send({
        type: ADD_IMPULSE_MSG,
        value: new Vector2(FLY_IMPULSE * Math.sign(collision.mtv1.x), -FLY_IMPULSE),
        gameObject,
        id: gameObject.id,
      });
    }
  }

  update() {
    this.gameObjectObserver.forEach((gameObject) => {
      this.updateMovement(gameObject);
      this.updateAttack(gameObject);
    });
  }
}
