<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a target="_blank">CETC</a>
      <a target="_blank">中电科网络空间安全研究院有限公司 ©2021</a>
      <a target="_blank">@上海研发中心</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
