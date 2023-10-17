import type {
  Message,
  GameObject,
} from 'remiz';

export interface CollisionEnterMessage extends Message {
  gameObject1: GameObject
  gameObject2: GameObject
  mtv1: {
    x: number
    y: number
  },
  mtv2: {
    x: number
    y: number
  }
}
