<script setup>
definePageMeta({
  middleware: 'route-check',
  layout: 'dashboard'
});
const verifyForm = ref({})
const route = useRoute()
const state = reactive({
  data: [],
  ticket: {
    description: null,
    state: 8,
    requestType: 1,
    parentId: null,
  },
  answerModal: false,
})

onMounted(() => {
  getData()
})

const getData = async () => {
  await axiosApi().get(apiPath.Ticket.get(route.params.id))
  .then((res) => {
    state.data = res.data
    dashboardbreadcrumbstore().setBreadCrumbs([
      {
        title: 'تیکت ها ',
        disabled: false,
        to: '/dashboard/ticket/list',
      },
      {
        title: `تیکت ${state.data.title}`,
        disabled: true,
        to: '/dashboard/ticket',
      },
    ])
  })
  .catch((error) => common.showError(error?.data?.messages))
}

const postTicket = async (r) => {
  if (r) {
    const { valid } = await verifyForm.value.validate()
    if (!valid) return
    
    state.ticket.parentId = state.data.id
    await axiosApi().post(apiPath.Ticket.post.add, state.ticket)
    .then((res) => {
      common.showMessage(res.messages)
      getData()
    })
    .catch((error) => common.showError(error?.data?.messages))
  }
  state.answerModal = false
}

const handleStateColor = (state) => {
  const ticketState = contracts.ticketState;
  const item = ticketState.find(item => item.id === state);
  return item ? item.color : null;
};

const toggleModal = () =>{
  state.answerModal = !state.answerModal
}

</script>
<template>
  <v-card>
    <div>
      <v-card-title class="d-sm-flex align-center">
        <p>{{ `تیکت ${state.data.title}` }}</p>
        <v-spacer></v-spacer>
        <v-chip :color="handleStateColor(state.data.state)" variant="outlined">{{ state.data.stateTitle }}</v-chip>
        <v-btn class="bg-blue mr-3" @click="toggleModal">پاسخ دادن</v-btn>
      </v-card-title>
    </div>
    <v-divider></v-divider>
    <v-card-text>
      <v-card variant="tonal" class="mb-3 mr-auto w-75">
        <template v-slot:title>
          {{ `تیکت ${state.data.title} به بخش ${state.data.departmentTitle}` }}
        </template>

        <template v-slot:text>
          {{ state.data.description }}
        </template>

        <v-card-actions>
          <v-row>
            <v-col class="text-left">
              <v-chip>{{ dateConverter.someTimeAgo(state.data.createdOn) }}</v-chip>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
      <v-card variant="tonal"
        :class="ticket.requestType == 1 ? 'mr-auto mb-3 w-75' : 'mb-3 w-75'"
        v-for="(ticket, index) in state.data.children" :key="index">

        <template v-slot:text>
          {{ ticket.description }}
        </template>

        <v-card-actions>
          <v-row>
            <v-col class="text-left">
              <v-chip>{{ dateConverter.someTimeAgo(ticket.createdOn) }}</v-chip>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-card-text>
  </v-card>

  <mj-dialog v-model="state.answerModal" title="پاسخ دادن به تیکت" :action-btn="true" action-btn-text="ارسال"
    :cancel-btn="true" action-type="primary" @action-callback="postTicket" size="sm">
    <v-form @submit.prevent="postTicket" ref="verifyForm">
      <v-select v-model="state.ticket.state" variant="outlined" label="مهارت ها" :items="contracts.ticketState"
        item-title="title" item-value="id">
      </v-select>
      <v-textarea v-model="state.ticket.description" :rules="validator.description" label="متن تیکت" maxlength="200"
        variant="outlined" counter></v-textarea>
    </v-form>
  </mj-dialog>
</template>

