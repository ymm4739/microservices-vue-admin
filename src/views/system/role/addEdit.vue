<template>
  <div>
    <a-modal
      :title="operation + title"
      :visible.sync="isVisible"
      :confirm-loading="loading"
      @ok="handleOk"
      @cancel="handleCancel">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        v-bind="layout">
        <a-form-model-item label="名称" prop="roleName">
          <a-input v-model="form.roleName" />
        </a-form-model-item>
        <a-form-model-item label="编码" prop="roleCode">
          <a-input v-model="form.roleCode" />
        </a-form-model-item>
        <a-form-model-item label="描述" prop="roleDesc">
          <a-input v-model="form.roleDesc" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { save } from '@/api/role'
export default {
  name: 'RoleAddEdit',
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
      operation: '',
      form: {},
      loading: false,
      isVisible: false,
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '角色编码不能为空', trigger: 'blur' }
        ]
      },
      layout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 18 }
      }
    }
  },
  methods: {
    initData () {
      this.operation = ''
      this.loading = false
      this.form = {}
    },
    handleOk () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          save(this.form).then((res) => {
            this.isVisible = false
            this.$message.success(this.operation + '成功')
            this.$emit('close', true)
          }).catch(error => {
            this.$message.error(this.operation + '失败，' + error)
          }).finally(() => {
            this.loading = false
          })
        }
      })
    },
    handleCancel () {
      this.$emit('close', false)
    }
  },
  watch: {
    visible () {
      this.isVisible = this.visible
      this.initData()
      if (this.isVisible) {
        this.form = this.data
        this.operation = (this.form && this.form.id && this.form.id > 0 ? '编辑' : '新增')
      }
    }
  }
}
</script>
