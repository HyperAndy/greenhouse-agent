<template>
  <div class="greenhouse">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <div>
            <el-button icon="ArrowLeft" link @click="$router.push('/farm')">返回</el-button>
            <span style="margin-left: 12px">大棚管理 - {{ farmName }}</span>
          </div>
          <el-button type="primary" icon="Plus" @click="handleAdd">新增大棚</el-button>
        </div>
      </template>

      <el-table :data="greenhouseList" v-loading="loading" stripe border>
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="name" label="大棚名称" min-width="150" />
        <el-table-column prop="area" label="面积(㎡)" width="120" align="center" />
        <el-table-column prop="cropType" label="种植作物" width="120" />
        <el-table-column prop="deviceCount" label="设备数" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <StatusBadge :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm title="确定删除?" @confirm="handleDelete(row)">
              <template #reference>
                <el-button type="danger" link icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑大棚' : '新增大棚'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="大棚名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入大棚名称" />
        </el-form-item>
        <el-form-item label="面积(㎡)" prop="area">
          <el-input-number v-model="form.area" :min="0" :max="10000" style="width: 100%" />
        </el-form-item>
        <el-form-item label="种植作物">
          <el-input v-model="form.cropType" placeholder="请输入种植作物" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="3" />
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
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import StatusBadge from '@/components/StatusBadge.vue'

const route = useRoute()
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const farmName = ref('阳光农场')

const greenhouseList = ref([
  { id: 1, name: 'A区1号棚', area: 500, cropType: '番茄', deviceCount: 6, status: 'online' },
  { id: 2, name: 'A区2号棚', area: 500, cropType: '黄瓜', deviceCount: 5, status: 'online' },
  { id: 3, name: 'B区1号棚', area: 800, cropType: '草莓', deviceCount: 8, status: 'offline' }
])

const form = reactive({ id: null, name: '', area: 0, cropType: '', remark: '' })

const rules = {
  name: [{ required: true, message: '请输入大棚名称', trigger: 'blur' }],
  area: [{ required: true, message: '请输入面积', trigger: 'blur' }]
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(form, { id: null, name: '', area: 0, cropType: '', remark: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  await formRef.value.validate()
  ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
  dialogVisible.value = false
}

const handleDelete = (row) => {
  greenhouseList.value = greenhouseList.value.filter(g => g.id !== row.id)
  ElMessage.success('删除成功')
}

onMounted(() => {
  // fetch greenhouse list by farmId: route.params.id
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
