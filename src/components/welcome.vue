<template>
  <div id="welcome">
 <h1>作者：张正鹏</h1>
   <!-- <el-card class="head">
     <div class="content">
       <img :src="imgSrc" alt="">
     </div>
     <div class="info"></div>
     <div class="info"></div>
     <div class="info"></div>
   </el-card>
   <el-card class="right">
     <div></div>
   </el-card> -->
  </div>
</template>

<script>
export default {
 data(){
   return{
     imgSrc: require('../assets/admin.jpg')
   }
 }

}
</script>

<style scoped>
#welcome{
  display: flex;
}
.head{
  width: 60%;
  margin-left: 100px;
  min-height: 100px;
}
.right{
    width: 20%;
    margin-left: 30px;
}
.content{
  /* border: 1px solid burlywood; */
  height: 150px;
  width: 100%;
}
.content img{
  width: 150px;
  height: 150px;
  float: right;
  /* display: inline-block; */
}
.info{
  margin-top: 15px;
  border: 1px solid burlywood;
  height: 150px;
  width: 100%;
}
</style>