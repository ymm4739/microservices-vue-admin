<template>
  <div>
    <a-form-model
      ref="form"
      :model="form"
      layout="inline">
      <a-form-model-item label="url" prop="url">
        <a-input v-model="form.url" />
      </a-form-model-item>
      <a-form-model-item>
        <a-button @click="search">搜索</a-button>
        <a-button @click="reset">重置</a-button>
      </a-form-model-item>
    </a-form-model>
    <a-button-group>
      <a-button @click="addEdit">新增</a-button>
      <a-button @click="remove(selectedRowKeys)">删除</a-button>
      <a-button @click="refresh" :loading="loading">刷新</a-button>
    </a-button-group>
    <a-table
      :columns="columns"
      :data-source="data"
      :row-key="record => record.id"
      :pagination="pagination"
      bordered
      :row-selection="rowSelection"
      :loading="loading"
      @change="onChange">
      <template slot="roles" slot-scope="roles">
        <a-tag v-for="role in roles" :key="role.id">{{ role.roleName }}</a-tag>
      </template>
      <span slot="action" slot-scope="row">
        <a-button @click="addEdit(row.id)">编辑</a-button>
        <!-- <a-button @click="detail(row.id)">详情</a-button> -->
        <a-button @click="remove([row.id])">删除</a-button>
      </span>
    </a-table>
    <permission-add-edit
      :title="name"
      :data="record"
      :visible="addEditVisible"
      @close="addEditClose">
    </permission-add-edit>
  </div>
</template>
<script>
import { page, get, deleteList } from '@/api/permission'
import PermissionAddEdit from './addEdit'
const columns = [{
  title: 'URL',
  dataIndex: 'url'
}, {
  title: '角色',
  dataIndex: 'roles',
  scopedSlots: { customRender: 'roles' }
}, {
  title: '操作',
  scopedSlots: { customRender: 'action' }
}]
export default {
  name: 'PermissionList',
  components: {
    PermissionAddEdit
  },
  data () {
    return {
      name: '权限',
      data: [],
      columns: columns,
      form: {},
      selectedRowKeys: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showQuickJumper: true,
        showTotal: (total, range) => `显示${range[0]}-${range[1]}条，共有 ${total}条`
      },
      rowSelection: {
        selectedRowKeys: [],
        onChange: this.onSelectChange
      },
      sorter: {
        field: '',
        order: false
      },
      filters: {},
      record: {},
      loading: false,
      detailVisible: false,
      addEditVisible: false
    }
  },
  created () {
    this.refresh()
  },
  methods: {
    fetch () {
      this.loading = true
      const params = {
        current: this.pagination.current,
        pageSize: this.pagination.pageSize,
        field: this.sorter.field,
        order: this.sorter.order,
        ...this.filters
      }
      page(params).then(res => {
        this.loading = false
        this.data = res.data.records
        const { total, current, size } = res.data
        this.pagination.total = total
        this.pagination.current = current
        this.pagination.pageSize = size
      })
    },
    refresh () {
      this.pagination.current = 1
      this.filters = {}
      this.fetch()
    },
    onChange (pagination, filters, sorter, currentDataSource) {
        this.pagination.current = pagination.current
        this.pagination.pageSize = pagination.pageSize
        this.sorter = sorter
        if (!sorter.order) {
          this.sorter.field = ''
        }
        this.sorter.order = sorter.order === 'ascend'
        this.filters = filters
        this.fetch()
    },
    onSelectChange (selectedRowKeys) {
      this.rowSelection.selectedRowKeys = selectedRowKeys
      this.selectedRowKeys = selectedRowKeys
    },
    search () {
      this.filters = this.form
      this.pagination.current = 1
      this.fetch()
    },
    reset () {
      this.form = {}
      this.search()
    },
    addEdit (id) {
      const edit = id && id > 0
      if (edit) {
        get(id).then(res => {
          this.record = res.data
          this.addEditVisible = true
        })
      } else {
        this.record = {}
        this.addEditVisible = true
      }
    },
    // detail (id) {
    //   get(id).then(res => {
    //       this.record = res.data
    //       this.detailVisible = true
    //     })
    // },
    remove (ids) {
      const params = {
        ids: ids.join(',')
      }
      deleteList(params).then(res => {
        this.$message.success('删除成功')
        this.refresh()
      })
    },
    addEditClose (success) {
      this.addEditVisible = false
      this.record = {}
      if (success) {
        this.refresh()
      }
    }
  }
}
</script>
