<template>
  <page-header-wrapper :title="false">
    <keep-alive>
      <a-spin :spinning="this.$store.getters.loading" size="large" tip="加载中，请稍后">
        <router-view />
      </a-spin>
    </keep-alive>
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'PageView'
}
</script>
