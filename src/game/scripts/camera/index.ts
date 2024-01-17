import type {
  GameObject,
  ScriptOptions,
} from 'remiz';
import { Script, Transform } from 'remiz';

interface CameraScriptOptions extends ScriptOptions {
  offsetY: number
}

export class CameraScript extends Script {
  private gameObject: GameObject;
  private offsetY: number;

  constructor(options: CameraScriptOptions) {
    super();

    this.gameObject = options.gameObject;
    this.offsetY = options.offsetY;
  }

  update(): void {
    const cameraTransform = this.gameObject.getComponent(Transform);
    cameraTransform.offsetY = this.offsetY;
  }
}

CameraScript.scriptName = 'CameraScript';
