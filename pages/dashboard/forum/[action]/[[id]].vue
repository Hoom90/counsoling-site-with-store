<script setup>
definePageMeta({
  middleware: 'route-check',
  layout: 'dashboard'
});
const route = useRoute()
const router = useRouter()
const state = reactive({
  data: [],
  topic: {},
  categoryData:[],
  dialogDelete: false,
  dialogEdit: false,
  dialogView: false,
  current: {},
  search: null,
  metadata: {
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    parameters: null,
  },
  dialog: [],
})

onMounted(async()=>{
  dashboardbreadcrumbstore().setBreadCrumbs([
  {
      title: 'تالار گفتگو ',
      disabled: false,
      to: '/dashboard/forum/list',
    },  
  {
      title: 'پست ها',
      disabled: true,
      to: ``,
    }])
    await getData()
    await getTopicById()
})

const getData = async () => {
  const payload = {
    topicId: route.params.id
  }
  if(route.query.index) payload.pageIndex = route.query.index
  if(route.query.size) payload.pageSize = route.query.size
  if(route.query.search) payload.searchFilters = [{field: "message",operator: 6,value: route.query.search}]
  await axiosApi().post(apiPath.Post.post.byTopicId,payload)
    .then((res) => {
      state.data = res.data
      state.metadata = res.metadata
    }).catch((error) => common.showError(error?.data?.messages))
}

const getTopicById = async () =>{
  await axiosApi().get(apiPath.Topic.get.byId(route.params.id))
    .then((res) => state.topic = res.data)
    .catch((error) => common.showError(error?.data?.messages))
}

const deleteData = async (r) =>{
  if(r){
    await axiosApi().delete(apiPath.Post.delete(state.current.id))
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
    await axiosApi().put(apiPath.Post.put,state.current)
    .then(res=>{
      common.showMessage(res.messages)
      getData()
    })
    .catch(error=>common.showError(error?.data?.messages))
  }
  state.dialogEdit = false
  state.current = {}
}

const changePageing = () => {
  let path = `/dashboard/forum/${route.params.action}/${route.params.id}`
  let query = null
  if (state.metadata.pageSize && state.metadata.pageSize != 10) query = { ...query, size: state.metadata.pageSize }
  if (state.metadata.pageIndex && state.metadata.pageIndex != 1) query = { ...query, index: state.metadata.pageIndex }
  if (state.searchFilters && state.searchFilters != '') query = { ...query, search: state.searchFilters }

  router.replace({ path, query })
  setTimeout(() => {
    getData()
  }, 50);
}

const handleDelete = (item) =>{
  state.dialogDelete = true
  state.current = item
}

const handleEdit = async (item) =>{
  state.dialogEdit = true
  state.current = {...item}
}

const handleView = async (item) =>{
  state.dialogView = true
  state.current = item
  state.current.fullName = item.firstName + " " + item.lastName
  state.current.shamsiData = dateConverter.convertToJalali(item.createdOn)
  state.current.replyTo = `${state.data.find(i => i.id == item.parentId)?.firstName ?? '-'} ${state.data.find(i => i.id == item.parentId)?.lastName ?? ''}`
}
</script>

<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>پست ها > {{ state.topic.title }}</v-toolbar-title>
  </v-toolbar>
  <v-card>
    <v-card-text class="d-flex pa-3">
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-form @submit.prevent="changePageing">
            <v-text-field v-model="state.searchFilters" variant="outlined" @blur="changePageing"
              @click:append-inner="changePageing" append-inner-icon="mdi-magnify" density="compact" label="جستجو در پیام کاربر"
              hide-details></v-text-field>
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
          <th class="text-center">ردیف</th>
          <th class="text-center">نام</th>
          <th class="text-center">نقش</th>
          <th class="text-center">تاریخ ایجاد</th>
          <th class="text-center">پاسخ به</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in state.data" :key="item.id" class="text-center">
          <td>{{ ((state.metadata.pageIndex - 1) * state.metadata.pageSize + index) + 1 }}</td>
          <td>{{ `${item.firstName} ${item.lastName}` }}</td>
          <td class="d-flex ga-1 align-center justify-center">
            <v-chip v-if="item.isExpert" color="blue">متخصص</v-chip>
            <v-chip v-if="item.isAdmin" color="green">ادمین</v-chip>
            <v-chip v-else color="success">کاربر</v-chip>
          </td>
          <td>
            {{ dateConverter.convertToJalali(item.createdOn) }}
          </td>
          <td>{{ `${state.data.find(i => i.id == item.parentId)?.firstName ?? '-'} ${state.data.find(i => i.id ==
            item.parentId)?.lastName ?? ''}`}}</td>
          <td>
            <div class="float-left d-flex ga-1">
              <v-btn variant="text" color="teal" icon="mdi-eye" @click="handleView(item)"></v-btn>
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

  <mj-dialog v-model="state.dialogView" :title="`جزئیات پیام > ${state.current.firstName} ${state.current.lastName}`"
    size="lg">
    <div class="d-flex ga-3 pa-5">
      <div class="my-auto">
        <div class="border pa-1 rounded-circle mx-auto" style="width: 200px;">
          <BaseImage :name="state.current.imageId" style="width: 200px;" class="mx-auto rounded-circle" />
        </div>
      </div>
      <div class="w-100">
        <div class="d-flex ga-3 my-3">
          <v-text-field v-model="state.current.fullName" readonly variant="outlined" label="نام"
            hide-details></v-text-field>
          <div class="d-flex my-auto">
            <v-chip v-if="state.current.isExpert" color="blue">متخصص</v-chip>
            <v-chip v-if="state.current.isAdmin" color="green">ادمین</v-chip>
            <v-chip v-else color="success">کاربر</v-chip>
          </div>
        </div>
        <v-textarea auto-grow v-model="state.current.message" class="my-3" label="متن" readonly variant="outlined"
          hide-details></v-textarea>
        <v-row>
          <v-col>
            <v-text-field v-model="state.current.shamsiData" readonly variant="outlined" label="تاریخ ایجاد"
              hide-details></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="state.current.replyTo" readonly variant="outlined" label="پاسخ به"
              hide-details></v-text-field>
          </v-col>
        </v-row>
      </div>
    </div>
  </mj-dialog>

  <mj-dialog v-model="state.dialogEdit" :title="`ویرایش پیام > ${state.current.firstName} ${state.current.lastName}`"
    :action-btn="true" :cancel-btn="true" action-type="primary" @action-callback="editData" size="sm">
    <v-form @submit.prevent="editData">
      <v-textarea v-model="state.current.message" class="mt-5" variant="outlined" label="توضیحات"></v-textarea>
    </v-form>
  </mj-dialog>

  <mj-dialog v-model="state.dialogDelete" title="حذف" :action-btn="true" action-btn-text="حذف شود" :cancel-btn="true"
    action-type="error" @action-callback="deleteData" size="sm">
    <p>{{ state.current.title }} حذف می شود.<br />آیا اطمینان دارید؟</p>
  </mj-dialog>
</template>
