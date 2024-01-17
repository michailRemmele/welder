import type { WidgetPartSchema } from 'remiz-editor';

export const camera: WidgetPartSchema = {
  fields: [
    {
      name: 'offsetY',
      title: 'resources.scriptSystem.camera.offsetY.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    offsetY: 0,
  }),
};
