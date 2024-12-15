<script setup>
definePageMeta({ layout: 'account', middleware: 'route-check', })
const router = useRouter()
const route = useRoute();
const state= reactive({
  records: [],
  pagination: {
    pageIndex: 0,
    pageSize:0,
    totalPages:0,
    totalCount: 0,
  },
})

//#region GET
onMounted(async()=>{
  getData()
})

const getData = async()=>{
  if(route.query){
    state.pagination = {
      pageIndex: route.query?.index,
      pageSize: route.query?.size
    }
  }
  await axiosApi().post(apiPath.User.Ticket.post.pagination,state.pagination)
  .then((res)=>{
    state.records = res.data
    state.pagination = res.metadata
  })
  .catch((error)=>common.showError(error?.data?.messages))
}

const changePageing = () => {
  router.replace({ path: '/account/ticket/list', query: { size: state.pagination.pageSize, index: state.pagination.pageIndex }})

  setTimeout(() => {
    getData()
  }, 50);
}
//#endregion

const handleStateColor = (state) => contracts.ticketState.find(x=>x.id==state)?.color

</script>

<template>
  <fieldset class="myFieldset rounded-xl d-flex align-center ga-5 mb-5">
    <v-btn icon="mdi-chevron-right" class="bg-teal d-md-none" to="/account/home"></v-btn>
    <p class="text-18"><strong>لیست تیکت ها</strong></p>
    <div class="mr-auto d-none d-md-block">
      <v-btn variant="tonal" class="rounded-pill" color="info" to="/account/ticket/add">ارسال تیکت جدید</v-btn>
    </div>
  </fieldset>

  <!-- records > cardlist -->
  <v-card flat class="d-md-none mb-5" v-for="(item, index) in state.records" :key="index">
    <v-row no-gutters>
      <v-col cols="12" class="mb-3">{{ item.title }}</v-col>
      <v-col cols="6">
        {{ item.departmentTitle }}
      </v-col>
      <v-col cols="6">
        <span>وضعیت:</span>
        <span>
          <strong>{{ item.stateTitle }}</strong>
        </span>
      </v-col>
      <v-col cols="6">
        <v-icon color="grey">mdi-calendar-outline</v-icon>
        <span>
          <small>{{ dateConverter.convertToJalali(item.createdOn) }}</small>
        </span>
      </v-col>
      <v-col cols="12">
        <v-btn class="bg-blue" block @click="router.push(`/account/ticket/${item.id}`)">
          <v-icon>mdi-eye</v-icon>
          <span>مشاهده</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </v-card>
  <v-card flat class="d-md-none mt-5">
    <v-pagination v-if="state.pagination.totalCount > state.pagination.pageSize" :length="state.pagination.totalPages"
      v-model="state.pagination.pageIndex" class="mx-auto" @update:modelValue="changePageing">
    </v-pagination>
  </v-card>

  <!-- table -->
  <fieldset class="d-none d-md-block myFieldset rounded-xl">
    <v-table>
      <thead>
        <tr>
          <th class="text-center">عنوان</th>
          <th class="text-center">گیرنده</th>
          <th class="text-center">تاریخ ارسال</th>
          <th class="text-center">وضعیت</th>
          <th class="text-center"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in state.records" :key="item.id">
          <td class="text-center">{{ item.title }}</td>
          <td class="text-center">{{ item.departmentTitle }}</td>
          <td class="text-center">{{ dateConverter.convertToJalali(item.createdOn) }}</td>
          <td class="text-center">
            <v-chip :color="handleStateColor(item.state)">{{ item.stateTitle }}</v-chip>
          </td>
          <td class="text-center">
            <v-btn color="blue" variant="tonal" @click="router.push(`/account/ticket/${item.id}`)">مشاهده</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </fieldset>

  <v-btn color="red" icon="mdi-plus" variant="flat" class="d-md-none" style="position: fixed;bottom: 50px;right: 40px;" to="/account/ticket/add"></v-btn>
</template>