<template>
    <div class="personalInfoBox">
        <div class="wattingBox" v-if="loading">
            <img src='data:image/gif;base64,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'>
            <p>加载数据中...</p>
        </div>
        <div class="avatarBox">
            <p>当前头像</p>
            <img :src="avatar!=''?avatar:'../../../static/img/noAvatar.jpg'" @click="avatarSettingShow=true">
            <my-upload field="image"
                @crop-success="cropSuccess"
                @crop-upload-success="cropUploadSuccess"
                @crop-upload-fail="cropUploadFail"
                v-model="avatarSettingShow"
                :width="300"
                :height="300"
                :noSquare="true"
                :url="GLOBAL.uploadURL"
                :headers="GLOBAL.uploadHEADERS"
                img-format="jpg"
        ></my-upload>
        </div>
        <form class="infoForm">
            <div><p>昵称：</p><input disabled="true" :value="userInfo.nick"></div>
            <div>
                <p>性别：</p>
                <select v-model="userInfo.sex">
                    <option value="不明">不明</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                </select>
            </div>
            <!-- v-model和value不可并存 -->
            <div><p>年龄：</p><input v-model="userInfo.age"></div>
            <div class="sign"><p>我的签名：</p><textarea v-model="userInfo.sign"></textarea></div>
        </form>
        <div class="submitUserInfoBtn" @click="updateUserInfo"><p>提交</p></div>
    </div>
</template>

<script>
import api from "../../api.js";
import myUpload from "vue-image-crop-upload";
export default {
  components: {
    myUpload
  },
  data() {
    return {
      avatar:
        localStorage.getItem("face") == api.baseURL + "/" ||
        localStorage.getItem("face") == null
          ? "../../../static/img/noAvatar.jpg"
          : localStorage.getItem("face"),
      userInfo: {
        nick: "loading",
        sex: "不明",
        age: "loading",
        sign: "loading"
      },
      imgDataUrl: "",
      curImageUrl: "",
      avatarSettingShow: false,
      loading: true
    };
  },
  // watch: {
  //   '$route' (to, from) {
  //     console.log("to: ",to+" from: ",from);
  //     setTimeout(()=>{
  //       this.avatar = localStorage.getItem("face");
  //     },1);
  //   },
  // },
  methods: {
    async initUserInfo() {
      let uid = localStorage.getItem("USER_ID");
      if (uid) {
        let rd = (await api.getUserInfoByUid(uid)).data;
        console.log("用户信息", rd);
        if (rd.code === 0) {
          this.userInfo = rd.data;
        } else {
          console.log("获取用户信息失败");
        }
      } else {
        console.log("uid为空");
      }
      this.loading = false;
    },
    async updateUserInfo() {
      if(this.loading) return;
      let uid = localStorage.getItem("USER_ID");
      let user = {
        sex: this.userInfo.sex,
        age: this.userInfo.age,
        sign: this.userInfo.sign
      };
      if (user.sex !== "" && user.age !== "") {
        let rd = (await api.updateUserInfo(uid, user)).data;
        console.log("提交结果:", rd);
        if (rd.code === 0) {
          this.userInfo.age = rd.data.age;
          this.userInfo.sex = rd.data.sex;
          this.userInfo.sign = rd.data.sign;
          this.$message.success("修改成功");
        } else {
          this.loading = true;
          this.initUserInfo();
          this.$message({
            message: rd.msg,
            type: "error"
          });
        }
      }
    },
    cropSuccess(imgDataUrl, field) {
      console.log("-------- crop success --------");
    },
    cropUploadSuccess(res, field) {
      console.log("-------- upload success --------");
      console.log(res);
      let link = res.data.link;
      link = link.substring(link.lastIndexOf("/"));
      console.log("link:", link);
      let imageUrl = link;
      this.imgDataUrl = this.GLOBAL.imgURL + imageUrl;
      this.curImageUrl = this.GLOBAL.imgURL + imageUrl;
      console.log("field: " + field);
      this.updateUserAvatar();
    },
    cropUploadFail(status, field) {
      console.log("-------- upload fail --------");
      console.log(status);
      console.log("field: " + field);
    },
    async updateUserAvatar() {
      let uid = localStorage.getItem("USER_ID");
      console.log("uid:", uid);
      let user = {
        face: this.curImageUrl
      };
      let res = await api.updateUserInfo(uid, user);
      let rd = res.data;
      console.log(rd);
      if (rd.code === 0) {
        console.log("修改成功");
        localStorage.setItem("face", this.curImageUrl);
        setTimeout(() => {
          this.$router.go(0);
        }, 800);
        // this.$router.push({ name: "blank"});
        // this.$router.push({ name: "personal"});
      } else {
        console.log(rd.msg);
      }
    }
  },
  mounted() {
    this.initUserInfo();
  }
};
</script>

<style>
.personalInfoBox {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
}
.avatarBox {

}
.avatarBox p {
  color: wheat;
}
.avatarBox img {
  height: 80px;
  width: 80px;
  border-radius: 80px;
  margin-top: -10px;
  cursor: pointer;
}
.infoForm {
  width: 95%;
  height: 350px;
  margin: auto auto;
  text-align: center;
}
.infoForm p {
  line-height: 20px;
  text-align: left;
  width: 50px;
  height: 20px;
  margin: auto 0;
  color: wheat;
}
.infoForm input,
select {
  height: 30px;
  width: 40%;
  border-radius: 4px;
  border: 1px solid gray;
  padding-left: 10px;
  padding-right: 10px;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0);
  color: rgb(177, 175, 172);
}
.infoForm select {
  width: 45% !important;
  margin-top: 8px;
  background: rgba(255, 255, 255, 0);
  height: 30px;
}
.infoForm input:hover,
textarea:hover,
select:hover {
  border: 1px solid white;
  box-shadow: 0 0 1px white;
}
.infoForm input:focus,
textarea:focus,
select:focus {
  border: 1px solid rgb(100, 149, 237);
  box-shadow: 0 0 1px rgb(100, 149, 237);
}
.infoForm div {
  margin: 30px 10px;
  width: 400px;
  height: 40px;
  display: flex;
  flex-direction: row;
}
.sign {
  flex-direction: column !important;
  height: 100px !important;
  text-align: center;
  width: 100%;
}
.sign p {
  margin: 0 0 !important;
  width: 80px !important;
}
.sign textarea {
  padding: 5px 10px 5px 10px;
  resize: none;
  height: 80px;
  width: 200%;
  border-radius: 4px;
  border: 1px solid gray;
  transition: border 0.2s;
  background: rgba(255, 255, 255, 0);
  color: rgb(177, 175, 172);;
  margin-top: 10px;
}
.wattingBox {
  background: white;
  position: absolute;
  z-index: 300;
  width: 150px;
  height: 100px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  margin: 250px 275px;
}
.wattingBox img {
  margin: auto auto;
  margin-bottom: 0;
}
.wattingBox p {
  margin: auto auto;
  font-weight: bold;
}
.submitUserInfoBtn {
  margin: 10px 30px;
  background: rgb(0, 164, 240);
  border-radius: 5px;
  height: 30px;
  width: 100px;
  display: flex;
  flex-direction: column;
  transition: background 0.2s;
  cursor: pointer;
}
.submitUserInfoBtn:hover {
  background: rgb(0, 134, 196);
}
.submitUserInfoBtn:active {
  background: rgb(0, 174, 255);
}
.submitUserInfoBtn p {
  line-height: 30px;
  margin: auto auto;
  color: white;
}
</style>
