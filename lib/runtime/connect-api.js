const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')
const createFieldNode  = require('../helper/create-field-node')

NameSpaceStore.register('ConnectApi');

const FeedItem = new ApexClass(
  'FeedItem',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('ConnectApi', FeedItem);

const ChatterFeeds = new ApexClass(
  'ChatterFeeds',
  null,
  [],
  [],
  {},
  {},
  {},
  {
    postFeedElement: [
      createMethodNode(
        'postFeedElement',
        ['public'],
        ['ConnectApi', 'FeedElement'],
        [],
        () => {
        }
      ),
    ]
  },
  {}
);
NameSpaceStore.registerClass('ConnectApi', ChatterFeeds);

const FeedItemInput = new ApexClass(
  'FeedItemInput',
  null,
  [],
  [],
  {
    Body: createFieldNode(
      ['ConnectApi', 'MessageBodyInput'],
      ['public'],
      new Ast.NullNode()
    ),
    FeedElementType: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
    SubjectId: createFieldNode(
      'ID',
      ['public'],
      new Ast.NullNode()
    ),
  },
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('ConnectApi', FeedItemInput);

const MentionSegmentInput = new ApexClass(
  'MentionSegmentInput',
  null,
  [],
  [],
  {
    Id: createFieldNode(
      'ID',
      ['public'],
      new Ast.NullNode()
    ),
  },
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('ConnectApi', MentionSegmentInput);

const MessageBodyInput = new ApexClass(
  'MessageBodyInput',
  null,
  [],
  [],
  {
    messageSegments: createFieldNode(
      new Ast.TypeNode(
        ['List'],
        [
          new Ast.TypeNode(['ConnectApi', 'MessageSegmentInput'], []),
        ]
      ),
      ['public'],
      new Ast.NullNode()
    ),
  },
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('ConnectApi', MessageBodyInput);

const TextSegmentInput = new ApexClass(
  'TextSegmentInput',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('ConnectApi', TextSegmentInput);

const FeedElementType = new ApexClass(
  'FeedElementType',
  null,
  [],
  [],
  {},
  {
    FeedItem: createFieldNode(
      'String',
      ['public'],
      new Ast.NullNode()
    ),
  },
  {},
  {},
  {}
);
NameSpaceStore.registerClass('ConnectApi', FeedElementType);

const FeedElement = new ApexClass(
  'FeedElement',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('ConnectApi', FeedElement);

const MessageSegmentInput = new ApexClass(
  'MessageSegmentInput',
  null,
  [],
  [],
  {},
  {},
  {},
  {},
  {}
);
NameSpaceStore.registerClass('ConnectApi', MessageSegmentInput);
