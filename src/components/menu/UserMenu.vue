<template>
    <div @mouseover="show = true" @mouseout="show = false" class="userMenuBox">
        <img :src="avatar" class="avatar">
        <transition name="menu" v-if="!login">
            <div v-if="show" class="withoutLogin">
                <div class="afterLoginYouCan">
                    <p @click="logout">登陆后你可以</p>
                    <div style="height=250px;width:380px;margin:0 auto;">
                        <img src="../../../static/img/afterLoginYouCan.jpg" style="height:250px;width:380px;position:relative;">
                    </div>
                </div>
                <a href="#/login/" style="text-decoration:none"><div class="login">登入</div></a>
                <!--后期加入注册url-->
                <div class="register">首次使用？<a href="#/register/">点我去注册</a></div>
            </div>
        </transition>
        <transition name="menu" v-if="login">
            <div v-if="show" class="withLogin">
                <div class="withLoginInBox">
                    <p class="withLoginUsername">{{account}}</p>
                    <p class="withLoginItem" @click="jmpPersonal">个人中心</p>
                    <p class="withLoginItem" @click="logout">退出登录</p>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import api from "../../api.js";
export default {
  props: {
    isLogin: Boolean
  },
  data() {
    console.log(this.login);
    console.log(localStorage);
    console.log(api);
    return {
      show: false,
      login: this.isLogin,
      avatar:
        localStorage.getItem("face")
          ?  localStorage.getItem("face"):"../../../static/img/noAvatar.jpg",
      account: localStorage.getItem("loginUserName")
    };
  },
  mounted() {
    console.log(this.avatar);
  },
  watch: {
    login() {
      this.$emit("update:isLogin", false);
    }
  },
  methods: {
    async logout() {
      console.log("登出");
      let res = await api.logout();
      if (res.data.code === 0 || res.data.msg === "登出成功") {
        this.login = false;
        localStorage.setItem("JWT_TOKEN", "");
        localStorage.setItem("loginUserName", "");
        localStorage.setItem("USER_ID", "");
      }
      this.login = false;
      localStorage.removeItem("USER_ID");
      localStorage.removeItem("JWT_TOKEN");
      localStorage.removeItem("loginUserName");
      localStorage.removeItem("face");
      window.location.href = "/";
    },
    jmpPersonal(){
        this.$emit('jmpPersonal');
    }
  }
};
</script>

<style>
.userMenuBox {
  height: 60px;
  width: 60px;
  display: flex;
  flex-direction: row;
}
.avatar {
  border-radius: 25px;
  height: 40px;
  width: 40px;
  margin: auto auto;
}
.menu-leave-active,
.menu-enter-active {
  transition: all 0.2s ease;
}
.menu-leave-active,
.menu-enter {
  height: 0px !important;
  /*!important 将该样式优先级调至最高*/
}
.menu-leave,
.menu-enter-active {
  height: 100px;
}
.withoutLogin {
  background: white;
  position: absolute;
  right: 20px;
  overflow: hidden;
  height: 400px;
  width: 400px;
  border-radius: 8px;
  box-shadow: 0px 10px 20px gainsboro;
  display: flex;
  flex-direction: column;
}
.afterLoginYouCan {
  display: flex;
  flex-direction: column;
}
.login {
  background: rgb(100, 149, 237);
  height: 30px;
  width: 370px;
  margin-top: 20px;
  margin-left: 15px;
  line-height: 30px;
  border-radius: 5px;
  color: aliceblue;
  cursor: pointer;
  transition: background 0.1s;
}
.login:hover {
  background: rgb(65, 105, 225);
}
.login:active {
  background: rgb(100, 149, 237);
}
.register {
  margin-top: 10px;
}
.withLogin {
  background: white;
  position: absolute;
  top: 60px;
  right: 20px;
  overflow: hidden;
  height: 130px;
  width: 180px;
  border-radius: 8px;
  box-shadow: 0px 10px 20px gainsboro;
  display: flex;
  flex-direction: column;
}
.withLoginInBox {
  width: 100%;
  height: 105px;
  margin: auto;
  display: flex;
  flex-direction: column;
}
.withLoginItem,
.withLoginUsername {
  height: 35px;
  width: 100%;
  line-height: 35px;
  margin: 0;
  transition: background 0.4s;
}
.withLoginItem {
  cursor: pointer;
}
.withLoginItem:hover {
  background: rgba(100, 149, 237, 0.6);
}
</style>
