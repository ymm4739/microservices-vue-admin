<template>
  <!-- <a-layout id="myapp">
    <a-layout-header :style="{position:'fixed',zIndex:1000,width:'100%'}">
      <img src="./assets/images/cetc.png" class="logo">
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['1']"
        :style="{lineHeight:'64px'}"
      >
        <a-menu-item key="1"><router-link :to="{name: 'datashow'}"><a-icon type="dot-chart"/>数据展示</router-link></a-menu-item>
        <a-menu-item key="2"><router-link :to="{name: 'datamanage'}"><a-icon type="setting"/>数据管理</router-link></a-menu-item>
        <a-menu-item key="3"><router-link :to="{name: 'china'}"><a-icon type="star"/>中国地图</router-link></a-menu-item>
        <a-menu-item key="4"><router-link :to="{name: 'world'}"><a-icon type="global"/>世界地图</router-link></a-menu-item>
        <a-menu-item key="5"><router-link :to="{name: 'zh_histogram'}"><a-icon type="histogram"/>柱状图</router-link></a-menu-item>
        <a-menu-item key="6"><router-link :to="{name: 'zh_gantt'}"><a-icon type="gantt"/>甘特图</router-link></a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content :style="{padding:'0 50px',marginTop:'64px'}">
      <div :style="{background:'#fff',padding:'24px',minHeight:'800px'}"> -->
        <div id="myapp">
        <router-view />
        </div>
      <!-- </div>
    </a-layout-content>
    <a-layout-footer :style="{textAlign:'center'}">中电科网络空间安全研究院 ©2020</a-layout-footer>
  </a-layout> -->
</template>

<script>
// import { domTitle, setDocumentTitle } from '@/utils/domUtil'
// import { i18nRender } from '@/locales'

export default {
  data () {
    return {}
  }
  // computed: {
  //   locale () {
  //     // 只是为了切换语言时，更新标题
  //     const { title } = this.$route.meta
  //     title && setDocumentTitle(`${i18nRender(title)} - ${domTitle}`)
  //     return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
  //   },
  // },
}
</script>
<style>
#myapp .ant-layout-content{
  min-height: 800px;
  background: #f0f2f5;
}
#myapp .logo{
  width: 100px;
  height: 31px;
  margin: 16px 24px 16px 0;
  float: left;
}
</style>
