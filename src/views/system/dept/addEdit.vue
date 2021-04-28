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
        <a-form-model-item label="上级部门" prop="parent">
          <a-tree-select
            :tree-data="treeData"
            show-search
            tree-data-simple-mode
            v-model="form.parentId"
            :load-data="onLoadData">
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="排序" prop="sort">
          <a-input v-model="form.sort" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { save, list, get } from '@/api/dept'
export default {
  name: 'DeptAddEdit',
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
      treeData: [],
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
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
      this.treeData = [
        {
          id: -1,
          parentId: 0,
          title: '无',
          value: '0',
          isLeaf: true
        }
      ]
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
    },
    onLoadData (treeNode) {
      return new Promise((resolve) => {
        const { id } = treeNode.dataRef
        const pId = id
        const data = {
          parentId: id
        }
        list(data).then((res) => {
          const children = res.data
          children.forEach((child) => {
            const { id, name, childNum } = child
            const parentId = this.form.parentId ? this.form.parentId : 0
            if (id !== parentId) {
              this.treeData = this.treeData.concat([{
                id: id,
                pId: pId,
                title: name,
                value: '' + id,
                isLeaf: !(childNum && childNum > 0)
              }])
            }
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
        this.operation = (this.form && this.form.id && this.form.id > 0 ? '编辑' : '新增')
        list({ parentId: 0 }).then(res => {
          res.data.forEach(row => {
            const { id, name, childNum, parentId } = row
            this.treeData.push({
              id,
              title: name,
              value: '' + id,
              pId: parentId,
              isLeaf: !(childNum && childNum > 0)
            })
          })
        })
        const parentId = this.form.parentId ? this.form.parentId : 0
        if (parentId !== 0) {
          get(parentId).then(res => {
              const { id, name, parentId } = res.data
              this.treeData.push({
                id,
                title: name,
                value: '' + id,
                pId: parentId,
                isLeaf: false
              })
          })
        }
      }
    }
  }
}
</script>
