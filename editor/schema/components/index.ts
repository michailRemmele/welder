import type { WidgetSchema } from 'remiz-editor';

import {
  Movement,
  AI,
  AIBlocker,
  Attack,
  ViewDirection,
} from '../../../src/game/components';

import { movement } from './movement';
import { ai } from './ai';
import { aiBlocker } from './ai-blocker';
import { attack } from './attack';
import { viewDirection } from './view-direction';

export const componentsSchema: Record<string, WidgetSchema> = {
  [Movement.componentName]: movement,
  [AI.componentName]: ai,
  [AIBlocker.componentName]: aiBlocker,
  [Attack.componentName]: attack,
  [ViewDirection.componentName]: viewDirection,
};
