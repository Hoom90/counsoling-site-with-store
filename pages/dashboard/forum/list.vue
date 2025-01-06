<script setup>
definePageMeta({
  middleware: 'route-check',
  layout: 'dashboard'
});
const verifyForm = ref({});
const route = useRoute()
const router = useRouter()
const state = reactive({
  data: [],
  category:[],
  dialogDelete: false,
  dialogEdit: false,
  dialogAdd: false,
  current: {},
  currentTitle: '',
  search: null,
  metadata: {
      pageIndex: 1,
      pageSize: 10,
      totalPages: 0,
      totalCount: 0,
      hasPreviousPage: false,
      hasNextPage: true,
      parameters: null
  },
  searchFilters:null,
  dialog: [],
})

onMounted(()=>{
  dashboardbreadcrumbstore().setBreadCrumbs([
    {
      title: 'تالار گفتگو ',
      disabled: true,
      to: '/dashboard/forum/list',
    }])
  getData()

})

const getData = async () => {
  const payload = {}
  if (route.query.index) payload.pageIndex = route.query.index
  if (route.query.size) payload.pageIndex = route.query.size
  if (route.query.search) payload.searchFilters = [{ field: "title", operator: 6, value: route.query.search }]
  await axiosApi().post(apiPath.Topic.post.pagination, payload)
    .then((res) => {
      state.data = res.data
      state.metadata = res.metadata
    })
    .catch((error) => common.showError(error?.data?.messages))
}

const getAllCategory = async () => {
  await axiosApi().get(apiPath.public.Category.post)
    .then((res) => state.category = res.data)
    .catch((error)=>common.showError(error?.data?.messages))
}

const postData = async (r) =>{
  if(r){
    const { valid } = await verifyForm.value.validate()
    if (!valid) return

    await axiosApi().post(apiPath.Topic.post.add,state.current)
    .then(res=>{
      common.showMessage(res.messages)
      getData()
    })
    .catch(error=>common.showError(error.messages))
  }
  state.dialogAdd = false
  state.current = {}
}

const deleteData = async (r) =>{
  if(r){
    await axiosApi().delete(apiPath.Topic.delete.byId(state.current.id))
    .then(res=>{
      common.showMessage(res.messages)
      getData()
    })
    .catch(error=>common.showError(error?.data?.messages))
  }
  state.dialogDelete = false
  state.current = {}
}

const editData = async (r) =>{
  if(r){
    const { valid } = await verifyForm.value.validate()
    if (!valid) return
    await axiosApi().put(apiPath.Topic.put,state.current)
    .then(res=>{
      common.showMessage(res.messages)
      getData()
    }
    )
    .catch(error=>common.showError(error?.data?.messages))
  }
  state.dialogEdit = false
  state.current = {}
}

const changePageing = () => {
  let path = '/dashboard/forum/list'
  let query = null
  if (state.metadata.pageSize && state.metadata.pageSize != 10) query = { ...query, size: state.metadata.pageSize }
  if (state.metadata.pageIndex && state.metadata.pageIndex != 1) query = { ...query, index: state.metadata.pageIndex }
  if (state.searchFilters && state.searchFilters != '') query = { ...query, search: state.searchFilters }

  router.replace({ path, query })
  setTimeout(() => {
    getData()
  }, 50);
}

const handleAdd = async () =>{
  if(state.category.length == 0) await getAllCategory()
  state.dialogAdd = true
  state.current = {}
}

const handleDelete = (item) =>{
  state.dialogDelete = true
  state.current = item
}

const handleEdit = async (item) =>{
  if(state.category.length == 0) await getAllCategory()
  state.dialogEdit = true
  state.current = {...item}
  state.currentTitle = {...item}.title
}

</script>

