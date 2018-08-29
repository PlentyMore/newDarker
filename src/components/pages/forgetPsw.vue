<template>
    <div class="forgetBox">
        <div class="nowPath">
            <p class="nowPathItem1" @click="backToLogin">登陆</p>
            <p class="nowPathTo">〉</p>
            <p class="nowPathItem2">忘记密码</p>
        </div>
        <div class="forgetPath">
            <div :class="['pathItem',step==1?'selectedPathItem':'finishedPathItem']"  @click="selectStep(1)">
                <div :class="['pathItemNum',step==1?'selectedPathItemNum':'finishedPathItemNum']">1</div>
                <div class="pathItemTitle">确认账号</div>
            </div>
            <div class="pathLine">————</div>
            <div :class="['pathItem',step==2?'selectedPathItem':(finished<2?'':'finishedPathItem')]" @click="selectStep(2)">
                <div :class="['pathItemNum',step==2?'selectedPathItemNum':(finished<2?'':'finishedPathItemNum')]">2</div>
                <div class="pathItemTitle">重置密码</div>
            </div>
            <div class="pathLine">————</div>
            <div :class="['pathItem',step==3?'selectedPathItem':'']">
                <div :class="['pathItemNum',step==3?'selectedPathItemNum':'']">3</div>
                <div class="pathItemTitle">重置成功</div>
            </div>
        </div>
        <div class="forgetStep1" v-if="step==1">
            <input placeholder="请输入绑定的邮箱" v-model="mail">
            <p @click="finishStep(1)">确认</p>
        </div>
        <div class="forgetStep2" v-if="step==2">
            <input placeholder="新密码：6-20位字符" type="password" v-model="psw1" :style="correctPsw1?'border: 1px solid red':''">
            <p class="errorTip">{{correctPsw1?'密码不符合格式或为空':''}}</p>
            <input placeholder="请输入确认密码" type="password" v-model="psw2" :style="correctPsw2?'border: 1px solid red':''">
            <p class="errorTip">{{correctPsw2?'两次密码不相同':''}}</p>
            <div class="changeMailBox">
                <p class="mailShow">邮箱：{{mail}}</p>
                <p class="changeMailBtn" @click="selectStep(1)">修改</p>
            </div>
            <div class="mailCodeBox">
                <input placeholder="请输入邮件验证码" v-model="mailCode" maxlength="6">
                <p class="getCodeBtn" @click="getEmailCode" v-if='time==0'>获取验证码</p>
                <p class="getCodeGreyBtn" v-if="time>0">重新发送({{time}}s)</p>
            </div>
            <p class="confirmReset" @click="finishStep(2)">确认修改</p>
        </div>
        <div class="forgetStep3" v-if="step==3">
            <p class="successTip">重置密码成功</p>
            <p class="timeoutJmp">{{time}}s后将跳转至登陆页面</p>
            <p class="backToMain" @click="backToMain">回到首页</p>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
