<template>
  <div class="commentItemBox" :id="rootReply.rpid">
    <div class="commentItemInBox">
      <a :href="'#/user/'+rootReply.uid" target="_blank">
        <img :src="rootReply.user.avatar?rootReply.user.avatar:'../../../static/img/noAvatar.jpg'" class="commentItemAvatar">
      </a>
      <div class="commentContentBox">
        <p class="replyUsername">
          <a :href="'#/user/'+rootReply.uid" target="_blank" style="text-decoration: none;color: rgb(127, 162, 238);">
            {{rootReply.user.nick}}
          </a>
        </p>
        <p class="replyContent">{{rootReply.content}}</p>
        <div class="commentControlBox">
          <p class="commentFloor">#{{rootReply.floor}}</p>
          <p class="commentTime">{{getDateDiff}}</p>
          <div class="commentUpvote" @click="upvote">
            <img :src="rootReply.like_status===0?'../../../static/img/upvote2.png':'../../../static/img/upvoted2.png'">
            <p>{{rootReply.like}}</p>
          </div>
          <p class="commentReplyBtn" @click="toggleReplyBox">回复</p>
          <p class="commentDeleteBtn" v-show="canDelReply" @click="delRootReply">删除</p>
        </div>
      </div>
    </div>
    <div v-for="(subReply,index) in rootReply.replies" :key="subReply.rpid">
      <sub-reply :subReply="subReply"
                 :subIndex="index"
                 :oid="oid"
                 :type="type"
                 @onRemoveSubReply="removeSubReply"
                 @onShowSubReplyBox="showSubReplyBox"
      >
      </sub-reply>
    </div>
    <div @click="seeMore" v-show="!noMore" v-if="rootReply.rcount>3 && !page" class="seeMore">共{{rootReply.rcount}}条回复，点击查看更多</div>
    <div v-if="noMore">
      <el-pagination
        v-show="noMore"
        v-if="page.totalSize>10"
        @current-change="pageSelect"
        :small="true"
        :current-page.sync="page.pageNumber"
        :page-count=11
        :page-size="page.pageSize"
        layout="total, prev, pager, next"
        :total="page.totalSize">
      </el-pagination>
    </div>
    <post-reply
      :oid="oid"
      :type="type"
      v-show="showReplyBox"
      class="commentReplyBox"
      :replyInfo="replyInfo"
      :parentRpid="rootReply.rpid"
      :mode=1
      @onAddSubReply="addSubReply">
    </post-reply>
  </div>
</template>

