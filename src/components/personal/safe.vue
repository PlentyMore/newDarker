<template>
    <div class="safeBox">
        <div class="wattingBox" v-if="loading">
            <img src='data:image/gif;base64,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'>
            <p>加载数据中...</p>
        </div>
        <div class="safeInBox">
            <div>
                <p style="background:green" class="finishLogo">v</p>
                <p>设置密码</p>
            </div>
            <p>已设置</p>
            <p class="safeBtn" @click="showSetting(1)" style="cursor:pointer;">修改密码</p>
        </div>
        <div class="safeInBox">
            <div>
                <p :style="finishStyle" class="finishLogo">{{flag}}</p>
                <p>绑定邮箱</p>
            </div>
            <p v-if="mail!=''" style="cursor:pointer;" @click="forceChangeMail(2)">{{mail}}{{mailVerifiedText}}</p>
            <p v-else style="cursor:pointer;">未绑定</p>
            <p class="safeBtn" @click="showSetting(2)" style="cursor:pointer;">{{mailBtnText}}</p>
        </div>
        <div v-if="safeMode==1" class="setBox1">
            <p class="safeTitle">修改密码</p>
            <input placeholder="请输入原密码" type="password" v-model="oldPsw" :data-correct="oldPswCorrect">
            <p v-if="oldPswCorrect" class="wrongTip">原密码错误或为空</p>
            <input placeholder="请输入新密码" type="password" v-model="newPsw" :data-correct="newPswCorrect">
            <p v-if="newPswCorrect" class="wrongTip">新密码不符合要求或为空</p>
            <input placeholder="请确认新密码" type="password" v-model="renewPsw" :data-correct="renewPswCorrect">
            <p v-if="renewPswCorrect" class="wrongTip">两次密码输入不相同或为空</p>
            <p class="safeSubmit" @click="updatePwd">提交</p>
        </div>
        <div v-if="safeMode==2" class="setBox">
            <p class="safeTitle">更换邮箱</p>
            <div class="newMailBox">
                <input v-model="newMail" :data-correct="mailCorrect" placeholder="请输入新邮箱">
                <p class="safeSubmit" v-if="!sentMailCode" @click="sendMailCode">发送验证码</p>
                <p class="safeSubmitTime" v-if="sentMailCode">重新发送({{codeTimer}}s)</p>
            </div>
            <p v-if="mailCorrect" class="mailWrongTip">邮箱格式错误或已被注册</p>
            <div class="mailCodeSubmit">
                <input v-model="mailCode" :data-correct="mailCodeCorrect" placeholder="请输入验证码">
                <p class="nothingCodeTip" :style="mailCodeStyle">{{mailCodeText}}</p>
            </div>
            <p class="safeSubmit mailSubmit" @click="updateMail">确定</p>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
