<template>
    <div class="movieInfoBox">
        <div class="movieInfoInBox">
            <img src="../../../static/img/1.jpg" class="movieCover">
            <div>
                <p class="movieTitle">ElderDriverBroken♂Man</p>
                <p class="movieBrief">简介：{{brief}}</p>
            </div>
        </div>
        <div class="episodeBox">
            <div class="episodeNumBox" v-for="n in episode" :key="n">
                <p class="episodeNum">{{n}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            brief:'多个是糜烂的，舍长也是丑恶的，大概的确帮少就是丑烂了。sssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
            episode: 100,
        };
    }
}
</script>

<style scoped>
.movieInfoBox{
    display: flex;
    flex-direction: column;
}
.movieInfoInBox{
    display: flex;
    flex-direction: row;
    margin: 3% auto;
    width: 1300px;
}
.movieCover{
    height: 400px;
    width: 700px;
    border-radius: 10px;
    border: 5px solid white;
}
.movieTitle{
    color: white;
    font-weight: bold;
    font-size: 20px;
    width: 50%;
    margin: 10px auto;
}
.movieBrief{
    color: white;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    height: 85%;
    width: 95%;
    text-align: left;
    margin: auto 2.5%;
}
.episodeBox{
    display: flex;
    flex-direction: row;
    margin: -2% auto;
    width: 1300px;
    display: inline-block;
}
.episodeNumBox{
    background: rgba(244, 165, 96, 0.466);
    width: 40px;
    height: 20px;
    float: left;
    margin: 10px 10px;
    cursor: pointer;
    border-radius: 3px;
    transition: all .3s;
}
.episodeNumBox:hover{
    background: rgba(244, 165, 96, 0.8);
}
.episodeNum{
    color: white;
    margin: 0 auto;
    line-height: 20px;
}
</style>
