import type { GameObjectEvent } from 'remiz';

export const MoveLeft = 'MoveLeft';
export const MoveRight = 'MoveRight';
export const MoveJump = 'MoveJump';
export const Attack = 'Attack';
export const AttackStart = 'AttackStart';

declare module 'remiz' {
  export interface GameObjectEventMap {
    [MoveLeft]: GameObjectEvent
    [MoveRight]: GameObjectEvent
    [MoveJump]: GameObjectEvent
    [Attack]: GameObjectEvent
    [AttackStart]: GameObjectEvent
  }
}
