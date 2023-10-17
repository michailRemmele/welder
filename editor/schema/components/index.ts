import type { WidgetSchema } from 'remiz-editor';

import { movement } from './movement';
import { ai } from './ai';
import { aiBlocker } from './ai-blocker';
import { attack } from './attack';
import { viewDirection } from './view-direction';

export const componentsSchema: Record<string, WidgetSchema> = {
  Movement: movement,
  AI: ai,
  AIBlocker: aiBlocker,
  Attack: attack,
  ViewDirection: viewDirection,
};
