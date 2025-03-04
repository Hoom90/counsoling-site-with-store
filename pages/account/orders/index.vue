<script setup>
definePageMeta({ layout: 'account', middleware: 'route-check', })
const router = useRouter();
const route = useRoute();
let regExTime = /([0-9]?[0-9]):([0-9][0-9])/;

const state = reactive({
  table: {
    headers: ["ردیف", "متخصص", "هزینه", "تاریخ خرید", "وضعیت"],
  },
  pagination: {
    pageIndex: 0,
    pageSize: 0,
    totalPages: 0,
    totalCount: 0,
  },
  records: [],
  zarinPardakhtData: null,
  paymentModal: false,
  todayDate: false,
  textnumber: null,
  showDetails: false,
  currentOrder: {},
  deleteOrder: false
})

//#region GET
onMounted(() => {
  getData()
});

const getData = async () => {
  if (route.query) {
    state.pagination = {
      pageIndex: route.query?.index,
      pageSize: route.query?.size
    }
  }
  await axiosApi().post(apiPath.User.Order.post.pagination, state.pagination)
    .then((res) => {
      state.records = res.data
      state.pagination = res.metadata
    })
    .catch((error) => common.showError(error?.data?.messages))
}

const changePageing = () => {
  router.replace({ path: '/account/orders', query: { size: state.pagination.pageSize, index: state.pagination.pageIndex } })

  setTimeout(() => {
    getData()
  }, 50);
}
//#endregion

//#region DELETE
const deleteData = async (s) => {
  if (s) {
    await axiosApi().delete(apiPath.User.Order.delete(state.currentOrder.id))
      .then((res) => {
        getData()
        common.showMessage('با موفقیت حذف شد')
        state.deleteOrder = false
      })
      .catch((error) => common.showError(error?.data?.messages))
  }
  else
    state.deleteOrder = false
}
//#endregion

const postPayment = async (item) => {
  state.textnumber = item.amount
  await axiosApi().get(apiPath.User.Payment.byOrder(item.id))
    .then((res) => {
      state.paymentModal = true
      state.zarinPardakhtData = res.data
      state.todayDate = new Date().toISOString().slice(0, 10)
    })
    .catch((error) => common.showError(error?.data?.messages))
}

const handleResult = (id) => {
  router.push(`/account/orders/result/${id}`)
}

const openPayPort = (r) => {
  if (r) window.location.href = state.zarinPardakhtData.url
  state.paymentModal = false
}

const showDetails = (item) => {
  state.showDetails = true
  axiosApi().get('/user/order/' + item.id)
    .then((res) => state.currentOrder = res.data)
    .catch((error) => common.showError(error?.data?.messages))
}

const handelDeleteOrder = (item) => {
  state.currentOrder = item
  state.deleteOrder = true
}


</script>

