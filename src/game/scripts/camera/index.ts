import type {
  Actor,
  ScriptOptions,
} from 'remiz';
import { Script, Transform } from 'remiz';

interface CameraScriptOptions extends ScriptOptions {
  offsetY: number
}

export class CameraScript extends Script {
  private actor: Actor;
  private offsetY: number;

  constructor(options: CameraScriptOptions) {
    super();

    this.actor = options.actor;
    this.offsetY = options.offsetY;
  }

  update(): void {
    const cameraTransform = this.actor.getComponent(Transform);
    cameraTransform.offsetY = this.offsetY;
  }
}

CameraScript.scriptName = 'CameraScript';
