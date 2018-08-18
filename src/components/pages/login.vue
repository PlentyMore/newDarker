<template>
    <div class="loginPage">
        <div class="loginBox">
            <form action="" method="get">
                <p>登入 Darker</p>
                <p></p>
                <input type="text" name="fname" placeholder="昵称/邮箱" v-model="username"/>
                <input type="password" name="lname" min="6" max="20" placeholder="请输入密码" v-model="password"/>
                <div class="switchBox">
                    记住我
                    <darker-switch :choose.sync="choose" class="switch"></darker-switch>
                     不在自己电脑上不要选择该选项
                </div>
                <a @click="login">登陆</a>
                <a href="#/forget">忘记密码？</a>
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
            window.location.href = "/";
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
    }
  }
};
</script>

<style>
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
  width: 100%;
  height: 800px;
}
.loginBox {
  background: rgba(128, 128, 128, 0.596);
  width: 400px;
  height: 350px;
  border-radius: 20px;
  border: 2px solid white;
  box-shadow: 0px 0px 10px gray;
  transition: all 0.2s;
}
.loginBox:hover {
  box-shadow: 5px 5px 10px gray;
  border: 2px solid rgb(228, 225, 225);
}
.loginBox p {
  font-size: 35px;
  font-weight: bold;
}
.loginBox form {
  height: 80%;
  width: 100%;
}
.loginBox input {
  height: 22px;
  width: 60%;
  border-radius: 4px;
  border: 1px solid gray;
  padding-left: 10px;
  padding-right: 10px;
  transition: border 0.2s;
}
.loginBox input:hover {
  border: 1px solid white;
}
.loginBox input:focus {
  border: 1px solid rgb(100, 149, 237);
}
.switchBox {
  display: flex;
  flex-direction: row;
  font-size: 15px;
  width: 80%;
  margin: auto auto;
}
.loginBox a {
  height: 30px;
  width: 70%;
  line-height: 30px;
  border-radius: 30px;
  border: 1px solid white;
  font-weight: bold;
  background: rgb(100, 149, 237);
  transition: all 0.1s;
}
.loginBox a:hover {
  background: rgb(65, 105, 225);
}
.loginBox a:active {
  background: rgb(100, 149, 237);
  border: 1px solid gray;
}
</style>
