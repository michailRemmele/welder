import type { WidgetSchema } from 'remiz-editor';

import { movement } from './movement';
import { ai } from './ai';
import { aiBlocker } from './ai-blocker';
import { attack } from './attack';
import { viewDirection } from './view-direction';
import { deathZone } from './death-zone';
import { finishZone } from './finish-zone';

export const componentsSchema: Record<string, WidgetSchema> = {
  Movement: movement,
  AI: ai,
  AIBlocker: aiBlocker,
  Attack: attack,
  ViewDirection: viewDirection,
  DeathZone: deathZone,
  FinishZone: finishZone,
};
