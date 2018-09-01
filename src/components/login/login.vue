<template>
    <div class="loginPage">
        <div class="loginBox">
          <div class="closeNowLoginBox" @click="closeNowLogin">×</div>
          <form action="" method="get">
            <img src="../../../static/img/logo.png" class="loginLogo">
            <p>登入 Darker</p>
            <input type="text" name="fname" placeholder="昵称/邮箱" v-model="username"/>
            <input @keyup.enter="login" type="password" name="lname" min="6" max="20" placeholder="请输入密码" v-model="password"/>
            <div class="switchBox">
              记住我
              <darker-switch :choose.sync="choose" class="switch"></darker-switch>
            </div>
            <a @click="login">登陆</a>
            <div class="pswToolBox"><a href="#/register" class="pswToolBtn">马上注册</a> | <a href="#/forget" class="pswToolBtn">忘记密码？</a></div>
          </form>
        </div>
    </div>
</template>

<script>
import darkerSwitch from "../darkerStyleComponents/darkerSwitch.vue";
import api from "../../api.js";
export default {
  data() {
    return {
      choose: false,
      username: "",
      password: ""
    };
  },
  components: {
    darkerSwitch
  },
  watch: {},
  methods: {
    async login() {
      //合法性检测
      if (this.username == "" || this.password == "") {
        this.$message({
          message: "账号或密码不能为空！",
          type: "error"
        });
        return;
      }
      let res = await api.login({
        principal: this.username,
        password: this.password,
        remember_me: this.choose ? 1 : 0
      });
      console.log(res);
      let data = res.data;
      //登陆错误
      if (data.code === 2002 || data.data == null) {
        this.$message({
          message: "账号或密码错误，请重试！",
          type: "error"
        });
        return false;
      }
      //登陆成功
      if (data.code === 0 || data.msg === "OK") {
        if (!data.data.token) {
          this.$message({
            message:
              "登陆错误，请重试！(Error message: Can't not get the Token)",
            type: "error"
          });
          return;
        }
        if(this.checkLocalStorage()){
            localStorage.setItem("USER_ID", data.data.user.uid);
            localStorage.setItem("JWT_TOKEN", data.data.token);
            localStorage.setItem("loginUserName", this.username);
            localStorage.setItem("face", data.data.user.face);
            localStorage.setItem("ROLE", data.data.user.role);
            console.log('登录成功了！',localStorage);
            window.location.reload();
        }
      }
    },
    //检测是否保持了登录状态
    checkLocalStorage() {
      if (typeof window.localStorage === "undefined") {
        this.$message({
          message: "错误：无法保持登录状态！（浏览器不支持，或开启了关闭隐私模式）",
          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    },
    closeNowLogin(){
      this.$emit('closeLoginBox');
    }
  }
};
</script>

<style scoped>
.loginPage,
.loginBox,
.loginBox form {
  display: flex;
  flex-direction: column;
}
.loginBox,
.loginBox p,
.loginBox form,
.loginBox input,
.loginBox a,
.switch {
  margin: auto auto;
}
.loginPage {
  margin:-60px 0;
  width: 100%;
  height: 100%;
  background: rgba(128, 128, 128, 0.295);
}
.closeNowLoginBox{
  font-size: 20px;
  background: rgba(73, 73, 73, 0.7);
  width: 30px;
  margin: 0 auto;
  margin-right: 0;
  border-top-right-radius: 5px;
  cursor: pointer;
  color: white;
  transition: all .2s;
}
.closeNowLoginBox:hover{
  background: rgba(73, 73, 73, 0.9);
}
.closeNowLoginBox:active{
  background: rgba(73, 73, 73, 0.5);
}
.loginBox {
  background: rgba(97, 97, 97, 0.596);
  width: 350px;
  height: 450px;
  border-radius: 5px;
  border: 0px solid white;
  box-shadow: 0px 0px 10px gray;
  transition: all 0.2s;
}
.loginBox:hover {
  box-shadow: 0px 0px 5px gray;
  border: 0px solid rgb(228, 225, 225);
}
.loginBox img{
  height: 15%;
  width: 35%;
  margin: 0 auto;
}
.loginBox p {
  font-size: 25px;
  color: wheat;
  font-family: 华文琥珀,serif;
}
.loginBox form {
  height: 90%;
  width: 100%;
}
.loginBox input {
  background: rgba(255, 255, 255, 0.85);
  height: 33px;
  width: 60%;
  border-radius: 4px;
  border: 1px solid gray;
  padding-left: 10px;
  padding-right: 10px;
  transition: border 0.2s;
  outline: none;
  /*font-family: 'Leckerli One', cursive;*/
}
.loginBox input:hover {
  border: 1px solid white;
}
.loginBox input:focus {
  border: 1px solid rgb(0, 0, 0);
}
.switchBox {
  display: flex;
  flex-direction: row;
  font-size: 12px;
  color: white;
  line-height: 20px;
  width: 67%;
  margin: 0 auto;
}
.switch{
  margin-right: 0;
}
.loginBox a {
  height: 40px;
  width: 67%;
  line-height: 40px;
  border-radius: 5px;
  color: white;
  /*border: 1px solid white;*/
  background: rgb(100, 149, 237);
  transition: all 0.1s;
  cursor: pointer;
  /*去掉a标签下划线*/
  text-decoration: none;
}
.loginBox a:hover {
  background: rgb(65, 105, 225);
}
.loginBox a:active {
  background: rgb(100, 149, 237);
  border: 1px solid gray;
}
.pswToolBox{
  color: white;
  width: 70%;
  margin: 0px auto;
}
.pswToolBox a{
  background: rgba(228, 225, 225,0);
  color: white;
  border: 0px;
  font-size: 12px;
  transition: all .2s;
}
.pswToolBox a:hover{
  color: black;
  background: rgba(228, 225, 225,0);
}
</style>
