<script setup>
definePageMeta({ layout: 'account', middleware: 'route-check', })
import moment from "jalali-moment";
const route = useRoute()
const state = reactive({
  data: [],
  categoryList: [],
  result: [],
  selectedCategory: null,
  newCounselingResult: {
    categoryId: 0,
    orderId: 0,
    summary: null,
    duration: 0,
    results: [
      {
        resultId: 0,
        value: null,
        title: null
      }
    ]
  }
})

onMounted(() => {
  getData()
  getCategory()
})

const getData = async () => {
  await axiosApi().get(apiPath.ExpertCounselingResultOrder(route.params.id))
    .then((res) => {
      state.data = res.data
      if(state.data.counselingResult){
        state.result = null
        state.selectedCategory = state.data.counselingResult.categoryId
        state.newCounselingResult = state.data.counselingResult
      }
    })
    .catch(error => common.showError(error?.data?.messages))
}

const getCategory = async () => {
  await axiosApi().get(apiPath.Category.get.all)
    .then((res) => state.categoryList = res.data)
    .catch((error) => common.showError(error?.messages))
}

const getResult = async () => {
  state.result = []
  await axiosApi().get(apiPath.ExpertResult(state.selectedCategory))
    .then((res) => {
      let items = res.data
      items.forEach(item => {
        state.result.push({
          resultId: item.id,
          value: item.defaultValue,
          title: item.title,
      })
      });
      state.newCounselingResult.results = state.result
    })
    .catch((error) => common.showMessage(error?.messages))
}

const postData = async () =>{
  state.newCounselingResult.orderId = route.params.id
  state.newCounselingResult.categoryId = state.selectedCategory
  console.log(state.newCounselingResult);
  await axiosApi().post(apiPath.ExpertCounselingResultAdd,state.newCounselingResult)
  .then((res)=>{
    common.showMessage(res.messages)
    state.selectedCategory = state.newCounselingResult.categoryId
  })
  .catch((error)=>common.showError(error?.messages))
}

</script>

<template>
  <fieldset class="myFieldset rounded-xl mb-5">
    <legend>اطلاعات نسخه</legend>
    <v-row class="align-center">
      <v-col cols="12" sm="8">
        <v-row>
          <v-col cols="12" sm="3" class="text-center">
            <BaseImage :name="state.data.imageId" class="rounded-pill border-xl w-100 mx-auto" style="max-width: 350px;"/>
          </v-col>
          <v-col cols="12" sm="9">
            <p class="mb-2">
              <strong>نام و نام خانوادگی: </strong>
              <span>{{ state.data?.userFirstName }} {{state.data?.userLastName}}</span>
            </p>
            <p class="mb-2">
              <strong>هزینه: </strong>
              <span>{{ state.data.amount }} تومان</span>
            </p>
            <p class="mb-2">
              <strong>زمان مشاوره: </strong>
              <span>{{ state.data?.consultationTime }} دقیقه</span>
            </p>
            <p class="mb-2">
              <strong>تاریخ مشاوره: </strong>
              <span>{{ moment(state.data?.updatedOn).locale("fa").format('LLLL') }}</span>
            </p>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="4" class="text-md-left text-center">
        <v-btn color="teal" variant="tonal" to="/account/service/" class="w-100">بازگشت به خدمات</v-btn>
      </v-col>
    </v-row>
  </fieldset>
  <fieldset class="myFieldset rounded-xl">
    <legend>صدور نسخه</legend>
    <v-form @submit.prevent="postData">
      <v-row no-gutters class="px-5">
        <v-col cols="12" lg="6" class="">
          <template v-if="state.data?.counselingResult?.id">
            <label>دسته بندی نسخه: </label>
            <span>{{ state.selectedCategory }}</span>
          </template>
          <BaseCategorySelect v-else v-model="state.selectedCategory" label="دسته بندی نسخه" :items="state.categoryList" :multiple="false"/>
        </v-col>
        <v-col cols="12" lg="6">
          <template v-if="state.data?.counselingResult?.id">
            <label>مدت زمان مشاوره (دقیقه): </label>
            <span>{{ state.newCounselingResult.duration }}</span>
          </template>
          <v-text-field v-else
            v-model="state.newCounselingResult.duration"
            variant="outlined"
            label="مدت زمان مشاوره (دقیقه)"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-divider class="my-5"></v-divider>

      <!-- add form -->
      <v-row no-gutters class="mb-1 px-5" v-if="state.result">
        <v-col cols="12" lg="6" v-if="state.result.length !== 0" v-for="(field,index) in state?.result">
          <template v-if="state.data?.counselingResult?.id">
            <label>{{ field?.title }}: </label>
            <span>{{ state.newCounselingResult.results[index].value }}</span>
          </template>
          <v-text-field v-else v-model="state.newCounselingResult.results[index].value" :label="field?.title" variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12" v-if="state.result.length != 0">
          <v-text-field
            v-model="state.newCounselingResult.duration"
            class=""
            variant="outlined"
            label="مدت زمان مشاوره (دقیقه)"
            type="number"
          ></v-text-field>
          <v-textarea
            v-model="state.newCounselingResult.summary"
            variant="outlined"
            label="توضیحات بیشتر"
          ></v-textarea>
        </v-col>
        <v-col cols="12" class="text-center" v-else>
          <p class="border rounded-lg pa-5">هنوز نسخه ای صادر نشده است</p>
        </v-col>
      </v-row>
      <!-- view form -->
      <v-row no-gutters class="mb-1 px-5" v-else>
        <v-col cols="12" lg="12" v-for="(field,index) in state?.newCounselingResult.resultItems">
          <template v-if="state.data?.counselingResult?.id">
            <label>{{ field?.title }}: </label>
            <span>{{ state.newCounselingResult.resultItems[index].value }}</span>
          </template>
          <v-text-field v-else v-model="state.newCounselingResult.resultItems[index].value" :label="field?.title" variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="12">
          <template v-if="state.data?.counselingResult?.id">
            <label>توضیحات بیشتر: </label>
            <span>{{ state.newCounselingResult.summary }}</span>
          </template>
          <v-textarea
            v-else
            v-model="state.newCounselingResult.summary"
            variant="outlined"
            label="توضیحات بیشتر"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-btn type="submit" class="bg-info w-100" size="large" v-if="!state.data?.counselingResult?.id ?? true">ثبت</v-btn>
    </v-form>

  </fieldset>
</template>