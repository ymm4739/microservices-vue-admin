<template>
  <div>
    <a-form-model
      ref="form"
      :model="form"
      layout="inline"
    >
      <a-form-model-item label="标题" prop="title">
        <a-input v-model="form.title" />
      </a-form-model-item>
      <a-form-model-item>
        <a-button @click="search">搜索</a-button>
        <a-button @click="reset">重置</a-button>
      </a-form-model-item>
    </a-form-model>
    <a-button-group>
      <a-button @click="editOrAdd">新增</a-button>
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
      @expand="getChildren"
      :expanded-row-keys="expandedRowIds"
      @change="onChange"
    >
      <span slot="roles" slot-scope="roles" >
        <a-tag color="blue" v-for="role in roles" :key="role.id">{{ role.roleName }}</a-tag>
      </span>
      <span slot="hidden" slot-scope="hidden" >
        <a-tag color="red" v-if="hidden && hidden > 0">{{ '是' }}</a-tag>
        <a-tag color="blue" v-else>{{ '否' }}</a-tag>
      </span>
      <span slot="target" slot-scope="target" >
        <a-tag color="red" v-if="target && target ==='_blank'">{{ '是' }}</a-tag>
        <a-tag color="blue" v-else>{{ '否' }}</a-tag>
      </span>
      <span slot="action" slot-scope="row">
        <a-button @click="editOrAdd(row.id)">编辑</a-button>
        <a-button @click="detail(row.id)">详情</a-button>
        <a-button @click="remove([row.id])">删除</a-button>
      </span>
    </a-table>

    <menu-addEdit
      :visible="addEditVisible"
      :title="name"
      :data="record"
      @close="addEditClose"
      @ok="addEditOk"></menu-addEdit>
    <menu-detail :visible="detailVisible" :title="name" :data="record" @close="detailClose"></menu-detail>
  </div>
</template>
<script>
import { page, deleteList, get, getChildren } from '@/api/menu'
// import { listToTree } from '@/router/generator-routers'
import MenuDetail from './detail'
import MenuAddEdit from './addEdit'
const columns = [{
  title: '标题',
  dataIndex: 'title'
}, {
  title: 'url',
  dataIndex: 'path',
  sorter: true
}, {
  title: '路由名称',
  dataIndex: 'name'
}, {
  title: '组件',
  dataIndex: 'component'
}, {
  title: '图标',
  dataIndex: 'icon'
  // scopedSlots: { customRender: 'icon' }
}, {
  title: '角色',
  dataIndex: 'roles',
  key: 'roles',
  scopedSlots: { customRender: 'roles' }
}, {
  title: '排序',
  dataIndex: 'sort',
  sorter: true
}, {
  title: '隐藏',
  dataIndex: 'hidden',
  scopedSlots: { customRender: 'hidden' }
}, {
  title: '外链',
  dataIndex: 'target',
  scopedSlots: { customRender: 'target' }
}, {
  title: '操作',
  key: 'action',
  scopedSlots: { customRender: 'action' }
}]

export default {
  name: 'MenuList',
  components: {
    MenuDetail,
    MenuAddEdit
  },
  data () {
    return {
      name: '菜单',
      data: [],
      columns: columns,
      loading: false,
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
      selectedRowKeys: [],
      addEditVisible: false,
      record: {},
      detailVisible: false,
      expandedRowIds: [],
      sorter: {
        field: '',
        order: false
      },
      filters: {},
      form: {}
    }
  },
  created () {
    this.refresh()
  },
  methods: {
    findParentMenu (data, result, parentId) {
      data.forEach((v) => {
        if (v.id === parentId) {
          result = v
        } else if (v.children && v.children.length > 0) {
          this.findParentMenu(v.children, result, parentId)
        }
      })
    },
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
        this.expandedRowIds = []
        this.data = res.data.records
        this.data.forEach((row) => {
          if (row.childNum > 0) {
            row.children = []
          }
        })
        // const tree = []
        // listToTree(this.data, tree, 0)
        // this.data = tree
        const { total, current, size } = res.data
        this.pagination.total = total
        this.pagination.current = current
        this.pagination.pageSize = size
        this.$store.dispatch('GenerateRoutes', this.$store.getters.userInfo.username)
      })
    },
    refresh () {
      this.pagination.current = 1
      // this.sorter.field = ''
      this.filters = {}
      this.fetch()
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
    getChildren (expanded, record) {
      if (expanded) {
        const data = {
          id: record.id
        }
        this.expandedRowIds.push(record.id)
        getChildren(data).then((res) => {
          const children = res.data
          children.forEach(row => {
            if (row.childNum && row.childNum > 0) {
              row.children = []
            }
          })
          record.children = children
          this.$forceUpdate() // 强制刷新表格组件
        })
      } else {
        const index = this.expandedRowIds.indexOf(record.id)
        this.expandedRowIds.splice(index, 1)
      }
    },
    onSelectChange (selectedRowKeys) {
      this.rowSelection.selectedRowKeys = selectedRowKeys
      this.selectedRowKeys = selectedRowKeys
    },
    editOrAdd (id) {
      const edit = id && id > 0
      if (edit) {
        get(id).then(res => {
          // const { id, title, path, name, component, sort } = res.data
          // this.record.id = id
          // this.record.title = title
          // this.record.path = path
          // this.record.name = name
          // this.record.component = component
          // this.record.sort = sort
          this.record = res.data
          this.addEditVisible = true
        })
      } else {
        this.record = {}
        this.addEditVisible = true
      }
    },
    detail (id) {
      get(id).then(res => {
          // const { id, title, path, name, component, sort } = res.data
          this.record = res.data
          this.detailVisible = true
        })
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
    addEditOk (success) {
      this.record = {}
      this.addEditVisible = false
      if (success) {
        this.refresh()
      }
    },
    addEditClose () {
      this.record = {}
      this.addEditVisible = false
    },
    detailClose () {
      this.record = {}
      this.detailVisible = false
    }
  }
}
</script>
