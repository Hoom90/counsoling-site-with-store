<script setup>
definePageMeta({ layout: 'account', middleware: 'route-check', })
const verifyForm = ref({})
const route = useRoute()
const state = reactive({
  data: [],
  answerModal: false,
  ticket: {
    title: null,
    description: null,
    requestType: 2,
    department: 0,
    parentId: null
  },
})

onMounted(() => {
  getData()
})

const getData = async () => {
  await axiosApi().get(apiPath.User.Ticket.getbyId(route.params.id))
    .then((res) => state.data = res.data)
    .catch((error) => common.showError(error?.data?.messages))
}

const postTicket = async (r) =>{
  if(!r){
    state.answerModal = false
    return
  }
  
  const { valid } = await verifyForm.value.validate()
  if (!valid) return

  state.ticket.title = state.data.title
  state.ticket.parentId = state.data.id
  state.ticket.department = state.data.department
  await axiosApi().post(apiPath.User.Ticket.post.add,state.ticket)
  .then((res)=>{
    common.showMessage(res.messages)
    state.answerModal = false
    getData()
  })
  .catch((error)=>common.showError(error?.data?.messages))
}

const handleStateColor = (state) => {
  const ticketState = contracts.ticketState;
  const item = ticketState.find(item => item.id === state);
  return item ? item.color : null;
};

</script>
<template>
  <fieldset class="myFieldset rounded-xl d-flex align-center ga-5 mb-5">
    <v-btn icon="mdi-chevron-right" class="bg-teal d-md-none" to="/account/ticket/list"></v-btn>
    <p class="text-18">
      <strong>{{ `تیکت ${state.data.title}` }}</strong>
      <v-chip class="d-md-none" :color="handleStateColor(state.data.state)" variant="text">{{ state.data.stateTitle }}</v-chip>
    </p>
    <div class="d-none d-md-block mr-auto">
      <v-chip :color="handleStateColor(state.data.state)" variant="outlined">{{ state.data.stateTitle }}</v-chip>
      <v-btn variant="tonal" class="rounded-pill mr-3" color="info" to="/account/ticket/list">بازگشت</v-btn>
    </div>
  </fieldset>

  <fieldset class="myFieldset rounded-xl">
    <v-card variant="tonal" class="mb-3 w-75">
      <v-card-text>
        <p class="mb-3">
          <strong>
            {{ `تیکت ${state.data?.title} به بخش ${state.data?.departmentTitle}` }}
          </strong>
        </p>
        <p>
          {{ state.data?.description }}
        </p>
      </v-card-text>
      <v-divider></v-divider>
      <v-row>
        <v-col class="text-left">
          <v-chip variant="text">{{ dateConverter.someTimeAgo(state.data.createdOn) }}</v-chip>
        </v-col>
      </v-row>
    </v-card>

    <v-card variant="tonal" :class="ticket.requestType == 2 ? 'mb-3 mr-auto w-75' : 'mb-3 w-75'" v-for="(ticket, index) in state.data?.children" :key="index">
      <template v-slot:text>
        {{ ticket.description }}
      </template>
      <v-divider></v-divider>

      <v-row>
        <v-col class="text-left">
          <v-chip variant="text">{{ dateConverter.someTimeAgo(ticket.createdOn) }}</v-chip>
        </v-col>
      </v-row>
    </v-card>

    <v-row
      v-if="state.data.children && (state.data.children[state.data.children?.length - 1]?.state == 6 || state.data.children[state.data.children?.length - 1]?.state == 5)">
      <v-col class="text-left">
        <v-btn variant="tonal" color="blue" @click="state.answerModal = !state.answerModal">جواب دادن</v-btn>
      </v-col>
    </v-row>
  </fieldset>


  <mj-dialog v-model="state.answerModal" :action-btn="true" title="جواب دادن به تیکت" :cancel-btn="true" @action-callback="postTicket" size="sm">
    <v-form @submit.prevent="postTicket" ref="verifyForm">
      <v-textarea v-model="state.ticket.description" :rules="validator.ticket.description" label="متن تیکت" maxlength = "200" variant="outlined" counter></v-textarea>
    </v-form>
  </mj-dialog>
</template>