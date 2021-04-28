<template>
  <a-modal
    :title="modalTitle"
    :visible.sync="isVisible"
    :confirm-loading="confirmLoading"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      v-bind="layout"
    >
      <a-form-model-item label="上级菜单" prop="parent">
        <a-tree-select
          :tree-data="menus"
          show-search
          tree-data-simple-mode
          v-model="form.parentId"
          :load-data="onLoadData">
        </a-tree-select>
      </a-form-model-item>
      <a-form-model-item label="标题" prop="title">
        <a-input v-model="form.title" />
      </a-form-model-item>
      <a-form-model-item label="名称" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item label="url" prop="path">
        <a-input v-model="form.path" />
      </a-form-model-item>
      <a-form-model-item label="组件" prop="component">
        <a-input v-model="form.component" />
      </a-form-model-item>
      <a-form-model-item label="图标" prop="icon">
        <a-input v-model="form.icon" />
      </a-form-model-item>
      <a-form-model-item label="排序" prop="sort">
        <a-input v-model="form.sort" />
      </a-form-model-item>
      <a-form-model-item label="隐藏" prop="hidden">
        <a-switch v-model="isHidden" ></a-switch>
      </a-form-model-item>
      <a-form-model-item label="外链" prop="target">
        <a-switch v-model="isTarget" ></a-switch>
      </a-form-model-item>
      <a-form-model-item label="角色" prop="roleIds">
        <a-select mode="multiple" placeholder="角色选择" :default-value="roleNames" @change="selectChange" v-model="selectedRoleIds">
          <a-select-option v-for="role in roles" :key="role.id" :id="role.id" :value="role.id">
            {{ role.roleName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import { updateOrSave, getChildren, list as listMenu } from '@/api/menu'
import { list } from '@/api/role'
export default {
  name: 'MenuAddEdit',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      confirmLoading: false,
      isVisible: false,
      modalTitle: '',
      form: {},
      menus: [],
      rules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: 'url不能为空', trigger: 'blur' }
        ],
        // component: [
        //   { required: true, message: '组件不能为空', trigger: 'blur' }
        // ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ]
      },
      roleNames: [],
      roles: [],
      selectedRoleIds: [],
      selectedParentId: '',
      isHidden: false,
      isTarget: false,
      layout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 18 }
      }
    }
  },
  methods: {
    initData () {
      this.modalTitle = ''
      this.form = {}
      this.roleNames = []
      this.roles = []
      this.selectedRoleIds = []
      this.selectedParentId = ''
      this.menus = [{
        title: '无',
        id: -1,
        value: '0',
        isLeaf: true,
        pId: 0
      }]
      this.isHidden = false
      this.isTarget = false
    },
    handleOk () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          this.form.roleIds = this.selectedRoleIds.join(',')
          this.form.hidden = this.isHidden ? 1 : 0
          this.form.target = this.isTarget ? '_blank' : ''
          updateOrSave(this.form).then(res => {
            this.confirmLoading = false
            this.isVisible = false
            this.$message.success('操作成功')
            // this.$refs.form.resetFields()
            // this.initData()
            this.$emit('ok', true)
          }).catch(error => {
            this.confirmLoading = false
            this.isVisible = false
            this.$message.error(error)
            // this.initData()
            this.$emit('ok', false)
          })
        }
      })
    },
    handleCancel () {
      // this.initData()
      this.$emit('close')
    },
    selectChange (value) {
      // console.log('selected ' + value)
      // console.log('selectedRoleIds ' + this.selectedRoleIds)
    },
    onLoadData (treeNode) {
      return new Promise((resolve) => {
        const { id } = treeNode.dataRef
        const pId = id
        const data = {
          id
        }
        getChildren(data).then((res) => {
          const children = res.data
          children.forEach((child) => {
            const { id, title, childNum } = child

            this.menus = this.menus.concat([{
              id: id,
              pId: pId,
              title: title,
              value: '' + id,
              isLeaf: !(childNum && childNum > 0)
            }])
          })
          // console.log(this.menus)
        })
        resolve()
      })
    }
  },
  watch: {
    visible () {
      this.isVisible = this.visible
      this.initData()
      if (this.isVisible) {
        this.form = this.data
        this.form.parentTitle = this.form.parentId > 0 ? this.form.parentTitle : '无'
        this.isHidden = this.form.hidden > 0
        this.isTarget = this.form.target === '_blank'
        // console.log('isTarget=', this.isTarget)
        listMenu().then((res) => {
          res.data.forEach((menu) => {
            const { id, title, childNum, parentId } = menu
            const menuData = {
              id: id,
              pId: parentId,
              value: '' + id,
              title: title,
              isLeaf: !(childNum && childNum > 0)
            }
            this.menus.push(menuData)
          })
        })
        // this.menus = this.menus.concat(this.menuTree)
        // console.log('menus=', this.menus)
        // this.form = this.form.roles.forEach(role => role.id)
        const roleIds = []
        if (this.form.roles && this.form.roles.length > 0) {
          this.form.roles.forEach((role) => {
            this.roleNames.push(role.roleName)
            roleIds.push(role.id)
          })
        }
        this.form.roleIds = roleIds
        this.selectedRoleIds = roleIds
        this.modalTitle = (this.form && this.form.id && this.form.id > 0 ? '编辑' : '新增') + this.title
        list().then(res => {
          this.roles = res.data
        })
        // console.log('form=', this.form)
      }
    }

  }
}
</script>
