export const ai = {
  title: 'components.ai.title',
  fields: [
    {
      name: 'direction',
      title: 'components.ai.direction.title',
      type: 'select',
      referenceId: 'directions',
    },
  ],
  references: {
    directions: {
      items: [
        {
          title: 'components.ai.directions.right.title',
          value: 'right',
        },
        {
          title: 'components.ai.directions.left.title',
          value: 'left',
        },
      ],
    },
  },
};
