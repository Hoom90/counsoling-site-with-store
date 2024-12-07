<script setup>
const router = useRouter()
const route = useRoute()
dashboardbreadcrumbstore().setBreadCrumbs([
  {
    title: 'محصولات',
    disabled: true,
    to: '/dashboard/product/list',
  }]
)

const state = reactive({
  metadata: {
    pageIndex: route.query?.index ?? 1,
    pageSize: route.query?.size ?? 10,
    totalPages: 0,
    totalCount: 0,
    hasPreviousPage: true,
    hasNextPage: true,
    parameters: null
  },
  newsList: [],
  dialogDelete: false,
  current: {}
})

onMounted(()=>{
  getAllProducts()
})

const getAllProducts = async () => {
  await axiosApi().post(apiPath.Product.getAll, {
    contentType: 1,
    pageIndex: state.metadata.pageIndex,
    pageSize: state.metadata.pageSize,
  }).then(r => {
    state.newsList = r.data;
    state.metadata = r.metadata
  }).catch(e => {
    common.showError(e?.data?.messages)
  })
}

const changePageing = () => {
  router.replace({ path: '/dashboard/product/list', query: { size: state.metadata.pageSize, index: state.metadata.pageIndex } })

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
        state.dialogDelete = false
        getAllProducts()
      }).catch(e => common.showError(e?.data?.messages))
  }
  else {
    state.dialogDelete = false
  }
}
</script>
<template v-if="state.newsList && state.newsList.length > 0">
  <v-toolbar class="mb-5" :elevation="1" color="white" rounded>
    <v-toolbar-title>محصولات</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn to="/dashboard/product/add" variant="tonal" color="info">ایجاد محصول جدید</v-btn>
  </v-toolbar>

  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-text-field type="search" variant="outlined" density="compact" label="جستجو" hide-details=""></v-text-field>
        </v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-select v-model="state.metadata.size" :items="constract.pageSize" variant="outlined" density="compact"
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
              <v-btn variant="tonal" color="info" class="mx-2" :to="'/dashboard/product/edit/' + item.id" >ویرایش</v-btn>
              <v-btn variant="tonal" color="warning" @click="handleDelete(item)">حذف</v-btn>
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