<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>تالار گفتگو</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn class="bg-blue-grey-lighten-1" @click="handleAdd" size="large">
      <v-icon class="ml-2">mdi-plus-circle-multiple</v-icon>
      افزودن تاپیک جدید
    </v-btn>
  </v-toolbar>

  <v-card>
    <v-card-text class="d-flex pa-3">
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-form @submit.prevent="changePageing">
            <v-text-field v-model="state.searchFilters" variant="outlined" @blur="changePageing" append-inner-icon="mdi-magnify" @click:append-inner="changePageing" density="compact" label="جستجو" hide-details></v-text-field>
          </v-form>
        </v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-select v-model="state.metadata.pageSize" :items="contracts.pageSize" variant="outlined" density="compact"
            label="تعداد نمایش" @update:modelValue="changePageing" hide-details></v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-table>
      <thead>
        <tr>
          <th>ردیف</th>
          <th class="text-center">عنوان</th>
          <th class="text-center">نویسنده</th>
          <th class="text-center">دسته بندی</th>
          <th class="text-center">تاریخ ایجاد</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in state.data" :key="item.id" class="text-center position-relative">
          <td>
            {{ ((state.metadata.pageIndex - 1) * state.metadata.pageSize + index) + 1 }}
            <div style="width: 100%;height: 1px;position: absolute;bottom: 0;right: 0;transform: translateY(-50%)"
              :class="item.isActive?'bg-green':'bg-red'"></div>
          </td>
          <td class="position-relative">
            <nuxt-link :to="`/topic/${item.id}`">
              <div
                style="min-width: 20px;height: 20px;position: absolute;top: 20%;left: 0;transform: translateY(-50%);border-radius: 100%;display: flex;align-items: center;justify-content: center;font-size: 10px;" class="bg-blue">{{ item.postCount }}</div>
              <span class="text-black">{{ item.title }}</span>
            </nuxt-link>
          </td>
          <td>{{ `${item.expertFirstName} ${item.expertLastName}` }}</td>
          <td>{{ item.categoryTitle }}</td>
          <td>
            {{ dateConverter.convertToJalali(item.createdOn) }}
          </td>
          <td>
            <div class="float-left d-flex align-center ga-1">
              <v-btn variant="text" color="info" :to="`/dashboard/forum/${item.categoryId}/${item.id}`">پست ها</v-btn>
              <v-btn variant="text" color="teal" icon="mdi-eye" :to="`/topic/${item.id}`"></v-btn>
              <v-btn variant="text" color="orange" icon="mdi-pen" @click="handleEdit(item)"></v-btn>
              <v-btn variant="text" color="red" icon="mdi-delete" @click="handleDelete(item)"></v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination v-if="state.metadata.totalCount > state.metadata.pageSize" :length="state.metadata.totalPages" v-model="state.metadata.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </v-card>

  <mj-dialog v-model="state.dialogAdd" title="افزودن تاپیک جدید" :action-btn="true" :cancel-btn="true"
    action-type="primary" @action-callback="postData" size="sm">
    <v-form @submit.prevent="postData" ref="verifyForm">

      <v-text-field v-model="state.current.title" variant="outlined" label="عنوان*"
        :rules="validator.forum.title"></v-text-field>

      <v-select :items="state.category" v-model="state.current.categoryId" label="انتخاب دسته*" variant="outlined"
        item-title="title" item-value="id" :rules="validator.forum.categoryId"></v-select>

      <v-textarea v-model="state.current.description" variant="outlined" label="توضیحات*"
        :rules="validator.forum.description"></v-textarea>
    </v-form>
  </mj-dialog>

  <mj-dialog v-model="state.dialogEdit" :title="`ویرایش > ${state.currentTitle}`" :action-btn="true"
    :cancel-btn="true" action-type="primary" @action-callback="editData" size="sm">
    <v-form @submit.prevent="editData" ref="verifyForm">

      <v-text-field v-model="state.current.title" variant="outlined" label="عنوان*"
        :rules="validator.forum.title"></v-text-field>

      <v-select :items="state.category" v-model="state.current.categoryId" label="انتخاب دسته*" variant="outlined"
        item-title="title" item-value="id" :rules="validator.forum.categoryId"></v-select>

      <v-textarea v-model="state.current.description" variant="outlined" label="توضیحات*"
        :rules="validator.forum.description"></v-textarea>
    </v-form>
  </mj-dialog>

  <mj-dialog v-model="state.dialogDelete" title="حذف" :action-btn="true" action-btn-text="حذف شود" :cancel-btn="true"
    action-type="error" @action-callback="deleteData" size="sm">
    <p>{{ state.current.title }} حذف می شود.<br />آیا اطمینان دارید؟</p>
  </mj-dialog>
</template>
