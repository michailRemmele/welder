import {
  Engine,

  Animator,
  CameraSystem,
  KeyboardInputSystem,
  KeyboardControlSystem,
  MouseInputSystem,
  PhysicsSystem,
  SpriteRenderer,
  ScriptSystem,

  Camera,
  KeyboardControl,
  ColliderContainer,
  RigidBody,
  Animatable,
  Sprite,
  Transform,
  MouseControl,
  ScriptBundle,
} from 'remiz';

import config from '../data/data.json';

import {
  AISystem,
  MovementSystem,

  AI,
  AIBlocker,
  Attack,
  Movement,
  ViewDirection,
  DeathZone,
  FinishZone,

  CameraScript,
  DeathZoneScript,
  PlayerScript,
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
    ScriptSystem,
    AISystem,
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
    ScriptBundle,
    AI,
    AIBlocker,
    Attack,
    Movement,
    ViewDirection,
    DeathZone,
    FinishZone,
  ],
  resources: {
    [ScriptSystem.systemName]: [
      CameraScript,
      DeathZoneScript,
      PlayerScript,
    ],
  },
});

void engine.play();
