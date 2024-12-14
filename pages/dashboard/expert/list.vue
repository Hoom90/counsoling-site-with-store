<script setup>
definePageMeta({
  middleware: 'route-check',
  layout: 'dashboard'
});
const route = useRoute()
const router = useRouter()
const state = reactive({
  users: [],
  metadata: {
    size: route.query?.size ?? 10,
    index: route.query?.index ?? 1,
    totalCount: 1,
    totalPages: 1,
    searchFilters:null,
  },
  currentUser: {},
  dialogDelete: false,
  searchFilters: null,
})

onMounted(()=>{
  getData()
  dashboardbreadcrumbstore().setBreadCrumbs([
    {
      title: 'متخصصان ',
      disabled: true,
      to: '/dashboard/expert/list',
    }])
})

const getData = async () => {
  let payload = {}
  if (route.query.size) payload.pageSize = route.query.size
  if (route.query.index) payload.pageIndex = route.query.index
  await axiosApi().post(apiPath.Expert.get.paged,payload)
    .then((res) => state.users = res.data)
    .catch((error) => common.showError(error?.data?.messages))
}

const changePageing = () => {
  let path = '/dashboard/expert/list'
  let query = null
  if (state.metadata.size && state.metadata.size != 10) query = { ...query, size: state.metadata.size }
  if (state.metadata.index && state.metadata.index != 1) query = { ...query, index: state.metadata.index }
  router.replace({ path, query })
  setTimeout(() => {
    getData()
  }, 50);
}

const handleDelete = (row) => {
  state.currentUser = row
  state.dialogDelete = true
}

const deleteData = (r) => {
  if (r) {
    axiosApi().delete(apiPath.Expert.delete(state.currentUser.id))
      .then(r => {
        common.showMessage('متخصص حذف شد')
        getData()
      })
      .catch(e => common.showError(e?.data?.messages))
  }
  state.dialogDelete = false
}
</script>
<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>متخصصان</v-toolbar-title>
  </v-toolbar>
  <v-card>
    <v-card-text class="d-flex pa-3">
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <v-col cols="12" xs="6" sm="4">
          <v-select v-model="state.metadata.size" :items="contracts.pageSize" variant="outlined" density="compact"
            label="تعداد نمایش" @update:modelValue="changePageing" hide-details></v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-table>
      <thead>
        <tr>
          <th>ردیف</th>
          <th>نام</th>
          <th>نام خانوادگی</th>
          <th>شماره تماس</th>
          <th>تاریخ عضویت</th>
          <th>وضعیت</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in state.users" :key="item.id" class="text-center">
          <td>{{ ((state.metadata.index - 1) * state.metadata.size + i) + 1 }}</td>
          <td>{{ item.firstName }}</td>
          <td>{{ item.lastName }}</td>
          <td>{{ item.phoneNumber }}</td>
          <td>{{ dateConverter.convertToJalali(item.createdOn) }}</td>
          <td>
            <v-chip color="green" v-if="item.isConfirm">تایید شده</v-chip>
            <v-chip color="red" v-else>در انتظار</v-chip>
          </td>
          <td>
            <div class="float-left">
              <v-btn variant="text" color="info" :to="'/dashboard/expert/schedule/' + item.id" prepend-icon="mdi-calendar" >جدول زمانی</v-btn>
              <v-btn variant="text" color="orange" icon="mdi-pen" :to="'/dashboard/expert/' + item.id"></v-btn>
              <v-btn variant="text" color="red" icon="mdi-delete" @click="handleDelete(item)"></v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination v-if="state.metadata.totalCount > state.metadata.size" :length="state.metadata.totalPages" v-model="state.metadata.index" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </v-card>


  <mj-dialog v-model="state.dialogDelete" title="حذف متخصص" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="deleteData" size="sm">
    <p>متخصص {{ state.currentUser.firstName }} {{ state.currentUser.lastName }} حذف می شود.<br />آیا اطمینان دارید؟</p>
  </mj-dialog>
</template>