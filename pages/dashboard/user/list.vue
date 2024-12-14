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
    totalPages: 1
  },
  currentUser: {},
  dialogDelete: false,
  dialogExpert: false,
  // searchFilters:null,
})

onMounted(()=>{
  load()
  dashboardbreadcrumbstore().setBreadCrumbs([
    {
      title: 'کاربران ',
      disabled: true,
      to: '/dashboard/user/list',
    }])
})


const load = () => {
  axiosApi().get(apiPath.Users.get.paged(route.query.index, route.query.size))
    .then(r => {
      state.users = r.data
      state.metadata.totalCount = r.metadata.totalCount
      state.metadata.totalPages = r.metadata.totalPages
    }).catch(e => e?.status != 401 ? common.showError(e?.data?.messages) : null)
}


const changePageing = () => {
  let path = '/dashboard/user/list'
  let query = null
  if (state.metadata.size && state.metadata.size != 10) query = { ...query, size: state.metadata.size }
  if (state.metadata.index && state.metadata.index != 1) query = { ...query, index: state.metadata.index }
  // if (state.searchFilters && state.searchFilters != '') query = { ...query, search: state.searchFilters }

  router.replace({ path, query })
  setTimeout(() => {
    load()
  }, 50);
}

const handleDelete = (row) => {
  state.currentUser = row
  state.dialogDelete = true
}

const acceptDelete = (r) => {
  if (r) {
    axiosApi().delete(apiPath.Users.delete(state.currentUser.id))
      .then(r => {
        load()
        common.showMessage('کاربر حذف شد')
      }).catch(e => common.showError(e?.data?.messages))
  }
  state.dialogDelete = false
}

const handelExpert = (row) => {
  state.currentUser = row
  state.dialogExpert = true
}

const acceptExpert = (r) => {
  if (r) {
    axiosApi().post(apiPath.Expert.post, {userId:state.currentUser.id})
      .then(res => {
        common.showMessage("متخصص ثبت شد ")
        load()
      })
      .catch(e => common.showError(e?.data?.messages))
  }
  state.dialogExpert = false
}


</script>
<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>کاربران</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn class="bg-blue-grey-lighten-1" to="/dashboard/user/" size="large">
      <v-icon class="ml-2">mdi-plus-circle-multiple</v-icon>
      افزودن کاربر
    </v-btn>
  </v-toolbar>
  <v-card>
    <v-card-text class="d-flex pa-3">
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <!-- <v-col cols="12" xs="6" sm="4" md="2">
          <v-form @submit.prevent="changePageing">
            <v-text-field v-model="state.searchFilters" type="search" variant="outlined" density="compact" label="جستجو" hide-details append-inner-icon="mdi-magnify" @click:append-inner="changePageing" @blur="changePageing"></v-text-field>
          </v-form>
        </v-col> -->
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
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in state.users" :key="item.id">
          <td>{{ ((state.metadata.index - 1) * state.metadata.size + i) + 1 }}</td>
          <td>{{ item.firstName }}</td>
          <td>{{ item.lastName }}</td>
          <td>{{ `0${item.phoneNumber}` }}</td>
          <td>
            <div class="float-left">
              <v-btn variant="text" color="teal" @click="handelExpert(item)" v-if="!item.expertId" prepend-icon="mdi-star">تعیین به متخصص</v-btn>
              <v-btn variant="text" color="orange" icon="mdi-pen" :to="'/dashboard/user/' + item.id"></v-btn>
              <v-btn variant="text" color="red" icon="mdi-delete" @click="handleDelete(item)" v-if="item.id != 1"></v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination v-if="state.metadata.totalCount > state.metadata.size" :length="state.metadata.totalPages" v-model="state.metadata.index" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </v-card>

  <mj-dialog v-model="state.dialogDelete" title="حذف کاربر" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="acceptDelete" size="sm">
    <p>
      کاربر {{ state.currentUser.firstName }} {{ state.currentUser.lastName }} حذف می شود.
      <br />
      آیا اطمینان دارید؟
    </p>

  </mj-dialog>

  <mj-dialog v-model="state.dialogExpert" title="تعیین متخصص" :action-btn="true" action-btn-text="ثبت متخصص"
    :cancel-btn="true" action-type="info" @action-callback="acceptExpert" size="sm">
    <p>
      کاربر {{ state.currentUser.firstName }} {{ state.currentUser.lastName }} به لیست متخصصان اضافه می شود.
      <br />
      آیا اطمینان دارید؟
    </p>

  </mj-dialog>
</template>