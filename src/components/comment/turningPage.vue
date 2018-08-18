<template>
    <div>
        <slot></slot>
        <div class="turningPageBox">
            <p @click="lastPage" class="lastBtn" v-show="index>1">上一页</p>
            <div class="pageNumBox">
              <p @click="choosePage(1)">1</p>
              <p v-if="index-middleNum>1">...</p>
              <p v-for="n in index" v-if="n>index-middleNum&&n>1&&n<maxPageNum" @click="choosePage(n)">{{n}}</p>
              <p v-for="n in (index+middleNum)" v-if="n>index&&n<maxPageNum" @click="choosePage(n)">{{n}}</p>
              <p v-if="index+middleNum<maxPageNum-1">...</p>
              <p @click="choosePage(maxPageNum)">{{maxPageNum}}</p>
            </div>
            <p @click="nextPage" class="nextBtn" v-show="index<maxPageNum">下一页</p>
        </div>
    </div>
</template>

<script>
export default {
  props: ["commentPageInfo", "pageIndex", "maxShowNum"],
  data() {
    let tmp = Math.ceil(this.commentPageInfo.totalSize / 20);
    let mid = Math.floor(
      tmp > this.maxShowNum ? this.maxShowNum / 2 : this.maxShowNum / 2
    );
    return {
      middleNum: mid,
      index: this.pageIndex,
      maxPageNum: tmp
    };
  },
  methods: {
    nextPage: function() {
      this.index++;
      this.$emit("pageSelect", this.index);
    },
    lastPage: function() {
      this.index--;
      this.$emit("pageSelect", this.index);
    },
    choosePage(index) {
      this.index = index;
      this.$emit("pageSelect", this.index);
    }
  }
};
</script>

<style>
.turningPageBox {
  background: sandybrown;
  width: 900px;
  margin: auto auto;
  display: flex;
  flex-direction: row;
  font-size: 25px;
  color: rgb(109, 109, 250);
}
.lastBtn {
  margin: auto auto;
  cursor: pointer;
}
.nextBtn {
  margin: auto auto;
  cursor: pointer;
}
.pageNumBox {
  display: flex;
  flex-direction: row;
}
</style>
