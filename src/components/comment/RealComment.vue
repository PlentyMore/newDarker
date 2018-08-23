<template>
  <div class="commentBox">
    <div class="commentNum">
      <p>{{page?page.allTotalSize:0}} 条评论</p>
    </div>
    <div class="commentTitle">
      <p class="commentAll">全部评论</p>
      <p class="refreshBtn" @click="refreshComment">刷新评论</p>
    </div>
    <div>
      <post-reply
        :oid="oid"
        :type="type"
        style="border-bottom: 1px solid gray;"
        :mode=0
        @onAddRootReply="addRootReply">
      </post-reply>
    </div>
    <div v-if="page.pageNumber==1&&this.topReplies" class="stickReplyBox">
      <root-reply
        :oid="oid"
        :type="type"
        :rootReply="topReplies"
        :top=true></root-reply>
    </div>
    <div v-if="hotReplies.length!==0">
      <div v-for="(rootReply,index) in hotReplies" style="color:red;" :key="rootReply.rpid">
        <root-reply
          :oid="oid"
          :type="type"
          :rootReply="rootReply"
          :rootIndex="index"
          :subPage="subPage"
          @onRemoveRootReply="removeRootReply"
        ></root-reply>
      </div>
    </div>
    <div v-if="hotReplies.length!=0" class="hotLine">
      <p style="color:white">------------------以上为热门评论，点击</p>
      <p @click="sortByHot" style="color: rgb(24, 109, 189);font-weight:bold;cursor:pointer;">查看更多</p>
      <p style="color:white">------------------</p>
    </div>
    <div>
      <div v-for="(rootReply,index) in rootReplies" style="color:red;" :key="rootReply.rpid">
        <root-reply
          :rootReply="rootReply"
          :rootIndex="index"
          :oid="oid"
          :type="type"
          :subPage="subPage"
          @onRemoveRootReply="removeRootReply"
          @onUpdateRootReply="updateRootReply">
        </root-reply>
      </div>
    </div>
    <div v-if="page || rootReplies.length>0" class="pagination">
      <el-pagination
        v-if="page.totalSize>20"
        @current-change="pageSelect"
        :current-page.sync="page.pageNumber"
        :page-count="11"
        :page-size="page.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="page.totalSize">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import commentItem from "./CommentItem.vue";
  import api from "../../api.js";
  import RootReply from "./RootReply";
  import PostReply from "./PostReply.vue";
  export default {
    name: "RealComment",
    props: ["oid","type","rpid"],
    components: {
      RootReply,
      commentItem,
      "post-reply": PostReply
    },
    data() {
      return {
        sort: 1,
        topReplies: {},
        hotReplies: [],
        parentCommentPlaceholder:
          "请自觉遵守互联网相关的政策法规，严禁发布色情、暴力、反动的言论。",
        rootReplies:[],
        page:"",
        subPage: ""
      };
    },
    methods:{
      async refreshComment(){
        console.log("refresh comment");
        this.sort = 1;
        this.initComment();
        this.refreshVal++;
      },
      async initComment() {
        let res = await api.getRepliesOfAnyClassPage({
          pn: 1,
          oid: this.oid,
          type: this.type,
          sort: this.sort
        });
        let rd = res.data;
        console.log("初始化评论：",rd);
        console.log("评论数据：",rd.data.replies);
        console.log("热门数据", this.hotComment);
        if(rd.code === 0){
          this.topReplies=rd.data.top;
          console.log('置顶评论',rd.data.top,this.topReplies);
          this.rootReplies = rd.data.replies;
          this.page = rd.data.page;
        }
        else {
          console.log("初始化评论出错！");
        }
      },
      async sortByHot() {
        this.sort = 2;
        let res = await api.getRepliesOfAnyClassPage({
          oid: this.oid,
          type: this.type,
          sort: this.sort
        });
        let rd = res.data;
        if(rd.code === 0){
          this.rootReplies = rd.data.replies;
          this.page = rd.data.page;
          this.hotComment = [];
        }
        else {
          console.log("按点赞数排序获取消息失败");
        }
      },
      async pageSelect(index) {
        let res = await api.getRepliesOfAnyClassPage({
          pn: this.page.pageNumber,
          oid: this.oid,
          type: 1,
          sort: this.sort
        });
        let rd = res.data;
        if (rd.code === 0) {
          this.rootReplies = rd.data.replies;
          this.page = rd.data.page;
        }
        else {
          console.log("翻页获取消息失败");
        }
      },
      removeRootReply(index){
        console.log("remove root reply: ",index);
        this.rootReplies.splice(index,1);
      },
      addRootReply(rpid){
        console.log("add rootReply: ",rpid);
        this.refreshComment();
      },
      updateRootReply(data){
        console.log("updateRootReply:",data);
        this.topReplies=data.top;
        this.rootReplies = data.replies;
        this.page = data.page;
      },
      goAnchor(selector) {
        let anchor = document.getElementById(selector);
        console.log('selector:', selector);
        console.log('anchor:', anchor);
        if (anchor) {
          console.log("scrollIntoView!!!");
          anchor.scrollIntoView();
        } else {
          this.$message({
            message: "评论已被删除",
            type: "info"
          });
        }
        // document.getElementById('here').scrollIntoView();
      }
    },
    created(){
        !this.rpid?this.initComment():0;
    },
    async mounted(){
      console.log("mounted.....rpid:",this.rpid);
      if(this.rpid){
        console.log("ready to send request.");
        let res = await api.getRepliesOfAnyClassPage({
          rpid: this.rpid,
          oid: this.oid,
          type: this.type
        });
        let rd = res.data;
        if(rd.code === 0){
          this.rootReplies = rd.data.replies;
          this.page = rd.data.page;
          if(rd.data.subpage.totalSize !== 0){
            this.subPage = rd.data.subpage;
            console.log("subPage:",this.subPage);
          }
        }
        else {
          console.log("position err...");
        }
        console.log("finished init data...");
        this.$nextTick( () => {
          this.goAnchor(this.rpid);
        });
      }
    }
  }
</script>

<style scoped>
  .commentBox {
    display: flex;
    flex-direction: column;
  }
  .commentNum {
    display: flex;
    flex-direction: column;
    width: 900px;
    height: 30px;
    margin: auto auto;
  }
  .commentNum p {
    text-align: left;
    color: antiquewhite;
    font-size: 20px;
    line-height: 30px;
    height: 30px;
    width: 100%;
    font-weight: bold;
    margin: auto auto;
  }
  .commentTitle {
    display: flex;
    flex-direction: row;
    width: 900px;
    margin: auto auto;
    height: 50px;
    border-bottom: 2px solid rgb(65, 163, 134);
  }
  .commentAll {
    color: antiquewhite;
    height: 30px;
    line-height: 30px;
  }
  .refreshBtn {
    color: antiquewhite;
    margin-left: 20px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
  }
  .hotLine {
    display: flex;
    flex-direction: row;
    margin: auto auto;
  }
  .pagination {
    width: 80%;
    margin: auto 0;
  }
  .stickReplyBox{
    border-radius: 5px;
    margin: 10px auto;
    width: 950px;
  }
</style>
