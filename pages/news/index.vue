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
    contentType: 1
  },
  loading: true,
})

useHead({
  title: 'اخبار',
  meta: [{ name: 'description', content: `آخرین اخبار` }],
  meta: [{ name: 'keywords', content: `اخبار,سحاب,اخرین,جدیدترین` }]
})

onMounted(async () => {
  publicbreadcrumbstore().setBreadCrumbs([
    {
      title: 'خانه',
      disabled: false,
      to: '/',
    },
    {
      title: 'خبر ها',
      disabled: true,
      to: '/news',
    }])
})

await fetchApi.get(apiPath.public.News.get.all + common.jsonToQueryString(state.metadata))
  .then((res) => {
    state.data = res.data.value.data
    state.metadata = res.data.value.metadata
  })
  .catch(error => common.showError(error?.data?.messages))
  .finally(() => state.loading = false)

const getData = async () => {
  const payload = {
    pageIndex: state.metadata.pageIndex++,
    contentType: 1
  }
  await axiosApi().get(apiPath.public.News.get.all + common.jsonToQueryString(payload))
    .then((res) => state.data = state.data.concat(res.data))
    .catch((error) => common.showError(error?.data?.messages))
}
</script>
<template>
  <v-container>
    <v-card flat variant="text" min-height="800">
      <v-card flat variant="text" class="d-flex flex-column justify-center align-center ga-3">
        <h2 class="text-20">جدیدترین اخبار</h2>
      </v-card>
      <v-row v-if="!state.loading">
        <v-col cols="6" sm="4" md="3" lg="2" v-for="(item, index) in state.data" :key="index">
          <nuxtLink :to="`news/${item.id}/${item.title.replaceAll(' ', '-')}`">
            <v-card class="grid-box rounded-xl h-100">
              <v-card-text>
                <BaseImage :src="item.image" class="rounded-xl" :is-thumbnail="true" :alt="item.title" />
              </v-card-text>
              <v-card flat class="text-center text-wrap pa-3">
                <h3 class="text-16">
                  <strong>{{ `${item.title.slice(0, 38)}${item.title.length > 38 ? '...' : ''}` }}</strong>
                </h3>
              </v-card>
              <v-card-item>
                <p>
                  <span class="ml-9">
                    <v-icon size="13" class="ml-2">mdi-calendar-month-outline</v-icon>
                    <small>{{ dateConverter.convertToJalali(item.createdOn) }}</small>
                  </span>
                  <span>
                    <v-icon size="13" class="ml-2">mdi-eye-outline</v-icon>
                    <small>{{ item.visitedCount }}</small>
                  </span>
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