export default {
  data() {
    return {
      step: 1,
      finished: 0,
      mail: "",
      ticket: "",
      psw1: "",
      psw2: "",
      correctPsw1: false,
      correctPsw2: false,
      mailCode: "",
      time: 0,
      timer: null
    };
  },
  watch: {
    psw1() {
      var passwordRegEx = new RegExp("[a-z0-9A-Z._]{6,20}", "g");
      this.correctPsw1 = !passwordRegEx.test(this.psw1);
      if (this.psw2 != "") this.correctPsw2 = !(this.psw1 == this.psw2);
    },
    psw2() {
      this.correctPsw2 = !(this.psw1 == this.psw2);
    }
  },
  methods: {
    selectStep(index) {
      if (this.step == 3) return;
      if (this.finished + 1 >= index) {
        this.step = index;
      }
    },
    async getEmailCode() {
      let resData = (await api.getMailCode({ ticket: this.ticket })).data;
      console.log("发送验证码", resData);
      if (resData.code === 0) {
        this.$message({
          message: resData.msg,
          type: "success"
        });
        clearInterval(this.timer);
        this.timer = null;
        this.time = 60;
        this.timer = setInterval(() => {
          this.time--;
          if (this.time == 0) {
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      } else {
        this.$message({
          message: resData.msg,
          type: "error"
        });
      }
    },
    async finishStep(index) {
      if (index == 1) {
        if (this.mail == "") {
          this.$message({
            message: "邮箱不可为空",
            type: "error"
          });
        } else {
          //发送检测账号是否存在的请求
          let resData = (await api.checkEmail({
            email: this.mail
          })).data;
          console.log(resData);
          if (resData.code === 0) {
            this.finished = 1;
            this.step = 2;
            this.mail = resData.data.value;
            this.ticket = resData.data.ticket;
            console.log("邮箱检测成功", this.ticket);
          } else {
            this.$message({
              message: resData.msg,
              type: "error"
            });
          }
        }
      } else if (index == 2) {
        if (this.correctPsw1 || this.correctPsw2) {
          this.$message({
            message: "请输入正确的新密码",
            type: "error"
          });
          return;
        }
        if (this.mailCode == "" || this.mailCode.length < 6) {
          this.$message({
            message: "请输入正确的验证码",
            type: "error"
          });
          return;
        }
        let resData = (await api.resetPassword({
          ticket: this.ticket,
          pwd: this.psw2,
          rcode: this.mailCode
        })).data;
        console.log("提交密码", resData);
        if (resData.code === 0) {
          this.step = 3;
          this.finished = 2;
          this.time = 5;
          clearInterval(this.timer);
          this.timer = null;
          console.log("outside", this.timer);
          this.timer = setInterval(() => {
            this.time--;
            console.log("inside", this.timer);
            if (this.time == 0) {
              clearInterval(this.timer);
              this.timer = null;
              this.$router.push({ name: "login" });
            }
          }, 1000);
        } else if (resData.code === 5005) {
          this.$message({
            message: resData.msg,
            type: "error"
          });
          this.step=1;
          this.finished=0;
          this.ticket='';
          this.mail='';
          this.psw1='';
          this.psw2='';
          this.correctPsw1=false;
          this.correctPsw2=false;
          this.mailCode='';
          this.time=0;
          clearInterval(this.timer);
          this.timer=null;
        } else {
          this.$message({
            message: resData.msg,
            type: "error"
          });
        }
      }
    },
    backToMain() {
      clearInterval(this.timer);
      this.timer = null;
      this.$router.push({ name: "index" });
    },
    backToLogin(){
      this.$router.push({ name: "login" });
    }
  }
};
</script>

<style>
.selectedPathItem {
  color: rgb(255, 87, 115) !important;
}
.selectedPathItemNum {
  border: 2px solid rgb(255, 87, 115) !important;
}
.finishedPathItem {
  color: rgb(40, 126, 255) !important;
}
.finishedPathItemNum {
  border: 2px solid rgb(40, 126, 255) !important;
}
.forgetBox {
  display: flex;
  flex-direction: column;
  height: 845px;
}
.nowPath {
  display: flex;
  flex-direction: row;
  width: 50%;
  margin: 50px auto;
}
.nowPathItem1 {
  color: wheat;
  font-weight: bold;
  cursor: pointer;
  font-size: 15px;
  line-height: 20px;
}
.nowPathTo {
  color: grey;
  font-weight: bold;
  margin-left: 10px;
}
.nowPathItem2 {
  color: wheat;
  margin-left: 0px;
  font-size: 15px;
  line-height: 20px;
}
.forgetPath {
  display: flex;
  flex-direction: row;
  width: 28%;
  margin: -30px auto;
}
.pathLine {
  margin: auto auto;
  color: grey;
}
.pathItem {
  display: flex;
  flex-direction: row;
  margin: auto auto;
  color: gray;
  cursor: pointer;
}
.pathItemTitle {
  margin: auto 10px;
  margin-right: 0px;
  line-height: 26px;
}
.pathItemNum {
  width: 20px;
  height: 20px;
  font-size: 12px;
  line-height: 20px;
  border-radius: 25px;
  border: 2px solid gray;
}
.forgetBox input {
  height: 30px;
  width: 300px;
  border-radius: 4px;
  border: 1px solid gray;
  padding-left: 10px;
  padding-right: 10px;
  transition: border 0.2s;
  outline: none;
}
.forgetBox input:hover {
  border: 1px solid white;
}
.forgetBox input:focus {
  border: 1px solid rgb(100, 149, 237);
}
.forgetStep1 {
  width: 30%;
  margin: 100px auto;
}
.forgetStep1 p {
  height: 30px;
  width: 320px;
  line-height: 30px;
  border-radius: 5px;
  color: white;
  border: 1px solid white;
  font-weight: bold;
  background: rgb(100, 149, 237);
  transition: all 0.1s;
  margin: 30px auto;
  cursor: pointer;
}
.forgetStep1 p:hover {
  background: rgb(65, 105, 225);
}
.forgetStep1 p:active {
  background: rgb(100, 149, 237);
  border: 1px solid gray;
}
.forgetStep2 {
  display: flex;
  flex-direction: column;
  margin: 100px auto;
}
.forgetStep2 input {
  margin: -10px auto;
}
.errorTip {
  color: red;
  margin-top: 12px;
  font-size: 13px;
  text-align: left;
}
.changeMailBox {
  display: flex;
  flex-direction: row;
}
.mailShow {
  margin: 0 0;
  font-size: 13px;
  color: wheat;
}
.changeMailBtn {
  margin: auto auto;
  margin-right: 0px;
  color: rgb(1, 132, 255);
  font-size: 13px;
  cursor: pointer;
}
.mailCodeBox {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}
.mailCodeBox input {
  width: 180px;
  margin: 10px 0;
}
.getCodeGreyBtn {
  height: 30px;
  width: 100px;
  line-height: 30px;
  border-radius: 5px;
  color: white;
  border: 1px solid white;
  font-weight: bold;
  font-size: 13px;
  background: grey;
  transition: all 0.1s;
  margin: auto auto;
  margin-right: 0;
  cursor: pointer;
}
.getCodeBtn {
  height: 30px;
  width: 100px;
  line-height: 30px;
  border-radius: 5px;
  color: white;
  border: 1px solid white;
  font-weight: bold;
  background: rgb(100, 149, 237);
  transition: all 0.1s;
  margin: auto auto;
  margin-right: 0;
  cursor: pointer;
}
.getCodeBtn:hover {
  background: rgb(65, 105, 225);
}
.getCodeBtn:active {
  background: rgb(100, 149, 237);
  border: 1px solid gray;
}
.confirmReset {
  height: 30px;
  width: 320px;
  line-height: 30px;
  border-radius: 5px;
  color: white;
  border: 1px solid white;
  font-weight: bold;
  background: rgb(100, 149, 237);
  transition: all 0.1s;
  margin: 15px auto;
  margin-right: 0;
  cursor: pointer;
}
.confirmReset:hover {
  background: rgb(65, 105, 225);
}
.confirmReset:active {
  background: rgb(100, 149, 237);
  border: 1px solid gray;
}
.forgetStep3 {
  margin: 100px auto;
}
.successTip {
  color: wheat;
  font-size: 23px;
  font-weight: bold;
}
.timeoutJmp {
  color: wheat;
}
.backToMain {
  height: 30px;
  width: 320px;
  line-height: 30px;
  border-radius: 5px;
  color: white;
  border: 1px solid white;
  font-weight: bold;
  background: rgb(100, 149, 237);
  transition: all 0.1s;
  margin: 15px auto;
  margin-right: 0;
  cursor: pointer;
}
.backToMain:hover {
  background: rgb(65, 105, 225);
}
.backToMain:active {
  background: rgb(100, 149, 237);
  border: 1px solid gray;
}
</style>
