<script setup>
definePageMeta({ layout: 'account', middleware: 'route-check', })
const router =useRouter()
const verifyForm = ref({})
const state = reactive({
  ticket: {
    title: null,
    description: null,
    requestType: 2,
    department: null,
    state: 1,
    parentId: null,
  },
})

const postTicket = async () =>{
  const { valid } = await verifyForm.value.validate()
  if (!valid) return
  
  await axiosApi().post(apiPath.User.Ticket.post.add,state.ticket)
  .then((res)=>{
    common.showMessage(res.messages)
    router.push(`/account/ticket/${res.data}`)
  })
  .catch((error)=>common.showError(error?.data?.messages))
}
</script>

<template>
  <fieldset class="myFieldset rounded-xl d-flex align-center ga-5 mb-5">
    <v-btn icon="mdi-chevron-right" class="bg-teal d-md-none" to="/account/ticket/list"></v-btn>
    <p class="text-18"><strong>ارسال تیکت</strong></p>
    <div class="mr-auto d-none d-md-block">
      <v-btn variant="tonal" class="rounded-pill" to="/account/ticket/list">بازگشت به لیست</v-btn>
    </div>
  </fieldset>
  <fieldset class="myFieldset rounded-xl">
    <v-form @submit.prevent="postTicket" ref="verifyForm">
      <v-row class="justify-center align-center">
        <v-col cols="12" md="7" lg="6">
          <v-text-field v-model="state.ticket.title" :rules="validator.ticket.title" variant="outlined" label="عنوان" maxlength = "50" counter></v-text-field>
          <v-select v-model="state.ticket.department" :rules="validator.ticket.department" variant="outlined" label="ارسال به" :items="contracts.ticketRecievers" item-value="id" item-title="title"></v-select>
          <v-textarea v-model="state.ticket.description" :rules="validator.ticket.description" label="متن تیکت" maxlength = "200" variant="outlined" counter></v-textarea>
          <v-btn block type="submit" class="bg-blue">ارسال</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </fieldset>
</template>
