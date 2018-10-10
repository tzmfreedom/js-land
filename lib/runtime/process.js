const NameSpaceStore = require('../store/name-space-store')
const Ast = require('../node/ast')
const EnvManager = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')
const createFieldNode = require('../helper/create-field-node')

NameSpaceStore.register('Process')

const Plugin = new Ast.ApexClass(
  'Plugin',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('Process', Plugin)

const PluginRequest = new Ast.ApexClass(
  'PluginRequest',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('Process', PluginRequest)

const PluginResult = new Ast.ApexClass(
  'PluginResult',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
)
NameSpaceStore.registerClass('Process', PluginResult)

const PluginDescribeResult = new Ast.ApexClass(
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
            'InputParameter'
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
            'OutputParameter'
          ],
          []
        )
      ]),
      ['public'],
      new Ast.NullNode()
    )
  },
  {},
  {},
  {},
  {
    InputParameter: new Ast.ApexClass(
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
    OutputParameter: new Ast.ApexClass(
      'OutputParameter',
      null,
      [],
      [],
      {},
      {},
      {},
      {},
      {}
    )
  }
)
NameSpaceStore.registerClass('Process', PluginDescribeResult)
