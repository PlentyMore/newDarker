<template>
  <div class="commentChildItemBox" :id="subReply.rpid">
    <div class="commentChildItemInBox">
      <a :href="'#/user/'+subReply.uid" target="_blank" >
        <img :src="subReply.user.avatar?subReply.user.avatar:'../../../static/img/noAvatar.jpg'" class="commentChildItemAvatar">
      </a>
      <div class="commentChildContentBox">
        <div class="replyChildUsername">
          <a :href="'#/user/'+subReply.uid" target="_blank" style="text-decoration: none;color: rgb(127, 162, 238);">
            {{subReply.user.nick}}
          </a>
          <img src="../../../static/img/replyMenu.png" @click="showAdminBox=!showAdminBox">
            <transition name="adminBoxTran">
              <div class="adminBox" v-if="showAdminBox">
                <div class="adminInBox">
                  <p class="report">举报</p>
                </div>
              </div>
            </transition>
        </div>
        <p class="replyChildContent">{{subReply.content}}</p>
        <div class="commentChildControlBox">
          <p class="commentChildTime">{{getDateDiff}}</p>
          <div class="commentChildUpvote" @click="upvote">
            <img :src="subReply.like_status===0?'../../../static/img/upvote2.png':'../../../static/img/upvoted2.png'">
            <p>{{subReply.like}}</p>
          </div>
          <p class="commentChildReplyBtn" @click="showReplyBox">回复</p>
          <p class="commentChildDeleteBtn" v-show="canDelReply" @click="showDelBox=!showDelBox">删除</p>
          <transition name="delConfirmTran">
            <div class="deleteConfirm" v-if="showDelBox">
              <p class="deleteConfirmTip">确定删除吗？</p>
              <div class="confirmDeleBtnBox">
                <p class="cancelDelBtn" @click="showDelBox=!showDelBox">取消</p>
                <p class="confirmDelBtn" @click="delSubReply">确定</p>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from "../../api.js";
  import { formatDate } from "../../time.js";
  export default {
    name: "SubReply",
    props:["oid","type","subReply","subIndex"],
    components:{
      // "reply-box": ReplyBox
    },
    data() {
      return {
        uid: "",
        role: "",
        showDelBox: false,
        showAdminBox:false,
      };
    },
    computed: {
      getDateDiff() {
        let minute = 1000 * 60;
        let hour = minute * 60;
        let day = hour * 24;
        let now = new Date().getTime();
        let diffValue = now - this.subReply.ctime;
        if (diffValue < 0) {
          return;
        }
        let dayC = diffValue / day;
        let hourC = diffValue / hour;
        let minC = diffValue / minute;
        if (dayC >= 1) {
          return formatDate(new Date(this.subReply.ctime), "yyyy-MM-dd hh:mm");
        } else if (hourC >= 1) {
          return "" + parseInt(hourC) + "小时前";
        } else if (minC >= 1) {
          return "" + parseInt(minC) + "分钟前";
        } else return "刚刚";
      },
      canDelReply(){
        if(this.uid === this.subReply.uid)
          return true;
        else if(this.role){
          if(this.role === 'ROLE_ADMIN' || this.role === 'ROLE_MANAGER')
            return true;
        }
        return false;
      }
    },
    methods:{
      async delSubReply(){
        let res = await api.deleteMyRpely(this.subReply.rpid);
        let rd = res.data;
        if(rd.code === 0){
          this.$emit("onRemoveSubReply",this.subIndex);
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
        else {
          console.log("删除子评论失败，index:",this.subIndex);
        }
      },
      async upvote() {
        let upvoteRes;
        if (this.subReply.like_status === 0) {
          upvoteRes = await api.upvoteReply(this.subReply.rpid);
          this.subReply.like++;
          this.subReply.like_status = 1;
        } else {
          upvoteRes = await api.cancelUpvoteReply(this.subReply.rpid);
          this.subReply.like--;
          this.subReply.like_status = 0;
        }
      },
      showReplyBox(){
        this.$emit("onShowSubReplyBox",this.subReply);
      },
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
    }
  }
</script>

<style scoped>

</style>
<style>
.commentChildItemBox {
  display: flex;
  flex-direction: column;
  width: 850px;
  margin: 0px auto;
  margin-right: 0;
}
.commentChildItemInBox {
  display: flex;
  flex-direction: row;
}
.commentChildItemAvatar {
  height: 30px;
  width: 30px;
  border-radius: 50px;
  margin: 13px auto;
  cursor: pointer;
}
.commentChildContentBox {
  text-align: left;
  margin: auto 5px;
}
.commentChildControlBox {
  display: flex;
  flex-direction: row;
}
.replyChildUsername {
  text-align: left;
  font-weight: bold;
  font-size: 13px;
  margin: 10px 10px;
  color: rgb(127, 162, 238);
  /*内容自适应宽度*/
  /*display: inline-block;*/
  display: flex;
  flex-direction: row;
}
.replyChildUsername img{
  width: 15px;
  height: 15px;
  margin: auto auto;
  margin-right: 0;
  cursor: pointer;
}
.replyChildContent {
  color: white;
  height: auto;
  text-align: left;
  font-size: 13px;
  margin: -8px 10px;
  width: 770px;
  word-wrap: break-word;
  word-break: break-all;
}
.commentChildControlBox {
  width: 770px;
  height: 20px;
  margin: 12px 10px;
}
.commentChildTime {
  font-size: 10px;
  margin: auto 0px;
  color: gray;
}
.commentChildUpvote {
  display: flex;
  flex-direction: row;
  margin: auto 5px;
  cursor: pointer;
}
.commentChildUpvote img {
  width: 15px;
  height: 15px;
  margin: auto auto;
}
.commentChildUpvote p {
  font-size: 10px;
  margin: auto auto;
  color: gray;
}
.commentChildReplyBtn {
  margin: auto 10px;
  color: rgb(24, 109, 189);
}
.commentChildDeleteBtn {
  margin: auto auto;
  margin-right: 0;
  color: rgb(156, 4, 4);
}
.commentChildDeleteBtn,
.commentChildReplyBtn {
  font-size: 11px;
  cursor: pointer;
  font-weight: bold;
}
.commentChildReplyBox {
  margin: auto auto;
  margin-bottom: 10px;
}
.deleteConfirm{
  position: absolute;
  right: 21%;
  display:flex;
  flex-direction:column;
  background: white;
  width:150px;
  height: 70px;
  margin-top: -80px;
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
.deleteConfirmTip{
  width:100%;
  margin: 10px auto;
  color: red;
  font-weight: bold;
  font-size: 13px;
  text-align: center;
}
.confirmDeleBtnBox{
  display: flex;
  flex-direction:row;
  justify-content: center;
  margin: -10px auto;
  margin-bottom: 0;
}
.confirmDeleBtnBox p{
  width:50px;
  text-align:center;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
  color: white;
}
.cancelDelBtn{
  background: gray;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
.confirmDelBtn{
  background: rgb(255, 73, 73);
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
.adminBox{
  width: 70px;
  background: white;
  position: absolute;
  right: 23.5%;
  height: 40px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  overflow: hidden;
}
.adminInBox{
  margin: auto auto;
  width: 80%;
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
  height: 40px;
}
.adminBox p{
  text-align: center;
  margin: 10px auto;
  font-size: 12px;
  line-height: 20px;
  border-radius: 3px;
  color: white;
  cursor: pointer;
}
.stick{
  background: rgb(79, 199, 255);
}
.report{
  background: rgb(255, 73, 73);
}
</style>
