import type { Reference } from 'remiz-editor';

import {
  MoveLeft,
  MoveRight,
  MoveJump,
  Attack,
} from '../../src/game/events';

export const controlEventsReference: Reference = {
  items: [
    MoveLeft,
    MoveRight,
    MoveJump,
    Attack,
  ].map((value) => ({ title: value, value })),
};
