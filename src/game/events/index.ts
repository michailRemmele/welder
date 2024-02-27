import type { ActorEvent } from 'remiz';

export const MoveLeft = 'MoveLeft';
export const MoveRight = 'MoveRight';
export const MoveJump = 'MoveJump';
export const Attack = 'Attack';
export const AttackStart = 'AttackStart';

declare module 'remiz' {
  export interface ActorEventMap {
    [MoveLeft]: ActorEvent
    [MoveRight]: ActorEvent
    [MoveJump]: ActorEvent
    [Attack]: ActorEvent
    [AttackStart]: ActorEvent
  }
}
