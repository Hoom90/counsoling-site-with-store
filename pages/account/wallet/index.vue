<script setup>
definePageMeta({ layout: 'account', middleware: 'route-check', })
const router = useRouter()
const route = useRoute()
const state = reactive({
  table: {
    headers: ["ردیف", "عنوان", "تاریخ", "بدهکار", "بستانکار"],
  },
  pagination: {
    pageIndex: 0,
    pageSize: 0,
    totalPages: 0,
    totalCount: 0,
  },
  balance: 0,
  textnumber: 0,
  records: [],
  payModal: false,
  modal: false,
  portData: null,
  todayDate: null,
})

//#region GET
onMounted(() => {
  getBalance()
  getRecord()
})

const getBalance = async () => {
  await axiosApi().get(apiPath.User.Wallet.balance)
    .then((res) => state.balance = res.data)
    .catch((error) => common.showError(error?.data?.messages))
}

const getRecord = async () => {
  if (route.query) {
    state.pagination = {
      pageIndex: route.query?.index,
      pageSize: route.query?.size
    }
  }
  await axiosApi().post(apiPath.User.Wallet.paged, state.pagination)
    .then((res) => {
      state.records = res.data
      state.pagination = res.metadata
    })
    .catch((error) => common.showError(error?.data?.messages))
}

const changePageing = () => {
  router.replace({ path: '/account/wallet', query: { size: state.pagination.pageSize, index: state.pagination.pageIndex } })

  setTimeout(() => {
    getRecord()
  }, 50);
}
//#endregion

//#region POST
const postData = async () => {
  if (state.textnumber == '0' || state.textnumber.length < 2) {
    common.showError("مقدار وارد شده اشتباه است.")
    return
  }
  await axiosApi().post(apiPath.User.Payment.post, { amount: state.textnumber })
    .then((res) => {
      state.modal = true
      state.portData = res.data
      state.todayDate = new Date().toISOString().slice(0, 10)
    })
    .catch((error) => common.showError(error?.data?.messages))
}
//#endregion

const openPayPort = (r) => {
  if (r) {
    window.location.href = state.portData.url
  }
  state.modal = false
  state.textnumber = '0'
}

</script>

<template>
  <!-- head -->
  <fieldset class="myFieldset rounded-xl mb-5 d-md-none">
    <div class="d-flex align-center ga-5">
      <v-btn icon="mdi-chevron-right" class="bg-teal d-md-none" to="/account/home"></v-btn>
      <p class="text-18"><strong>سوابق کیف پول</strong></p>
    </div>
    <div class="text-center">
      <span>موجودی کیف پول: </span>
      <span>{{ state.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} تومان</span>
    </div>
  </fieldset>

  <template class="d-none d-md-block">
    <fieldset class="myFieldset rounded-xl mb-5 d-flex justify-space-between align-center pr-10">
      <legend>شارژ کیف</legend>
      <div>
        <span>موجودی کیف پول: </span>
        <span>{{ state.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} تومان</span>
      </div>
      <div class="mb-3">
        <v-form @submit.prevent="postData">
          <div class="d-flex align-center ga-1">
            <v-btn color="theme-blue" type="submit" variant="outlined" height="40" min-width="40"
              class="d-flex align-center pa-0">
              <v-icon>mdi-cash-plus</v-icon>
            </v-btn>
            <BaseNumberSeprator style="min-width: 200px;" v-model="state.textnumber" dir="ltr" hide-details
              density="compact" />
          </div>
        </v-form>
      </div>
    </fieldset>
  </template>

  <!-- records > cardlist -->
  <v-card flat class="d-md-none mb-5" v-for="(item, index) in state.records" :key="index">
    <v-row no-gutters>
      <v-col cols="12" class="mb-3">
        {{ item.description }}
      </v-col>
      <v-col cols="6">
        <v-icon color="grey">mdi-calendar-outline</v-icon>
        <span>{{ dateConverter.convertToJalali(item.createdOn) }}</span>
      </v-col>
      <v-col cols="6" v-if="item.indebtedAmount != 0" dir="ltr">
        <span class="text-20 text-red">
          <strong>-{{ item.indebtedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</strong>
        </span>
        <small>تومان</small>
      </v-col>
      <v-col cols="6" v-if="item.creditAmount != 0" dir="ltr">
        <span class="text-20 text-green">
          <strong>+{{ item.creditAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</strong>
        </span>
        <small>تومان</small>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </v-card>
  <v-card flat class="d-md-none mt-5">
    <v-pagination v-if="state.pagination.totalCount > state.pagination.pageSize" :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </v-card>

  <!-- records > table -->
  <fieldset class="myFieldset rounded-xl d-none d-md-block">
    <legend>سوابق پرداخت</legend>
    <v-table>
      <thead>
        <tr>
          <th>ردیف</th>
          <th>عنوان</th>
          <th>تاریخ</th>
          <th>بدهکار</th>
          <th>بستانکار</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in state.records" :key="item.index">
          <td>{{ ((state.pagination.pageIndex - 1) * state.pagination.pageSize + index) + 1 }}</td>
          <td>{{ item.description }}</td>
          <td>{{ dateConverter.convertToJalali(item.createdOn) }}</td>
          <td>{{ item.indebtedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
          <td>{{ item.creditAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination v-if="state.pagination.totalCount > state.pagination.pageSize" :length="state.pagination.totalPages" v-model="state.pagination.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </fieldset>

  <mj-dialog v-model="state.modal" title="رسید پیگیری پرداخت" :action-btn="true" action-btn-text="پرداخت"
    :cancel-btn="true" action-type="primary" @action-callback="openPayPort" size="sm">
    <v-row class="pa-10 text-center">
      <v-col cols="12">
        <p>کد پیگیری شما:<br />{{ parseInt(state.portData.autority) }}</p>
      </v-col>
      <v-col cols="12">
        <p>تاریخ:<br />{{ dateConverter.convertToJalali(state.todayDate) }}</p>
      </v-col>
      <v-col cols="12">
        <p>هزینه:<br />{{ state.textnumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} تومان</p>
      </v-col>
    </v-row>
  </mj-dialog>

  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" color="red" icon="mdi-plus" variant="flat"
        style="position: fixed;bottom: 50px;right: 40px;"></v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card>
        <v-card-title class="d-flex align-center bg-teal">
          <v-btn icon="mdi-close" variant="text" @click="isActive.value = false"></v-btn>
          <p>شارژ کیف پول</p>
        </v-card-title>
        <v-card-text>
          <div class="mb-5 text-center">
            <span><small>موجودی کیف پول: </small></span>
            <span>
              <strong>{{ state.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</strong>
              <small>تومان</small>
            </span>
          </div>
          <div class="mb-3">
            <v-form @submit.prevent="postData">
              <BaseNumberSeprator v-model="state.textnumber" dir="ltr" />
              <v-btn class="bg-red w-50" size="large" @click="isActive.value = false">انصراف</v-btn>
              <v-btn type="submit" class="bg-blue w-50" size="large">پرداخت</v-btn>
            </v-form>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>