<script setup>
import { userStore } from "@/stores/userStore"
import avatar from "@/assets/img/avatar.png"
const user = userStore()
const router = useRouter()

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
  <v-card class="asideCard rounded-xl" style="background: var(--theme-blue)">
    <v-card-text class="d-flex align-center ga-3">
      <BaseImage :src="user.getUser?.imageId" :no-image="avatar" class="rounded-circle border-xl sidebarBaseImage"/>
      <h1 class="text-white mb-3">
        <strong>
          {{ `${user.getUser.firstName} ${user.getUser.lastName}`}}
        </strong>
      </h1>
    </v-card-text>
    <v-list class="d-none d-md-block">

      <v-list-item v-for="item in state.asideAccount" :key="item" :to="item.url" :title="item.name" @click="item.func">
        <template v-slot:prepend>
          <v-icon color="blue" :icon="item.icon"></v-icon>
        </template>
      </v-list-item>

    </v-list>
  </v-card>
</template>
<style>
.sidebarBaseImage{
  max-width: 150px;
  aspect-ratio: 1;
}
.asideCard{position: sticky;top: 110px;}
</style>
