import {
  Engine,

  Animator,
  CameraSystem,
  KeyboardInputSystem,
  KeyboardControlSystem,
  MouseInputSystem,
  PhysicsSystem,
  SpriteRenderer,

  Camera,
  KeyboardControl,
  ColliderContainer,
  RigidBody,
  Animatable,
  Sprite,
  Transform,
  MouseControl,
} from 'remiz';

import config from '../data/data.json';

import {
  AISystem,
  GameSystem,
  MovementSystem,

  AI,
  AIBlocker,
  Attack,
  Movement,
  ViewDirection,
} from './game';

const engine = new Engine({
  config,
  systems: [
    Animator,
    CameraSystem,
    KeyboardInputSystem,
    KeyboardControlSystem,
    MouseInputSystem,
    PhysicsSystem,
    SpriteRenderer,
    AISystem,
    GameSystem,
    MovementSystem,
  ],
  components: [
    Camera,
    KeyboardControl,
    ColliderContainer,
    RigidBody,
    Animatable,
    Sprite,
    Transform,
    MouseControl,
    AI,
    AIBlocker,
    Attack,
    Movement,
    ViewDirection,
  ],
});

void engine.play();
