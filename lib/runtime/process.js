const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

NameSpaceStore.register('Process');

const Plugin = new ApexClass(
  'Plugin',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Process', Plugin);

const PluginRequest = new ApexClass(
  'PluginRequest',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Process', PluginRequest);

const PluginResult = new ApexClass(
  'PluginResult',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('Process', PluginResult);

const PluginDescribeResult = new ApexClass(
  'PluginDescribeResult',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {
    InputParameter: new ApexClass(
      'InputParameter',
      null,
      [],
      [],
      {},
      {},
      {},
      {},
      {}
    ),
    OutputParameter: new ApexClass(
      'OutputParameter',
      null,
      [],
      [],
      {},
      {},
      {},
      {},
      {}
    ),
  }
);
NameSpaceStore.registerClass('Process', PluginDescribeResult);

