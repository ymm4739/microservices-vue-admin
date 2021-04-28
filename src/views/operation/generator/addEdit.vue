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
        <a-form-model-item label="包名" prop="packageName">
          <a-input v-model="form.packageName" />
        </a-form-model-item>
        <a-form-model-item label="模块名" prop="moduleName">
          <a-input v-model="form.moduleName" />
        </a-form-model-item>
        <a-form-model-item label="作者" prop="author">
          <a-input v-model="form.author" />
        </a-form-model-item>
        <a-form-model-item label="数据源" prop="url">
          <a-input v-model="form.url" />
        </a-form-model-item>
        <a-form-model-item label="登陆名" prop="username">
          <a-input v-model="form.username" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input v-model="form.password" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { save } from '@/api/generator'
export default {
  name: 'GeneratorAddEdit',
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
        packageName: [
          { required: true, message: '包名不能为空', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '数据源URL不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '数据源登陆名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '数据源登陆密码不能为空', trigger: 'blur' }
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
