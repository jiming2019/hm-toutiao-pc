<template>
  <div class="container">
    <img src="../../assets/img/welcome.jpg" alt />
  </div>
</template>

<script>
export default {
  // 测试拦截
  created () {
    this.$http
      .get('articles')
      .then(res => {
        // console.log(res.data)
      })
      .catch(() => {
        // console.log('error')
      })
  }
}
</script>

<style scoped lang='less'>
img {
  display: block;
  margin: 0 auto;
}
</style>
