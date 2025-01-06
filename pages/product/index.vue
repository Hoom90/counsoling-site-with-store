<script setup>
const state = reactive({
  data: [],
  metadata: {
    pageIndex: 1,
    pageSize: 50,
    totalPages: 0,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
    parameters: null,
  },
  loading: true,
})

useHead({
  title: 'محصولات',
  meta: [{ name: 'description', content: `آخرین محصولات` }],
  meta: [{ name: 'keywords', content: `محصولات,سحاب,اخرین,جدیدترین` }]
})

onMounted(() => {
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
})

await fetchApi.get(apiPath.public.Product.getAll + common.jsonToQueryString(state.metadata))
  .then((res) => {
    state.data = res.data.value.data
    state.metadata = res.data.value.metadata
  })
  .catch(error => common.showError(error?.data?.messages))
  .finally(() => state.loading = false)

const getData = async () => {
  const payload = {
    pageIndex: state.metadata.pageIndex++,
  }
  await axiosApi().get(apiPath.public.Product.getAll + common.jsonToQueryString(payload))
    .then((res) => state.data = state.data.concat(res.data))
    .catch((error) => common.showError(error?.data?.messages))
}

</script>
<template>
  <v-container>
    <v-card flat variant="text" min-height="800">
      <v-card flat variant="text" class="d-flex flex-column justify-center align-center ga-3">
        <h2 class="text-20">جدیدترین محصولات</h2>
      </v-card>
      <v-row v-if="!state.loading">
        <v-col cols="6" sm="4" md="3" lg="2" v-for="(item, index) in state.data" :key="index">
          <nuxtLink :to="`/product/${item.id}-${item.title.replaceAll(' ', '-')}`">
            <v-card class="grid-box rounded-xl h-100">
              <v-card-text>
                <BaseImage :src="item.imageList.find(x => x.isDefault)?.id" :is-thumbnail="true" :alt="item.title" />
              </v-card-text>
              <v-card flat class="text-center text-wrap pa-3">
                <h3 class="text-16">
                  <strong>{{ item.title }}</strong>
                </h3>
              </v-card>
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
      <v-card v-if="state.metadata.totalCount > state.metadata.pageSize" flat variant="text" class="text-center">
        <v-btn class="bg-teal mt-3 rounded" icon="mdi-sync" @click="getData"></v-btn>
      </v-card>
    </v-card>
  </v-container>
</template>
