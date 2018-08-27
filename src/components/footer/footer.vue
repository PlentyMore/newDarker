<template>
      <div class="indexFooter1">
        <div class="inderFooter21">
          <div class="footerAbout1">
            <a class="footerItem1">关于我们</a>
            <a class="footerItem1" href="#/contactUs" @mouseover="infoText='联系我们'" @mouseout="infoText='用爱发电'">{{infoText}}</a>
            <a class="footerItem1" href="https://github.com/DMCollection"><img style="width:20px;height:15px;" src="../../../static/img/logo.png"><p>加入我们</p></a>
          </div>
          <div class="authorInfo1">
            <p>Crafted with</p>
            <p style="color:red;font-size:18px;">❤</p>
            <p>by Darkers ©2018 Darker.</p>
          </div>
          <div class="indexFooterInBox1">
            <a href="https://cn.vuejs.org/" class="footerItem1"><img src="https://cn.vuejs.org//images/logo.png"><p>Vue.js</p></a>
            <a href="http://dplayer.js.org/#/" class="footerItem1"><img src="https://camo.githubusercontent.com/69d9f15725387a031fbfe904a38b79e2c60034ca/68747470733a2f2f692e696d6775722e636f6d2f4c6e50765a764f2e706e67"><p>Dplayer</p></a>
            <a href="http://element-cn.eleme.io/#/zh-CN" class="footerItem1"><img class="elementIcon1" src="https://camo.githubusercontent.com/462f24153b8e8739c8ea71f7102585c4cb0e1575/68747470733a2f2f63646e2e7261776769742e636f6d2f456c656d6546452f656c656d656e742f6465762f656c656d656e745f6c6f676f2e737667"></a>
          </div>
        </div>
      </div>
</template>

<script>
export default {
  data() {
    return {
      infoText: "用爱发电"
    };
  }
};
</script>
<style>
.indexFooter1{
  display: flex;
  flex-direction: row;
  left: 0.5%;
  width: 99%;
  color: wheat;
  font-size: 13px;
}
.inderFooter21{
  display: flex;
  flex-direction: row;
  margin: auto auto;
}
.footerAbout1{
  display: flex;
  flex-direction: row;
}
.authorInfo1{
  display: flex;
  flex-direction: row;
  height: 20px;
}
.authorInfo1 p{
  height: 20px;
  margin: auto 3px;
  line-height: 20px;
}
.indexFooterInBox1{
  display: flex;
  flex-direction: row;
  margin: auto auto;
}
.footerItem1{
  margin: auto 10px;
  text-align: center;
  display: flex;
  flex-direction: row;
  height: 20px;
  text-decoration: none;
  color: wheat;
}
.footerItem1 img{
  height: 20px;
  width: 20px;
  margin: auto auto;
}
.elementIcon1{
  width: 80px !important;
}
.footerItem1 p{
  line-height: 20px;
  height: 20px;
  margin: auto 5px;
  color: wheat;
}
</style>
