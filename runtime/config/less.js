const helpers = require('./helpers');
const path = require('path');

const modules = [
  {
    name: 'bootstrap'
  }, {
    name: 'font-awesome',
    module: 'font-awesome',
    path: 'font-awesome',
    less: 'less'
  }, {
    name: 'patternfly',
    module: 'patternfly'
  }
];

modules.forEach(val => {
  val.module = val.module || val.name + '-less';
  val.path = val.path || path.join(val.module, 'assets');
  val.modulePath = val.modulePath || path.join('node_modules', val.path);
  val.less = val.less || path.join('stylesheets');
  val.lessPath = path.join(helpers.root(), val.modulePath, val.less);
});

exports.modules = modules;
