import {
  Engine,
  contribSystems,
  contribComponents,
} from 'remiz';

import config from '../data/data.json';

import {
  systems,
  components,
} from './game';

const engine = new Engine({
  config,
  systems: {
    ...contribSystems,
    ...systems,
  },
  components: {
    ...contribComponents,
    ...components,
  },
});

engine.play();
