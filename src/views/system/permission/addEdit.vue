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
        <a-form-model-item label="URL" prop="url">
          <a-input v-model="form.url" />
        </a-form-model-item>
        <a-form-model-item label="角色" prop="roles">
          <a-select mode="multiple" placeholder="角色选择" :default-value="roleNames" v-model="selectedRoleIds">
            <a-select-option v-for="role in roles" :key="role.id" :id="role.id" :value="role.id">
              {{ role.roleName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { save } from '@/api/permission'
import { list } from '@/api/role'
export default {
  name: 'PermissionAddEdit',
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
        url: [
          { required: true, message: 'URL不能为空', trigger: 'blur' }
        ]
      },
      roleNames: [],
      selectedRoleIds: [],
      roles: [],
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
      this.roleNames = []
      this.roles = []
      this.selectedRoleIds = []
    },
    handleOk () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.form.roleIds = this.selectedRoleIds.join(',')
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
        if (this.form.roles && this.form.roles.length > 0) {
          this.form.roles.forEach((role) => {
            this.roleNames.push(role.roleName)
            this.selectedRoleIds.push(role.id)
          })
        }
        this.operation = (this.form && this.form.id && this.form.id > 0 ? '编辑' : '新增')
        list().then(res => {
          this.roles = res.data
        })
      }
    }
  }
}
</script>
