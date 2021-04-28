<template>
  <div>
    <a-form-model
      ref="form"
      :model="form"
      layout="inline">
      <a-form-model-item label="包名" prop="packageName">
        <a-input v-model="form.packageName" />
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
      @change="onChange">
      <span slot="action" slot-scope="row">
        <a-button @click="addEdit(row.id)">编辑</a-button>
        <a-button @click="generate(row.id)">生成</a-button>
        <a-button @click="remove([row.id])">删除</a-button>
      </span>
    </a-table>
    <generator-add-edit
      :title="name"
      :data="record"
      :visible="addEditVisible"
      @close="addEditClose">
    </generator-add-edit>
    <a-modal
      title="配置生成表"
      :visible="modalVisible"
      :confirm-loading="loading"
      @ok="handleOk"
      @cancel="handleCancel">
      <a-form-model
        ref="modalForm"
        v-bind="layout">
        <a-form-model-item label="表名" prop="tables">
          <a-select mode="multiple" placeholder="选择生成的表名" v-model="selectedTables">
            <a-select-option v-for="table in tables" :key="table" :id="table" :value="table">
              {{ table }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="文件类型" prop="fileTypes">
          <a-select mode="multiple" placeholder="选择生成的文件" v-model="fileTypes">
            <a-select-option v-for="type in types" :key="type" :id="type" :value="type">
              {{ type }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { page, get, deleteList, generate, download, getTables } from '@/api/generator'
import GeneratorAddEdit from './addEdit'
const columns = [{
  title: '包名',
  dataIndex: 'packageName'
}, {
  title: '模块名',
  dataIndex: 'moduleName',
  sorter: true
}, {
  title: '作者',
  dataIndex: 'author'
}, {
  title: '数据源',
  dataIndex: 'url'
}, {
  title: '登陆名',
  dataIndex: 'username'
}, {
  title: '密码',
  dataIndex: 'password'
}, {
  title: '操作',
  scopedSlots: { customRender: 'action' }
}]
export default {
  name: 'GeneratorList',
  components: {
    GeneratorAddEdit
  },
  data () {
    return {
      name: '代码生成',
      data: [],
      columns: columns,
      form: {},
      types: ['all', 'controller', 'entity', 'mapper', 'service', 'xml'],
      fileTypes: ['all'],
      tables: ['all'],
      selectedTables: ['all'],
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
      modalVisible: false,
      selectedId: '',
      layout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 18 }
      }
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
    generate (id) {
      this.selectedId = id
      this.modalVisible = true
      getTables({ id: id }).then(res => {
        this.tables = res.data
        this.tables.splice(0, 0, 'all')
      })
    },
    remove (ids) {
      if (this.selectedRowKeys.length > 0) {
        const params = {
          ids: ids.join(',')
        }
        deleteList(params).then(res => {
          this.$message.success('删除成功')
          this.refresh()
        })
      }else {
        this.$message.info('请先勾选数据')
      }
    },
    addEditClose (success) {
      this.addEditVisible = false
      this.record = {}
      if (success) {
        this.refresh()
      }
    },
    handleOk () {
      this.loading = true
      const noAllTables = this.tables
      noAllTables.splice(0, 1)
      const noAllTypes = this.types
      noAllTypes.splice(0, 1)
      const tables = this.selectedTables.includes('all') ? noAllTables : this.selectedTables
      const types = this.fileTypes.includes('all') ? noAllTypes : this.fileTypes
      const param = {
        id: this.selectedId,
        tableNames: tables.join(','),
        fileTypes: types.join(',')
      }
      generate(param).then(res => {
        this.modalVisible = false
        this.$message.success('生成代码成功')
        const fileName = res.data.fileName
        download(res.data).then(res => {
                    var blob = new Blob([res], { type: 'application/octet-stream' })
                    if (window.navigator.msSaveOrOpenBlob) {
                        navigator.msSaveBlob(blob, fileName)
                    } else {
                        var link = document.createElement('a')
                        link.href = window.URL.createObjectURL(blob)
                        link.download = fileName
                        link.click()
                        window.URL.revokeObjectURL(link.href)
                    }
                })
      }).catch(err => {
        this.$message.error(err)
      })
      this.loading = false
      this.fileTypes = ['all']
      this.tables = ['all']
      this.selectedTables = ['all']
      this.types = ['all', 'controller', 'entity', 'mapper', 'service', 'xml']
    },
    handleCancel () {
      this.selectedId = 0
      this.modalVisible = false
      this.fileTypes = ['all']
      this.tables = ['all']
      this.selectedTables = ['all']
      this.types = ['all', 'controller', 'entity', 'mapper', 'service', 'xml']
    }
  }
}
</script>