<template>
  <fieldset class="myFieldset rounded-xl mb-5 d-flex align-center ga-5">
    <v-btn icon="mdi-chevron-right" class="bg-teal d-md-none" to="/account/home"></v-btn>
    <p class="text-18"><strong>سفارشات</strong></p>
  </fieldset>

  <!-- records > cardlist -->
  <v-card flat class="d-md-none mb-5" v-for="(item, index) in state.records" :key="index">
    <v-row no-gutters>
      <v-col cols="12" class="mb-3">
        {{ `نام کارشناس: ${item.expertFirstName} ${item.expertLastName}` }}
      </v-col>
      <v-col cols="6">
        <v-icon color="grey">mdi-calendar-outline</v-icon>
        <span>{{ dateConverter.convertToJalali(item.createdOn) }}</span>
      </v-col>
      <v-col cols="6" dir="ltr">
        <span class="text-20">
          <strong>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</strong>
        </span>
        <small>تومان</small>
      </v-col>
      <v-col cols="12" class="mb-3">
        <span>
          وضعیت سفارش: 
        </span>
        <span class="text-16">
          <strong>{{ item.stateTitle }}</strong>
        </span>
      </v-col>
      <v-col cols="6">
        <v-btn v-if="item.state == 2" class="bg-green" rounded="0" block
          @click="postPayment(item)">
          <small>تکمیل پرداخت</small>
        </v-btn>
        <v-btn class="bg-grey" rounded="0" @click="showDetails(item)" block>
          <v-icon>mdi-eye</v-icon>
          <small>جزئیات پرداخت</small>
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn v-if="item.state == 4" class="bg-teal" rounded="0" block
        @click="handleResult(item.id)">
          <v-icon>mdi-note</v-icon>
          <small>نسخه شما</small>
        </v-btn>
        <v-btn v-if="item.state == 1 || item.state == 2 || item.state == 3" class="bg-red" block
          rounded="0" @click="handelDeleteOrder(item)">
          <v-icon>mdi-delete</v-icon>
          <small>حذف نوبت</small>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </v-card>
  <v-card flat class="d-md-none d-flex justify-space-between">
    <v-pagination v-if="state.pagination.totalCount > state.pagination.pageSize" :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </v-card>

  <!-- table -->
  <fieldset class="d-none d-md-block myFieldset rounded-xl">
    <v-table>
      <thead>
        <tr>
          <th>متخصص</th>
          <th>هزینه</th>
          <th>تاریخ خرید</th>
          <th>وضعیت</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in state.records" :key="index">
          <td>{{ `${item.expertFirstName} ${item.expertLastName}` }}</td>
          <td>{{ item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
          <td>{{ dateConverter.convertToJalali(item.createdOn) }}</td>
          <td>
            {{ item.stateTitle }}
          </td>
          <td class="text-left pa-0 ma-0 d-flex justify-end">
            <v-btn v-if="item.state == 2" class="h-100" color="green-lighten-1" variant="tonal" rounded="0"
              @click="postPayment(item)">
              <small>تکمیل پرداخت</small>
            </v-btn>
            <v-btn class="h-100" color="blue-lighten-1" variant="tonal" rounded="0" @click="showDetails(item)">
              <small>جزئیات پرداخت</small>
            </v-btn>

            <v-btn v-if="item.state == 4" class="h-100" color="deep-purple-lighten-1" variant="tonal" rounded="0"
              @click="handleResult(item.id)">
              <small>نسخه شما</small>
            </v-btn>
            <v-btn v-if="item.state == 1 || item.state == 2 || item.state == 3" class="h-100" color="red-darken-4"
              variant="tonal" rounded="0" @click="handelDeleteOrder(item)">
              <small>حذف نوبت</small>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination v-if="state.pagination.totalCount > state.pagination.pageSize" :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </fieldset>

  <!-- رسید پیگیری پرداخت -->
  <mj-dialog v-model="state.paymentModal" title="رسید پیگیری پرداخت" :action-btn="true" action-btn-text="پرداخت"
    :cancel-btn="true" action-type="primary" @action-callback="openPayPort" size="sm">
    <v-row class="pa-10 text-center">
      <v-col cols="6">
        <p>کد پیگیری شما:<br />{{ parseInt(state.zarinPardakhtData.autority) }}</p>
      </v-col>
      <v-col cols="6">
        <p>تاریخ:<br />{{ dateConverter.convertToJalali(state.todayDate) }}</p>
      </v-col>
      <v-col cols="12">
        <p>هزینه قابل پرداخت:<br />{{ state.textnumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} تومان</p>
      </v-col>
    </v-row>
  </mj-dialog>

  <mj-dialog v-model="state.showDetails" title="جزئیات سفارش" size="sm">
    <v-row class="pa-3 text-center">
      <v-col cols="12">
        <v-list density="compact">
          <!-- <v-list-item prepend-icon="mdi-arrow-left-circle">
                    <strong>عنوان : </strong>
                    <span>{{ state.data?.title }}</span>
                  </v-list-item> -->
          <v-list-item prepend-icon="mdi-arrow-left-circle" class="text-start">
            <strong>نام و نام خانوادگی متخصص: </strong>
            <span>{{ state.currentOrder?.expertFirstName }} {{ state.currentOrder?.expertLastName }}</span>
          </v-list-item>

          <v-list-item prepend-icon="mdi-arrow-left-circle" class="text-start">
            <strong>کد نظام : </strong>
            <span>{{ state.currentOrder?.medicalNumber }}</span>
          </v-list-item>
          <v-list-item prepend-icon="mdi-arrow-left-circle" class="text-start">
            <strong>هزینه : </strong>
            <span>{{ state.currentOrder?.amount?.toLocaleString() }}</span>
          </v-list-item>
          <v-list-item prepend-icon="mdi-arrow-left-circle" class="text-start">
            <strong>زمان سفارش : </strong>
            <span>{{ dateConverter.convertToJalali(state.currentOrder?.createdOn) }}</span>
          </v-list-item>
          <v-list-item v-if="state.currentOrder.schedule" prepend-icon="mdi-arrow-left-circle" class="text-start">
            <strong>تاریخ مشاوره : </strong>
            <span>{{ dateConverter.convertToJalali(state.currentOrder?.schedule?.startTime) }}</span>
          </v-list-item>
          <v-list-item v-if="state.currentOrder.schedule" prepend-icon="mdi-arrow-left-circle" class="text-start">
            <strong>زمان مشاوره : </strong>
            <span> از {{ (regExTime.exec(state.currentOrder?.schedule?.startTime) ?? [])[0] }} تا {{ (regExTime.exec(
              state.currentOrder?.schedule?.endTime) ?? [])[0] }} </span>
          </v-list-item>

        </v-list>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <div class="d-flex">

      <v-btn class="ms-auto ma-3" @click="state.showDetails = false" variant="text">انصراف</v-btn>
    </div>
  </mj-dialog>


  <mj-dialog v-model="state.deleteOrder" title="حذف سفارش" size="sm" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="deleteData">
    <div v-if="state.currentOrder.state == 3">
      در صورتی که تا یک روز مانده به جلسه مشاوره انصراف دهید هزینه به کیف پول شما برگردانده می شود
      <br />
      در صورتی که تا 10 ساعت مانده به شروع جلسه مشاوره انصراف دهید نصف هزینه عودت داده می شود
      <br />
      در صورتی که کمتر از 10 ساعت مانده به جلسه مشاوره انصراف دهید هزینه عودت داده نمی شود

      <br />
      آیا اطمینان دارید؟
    </div>
    <div v-else>
      این سفارش حذف می گردد.
      <br />
      آیا اطمینان دارید؟
    </div>
  </mj-dialog>
</template>