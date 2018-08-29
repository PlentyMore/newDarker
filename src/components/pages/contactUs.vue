<template>
    <div class="contactUsBox">
        <div class="contactUsInBox">
            <div class="contactBlock">
                <div class="columnLine">
                    <p>● 合作洽谈</p>
                </div>
                <div class="blockItemBox">
                    <div class="blockItem">
                        <p class="blockTitle">广告投放</p>
                        <div class="contactUsWay">
                            <p>联系邮箱：ad@darker.online</p>
                        </div>
                    </div>
                    <div class="blockItem">
                        <p class="blockTitle">商务合作</p>
                        <div class="contactUsWay">
                            <p>联系邮箱：echisan@darker.online</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="contactBlock">
                <div class="columnLine">
                    <p>● 版权问题</p>
                </div>
                <div class="blockItemBox">
                    <div class="blockItem">
                        <p class="blockTitle">版权问题</p>
                        <div class="contactUsWay">
                            <p>联系邮箱：help@darker.online</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style>
.contactUsBox {
  display: flex;
  flex-direction: column;
  height: 840px;
}
.contactUsInBox {
  margin: 0 auto;
  width: 100%;
}
.contactBlock {
  width: 40%;
  height: 220px;
  margin: auto auto;
  border-radius: 3px;
}
.columnLine {
  width: 90%;
  display: flex;
  flex-direction: row;
  margin: 50px auto;
  border-bottom: 2px solid grey;
}
.columnLine p {
  text-align: center;
  width: 80px;
  margin: auto 0px;
  height: 35px;
  line-height: 35px;
  font-size: 15px;
  font-weight: bold;
  color: wheat;
}
.blockItemBox {
  width: 650px;
  margin: -30px auto;
  display: flex;
  flex-direction: row;
}
.blockItem {
  background: rgb(35, 35, 48);
  width: 280px;
  height: 130px;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  margin: auto auto;
}
.blockTitle {
  background: rgb(35, 35, 48);
  color: rgb(169, 199, 199);
  margin: 0px auto;
  line-height: 30px;
  width: 100%;
  font-weight: bold;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.164);
}
.contactUsWay {
  color: white;
  font-size: 13px;
}
</style>
