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
          <a-form-model-item label="名称" prop="dictName">
            <a-input v-model="form.dictName" />
          </a-form-model-item>
          <a-form-model-item label="编码" prop="dictCode">
            <a-input v-model="form.dictCode" />
          </a-form-model-item>
          <a-form-model-item label="描述" prop="description">
            <a-input v-model="form.description" />
          </a-form-model-item>
          <a-form-model-item label="备注信息" prop="remark">
            <a-input v-model="form.remark" />
          </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { save } from '@/api/sysDict'
export default {
  name: 'SysDictAddEdit',
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
      const message = this.$message
      const form = this.$refs.form
      form.validate(valid => {
        if (valid) {
          this.loading = true
          save(this.form).then((res) => {
            this.isVisible = false
            message.success(this.operation + '成功')
            this.$emit('close', true)
          }).catch(error => {
            message.error(this.operation + '失败，' + error)
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
