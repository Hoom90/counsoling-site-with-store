<script setup>
definePageMeta({
  middleware: 'route-check',
  layout: 'dashboard'
});
const router = useRouter()
const route = useRoute()
const state = reactive({
  metadata: {
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
    hasPreviousPage: true,
    hasNextPage: true,
    parameters: null
  },
  newsList: [],
  dialogDelete: false,
  current: {},
  searchFilters:null,
})

onMounted(()=>{
  getAllProducts()
  dashboardbreadcrumbstore().setBreadCrumbs([
    {
      title: 'محصولات',
      disabled: true,
      to: '/dashboard/product/list',
    }]
  )
})

const getAllProducts = async () => {
  const payload = {}
  if(route.query.index) payload.pageIndex = route.query.index
  if(route.query.size) payload.pageSize = route.query.size
  if(route.query.search) payload.searchFilters = [{field:'title',operator:6,value:route.query.search}]
  await axiosApi().post(apiPath.Product.getAll, payload)
  .then(r => {
    state.newsList = r.data;
    state.metadata = r.metadata
  })
  .catch(e => common.showError(e?.data?.messages))
}

const changePageing = () => {
  let path = '/dashboard/product/list'
  let query = null
  if (state.metadata.pageSize && state.metadata.pageSize != 10) query = { ...query, size: state.metadata.pageSize }
  if (state.metadata.pageIndex && state.metadata.pageIndex != 1) query = { ...query, index: state.metadata.pageIndex }
  if (state.searchFilters && state.searchFilters != '') query = { ...query, search: state.searchFilters }

  router.replace({ path, query })
  setTimeout(() => {
    getAllProducts()
  }, 50);
}

const handleDelete = (row) => {
  state.dialogDelete = true
  state.current = row
}

const acceptDelete = async (r) => {
  if (r) {
    await axiosApi().delete(apiPath.Product.delete(state.current.id))
      .then(r => {
        common.showMessage("کالا با موفقیت حذف شد")
        getAllProducts()
      }).catch(e => common.showError(e?.data?.messages))
  }
  state.dialogDelete = false
}
</script>
<template v-if="state.newsList && state.newsList.length > 0">
  <v-toolbar class="mb-5" :elevation="1" color="white" rounded>
    <v-toolbar-title>محصولات</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn class="bg-blue-grey-lighten-1" size="large" to="/dashboard/product/add">
      <v-icon class="ml-2">mdi-plus-circle-multiple</v-icon>
      ایجاد محصول جدید
    </v-btn>
  </v-toolbar>

  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-form @submit.prevent="changePageing">
            <v-text-field v-model="state.searchFilters" @blur="changePageing" @click:append-inner="changePageing" append-inner-icon="mdi-magnify" type="search" variant="outlined" density="compact" label="جستجو" hide-details=""></v-text-field>
          </v-form>
        </v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-select v-model="state.metadata.pageSize" :items="contracts.pageSize" variant="outlined" density="compact"
            label="تعداد نمایش" @update:modelValue="changePageing" hide-details></v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-table size="x-large">
      <thead>
        <tr>
          <th>ردیف</th>
          <th>عنوان</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in state.newsList" :key="item.id">
          <td>{{ ((state.metadata.pageIndex - 1) * state.metadata.pageSize + index) + 1 }}</td>
          <td>{{ item.title }}</td>
          <td class="text-center">
            <div class="float-left">
              <v-btn variant="text" color="orange" icon="mdi-pen" :to="'/dashboard/product/edit/' + item.id" ></v-btn>
              <v-btn variant="text" color="red" icon="mdi-delete" @click="handleDelete(item)"></v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination v-if="state.metadata.totalCount > 10"
        :total-visible="6"
        :length="state.metadata.totalPages" v-model="state.metadata.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </v-card>


  <mj-dialog v-model="state.dialogDelete" title="حذف خبر" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="acceptDelete" size="sm">
    <p>خبر {{ state.current.title }} حذف می شود.<br />آیا اطمینان دارید؟</p>
  </mj-dialog>
</template>
