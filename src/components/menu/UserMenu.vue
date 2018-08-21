<template>
    <div @mouseover="show=true" @mousemove="show = true" @mouseout="show = false" class="userMenuBox">
        <img :src="avatar" class="avatar">
        <transition name="menu" v-if="!login">
            <div v-if="show" class="withoutLogin">
                <div class="afterLoginYouCan">
                    <p @click="logout">登陆后你可以</p>
                    <img width="100%" height="90%" src="../../../static/img/afterLoginYouCan.jpg">
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
      avatar: localStorage.getItem("face")
        ? localStorage.getItem("face")
        : "../../../static/img/noAvatar.jpg",
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
    jmpPersonal() {
      this.$emit("jmpPersonal");
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
  transition: all 0.5s ease;
}
.menu-leave-active,
.menu-enter {
  height: 0px !important;
  /*!important 将该样式优先级调至最高*/
  opacity: 0;
}
.menu-leave,
.menu-enter-active {
  height: 100px;
}
.withoutLogin {
  background: white;
  position: absolute;
  top: 60px;
  right: 20px;
  overflow: hidden;
  height: 350px;
  width: 350px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
}
.afterLoginYouCan {
  display: flex;
  flex-direction: column;
  margin: 10px auto;
  width: 92%;
  height: 70%;
  text-align: left;
}
.afterLoginYouCan p{
  margin-top: 0;
  font-size: 13px;
}
.afterLoginYouCan img {
  margin: -5px auto;
}
.login {
  background: rgb(100, 149, 237);
  height: 40px;
  width: 92%;
  margin: 5px auto;
  line-height: 40px;
  font-size: 15px;
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
  margin-top: 5px;
  font-size: 10px;
}
.withLogin {
  background: white;
  position: absolute;
  top: 60px;
  right: 160px;
  overflow: hidden;
  height: 130px;
  width: 150px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
}
.withLoginInBox {
  width: 100%;
  height: 105px;
  margin: auto;
  display: flex;
  flex-direction: column;
  font-size: 13px;
}
.withLoginItem,
.withLoginUsername {
  height: 35px;
  width: 100%;
  line-height: 35px;
  /*文字超出省略号*/
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
