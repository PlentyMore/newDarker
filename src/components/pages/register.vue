<template>
    <div class="registerPage">
        <div class="registerBox">
            <form action="" method="get">
                <p>加入 Darker</p>
                <p></p>
                <input type="text" name="nick" placeholder="请输入一个昵称" @blur='checkNick' v-model="nickname" :data-correct="correctNickname"/>
                <p class="wrongTips" v-if="correctNickname">请输入正确的昵称</p>
                <input type="text" name="mail" placeholder="请输入您的邮箱" @blur='checkMail' v-model="mail" :data-correct="correctMail"/>
                <p class="wrongTips" v-if="correctMail">请输入正确的邮箱</p>
                <input type="password" name="psw1" min="6" max="20" placeholder="请输入一个6-20位密码" @blur="checkPsw" v-model="psw1" :data-correct="correctPsw1"/>
                <p class="wrongTips" v-if="correctPsw1">密码不符合格式或为空</p>
                <input type="password" name="psw2" min="6" max="20" placeholder="确认密码" @blur="checkPsw2" v-model="psw2" :data-correct="correctPsw2"/>
                <p class="wrongTips" v-if="correctPsw2">两次输入密码不相同或为空，请重新输入</p>
                <a type="submit" @click="register">注册</a>
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
      nickname: "",
      mail: "",
      psw1: "",
      psw2: "",
      choose: false,
      correctNickname: false,
      correctMail: false,
      correctPsw1: false,
      correctPsw2: false
    };
  },
  components: {
    darkerSwitch
  },
  computed: {},
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
    async register() {
      if (
        this.correctNickname ||
        this.correctMail ||
        this.correctPsw1 ||
        this.correctPsw2 ||
        this.nickname == "" ||
        this.mail == "" ||
        this.psw1 == "" ||
        this.psw2 == ""
      ) {
        this.$message({
          message: "请重新检查注册信息是否正确后再试！",
          type: "error"
        });
        return;
      }
      let regRes = await api.register({
        nick: this.nickname,
        email: this.mail,
        pwd: this.psw1
      });
      console.log(regRes);
      if (regRes.data.code == 0) {
        this.$message({
          message: "注册成功，正在为您自动登陆...",
          type: "success"
        });
        let loginRes = await api.login({
          principal: this.nickname,
          password: this.psw1,
          remember_me: 1
        });
        let loginData = loginRes.data.data;
        if (loginRes.data.code == 0) {
          console.log("登陆成功，跳转页面中...");
          localStorage.setItem("USER_ID", loginData.user.uid);
          localStorage.setItem("JWT_TOKEN", loginData.token);
          localStorage.setItem("loginUserName", loginData.user.nick);
          localStorage.setItem("ROLE", loginData.user.role);
          window.location.href = "/";
        } else {
          this.$message({
            message: "自动登陆失败，请手动登陆重试！",
            type: "error"
          });
        }
      } else {
        this.$message({
          message: "注册失败，"+regRes.data.msg+"！",
          type: "error"
        });
      }
    },
    checkNick: function() {
      var nickRegEx = new RegExp("[a-z0-9A-Z\\u4e00-\\u9fa5_]{1,20}", "g");
      this.correctNickname = !nickRegEx.test(this.nickname);
    },
    checkMail: function() {
      var emailRegEx = new RegExp(
        "^[A-Za-z0-9\\u4e00-\\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$",
        "g"
      );
      this.correctMail = !emailRegEx.test(this.mail);
    },
    checkPsw: function() {
      var passwordRegEx = new RegExp("[a-z0-9A-Z._]{6,20}", "g");
      this.correctPsw1 = !passwordRegEx.test(this.psw1);
      if (this.psw2 != "") this.correctPsw2 = !(this.psw1 == this.psw2);
    },
    checkPsw2: function() {
      this.correctPsw2 = !(this.psw1 == this.psw2);
    }
  }
};
</script>

<style>
.registerPage,
.registerBox,
.registerBox form {
  display: flex;
  flex-direction: column;
}
.registerBox,
.registerBox p,
.registerBox form,
.registerBox input,
.registerBox a,
.switch {
  margin: auto auto;
}
.registerPage {
  width: 100%;
  height: 800px;
}
.registerBox {
  background: rgba(128, 128, 128, 0.596);
  width: 400px;
  height: 400px;
  border-radius: 20px;
  border: 2px solid white;
  box-shadow: 0px 0px 10px gray;
  transition: all 0.2s;
}
.registerBox:hover {
  box-shadow: 5px 5px 10px gray;
  border: 2px solid rgb(228, 225, 225);
}
.registerBox p {
  font-size: 35px;
  font-weight: bold;
}
.registerBox form {
  height: 80%;
  width: 100%;
}
.registerBox input {
  outline: none;
  height: 22px;
  width: 60%;
  border-radius: 4px;
  border: 1px solid gray;
  padding-left: 10px;
  padding-right: 10px;
  transition: border 0.2s;
}
.wrongTips {
  font-size: 10px !important;
  margin-top: 1px !important;
  color: red;
  transition: all 0.1s;
}
.registerBox input:hover {
  border: 1px solid white;
}
.registerBox input:focus {
  border: 1px solid rgb(100, 149, 237);
}
[data-correct="true"] {
  border: 2px solid red !important;
}
.switchBox {
  display: flex;
  flex-direction: row;
  font-size: 15px;
  width: 80%;
  margin: auto auto;
}
.registerBox a {
  height: 30px;
  width: 70%;
  line-height: 30px;
  border-radius: 30px;
  border: 1px solid white;
  font-weight: bold;
  background: rgb(100, 149, 237);
  transition: all 0.1s;
}
.registerBox a:hover {
  background: rgb(65, 105, 225);
}
.registerBox a:active {
  background: rgb(100, 149, 237);
  border: 1px solid gray;
}
</style>