export default {
  data() {
    return {
      loading: true,
      finishStyle: { background: "red"},
      flag: "×",
      finishMail: true,
      mail: "",
      safeMode: 0,
      oldPsw: "",
      newPsw: "",
      renewPsw: "",
      mail: "",
      newMail: "",
      mailVerified: false,
      mailVerifiedText: "(未验证)",
      mailBtnText: "验证邮箱",
      mailCodeText: "等待提交",
      mailCodeStyle: { color: "wheat" },
      mailCode: "",
      oldPswCorrect: false,
      newPswCorrect: false,
      renewPswCorrect: false,
      mailCorrect: false,
      mailCodeCorrect: false,
      sentMailCode: false,
      codeTimer: 60,
      codeInterval: null
    };
  },
  watch: {
    oldPsw: function() {
      this.oldPswCorrect = this.oldPsw == "";
    },
    newPsw: function() {
      var passwordRegEx = new RegExp("[a-z0-9A-Z._]{6,20}", "g");
      this.newPswCorrect = !passwordRegEx.test(this.newPsw);
      if (this.renewPsw != "")
        this.renewPswCorrect = !(this.newPsw == this.renewPsw);
    },
    renewPsw: function() {
      this.renewPswCorrect = !(this.newPsw == this.renewPsw);
    },
    newMail: function() {
      var emailRegEx = new RegExp(
        "^[A-Za-z0-9\\u4e00-\\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$",
        "g"
      );
      this.mailCorrect = !emailRegEx.test(this.mail);
    },
    mailCode: function() {
      this.mailCodeCorrect = this.mailCode == "";
    }
  },
  methods: {
    async initUserInfo() {
      let uid = localStorage.getItem("USER_ID");
      if (uid) {
        let rd = (await api.getUserInfoByUid(uid)).data;
        console.log("用户信息", rd);
        if (rd.code === 0) {
          this.flag = "!";
          this.finishStyle = { background: "rgb(153, 108, 25)" };
          this.mailCodeText = "等待提交";
          this.mailCodeStyle = { color: "wheat" };
          if (rd.data.emailVerified == 1) {
            if (!this.mailVerified && this.codeInterval != null) {
              //激活邮箱时，每十秒检测一次数据，若变为了已激活，则循环定时器去除
              clearInterval(this.codeInterval);
              this.codeInterval = null;
              this.codeTimer = 60;
            }
            this.mailVerified = true;
            this.flag = "v";
            this.finishStyle = { background: "green" };
            this.mailVerifiedText = "(已验证)";
            this.mailBtnText = "更换邮箱";
          } else {
            this.mailBtnText = "验证邮箱";
            this.mailVerified = false;
            this.flag = "!";
            this.finishStyle = { background: "rgb(153, 108, 25)" };
            this.mailVerifiedText = "(未验证)";
          }
          this.mail = rd.data.email;
        } else {
          console.log("获取用户信息失败");
        }
      } else {
        console.log("uid为空");
      }
      this.safeMode = 0;
      this.loading = false;
    },
    async updatePwd() {
      let rd = (await api.updateUserPwd(localStorage.getItem("USER_ID"), {
        opwd: this.oldPsw,
        cpwd: this.renewPsw
      })).data;
      console.log(rd);
      if (rd.code === 0) {
        this.$message.success("密码修改成功!");
        this.showPwdBox = false;
        this.safeMode = 0;
      } else {
        this.oldPswCorrect = true;
        this.$message.error(rd.msg);
      }
    },
    showSetting(index) {
      if (index == 2 && !this.mailVerified) {
        this.verifyEmail();
      } else this.safeMode = this.safeMode == index ? 0 : index;
    },
    forceChangeMail(index) {
      this.safeMode = this.safeMode == index ? 0 : index;
    },
    async verifyEmail() {
      //修改邮箱后再次点击验证时，会重复发送验证，这里防止了这种情况
      this.initUserInfo();
      if (this.mailVerified) {
        console.log("防重复发送");
        return;
      }
      //-----
      let rd = (await api.reVerifyEmail()).data;
      if (rd.code === 0) {
        console.log("验证码发送结果", rd);
        this.$message.success("验证邮箱发送成功，请在20分钟内确认");
        this.mailBtnText = "重新发送(" + this.codeTimer.toString() + "s)";
        clearInterval(this.codeInterval);
        this.codeInterval = null;
        this.codeInterval = setInterval(() => {
          //十秒刷新一次数据
          if (this.codeTimer % 10 == 0) {
            this.loading = true;
            this.initUserInfo();
          }
          if (this.codeTimer == 0) {
            this.codeTimer = 60;
            this.mailBtnText = "验证邮箱";
            clearInterval(this.codeInterval);
            this.codeInterval = null;
          }
          this.codeTimer--;
          this.mailBtnText = "重新发送(" + this.codeTimer.toString() + "s)";
        }, 1000);
      } else {
        this.$message.error(rd.msg);
      }
    },
    async sendMailCode() {
      if (this.mail == this.newMail || this.newMail == "") {
        this.$message({
          message: "不可重设为旧邮箱或为空",
          type: "error"
        });
        return;
      }
      this.sentMailCode = true;
      let code = await api.getEmailResetCode();
      console.log("发送验证码", code);
      clearInterval(this.codeInterval);
      this.codeInterval = null;
      this.codeInterval = setInterval(() => {
        if (this.codeTimer == 0) {
          this.codeTimer = 60;
          this.sentMailCode = false;
          clearInterval(this.codeInterval);
          this.codeInterval = null;
        }
        this.codeTimer--;
      }, 1000);
      if (code.data.code === 0) {
        this.$message({
          message: "发送验证码成功",
          type: "success"
        });
      } else {
        this.$message({
          message: code.data.msg,
          type: "error"
        });
      }
    },
    async updateMail() {
      if (this.mail == this.newMail || this.newMail == "") {
        this.$message({
          message: "不可重设为旧邮箱或为空",
          type: "error"
        });
        return;
      }
      this.mailCodeText = "验证中...";
      let rd = (await api.modifyEmail(localStorage.getItem("USER_ID"), {
        email: this.newMail,
        rcode: this.mailCode
      })).data;
      console.log("更换邮箱", rd);
      if (rd.code === 0) {
        this.mailCodeStyle = { color: "green" };
        this.mailCodeText = "验证成功";
        setTimeout(this.initUserInfo(), 2000);
        this.$message({
          message: rd.msg,
          type: "success"
        });
      } else {
        (this.mailCodeStyle = { color: "red" }), (this.mailCodeText = rd.msg);
      }
    }
  },
  mounted() {
    this.initUserInfo();
  }
};
</script>

