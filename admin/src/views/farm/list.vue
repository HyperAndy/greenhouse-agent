<template>
  <div class="farm-list">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>农场管理</span>
          <el-button type="primary" icon="Plus" @click="handleAdd">新增农场</el-button>
        </div>
      </template>

      <el-table :data="farmList" v-loading="loading" stripe border>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="name" label="农场名称" min-width="150" />
        <el-table-column prop="address" label="地址" min-width="200" />
        <el-table-column prop="greenhouseCount" label="大棚数量" width="100" align="center" />
        <el-table-column prop="contact" label="联系人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link icon="View" @click="handleGreenhouse(row)">大棚</el-button>
            <el-button type="primary" link icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除该农场?" @confirm="handleDelete(row)">
              <template #reference>
                <el-button type="danger" link icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchList"
          @current-change="fetchList"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑农场' : '新增农场'"
      width="500px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="农场名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入农场名称" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const farmList = ref([
  { id: 1, name: '阳光农场', address: '北京市昌平区', greenhouseCount: 8, contact: '张三', phone: '13800138001' },
  { id: 2, name: '绿源农场', address: '北京市大兴区', greenhouseCount: 12, contact: '李四', phone: '13800138002' },
  { id: 3, name: '丰收农场', address: '河北省廊坊市', greenhouseCount: 6, contact: '王五', phone: '13800138003' }
])

const form = reactive({ id: null, name: '', address: '', contact: '', phone: '', remark: '' })

const rules = {
  name: [{ required: true, message: '请输入农场名称', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
}

const fetchList = () => {
  loading.value = true
  setTimeout(() => {
    pagination.total = farmList.value.length
    loading.value = false
  }, 300)
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { id: null, name: '', address: '', contact: '', phone: '', remark: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value.validate()
  submitLoading.value = true
  setTimeout(() => {
    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
    dialogVisible.value = false
    submitLoading.value = false
    fetchList()
  }, 500)
}

const handleDelete = (row) => {
  farmList.value = farmList.value.filter(f => f.id !== row.id)
  ElMessage.success('删除成功')
  fetchList()
}

const handleGreenhouse = (row) => {
  router.push(`/farm/${row.id}/greenhouse`)
}

onMounted(fetchList)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
