<template>
  <div>
    <!-- 导航面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCataDialogVisible"
        width="50%"
        @close="addCateDialogClosed"
      >
        <!-- 添加分类的表单 -->
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <el-form-item label="添加分类" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <!-- options用来指定数据源-->
            <!-- props用来指定配置对象 -->
            <!-- 选择一级菜单 -->
            <el-cascader
              expand-trigger="hover"
              :options="parentCateList"
              v-model="selectKeys"
              @change="parentCateChanged"
              :props="cascaderProps"
              clearable
              change-on-select
            >
            </el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCataDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
      <tree-table
        :data="cateList"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        :show-index="true"
        index-text="#"
        border
        class="tree-table"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightGreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 表格 -->

    <!-- 分页区域 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分页数据
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //   获取商品分类数据
      cateList: [],
      //   商品分类的总数据的条数
      total: 0,
      // 添加分类对话框默认隐藏
      addCataDialogVisible: false,
      // 添加分类表单的数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 分类的id
        cat_id: 0,
        // 分类的等级 默认要添加的是一级分类
        cat_level: 0,
      },
      // 将要添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
        {
          label: '是否有效',
          // 表示，当将前列定义为模板列
          type: 'template',
          //   表示当前列使用的模板名称
          template: 'isok',
        },
        {
          label: '排序',
          // 表示，当将前列定义为模板列
          type: 'template',
          //   表示当前列使用的模板名称
          template: 'order',
        },
        {
          label: '操作',
          // 表示，当将前列定义为模板列
          type: 'template',
          //   表示当前列使用的模板名称
          template: 'opt',
        },
      ],
      // 父级分类的列表
      parentCateList: [],
      // 用来指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // 选中的父级分类id数据
      selectKeys: [],
    }
  },
  created() {
    //   获取商品分类数组
    this.getCateList()
  },
  methods: {
    //   获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      console.log(res)
      //   把数据列表赋值给cateList
      this.cateList = res.data.result
      //   把总的数据条数赋值给total
      this.total = res.data.total
      this.$message.success('获取商品分类数据成功')
    },
    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum的改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 点击按钮显示添加分类的对话框
    showAddDialog() {
      // 先获取父级分类数据列表
      this.getParentCateList()
      // 在展示对话框
      this.addCataDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类的数据列表失败')
      }

      console.log(res.data)
      this.parentCateList = res.data
    },
    //选择项发生变化触发的函数
    parentCateChanged() {
      // console.log(this.selectKeys)
      // 如果selectKeys数组中的length长度大于0，说明选中的是父级分类
      // 反之就说明没有选中任何父级分类
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 为当前父类的等级赋值
        this.addCateForm.cat_level = this.selectKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate() {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        // 重新获取数据
        this.getCateList()
        // 同时将对话框隐藏
        this.addCataDialogVisible = false
      })
    },
    // 监听对话框的关闭事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
  },
}
</script>

<style scoped lang="less">
.tree-table {
  margin-top: 30px;
}
.el-cascader {
  width: 100%;
}
.el-cascader-panel {
  height: 50%;
}
</style>
