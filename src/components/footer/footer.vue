<template>
      <div class="indexFooter1">
        <div class="inderFooter21">
          <div class="footerAbout1">
            <a target="_blank" class="footerItem1" href="#/aboutUs">关于我们</a>
            <a target="_blank" class="footerItem1" href="#/contactUs" @mouseover="infoText='联系我们'" @mouseout="infoText='用爱发电'">{{infoText}}</a>
            <a target="_blank" class="footerItem1" href="https://t.me/joinchat/D6RlYg6geGuiS3WP_ag5zg"><img style="width:20px;height:15px;" src="../../../static/img/logo.png"><p>加入我们</p></a>
          </div>
          <div class="authorInfo1">
            <p>Crafted with</p>
            <p style="color:red;font-size:18px;">❤</p>
            <p>by Darkers ©2018 Darker.</p>
          </div>
          <div class="indexFooterInBox1">
            <a target="_blank" :href="GLOBAL.DOInviteLink" class="footerItem"><img class="elementIcon1" :src="GLOBAL.imgURL+'/FlgYbSr.png'"></a>
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
  width: 120px !important;
}
.footerItem1 p{
  line-height: 20px;
  height: 20px;
  margin: auto 5px;
  color: wheat;
}
</style>
