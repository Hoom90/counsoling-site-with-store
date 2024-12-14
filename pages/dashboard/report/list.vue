<script setup>
definePageMeta({
  middleware: 'route-check',
  layout: 'dashboard'
});
const tab = ref()
onMounted(()=>{
  tab.value =1
})

</script>
<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>گزارشات</v-toolbar-title>
  </v-toolbar>
  
  <v-card>
    <v-card-text>
      <v-tabs v-model="tab" color="primary">
        <v-tab :value="1">گزارش پرداخت های نوبت گیری</v-tab>
        <v-tab :value="2">گزارش برنامه متخصصان</v-tab>
      </v-tabs>
    </v-card-text>

    <ReportOrderData v-if="tab == 1"/>

    <ReportScheduleData v-if="tab == 2"/>

  </v-card>
</template>