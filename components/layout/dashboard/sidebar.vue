
<script setup>
import { useDisplay } from 'vuetify'
const props=defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])
const { name } = useDisplay()

const state = reactive({
  show:true ,
  items: [
    { text: 'کاربران', icon: 'mdi-account-edit', url:'/dashboard/user/list' },
    { text: 'متخصصان', icon: 'mdi-gauge-low', url:'/dashboard/expert/list' },
    { text: 'تالار گفتگو', icon: 'mdi-chat-outline', url:'/dashboard/forum/list' },
    { text: 'اخبار', icon: 'mdi-newspaper-variant-multiple-outline', url: '/dashboard/news/list/' },
    { text: 'محصولات', icon: 'mdi-cart-outline', url: '/dashboard/product/list/' },
    { text: 'مقالات', icon: 'mdi-book-open-page-variant-outline', url: '/dashboard/article/list/' },
    { text: 'صفحه ها', icon: 'mdi-book-open-page-variant-outline', url: '/dashboard/page/list/' },
    { text: 'دیدگاه ها', icon: 'mdi-chat-outline', url: '/dashboard/comment/list/' },
    { text: 'نسخه ها', icon: 'mdi-archive-outline' ,url:'/dashboard/result' },
    { text: 'دسته ها', icon: 'mdi-view-grid-outline', url: '/dashboard/category/' },
    { text: 'اسلایدر', icon: 'mdi-gamepad-outline', url:  '/dashboard/slider' },
    { text: 'شهر ها', icon: 'mdi-view-grid-outline' ,url:'/dashboard/province' },
    { text: 'تیکت ها', icon: 'mdi-message-text-outline' ,url:'/dashboard/ticket/list' },
    { text: 'گزارشات', icon: 'mdi-chart-line' ,url:'/dashboard/report/list' },
    { text: 'تنظیمات', icon: 'mdi-cogs' },
    { text: 'ماژول ها', icon: 'mdi-cogs' },
    { text: 'Help', icon: 'mdi-help-circle-outline' },
  ],
})

watch(()=>props.modelValue,()=> {
  state.show= name.value=='lg' || name.value=='xl' || name.value=='xxl' || props.modelValue
})
</script>

<template>
  <v-navigation-drawer expand-on-hover v-model="state.show" :rail="!props.modelValue" 
  :permanent="name=='lg' || name=='xl' || name=='xxl'" 
  :temporary="name=='md' || name=='sm' || name=='xs'" 
  color="grey-darken-3" @update:modelValue="emits('update:modelValue')">
    <v-list :elevation="2">
      <v-list-item to="/" style="font-family: 'IRANSans-black'" title="مرکز مشاوره سحاب"></v-list-item>
    </v-list>
    <v-list density="compact">
      <v-list-item
        v-for="(item, i) in state.items"
        :key="i"
        :value="item"
        color="blue-grey-lighten-4"
        rounded="xl"
        :class="props.modelValue ? 'mx-2':'mx-1 pa-3'"
        :to="item.url"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

