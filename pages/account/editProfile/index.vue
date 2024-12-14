<script setup>
definePageMeta({ layout: 'account', middleware: 'route-check', })
import avatar from "@/assets/img/avatar.png"
const verifyForm = ref({});
const user = userStore()
const state = reactive({
  user: [],
  item: null,
  tab: null,
  userImage: avatar,
  expertImages: null,
})

onMounted(() => {
  getUser()
  getProvinces()
})

const getUser = async () => {
  await axiosApi().get(apiPath.UserInfo)
    .then((res) => {
      state.user = res.data
      state.selectedImage = state.user.imageId
    })
    .catch((error) => common.showError(error?.data?.messages))
}

const getProvinces = async () => {
  await axiosApi().get(apiPath.User.Province.get)
    .then((res) => {
      state.province = res.data
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}

const postData = async () => {
  const { valid } = await verifyForm.value.validate()
  if (!valid){
    common.showError('موارد ضروری را وارد کنید')
    return
  }
  if (state.tab == 1) {
    await postUserData()
  }
  if (state.tab == 2) {
    await postExpertData()
  }
}

const postUserData = async () => {
  await axiosApi().post(apiPath.ChangeProfile, state.user)
    .then((res) => {
      common.showMessage(res.messages)
      getUser()
      let user = localStorage.getUser()
      user.firstName = state.user.firstName
      user.lastName = state.user.lastName
      user.imageId = state.user.imageId
      localStorage.saveUser(user)
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}

const uploadImage = (value) => {
  state.imageError = false
  state.selectedImage = value
  state.user.imageId = value
}

const deleteUploadedImage = () => {
  state.user.imageId = null
  state.selectedImage = null
  state.imageError = true
}

</script>

<template>
  <fieldset class="myFieldset rounded-xl mb-3 d-flex align-center ga-5">
    <v-btn icon="mdi-chevron-right" class="bg-teal d-md-none" to="/account/home"></v-btn>
    <p class="text-18"><strong>ویرایش حساب کاربری</strong></p>
  </fieldset>
  <fieldset class="myFieldset rounded-xl">
    <v-form @submit.prevent="postData" ref="verifyForm" :readonly="user.getIsConsultant ? true : false">
          <v-row>
            <!-- فرم -->
            <v-col cols="12" lg="8" class="order-2 order-lg-1">
              <v-text-field variant="outlined" label="نام" v-model="state.user.firstName" :rules="validator.user.firstName"></v-text-field>
              <v-text-field variant="outlined" label="نام خانوادگی" v-model="state.user.lastName" :rules="validator.user.lastName"></v-text-field>
              <v-text-field variant="outlined" label="شماره موبایل" v-model="state.user.phoneNumber" readonly></v-text-field>
              <v-text-field variant="outlined" label="توضیحات" v-model="state.user.description"></v-text-field>
              <v-text-field variant="outlined" label="آدرس" v-model="state.user.address"></v-text-field>
            </v-col>
            <!-- عکس حساب کاربری -->
            <v-col cols="12" lg="4" class="order-1 order-lg-2">
              <label>
                <strong>عکس حساب کاربری*</strong>
              </label>
              <v-divider class="mt-3 mb-1"></v-divider>
              <v-card flat class="mx-auto text-center" max-width="300">
                <BaseImage :src="state.selectedImage" class="mb-1" />
                <Uploader v-if="!state.selectedImage" @update:model-value="uploadImage" :hasImage="false" :multiple="false" :is-private="false"/>
                <v-btn v-if="state.selectedImage" class="bg-red w-100" prepend-icon="mdi-delete-forever" @click="deleteUploadedImage">حذف</v-btn>
              </v-card>
              <v-divider class="d-lg-none mt-3"></v-divider>
            </v-col>
          </v-row>
      <v-btn type="submit" class="bg-info" size="large" block>ثبت</v-btn>
    </v-form>
  </fieldset>
</template>

<style>
a.filepond--credits {
  display: none !important;
}

.customDatePicker {
  display: flex;
  justify-content: space-between;
  border: 1px solid rgb(133, 133, 133);
  padding: 15px;
  border-radius: 3px;

}

.customDatePicker input {
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
}
</style>