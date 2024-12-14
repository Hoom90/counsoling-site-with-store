<script setup>
publicbreadcrumbstore().setBreadCrumbs([
  {
    title: 'خانه',
    disabled: false,
    to: '/',
  },
  {
    title: 'محصولات',
    disabled: true,
    to: '/product',
  }])

useHead({
  title: 'محصولات',
  meta:[{name:'description',content:`آخرین محصولات`}],
  meta:[{name:'keywords',content:`محصولات,سحاب,اخرین,جدیدترین`}]
})

const state = reactive({
  data: [],
  page: {
    header: {
      pageSize: 50,
      pageIndex: 1,
      contentType: 1
    },
    totalPages:0,
    height: 0,
  },
  loading: false,
  timeoutState: null,
  scroll: 0,
})

await fetchApi.post(apiPath.public.Product.getAll, {body:{}})
  .then((res) => state.data = res.data.value.data)
  .catch(error => common.showError(error?.data?.messages))

</script>
<template v-if="state.data">
  <v-container>
    <v-row class="d-flex flex-column justify-center align-center ga-3 mb-5">
      <h2 class="text-22">جدیدترین محصولات</h2>
    </v-row>
    <v-row>
      <v-col cols="6" sm="4" md="3" lg="2" v-for="(item,index) in state.data" :key="index">
        <nuxtLink :to="`/product/${item.id}-${item.title.replaceAll(' ','-')}`">
          <v-card class="rounded-xl">
            <BaseImage :src="item.imageList.find(x=>x.isDefault)?.id" :is-thumbnail="true" :alt="item.title"/>
            <v-card-text class="text-wrap">
              <p class="height-42 overflow-hidden">
                <strong>{{ item.title }}</strong>
              </p>
            </v-card-text>
            <v-card-item>
              <p class="text-end">
                <strong>{{ item.price.toLocaleString() }}</strong>
                <small>تومان</small>
              </p>
            </v-card-item>
          </v-card>
        </nuxtLink>
      </v-col>
    </v-row>
    <!-- <div class="d-flex justify-center align-center mt-10">
        <v-btn color="success" @click="getData" v-if="state.data.length > 49">بیشتر</v-btn>
      </div> -->
  </v-container>
</template>

