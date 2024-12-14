<script setup>
definePageMeta({ layout: 'account', middleware: 'route-check', })
const user = userStore()
const state = reactive({
  asideAccount: [
    { name: "میزکار من", icon: 'mdi-laptop', url: "/account/home" },
    { name: "ویرایش کاربری", icon: 'mdi-badge-account-horizontal-outline', url: "/account/editProfile" },
    { name: "کیف پول", icon: 'mdi-credit-card-outline', url: "/account/wallet" },
    { name: "سفارشات", icon: 'mdi-basket-outline', url: "/account/orders/" },
    { name: "تیکت", icon: 'mdi-rhombus-split', url: "/account/ticket/list" },
    { name: "تغییر کلمه عبور", icon: 'mdi-key-outline', url: "/account/changePassword" },
    { name: "خروج", icon: 'mdi-power-standby', func: logOut },
  ],
})

onMounted(()=>{
  if(user.getIsConsultant){
    state.asideAccount.splice(4,0,{ name: "خدمات", icon: 'mdi-briefcase-outline', url: "/account/service" },{ name: "تالار گفتگو", icon: 'mdi-chat-outline', url: "/account/forum/" })
  }
})

async function logOut() {
  await axiosApi().post(apiPath.Logout)
    .then(r => {
      console.log('logout');
      localStorage.logOut()
      router.replace('/')
    }).catch(e => common.showError(e?.data?.messages))
}
</script>

<template>
  <v-row class="d-none d-md-flex">
    <v-col cols="6" sm="4" md="3">
      <v-alert
          variant="outlined"
          class="rounded-lg border-md text-center"
          color="red-lighten-1"
          border="start"
      >
        <h2 class="mb-10">خرید</h2>
        <h1>0</h1>
      </v-alert>
    </v-col>
    <v-col cols="6" sm="4" md="3">
      <v-alert
          variant="outlined"
          class="rounded-lg border-md text-center"
          color="deep-purple-accent-4"
          border="start"
      >
        <h2 class="mb-10">تاپیک</h2>
        <h1>0</h1>
      </v-alert>
    </v-col>
    <v-col cols="6" sm="4" md="3">
      <v-alert
          variant="outlined"
          class="rounded-lg border-md text-center"
          color="teal-darken-1"
          border="start"
      >
        <h2 class="mb-10">کیف پول</h2>
        <h1>0</h1>
      </v-alert>
    </v-col>
    <v-col cols="6" sm="4" md="3">
      <v-alert
          variant="outlined"
          class="rounded-lg border-md text-center"
          color="orange-darken-2"
          border="start"
      >
        <h2 class="mb-10">تیکت</h2>
        <h1>0</h1>
      </v-alert>
    </v-col>
    <v-col cols="12">
      <v-alert color="warning" variant="tonal" class="rounded-lg">
        <strong>{{`${user.getUser.firstName} ${user.getUser.lastName}`}}</strong><br /><br />
        <p>به پنل کاربری خود خوش آمدید.</p>
      </v-alert>
    </v-col>
  </v-row>
  
  <v-list class="d-block d-md-none">
    <v-list-item v-for="item in state.asideAccount" :key="item" :to="item.url" :title="item.name" @click="item.func">
      <template v-slot:prepend>
        <v-icon color="blue" :icon="item.icon"></v-icon>
      </template>
    </v-list-item>
  </v-list>
</template>