const ApexClass        = require('../node/apex-class')
const NameSpaceStore = require('../store/name-space-store')
const Ast              = require('../node/ast')
const EnvManager       = require('../env-manager')
const createMethodNode = require('../helper/create-method-node')

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
  {},
  {}
);
NameSpaceStore.registerClass('ConnectApi', ChatterFeeds);

const FeedItemInput = new ApexClass(
  'FeedItemInput',
  null,
  [],
  [],
  {},
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
  {},
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
  {},
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
  {},
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

