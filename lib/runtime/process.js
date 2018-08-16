const ApexClass        = require('../node/apex-class')
const NameSpaceStore   = require('../store/name-space-store')
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')
const createFieldNode  = require('../helper/create-field-node')

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
  {
    description: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    tag: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    inputParameters: createFieldNode(
      new Ast.TypeNode(['List'], [
        new Ast.TypeNode(
          [
            'Process',
            'PluginDescribeResult',
            'InputParameter',
          ],
          []
        )
      ]),
      ['public'],
      new Ast.NullNode()
    ),
    outputParameters: createFieldNode(
      new Ast.TypeNode(['List'], [
        new Ast.TypeNode(
          [
            'Process',
            'PluginDescribeResult',
            'OutputParameter',
          ],
          []
        )
      ]),
      ['public'],
      new Ast.NullNode()
    ),
  },
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