<script>
  import PostReply from "./PostReply.vue";
  import SubReply from "./SubReply.vue";
  import api from "../../api.js";
  import { formatDate } from "../../time.js";
  export default {
    name: "RootReply",
    props:["rootReply","rootIndex","oid","type","rpid","subPage"],
    components:{
      'post-reply': PostReply,
      'sub-reply': SubReply,
    },
    data() {
      return {
        uid: "",
        role: "",
        page: "",
        showReplyBox: false,
        noMore: false,
        replyInfo:"",
        placeholder:""
      };
    },
    computed: {
      getDateDiff() {
        let minute = 1000 * 60;
        let hour = minute * 60;
        let day = hour * 24;
        let now = new Date().getTime();
        let diffValue = now - this.rootReply.ctime;
        if (diffValue < 0) {
          return;
        }
        let dayC = diffValue / day;
        let hourC = diffValue / hour;
        let minC = diffValue / minute;
        if (dayC >= 1) {
          return formatDate(new Date(this.rootReply.ctime), "yyyy-MM-dd hh:mm");
        } else if (hourC >= 1) {
          return "" + parseInt(hourC) + "小时前";
        } else if (minC >= 1) {
          return "" + parseInt(minC) + "分钟前";
        } else return "刚刚";
      },
      canDelReply(){
        if(this.uid === this.rootReply.uid)
          return true;
        else if(this.role){
          if(this.role === 'ROLE_ADMIN' || this.role === 'ROLE_MANAGER')
            return true;
        }
        return false;
      }
    },
    methods:{
      async seeMore() {
        this.noMore = true;
        let res = await api.getRepliesOfAnyClassPage({
          pn: 1,
          oid: this.oid,
          type: this.type,
          root: this.rootReply.rpid
        });
        let rd = res.data;
        console.log("view more subReplies:",rd);
        if(rd.code === 0){
          // this.rootReply.replies = rd.data.replies;
          this.rootReply.replies.splice(0);
          let i = 0;
          for(i=0;i<rd.data.replies.length;i++){
            this.rootReply.replies.push(rd.data.replies[i]);
          }
          this.page = rd.data.page;
          this.noMore = true;
        }
        else {
          console.log("查看更多子评论失败");
        }
      },
      async pageSelect(index) {
        let res = await api.getRepliesOfAnyClassPage({
          pn: index,
          oid: this.oid,
          type: this.type,
          root: this.rootReply.rpid
        });
        let rd = res.data;
        if(rd.code === 0){
          this.rootReply.replies.splice(0);
          let i = 0;
          for(i=0;i<rd.data.replies.length;i++){
            this.rootReply.replies.push(rd.data.replies[i]);
          }
          // this.rootReply.replies = rd.data.replies;
          this.page = rd.data.page;
        }
        else {
          console.log("查看更多子评论失败");
        }
      },
      async upvote() {
        let upvoteRes;
        if (this.rootReply.like_status === 0) {
          upvoteRes = await api.upvoteReply(this.rootReply.rpid);
          this.rootReply.like++;
          this.rootReply.like_status = 1;
        } else {
          upvoteRes = await api.cancelUpvoteReply(this.rootReply.rpid);
          this.rootReply.like--;
          this.rootReply.like_status = 0;
        }
      },
      async delRootReply(){
        let res = await api.deleteMyRpely(this.rootReply.rpid);
        let rd = res.data;
        if(rd.code === 0){
          this.$emit('onRemoveRootReply',this.rootIndex);
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
        else {
          console.log("删除根评论失败，index:",this.rootIndex);
        }
      },
      removeSubReply(index){
        console.log("remove sub reply: ",index);
        this.rootReply.replies.splice(index,1);
      },
      showSubReplyBox(subRpy){
        this.replyInfo = subRpy;
        this.showReplyBox = true;
      },
      toggleReplyBox(){
        this.replyInfo = this.rootReply;
        this.showReplyBox = !this.showReplyBox;
      },
      async addSubReply(rpid){
        let res = await api.getRepliesOfAnyClassPage({
          rpid: rpid,
          oid: this.oid,
          type: this.type
          // root: this.rootReply.rpid
        });
        let rd = res.data;
        if(rd.code === 0){
          this.$emit("onUpdateRootReply",rd.data);
          this.page = rd.data.subpage;
          this.showReplyBox = false;
          this.noMore = true;
        }
        else {
          console.log("添加评论后刷新子评论失败");
        }
      }
    },
    created(){
      let id = localStorage.getItem("USER_ID");
      let rol = localStorage.getItem("ROLE");
      if(id){
        this.uid = parseInt(id);
      }
      if(rol){
        this.role = rol;
      }
      if(this.subPage){
        if(this.rootReply.rpid === this.subPage.rootId){
          this.page = this.subPage;
          this.noMore = true;
        }
      }
    }
  }
</script>

<style scoped>

</style>
<style>
.commentItemBox {
  display: flex;
  flex-direction: column;
  width: 900px;
  margin: 10px auto;
  border-bottom: 1px solid gray;
}
.commentItemInBox {
  display: flex;
  flex-direction: row;
}
.commentItemAvatar {
  height: 50px;
  width: 50px;
  border-radius: 50px;
  margin: 12px auto;
  cursor: pointer;
}
.commentContentBox {
  margin: auto auto;
  text-align: left;
}
.commentControlBox {
  display: flex;
  flex-direction: row;
}
.replyUsername {
  text-align: left;
  margin-left: 10px;
  font-weight: bold;
  color: rgb(127, 162, 238);
  cursor: pointer;
  /*内容自适应宽度*/
  display: inline-block;
}
.replyContent {
  color: white;
  height: auto;
  text-align: left;
  margin: -10px 10px;
  width: 820px;
  word-wrap: break-word;
  word-break: break-all;
}
.commentControlBox {
  width: 820px;
  height: 20px;
  margin: 12px 10px;
}
.commentFloor {
  font-size: 12px;
  margin: auto 0;
  color: gray;
}
.commentTime {
  font-size: 12px;
  margin: auto 10px;
  color: gray;
}
.commentUpvote {
  display: flex;
  flex-direction: row;
  margin: auto 5px;
  cursor: pointer;
}
.commentUpvote img {
  width: 20px;
  height: 20px;
  margin: auto auto;
}
.commentUpvote p {
  font-size: 12px;
  margin: auto auto;
  color: gray;
}
.commentReplyBtn {
  margin: auto 10px;
  color: rgb(24, 109, 189);
}
.commentDeleteBtn {
  margin: auto auto;
  margin-right: 0;
  color: rgb(156, 4, 4);
}
.commentDeleteBtn,
.commentReplyBtn {
  font-size: 13px;
  cursor: pointer;
  font-weight: bold;
}
.commentReplyBox {
  margin: auto auto;
  margin-bottom: 10px;
}
.seeMore {
  color: rgb(127, 162, 238);
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
  margin-left: 50px;
}
.childRepliesPageBox {
  display: flex;
  flex-direction: row;
  background: salmon;
}
</style>
