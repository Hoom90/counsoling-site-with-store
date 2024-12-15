<script setup>
definePageMeta({ layout: 'account', middleware: 'route-check', })
const router = useRouter();
const state= reactive({
  pagination: {
    pageIndex: 0,
    pageSize:0,
    totalPages:0,
    totalCount: 0,
  },
  records: [],
})

//#region GET
onMounted(()=>{
  getData()
});

const getData = async () => {
  await axiosApi().post(apiPath.ExpertOrderPagination,state.pagination)
  .then((res)=>{
    state.records = res.data
    state.pagination = res.metadata
  })
  .catch((error)=>common.showError(error?.data?.messages))
}

const changePageing = () => {
  router.replace({ path: '/account/service', query: { size: state.pagination.pageSize, index: state.pagination.pageIndex }})

  setTimeout(() => {
    getData()
  }, 50);
}
//#endregion

</script>

<template>
  <fieldset class="myFieldset rounded-xl mb-5 d-flex align-center ga-5">
    <v-btn icon="mdi-chevron-right" class="bg-teal d-md-none" to="/account/home"></v-btn>
    <p class="text-18"><strong>خدمات ارائه شده</strong></p>
  </fieldset>

  <!-- records > cardlist -->
  <v-card flat class="d-md-none mb-5" v-for="(item, index) in state.records" :key="index">
    <v-row no-gutters>
      <v-col cols="12" class="mb-3 d-flex ga-1">
        <v-icon color="grey">mdi-account-circle-outline</v-icon>
        <span class="text-18">
          <strong>{{ `${item.userFirstName} ${item.userLastName}` }}</strong>
        </span>
      </v-col>
      <v-col cols="6">
        <span>مدت زمان مشاوره: </span>
        <span class="text-20">
          <strong>{{ item.consultationTime }}</strong>
        </span>
        <small>دقیقه</small>
      </v-col>
      <v-col cols="6" dir="ltr">
        <span>
          {{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
        </span>
        <small>تومان</small>
      </v-col>
      <v-col cols="12" class="mt-3">
        <v-btn class="bg-blue" block rounded="0"
          :to="`/account/service/prescription/${item.id}`">
          <v-icon>mdi-note-plus</v-icon>
          <span>صدور نسخه</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </v-card>
  <v-card flat class="d-md-none mt-5">
    <v-pagination v-if="state.pagination.totalCount > state.pagination.pageSize" :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </v-card>

  <!-- table -->
  <fieldset class="d-none d-md-block myFieldset rounded-xl">
    <v-table>
      <thead>
        <tr>
          <th v-for="item in ['ردیف','نام و نام خانوادگی','زمان (دقیقه)','هزینه']">{{ item }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in state.records" :key="item.id">
          <td>{{ ((state.pagination.pageIndex - 1) * state.pagination.pageSize + index) + 1 }}</td>
          <td>{{ `${item.userFirstName} ${item.userLastName}` }}</td>
          <td>{{ item.consultationTime }}</td>
          <td>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
          <td class="text-left pa-0 ma-0 justify-end">
            <v-btn class="h-100" color="light-blue-accent-1" variant="tonal" rounded="0"
              :to="`/account/service/prescription/${item.id}`">
              <v-icon>mdi-note-plus</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination v-if="state.pagination.totalCount > state.pagination.pageSize" :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </fieldset>

</template>