<template>
  <div class="device-list">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>设备管理</span>
          <el-button type="primary" icon="Plus" @click="handleAdd">新增设备</el-button>
        </div>
      </template>

      <div class="filter-bar">
        <el-input v-model="filters.keyword" placeholder="搜索设备名称/MAC" prefix-icon="Search" clearable style="width: 250px" @clear="fetchList" @keyup.enter="fetchList" />
        <el-select v-model="filters.status" placeholder="设备状态" clearable style="width: 140px" @change="fetchList">
          <el-option label="在线" value="online" />
          <el-option label="离线" value="offline" />
          <el-option label="故障" value="error" />
        </el-select>
        <el-select v-model="filters.greenhouse" placeholder="所属大棚" clearable style="width: 180px" @change="fetchList">
          <el-option label="A区1号棚" value="1" />
          <el-option label="A区2号棚" value="2" />
          <el-option label="B区1号棚" value="3" />
        </el-select>
      </div>

      <el-table :data="deviceList" v-loading="loading" stripe border>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="name" label="设备名称" min-width="140" />
        <el-table-column prop="mac" label="MAC地址" width="180" />
        <el-table-column prop="greenhouse" label="所属大棚" width="140" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <StatusBadge :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column prop="lastOnline" label="最后在线" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link icon="View" @click="handleDetail(row)">详情</el-button>
            <el-button type="primary" link icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除?" @confirm="handleDelete(row)">
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

    <el-drawer v-model="drawerVisible" title="设备详情" size="450px">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="设备名称">{{ detail.name }}</el-descriptions-item>
        <el-descriptions-item label="MAC地址">{{ detail.mac }}</el-descriptions-item>
        <el-descriptions-item label="所属大棚">{{ detail.greenhouse }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <StatusBadge :status="detail.status" />
        </el-descriptions-item>
        <el-descriptions-item label="最后在线">{{ detail.lastOnline }}</el-descriptions-item>
        <el-descriptions-item label="固件版本">{{ detail.firmware }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ detail.ip }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑设备' : '新增设备'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="MAC地址" prop="mac">
          <el-input v-model="form.mac" placeholder="请输入MAC地址" />
        </el-form-item>
        <el-form-item label="所属大棚" prop="greenhouse">
          <el-select v-model="form.greenhouse" placeholder="请选择" style="width: 100%">
            <el-option label="A区1号棚" value="A区1号棚" />
            <el-option label="A区2号棚" value="A区2号棚" />
            <el-option label="B区1号棚" value="B区1号棚" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import StatusBadge from '@/components/StatusBadge.vue'

const loading = ref(false)
const drawerVisible = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
const filters = reactive({ keyword: '', status: '', greenhouse: '' })

const deviceList = ref([
  { id: 1, name: '温湿度传感器-01', mac: 'AA:BB:CC:DD:EE:01', greenhouse: 'A区1号棚', status: 'online', lastOnline: '2024-03-15 14:30:00' },
  { id: 2, name: '温湿度传感器-02', mac: 'AA:BB:CC:DD:EE:02', greenhouse: 'A区2号棚', status: 'online', lastOnline: '2024-03-15 14:28:00' },
  { id: 3, name: '光照传感器-01', mac: 'AA:BB:CC:DD:EE:03', greenhouse: 'B区1号棚', status: 'offline', lastOnline: '2024-03-14 18:00:00' },
  { id: 4, name: '继电器控制-01', mac: 'AA:BB:CC:DD:EE:04', greenhouse: 'A区1号棚', status: 'error', lastOnline: '2024-03-15 10:00:00' }
])

const detail = ref({})
const form = reactive({ id: null, name: '', mac: '', greenhouse: '' })

const rules = {
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  mac: [{ required: true, message: '请输入MAC地址', trigger: 'blur' }],
  greenhouse: [{ required: true, message: '请选择大棚', trigger: 'change' }]
}

const fetchList = () => {
  loading.value = true
  setTimeout(() => {
    pagination.total = deviceList.value.length
    loading.value = false
  }, 300)
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { id: null, name: '', mac: '', greenhouse: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleDetail = (row) => {
  detail.value = { ...row, firmware: 'v2.1.0', ip: '192.168.1.101' }
  drawerVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value.validate()
  ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
  dialogVisible.value = false
}

const handleDelete = (row) => {
  deviceList.value = deviceList.value.filter(d => d.id !== row.id)
  ElMessage.success('删除成功')
  fetchList()
}

onMounted(fetchList)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
