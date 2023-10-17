import type { WidgetSchema } from 'remiz-editor';

import { movementSystem } from './movement-system';
import { gameSystem } from './game-system';
import { aiSystem } from './ai-system';

export const systemsSchema: Record<string, WidgetSchema> = {
  MovementSystem: movementSystem,
  GameSystem: gameSystem,
  AISystem: aiSystem,
};
