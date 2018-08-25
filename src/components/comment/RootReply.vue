<template>
  <div class="commentItemBox" :id="rootReply.rpid">
    <div class="commentItemInBox">
      <a :href="'#/user/'+rootReply.uid" target="_blank">
        <img :src="rootReply.user.avatar?rootReply.user.avatar:'../../../static/img/noAvatar.jpg'" class="commentItemAvatar">
      </a>
      <div class="commentContentBox">
        <div class="replyUsername">
          <a :href="'#/user/'+rootReply.uid" target="_blank" style="text-decoration: none;color: rgb(127, 162, 238);">
            {{rootReply.user.nick}}
          </a>
          <img v-if="top" class="stickFlag" src="../../../static/img/stick.png">
          <div class="adminBoxOutBox" tabindex="1" @blur="showAdminBox=false">
            <img class="adminMenuBtn" src="../../../static/img/replyMenu.png" @click="showAdminBox=!showAdminBox">
              <transition name="adminBoxTran">
                <div class="adminBox" v-if="showAdminBox">
                  <div class="adminInBox">
                    <p :class="['stick','greyBtn']" v-if="!top && canSetTop" @click="stickReply(rootReply.rpid)">置顶</p>
                    <p :class="['stick','greyBtn']" class="stick" v-if="top && canSetTop" @click="unStickReply(rootReply.rpid)">取消置顶</p>
                    <p class="report">举报</p>
                    <p class="report" v-if="canDelReply" @click="showDelDialog">删除</p>
                  </div>
                </div>
              </transition>
          </div>
        </div>
        <p class="replyContent">{{rootReply.content}}</p>
        <div class="commentControlBox">
          <p class="commentFloor">#{{rootReply.floor}}</p>
          <p class="commentTime">{{getDateDiff}}</p>
          <div class="commentUpvote" @click="upvote">
            <img :src="rootReply.like_status===0?'../../../static/img/upvote2.png':'../../../static/img/upvoted2.png'">
            <p>{{rootReply.like}}</p>
          </div>
          <p class="commentReplyBtn" @click="toggleReplyBox">回复</p>
          <div class="delConfirmOutBox" tabindex="1" @blur="showDelBox=false">
            <transition name="delConfirmTran">
              <div class="deleteConfirm" v-if="showDelBox">
                <p class="deleteConfirmTip">确定删除吗？</p>
                <div class="confirmDeleBtnBox">
                  <p class="cancelDelBtn" @click="showDelBox=!showDelBox">取消</p>
                  <p class="confirmDelBtn" @click="delRootReply">确定</p>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <div v-for="(subReply,index) in rootReply.replies" :key="subReply.rpid">
      <sub-reply :subReply="subReply"
                 :subIndex="index"
                 :oid="oid"
                 :type="type"
                 @onRemoveSubReply="removeSubReply"
                 @onShowSubReplyBox="showSubReplyBox">
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
      :top="top"
      @onAddTopSubReply="addTopSubReply"
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
  props: ["rootReply", "rootIndex", "oid", "type", "rpid", "subPage", "top"],
  components: {
    "post-reply": PostReply,
    "sub-reply": SubReply
  },
  data() {
    return {
      uid: "",
      role: "",
      page: "",
      showReplyBox: false,
      noMore: false,
      replyInfo: "",
      placeholder: "",
      showDelBox: false,
      showAdminBox: false
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
    canDelReply() {
      if(!this.uid)
        return false;  //没有登陆，不能删除评论
      if (this.type === 4){  //用户资料下的评论
          if (this.uid === this.oid){  //在自己的资料下面，可以删除全部评论，oid为要查看的用户资料的uid
            return true;
          }
          else if (this.role) {  //管理员可以删除全部评论
            if (this.role === "ROLE_ADMIN" || this.role === "ROLE_MANAGER")
              return true;
          }
          else if (this.uid === this.rootReply.uid) {  //用户可以删除自己发的评论
            return true;
          }
      }
      else {  //其他类型的评论
        if (this.uid === this.rootReply.uid) {  //用户可以删除自己发的评论
          return true;
        }
        else if (this.role) {  //管理员
          if (this.role === "ROLE_ADMIN" || this.role === "ROLE_MANAGER")
            return true;
        }
      }
      return false;
    },
    canSetTop(){
      if (!this.uid)  //没有登陆
        return false;
      if(this.type === 4){  //用户资料下的评论
        if(this.uid === this.oid){  //自己的资料下面的评论，可以进行置顶
          return true;
        }
        else {
          if (this.role === "ROLE_ADMIN" || this.role === "ROLE_MANAGER")
            return true;  //管理员为所欲为
        }
      }
      else {  //其他类型的评论
        if (this.role === "ROLE_ADMIN" || this.role === "ROLE_MANAGER")
          return true;  //其他类型的评论一般只有管理员可以置顶
      }
      return false;
    }
  },
  methods: {
    showDelDialog(){
      this.showAdminBox = false;
      this.showDelBox = !this.showDelBox;
    },
    async seeMore() {
      this.noMore = true;
      let res = await api.getRepliesOfAnyClassPage({
        pn: 1,
        oid: this.oid,
        type: this.type,
        root: this.rootReply.rpid
      });
      let rd = res.data;
      console.log("view more subReplies:", rd);
      if (rd.code === 0) {
        // this.rootReply.replies = rd.data.replies;
        this.rootReply.replies.splice(0);
        let i = 0;
        for (i = 0; i < rd.data.replies.length; i++) {
          this.rootReply.replies.push(rd.data.replies[i]);
        }
        this.page = rd.data.page;
        this.noMore = true;
      } else {
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
      if (rd.code === 0) {
        this.rootReply.replies.splice(0);
        let i = 0;
        for (i = 0; i < rd.data.replies.length; i++) {
          this.rootReply.replies.push(rd.data.replies[i]);
        }
        // this.rootReply.replies = rd.data.replies;
        this.page = rd.data.page;
      } else {
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
    async delRootReply() {
      let res = await api.deleteMyRpely(this.rootReply.rpid);
      let rd = res.data;
      if (rd.code === 0) {
        if(this.top){
          this.$emit("onRemoveTopReply");
          this.page = "";
          this.noMore = false;
        }
        else {
          this.$emit("onRemoveRootReply", this.rootIndex);
        }
        this.$message({
          message: "删除成功",
          type: "success"
        });
      } else {
        console.log("删除根评论失败，index:", this.rootIndex);
      }
    },
    removeSubReply(index) {
      console.log("remove sub reply: ", index);
      this.rootReply.replies.splice(index, 1);
    },
    showSubReplyBox(subRpy) {
      this.replyInfo = subRpy;
      this.showReplyBox = true;
    },
    toggleReplyBox() {
      this.replyInfo = this.rootReply;
      this.showReplyBox = !this.showReplyBox;
    },
    async addSubReply(rpid) {
      let res = await api.getRepliesOfAnyClassPage({
        rpid: rpid,
        oid: this.oid,
        type: this.type
        // root: this.rootReply.rpid
      });
      let rd = res.data;
      if (rd.code === 0) {
        this.$emit("onUpdateRootReply", rd.data);
        this.page = rd.data.subpage;
        this.showReplyBox = false;
        this.noMore = true;
      } else {
        console.log("添加评论后刷新子评论失败");
      }
    },
    async addTopSubReply(rpid){
      let res = await api.getRepliesOfAnyClassPage({
        rpid: rpid,
        oid: this.oid,
        type: this.type
        // root: this.rootReply.rpid
      });
      let rd = res.data;
      if (rd.code === 0) {
        this.$emit("onUpdateTopReply", rd.data);
        this.page = rd.data.subpage;
        this.showReplyBox = false;
        this.noMore = true;
      } else {
        console.log("添加评论后刷新置顶子评论失败");
      }
    },
    async stickReply(rpid) {
      console.log("置顶rpid", rpid);
      let resData = (await api.stickReply(rpid)).data;
      console.log("置顶", resData);
      if (resData.code === 0) {
        //初始化列表
        this.$emit("onRefreshComment");
        this.$message({
          message: "置顶成功",
          type: "success"
        });
      } else {
        this.$message({
          message: message.msg,
          type: "error"
        });
      }
    },
    async unStickReply(rpid) {
      console.log("取消置顶rpid", rpid);
      let resData = (await api.unstickReply(rpid)).data;
      console.log("取消置顶", resData);
      if (resData.code === 0) {
        //初始化列表
        this.$emit("onRefreshComment");
        this.$message({
          message: "取消置顶成功",
          type: "success"
        });
      } else {
        this.$message({
          message: message.msg,
          type: "error"
        });
      }
    }
  },
  created() {
    let id = localStorage.getItem("USER_ID");
    let rol = localStorage.getItem("ROLE");
    if (id) {
      this.uid = parseInt(id);
    }
    if (rol) {
      this.role = rol;
    }
    if (this.subPage) {
      if (this.rootReply.rpid === this.subPage.rootId) {
        this.page = this.subPage;
        this.noMore = true;
      }
    }
  }
};
</script>


<style scoped>
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
  position: relative;
}
.commentControlBox {
  display: flex;
  flex-direction: row;
}
.replyUsername {
  text-align: left;
  margin: 10px 10px;
  font-weight: bold;
  color: rgb(127, 162, 238);
  /*内容自适应宽度*/
  display: flex;
  flex-direction: row;
}
.adminMenuBtn {
  width: 20px;
  height: 20px;
  margin: auto auto;
  margin-right: 0;
  cursor: pointer;
}
.stickFlag {
  width: 35px;
  height: 20px;
  margin-left: 5px;
}
.replyContent {
  color: white;
  height: auto;
  text-align: left;
  margin: -8px 10px;
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
  cursor: pointer;
}
.childRepliesPageBox {
  display: flex;
  flex-direction: row;
  background: salmon;
}
.deleteConfirm {
  position: absolute;
  right: -5%;
  display: flex;
  flex-direction: column;
  background: white;
  width: 150px;
  height: 70px;
  margin-top: -90px;
  border-radius: 5px;
  overflow: hidden;
}
.delConfirmTran-leave-active,
.delConfirmTran-enter-active {
  transition: all 0.2s ease;
}
.delConfirmTran-leave-active,
.delConfirmTran-enter {
  height: 0px !important;
  /*!important 将该样式优先级调至最高*/
  opacity: 0;
}
.delConfirmTran-leave,
.delConfirmTran-enter-active {
  height: 70px;
}
.deleteConfirmTip {
  width: 100%;
  margin: 10px auto;
  color: red;
  font-weight: bold;
  font-size: 13px;
  text-align: center;
}
.confirmDeleBtnBox {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: -10px auto;
  margin-bottom: 0;
}
.confirmDeleBtnBox p {
  width: 50px;
  text-align: center;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
  color: white;
}
.cancelDelBtn {
  background: gray;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
.confirmDelBtn {
  background: rgb(255, 73, 73);
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
.adminBox {
  width: 70px;
  background: white;
  position: absolute;
  right: -2%;
  margin-top: 0px;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  /*overflow: hidden;*/
  outline: none;
  z-index: 30;
}
.adminInBox {
  margin: auto auto;
  width: 80%;
  overflow: hidden;
}
.adminBoxTran-leave-active,
.adminBoxTran-enter-active {
  transition: all 0.2s ease;
}
.adminBoxTran-leave-active,
.adminBoxTran-enter {
  height: 0px !important;
  /*!important 将该样式优先级调至最高*/
  opacity: 0;
}
.adminBoxTran-leave,
.adminBoxTran-enter-active {
  height: 70px;
}
.adminBox p {
  text-align: center;
  margin: 10px auto;
  font-size: 12px;
  line-height: 20px;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  display: block;
}
.stick {
  background: rgb(79, 199, 255);
}
.report {
  background: rgb(255, 73, 73);
}
.greyBtn {
  background: rgb(168, 168, 168);
}
.adminBoxOutBox{
  margin: auto auto;
  margin-right: 0;
  outline: none;
}
.delConfirmOutBox{
  outline: none;
  margin: auto auto;
  margin-right: 0;
}
</style>
