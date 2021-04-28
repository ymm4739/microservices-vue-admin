<template>
  <a-modal
    :title="modalTitle"
    :visible.sync="detailVisible"
    @cancel="close"
  >
    <template slot="footer">
      <a-button @click="close">关闭</a-button>
    </template>
    <a-row :gluter="16">
      <a-col :span="24">上级菜单: {{ menu.parentTitle || '无' }}
      </a-col>
    </a-row>
    <a-row :gluter="16">
      <a-col :span="12">标题: {{ menu.title }}</a-col>
      <a-col :span="12">URL: {{ menu.path }}</a-col>
    </a-row>
    <a-row :gluter="16">
      <a-col :span="12">名称: {{ menu.name }}</a-col>
      <a-col :span="12">组件: {{ menu.component }}</a-col>
    </a-row>
    <a-row :gluter="16">
      <a-col :span="12">图标: {{ menu.icon }}</a-col>
      <a-col :span="12">排序: {{ menu.sort }}</a-col>
    </a-row>
    <a-row :gluter="16">
      <a-col :span="12">隐藏: {{ menu.hidden > 0 ? '是' : '否' }}</a-col>
      <a-col :span="12">外链: {{ menu.target && menu.target === '_blank' ? '是' : '否' }}</a-col>
    </a-row>
    <a-row :gluter="16">
      <a-col :span="24">角色: <span>
        <a-tag color="blue" v-for="role in menu.roles" :key="role.id">{{ role.roleName }}</a-tag>
      </span>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
export default {
  name: 'MenuDetail',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line vue/require-default-prop
    data: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      menu: {},
      detailVisible: false,
      modalTitle: ''
    }
  },
  computed: {
  },
  methods: {
    close () {
      this.detailVisible = false
      this.$emit('close')
    }
  },
  watch: {
    visible: function (newValue) {
      this.detailVisible = this.visible
      this.modalTitle = this.title + '详情'
      this.menu = this.data
    }
  }
}
</script>
