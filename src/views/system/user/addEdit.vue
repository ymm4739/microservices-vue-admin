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
        <a-form-model-item label="用户名" prop="username">
          <a-input v-model="form.username" />
        </a-form-model-item>
        <a-form-model-item label="密码" prop="password">
          <a-input v-model="form.password" />
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="form.email" />
        </a-form-model-item>
        <a-form-model-item label="手机号" prop="phone">
          <a-input v-model="form.phone" />
        </a-form-model-item>
        <a-form-model-item label="性别" prop="sex">
          <a-switch v-model="isMan"></a-switch>
        </a-form-model-item>
        <a-form-model-item label="状态" prop="status">
          <a-switch v-model="isNormal" ></a-switch>
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
import { save } from '@/api/user'
import { list } from '@/api/role'
export default {
  name: 'UserAddEdit',
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
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      },
      roleNames: [],
      selectedRoleIds: [],
      roles: [],
      isMan: true,
      isNormal: true,
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
      this.isMan = true
      this.isNormal = true
    },
    handleOk () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          this.form.roleIds = this.selectedRoleIds.join(',')
          this.form.sex = this.isMan ? 1 : 2
          this.form.status = this.isNormal ? 0 : 1
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
