<template>
  <div>
    <a-form-model
      ref="form"
      :model="form"
      layout="inline">
      <a-form-model-item label="名称" prop="name">
        <a-input v-model="form.dictName" />
      </a-form-model-item>
      <a-form-model-item>
        <a-button @click="search">搜索</a-button>
        <a-button @click="reset">重置</a-button>
      </a-form-model-item>
    </a-form-model>
    <a-button-group>
      <a-button @click="addEdit">新增</a-button>
      <a-button @click="refresh" :loading="loading">刷新</a-button>
    </a-button-group>
    <a-table
      :columns="columns"
      :data-source="data"
      :row-key="record => record.id"
      :pagination="pagination"
      bordered
      :loading="loading"
      @change="onChange">
      <span slot="action" slot-scope="row">
        <a-button @click="addEdit(row.id)">编辑</a-button>
        <a-button @click="addItem(row.id)">添加子项</a-button>
        <a-button @click="remove([row.id])">删除</a-button>
      </span>
      <a-table
        slot="expandedRowRender"
        slot-scope="row"
        :columns="innerColumns"
        :data-source="row.items"
        :row-key="record => record.id"
        :pagination="false"
        bordered
        :loading="loading">
        <span slot="action" slot-scope="row">
          <a-button @click="edit(row.id)" size="small">编辑</a-button>
          <a-button @click="removeItem([row.id])" size="small">删除</a-button>
        </span>
      </a-table>
    </a-table>
    <sys-dict-add-edit
      :title="name"
      :data="record"
      :visible="addEditVisible"
      @close="addEditClose">
    </sys-dict-add-edit>
    <a-modal
      title="字典项"
      v-model="itemVisible"
      :confirm-loading="loading"
      @ok="handleOk"
      :destroyOnClose="true">
      <a-form-model
        ref="form"
        :model="itemForm">
        <a-form-model-item label="字典项键" prop="itemKey">
          <a-input v-model="itemForm.itemKey" />
        </a-form-model-item>
        <a-form-model-item label="字典项值" prop="itemValue">
          <a-input v-model="itemForm.itemValue" />
        </a-form-model-item>
        <a-form-model-item label="描述" prop="description">
          <a-input v-model="itemForm.description" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { deleteList, get, page } from '@/api/sysDict'
import SysDictAddEdit from './addEdit'
import { save, get as getItem, deleteList as removeItem } from '@/api/sysDictItem'
const columns = [{
  title: '名称',
  dataIndex: 'dictName'
}, {
  title: '编码',
  dataIndex: 'dictCode'
}, {
  title: '描述',
  dataIndex: 'description'
}, {
  title: '备注信息',
  dataIndex: 'remark'
}, {
  title: '操作',
  scopedSlots: { customRender: 'action' }
}]

const innerColumns = [{
  title: '字典项键',
  dataIndex: 'itemKey'
}, {
  title: '字典项值',
  dataIndex: 'itemValue'
}, {
  title: '描述',
  dataIndex: 'description'
}, {
  title: '操作',
  scopedSlots: { customRender: 'action' }
}]
export default {
  name: 'SysDictList',
  components: {
    SysDictAddEdit
  },
  data () {
    return {
      name: '字典',
      data: [],
      columns: columns,
      innerColumns: innerColumns,
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
      addEditVisible: false,
      itemForm: {},
      itemVisible: false
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
      if (id && id > 0) {
        get(id).then(res => {
          this.record = res.data
          this.addEditVisible = true
        })
      } else {
        this.record = {}
        this.addEditVisible = true
      }
    },
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
    },
    addItem (id) {
      this.itemForm.dictId = id
      this.itemVisible = true
    },
    handleOk () {
      save(this.itemForm).then(res => {
        this.$message.info('添加字典项成功')
        this.itemVisible = false
        this.itemForm = {}
        this.refresh()
      })
    },
    edit (id) {
      getItem(id).then(res => {
        this.itemForm = res.data
        this.itemVisible = true
      })
    },
    removeItem (ids) {
      const params = {
        ids: ids.join(',')
      }
      removeItem(params).then(res => {
        this.$message.info('删除字典项成功')
        this.refresh()
      })
    }
  }
}
</script>