<style>
.safeBox {
  font-size: 13px;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
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
.safeInBox {
  display: flex;
  flex-direction: row;
  height: 80px;
  width: 90%;
  border-top: 2px solid black;
  margin: auto auto;
}
.safeInBox div {
  margin: auto 0px;
  display: flex;
  flex-direction: row;
}
.safeBtn {
  margin: auto 0px !important;
}
.finishLogo {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  line-height: 15px;
  color: white;
  font-size: 15px;
  font-weight: bold;
}
.safeInBox p {
  margin: auto auto;
}
.setBox {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 300px;
  height: 200px;
  border-radius: 5px;
  left: 46%;
  top: 300px;
  background: #252e53;
}
.safeTitle {
  font-size: 18px;
  font-weight: bold;
  line-height: 40px;
  color: wheat;
  background: #020b36;
  margin-top: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  height: 40px;
}
.setBox input {
  height: 22px;
  width: 40%;
  border-radius: 4px;
  border: 1px solid gray;
  padding-left: 10px;
  padding-right: 10px;
  transition: border 0.2s;
  margin: 18px auto;
}
.setBox input:hover {
  border: 1px solid white;
}
.setBox input:focus {
  border: 1px solid rgb(100, 149, 237);
}
.safeSubmit {
  height: 25px;
  width: 50%;
  line-height: 25px;
  border-radius: 25px;
  border: 1px solid white;
  font-weight: bold;
  font-size: 12px;
  background: rgb(100, 149, 237);
  transition: all 0.1s;
  margin: 10px auto;
  cursor: pointer;
}
.safeSubmit:hover {
  background: rgb(65, 105, 225);
}
.safeSubmit:active {
  background: rgb(100, 149, 237);
  border: 1px solid gray;
}
.safeSubmitTime {
  color: wheat;
  height: 25px;
  width: 15%;
  line-height: 25px;
  font-size: 13px;
  border-radius: 25px;
  border: 1px solid gray;
  margin: 25px auto;
}
.codeTimer {
  color: wheat;
  font-size: 12px;
}
[data-correct] {
  border: 2px solid red !important;
}
.wrongTip {
  color: red;
  font-size: 10px;
  margin: -15px auto;
}
.correctTip {
  color: green;
  font-size: 10px;
  margin: -15px auto;
}
.mailWrongTip {
  color: red;
  font-size: 10px;
}
.wrongCodeTip {
  color: red;
  font-size: 10px;
}
.nothingCodeTip {
  color: black;
  font-size: 10px;
}
.newMailBox {
  display: flex;
  flex-direction: row;
  width: 80%;
  margin: 10px auto;
}
.newMailBox input {
  margin: auto 0 !important;
  width: 60%;
}
.newMailBox p {
  margin: auto 10px !important;
  width: 40%;
}
.mailCodeSubmit {
  display: flex;
  flex-direction: row;
  width: 80%;
  margin: 20px auto;
}
.mailCodeSubmit input {
  margin: auto 0 !important;
  width: 49% !important;
}
.mailCodeSubmit p {
  margin: auto 0 !important;
  width: 40% !important;
}
.mailSubmit {
  margin-top: 10px;
  width: 40%;
}
.setBox1 {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 300px;
  height: 200px;
  border-radius: 5px;
  left: 46%;
  top: 300px;
  background: #252e53;
}
.setBox1 input {
  height: 300px !important;
  width: 40%;
  border-radius: 4px;
  border: 1px solid gray;
  padding-left: 10px;
  padding-right: 10px;
  transition: border 0.2s;
  margin: 5px auto;
}
.setBox1 input:hover {
  border: 1px solid white;
}
.setBox1 input:focus {
  border: 1px solid rgb(100, 149, 237);
}
</style>
