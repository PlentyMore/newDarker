## Comment
props:[\'oid\',\'type'\']

传入oid和type即可加载在评论，这这里调用initComment方法初始化评论

父评论数组的结构如下：
```angularjs
[{rootReply1},{rootReply2}...}]  //rootReply结构参考下面
```

rootReplies:[]，

>对象id,r如果是番剧下的评论，oid={epId},如果是公告下的,oid={noticeId}

>类型，番剧下的评论type=1,公告下的评论type=2

## RootReply
props:[\'oid\',\'type'\',\'rootReply\',\'rootIndex\']

根（父）评论，传入oid，type和根评论和根评论的索引。

索引用于删除评论

rootReply的结构如下：
```angularjs
{
  "root":0,
  "like":0,
  "content":"hh",
  "floor":3,
  "status":0,
  "replies":[],  //子评论数组
  "oid":1,
  "user":
      {
      "uid":6,
      "nick":"echisan",
      "sign":null,
      "avatar":"https://i.imgur.com/b6jCxxz.jpg"
      },
  "uid":6,
  "rpid":302,
  "rcount":0,
  "like_status":0,
  "ctime":1534646278000,
  "type":1}
```

## SubReply

props:[\'oid\',\'type'\',\'subReply\',\'subIndex\']

子评论的结构如下：
```angularjs
{
  "root":293,
  "like":0,
  "content":"回复 @echisan :test",
  "floor":1,
  "status":0,
  "replies":null,
  "oid":1,
  "user":
      {"uid":6,
      "nick":"echisan",
      "sign":null,
      "avatar":"https://i.imgur.com/b6jCxxz.jpg"
      },
  "uid":6,
  "rpid":294,
  "rcount":0,
  "like_status":0,
  "ctime":1534646197000,
  "type":1
}
```
子评论和父评论结构是一样的，不过子评论的root一定不为0，且replies一定为空。


## page
请求所有评论和某一个父评论下的子评论都有一个分页信息，结构如下：
```angularjs
{
  "totalSize":3,  //所有的根（父）评论总数
  "pageSize":20,  //页大小
  "pageNumber":1,  //页码
  "allTotalSize":11  //所有评论，包括根评论和子评论
}
```
