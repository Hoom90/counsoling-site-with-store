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
    totalPages: 6,
    totalCount: 60,
    hasPreviousPage: false,
    hasNextPage: true,
    parameters: null
  },
  ticketList: [],
})

onMounted(() => {
  getData()
  dashboardbreadcrumbstore().setBreadCrumbs([
    {
      title: 'تیکت ها ',
      disabled: true,
      to: '/dashboard/ticket',
    }])
})

const getData = async () => {
  const payload = {}
  if (route.query.index) payload.pageIndex = route.query.index 
  if (route.query.size) payload.pageSize = route.query.size 
  if (route.query.search) payload.searchFilters = [{field:'title',operator:6,value:route.query.search}] 
  await axiosApi().post(apiPath.Ticket.post.pagination,payload)
    .then((res) => {
      state.ticketList = res.data
      state.metadata = res.metadata
    })
    .catch((error) => common.showError(error?.data?.messages))
}

const changePageing = () => {
  let path = '/dashboard/ticket/list'
  let query = null
  if (state.metadata.pageSize && state.metadata.pageSize != 10) query = { ...query, size: state.metadata.pageSize }
  if (state.metadata.pageIndex && state.metadata.pageIndex != 1) query = { ...query, index: state.metadata.pageIndex }
  if (state.searchFilters && state.searchFilters != '') query = { ...query, search: state.searchFilters }
  router.replace({ path, query })
  setTimeout(() => {
    getData()
  }, 50);
}

const handleStateColor = (state) => {
  const ticketState = contracts.ticketState;
  const item = ticketState.find(item => item.id === state);
  return item ? item.color : null;
};

const handleDepartmentTitle = (departmentId) => {
  const department = contracts.ticketRecievers;
  const item = department.find(item => item.id === departmentId);
  return item ? item.title : null;
};

const handleDelete = async (item) => {
  await axiosApi().delete(apiPath.Ticket.delete(item.id))
    .then((res) => {
      common.showMessage(res.messages)
      getData()
    })
    .catch((error) => common.showError(error?.data?.messages))
}
</script>
<template>
  <v-toolbar class="mb-5" elevation="1" color="white" rounded>
    <v-toolbar-title>تیکت ها</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-form @submit.prevent="changePageing">
            <v-text-field v-model="state.searchFilters" @blur="changePageing" @click:append-inner="changePageing"
              append-inner-icon="mdi-magnify" type="search" variant="outlined" density="compact" label="جستجو"
              hide-details=""></v-text-field>
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
          <th>گیرنده</th>
          <th>تاریخ ایجاد</th>
          <th>وضعیت</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in state.ticketList" :key="index">
          <td>{{ ((state.metadata.pageIndex - 1) * state.metadata.pageSize + index) + 1 }}</td>
          <td>{{ item.title }}</td>
          <td>{{ handleDepartmentTitle(item.department) }}</td>
          <td>{{ dateConverter.someTimeAgo(item.createdOn) }}</td>
          <td>
            <v-chip :color="handleStateColor(item.state)">{{ item.stateTitle }}</v-chip>
          </td>
          <td>
            <div class="float-left">
              <v-btn class="bg-info" :to="`/dashboard/ticket/${item.id}`">
                <v-icon>mdi-eye</v-icon>
                بررسی
              </v-btn>
              <v-btn variant="text" color="red" icon="mdi-delete" @click="handleDelete(item)"></v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination total-visible="6" :length="state.metadata.totalPages" v-model="state.metadata.pageIndex"
      class="mx-auto" @update:modelValue="changePageing">
    </v-pagination>
  </v-card>

  <!-- <mj-dialog v-model="state.dialogDelete" title="حذف مقاله" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="acceptDelete" size="sm">
    <p>مقاله {{ state.current.title }} حذف می شود.<br />آیا اطمینان دارید؟</p>
  </mj-dialog> -->
</template>
