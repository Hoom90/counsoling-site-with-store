<script setup>
definePageMeta({ layout: 'account', middleware: 'route-check', })
const verifyForm = ref();
const state = reactive({
  password: {
    oldPassword:null,
    newPassword:null,
    rePassword:null,
  }
})

const save = async () => {
  const { valid } = await verifyForm.value.validate()
  if (!valid) return
  await axiosApi().post(apiPath.ChangePassword, state.password)
    .then((res) => {
      state.password = null
      common.showMessage("کلمه عبور با موفقیت تغییر کرد")
    })
    .catch((error) => common.showError(error?.data?.messages))
}
</script>

<template>
  <fieldset class="myFieldset rounded-xl mb-5 d-flex align-center ga-5">
    <v-btn icon="mdi-chevron-right" class="bg-teal d-md-none" to="/account/home"></v-btn>
    <h3>تغییر کلمه عبور</h3>
  </fieldset>
  <fieldset class="myFieldset rounded-xl">
    <v-row class="justify-center">
      <v-col cols="12" sm="6" md="6">
        <v-form @submit.prevent="save" ref="verifyForm">
          <v-text-field variant="outlined" type="password" v-model="state.password.oldPassword" :rules="validator.auth.oldPassword"
            label="کلمه عبور قبلی"></v-text-field>
          <v-text-field variant="outlined" type="password" v-model="state.password.newPassword" :rules="validator.auth.newPassword"
            label="کلمه عبور جدید"></v-text-field>
          <v-text-field variant="outlined" type="password" v-model="state.password.rePassword" :rules="validator.auth.repeatNewPassword"
            label="تکرار کلمه عبور جدید"></v-text-field>
          <v-btn class="bg-info" type="submit" size="large" block>ذخیره کلمه عبور</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </fieldset>
</template>