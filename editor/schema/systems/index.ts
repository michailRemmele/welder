import type { WidgetSchema } from 'remiz-editor';

import {
  MovementSystem,
  GameSystem,
  AISystem,
} from '../../../src/game/systems';

import { movementSystem } from './movement-system';
import { gameSystem } from './game-system';
import { aiSystem } from './ai-system';

export const systemsSchema: Record<string, WidgetSchema> = {
  [MovementSystem.systemName]: movementSystem,
  [GameSystem.systemName]: gameSystem,
  [AISystem.systemName]: aiSystem,
};
