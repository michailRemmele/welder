import {
  Engine,

  Animator,
  CameraSystem,
  KeyboardInputSystem,
  KeyboardControlSystem,
  MouseInputSystem,
  PhysicsSystem,
  Renderer,

  Camera,
  KeyboardControl,
  ColliderContainer,
  RigidBody,
  Animatable,
  Renderable,
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
    Renderer,
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
    Renderable,
    Transform,
    MouseControl,
    AI,
    AIBlocker,
    Attack,
    Movement,
    ViewDirection,
  ],
  helpers: {},
});

void engine.play();
