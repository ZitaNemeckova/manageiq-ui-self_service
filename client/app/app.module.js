import './globals.js';
import './components/components.module.js';

import { AppController } from './app.controller.js';
import { AppRoutingModule } from './states/states.module.js';
import { CatalogsModule } from './catalogs/catalogs.module.js';
import { CoreModule } from './core/core.module.js';
import { DialogsModule } from './dialogs/dialogs.module.js';

export default angular
  .module('app', [
    'ngProgress',

    AppRoutingModule,
    CoreModule,
    CatalogsModule,
    DialogsModule,
  ])
  .controller('AppController', AppController)
  .name;
