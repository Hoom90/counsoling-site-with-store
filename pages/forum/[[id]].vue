<script setup>
const verifyForm = ref({});
const route = useRoute()
const user = userStore()
const state = reactive({
  topic: [],
  category: [],
  payload: {
    topicHeader: {
      pageSize: 50,
      pageIndex: 1,
      categoryId: null,
    },
    totalPages: 0,
    height: 0,
  },
  keywords: '',
  newTopic: {
    title: null,
    description: null,
    categoryId: null,
    isActive: true,
  },
  dialogAdd: false,
  breadTitle: '',
  //#region FILTER
  panel: [0, 1],
  //#endregion
  //#region SCROLL LOADING
  loading: false,
  timeoutState: null,
  scroll: 0,
  //#endregion
})

//#region GET
// onMounted(async () => {
//   window.addEventListener("scroll", async (event) => {
//     state.test = window.scrollY
//     state.payload.height = document.getElementById('table').clientHeight
//     if (window.scrollY > state.scroll && !(state.payload.topicHeader.pageIndex > state.payload.totalPages)){
//       if (window.scrollY > 0 && window.scrollY > (state.payload.height * 0.4) && !state.loading) {
//           state.loading = true
//           clearTimeout(state.timeoutState)
//           state.timeoutState = setTimeout(async () => {
//             await getNoSSRData()
//             state.loading = false
//             state.payload.topicHeader.pageIndex++
//           }, 10)
//         }
//       state.scroll = window.scrollY
//     }
//   });
// })

//#region getCategorySSR
/** get categories in ssr mode **/
fetchApi.post(apiPath.public.Category.post, { body: {} })
  .then((res) => {
    state.category = res.data.value.data
    state.category.forEach(item => {
      state.keywords = item.title + ',' + state.keywords
    })
    useHead({
      title: route.params.id ? `تالار گفتگو - ${state.category.find(x=>x.id == route.params.id.split('-').find(x=>x)).title}` : 'تالار گفتگو',
      meta: [
        { name: 'description', content: route.params.id ? `تالار گفتگو - ${state.category.find(x=>x.id == route.params.id.split('-').find(x=>x))}` : 'تالار گفتگو' },
        { name: 'keywords', content: `${state.keywords}` },
      ]
    })
  })
  .catch((error) => {
    common.showError(error?.data?.messages)
  })
//#endregion

// const getNoSSRData = async () => {
//   state.payload.topicHeader.pageSize = 50
//   await axiosApi().post(apiPath.public.Topic.post.pagination, state.payload.topicHeader)
//     .then((res) => {
//       state.topic = state.topic.concat(res.data)
//       state.payload.topicHeader.pageIndex++
//     })
//     .catch((error) => {
//       common.showError(error?.data?.messages)
//     })
// }

const getNewData = () => {
  state.payload.topicHeader.pageIndex++
  getSSRData()
}

const getSSRData = async () => {
  await fetchApi.post(apiPath.public.Topic.post.pagination, { body: state.payload.topicHeader })
    .then((res) => {
      state.topic = state.topic.concat(res.data.value.data)
      // state.topic = res.data.value.data
      state.payload.totalPages = res.data.value.metadata.totalPages
      setPageBreadcrumb()
    })
    .catch((error) => {
      common.showError(error?.data?.messages)
    })
}

const setPageBreadcrumb = () => {
  if (route.params.id) {
    publicbreadcrumbstore().setBreadCrumbs([
      {
        title: 'خانه',
        disabled: false,
        to: '/',
      },
      {
        title: 'تالار گفتگو',
        disabled: false,
        to: '/forum',
      },
      {
        title: state.category?.find(item => item.id == route.params.id.split('-').find(x=>x))?.title ?? '',
        disabled: true,
        to: route.params.id.split('-').find(x=>x),
      },
    ])
  }
  else {
    publicbreadcrumbstore().setBreadCrumbs([
      {
        title: 'خانه',
        disabled: false,
        to: '/',
      },
      {
        title: 'تالار گفتگو',
        disabled: true,
        to: '/forum',
      },
    ])
  }
}


if (route.params.id) {
  state.payload.topicHeader.pageSize = 10
  state.payload.topicHeader.categoryId = route.params.id.split('-').find(x=>x)
  state.newTopic.categoryId = route.params.id.split('-').find(x=>x)
  getSSRData()
}
else {
  state.payload.topicHeader.pageSize = 10
  state.payload.topicHeader.categoryId = null
  getSSRData()
}


//#endregion

//#region POST
const postTopic = async (r) => {
  if (r) {
    const { valid } = await verifyForm.value.validate()
    if (!valid) return


    await axiosApi().post(apiPath.ExpertTopic.post.add, state.newTopic)
      .then(async (res) => {
        common.showMessage(res.message)
        state.topic = []
        await getSSRData()
      })
      .catch((error) => {
        common.showError(error?.data?.messages)
      })
  }
  state.dialogAdd = false
  state.newTopic = {
    title: null,
    description: null,
    categoryId: route.params.id,
    isActive: true,
  }
}
//#endregion

</script>

<template>
  <v-card flat variant="text" class="d-sm-none mt-3">
    <v-sheet class="mx-auto" max-width="600">
      <v-slide-group>
        <v-slide-group-item v-for="(item,index) in state.category" :key="index">
          <v-btn class="ma-2 bg-teal" rounded :to="`/forum/${item.id}-${item.title.replaceAll(' ','-')}`">
            {{ item.title }}
          </v-btn>
        </v-slide-group-item>
      </v-slide-group>
    </v-sheet>
  </v-card>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" lg="3" class="d-none d-sm-block">
        <forum-expantion-panel :isClose="state.panel" :categories="state.category" />
      </v-col>
      <v-col cols="12" md="8" lg="9">

        <v-card class="rounded-xl mb-3" elevation="0">
          <v-card-item>
            <div class="d-flex justify-space-between align-center">
              <h3 class="pa-1">{{ `موضوعات گفتگو ${route.params.id ? state.category?.find(item => item.id ==
                route.params.id.split('-').find(x=>x))?.title ?? '' : ''}` }}</h3>
              <v-btn color="blue" variant="tonal" v-if="(user.getIsAdmin || user.getIsConsultant) && route.params.id.split('-').find(x=>x)"
                @click="state.dialogAdd = !state.dialogAdd">افزودن موضوع جدید</v-btn>
            </div>
          </v-card-item>
        </v-card>

        <div id="table">
          <v-row>
            <v-col cols="12" v-for="item in state.topic" :key="item.id">
              <v-card class="rounded-xl border" elevation="0">
                <v-card-text class="text-black pa-3 px-5 pt-5 d-flex">
                  <nuxt-link :to="`/topic/${item.id}-${item.title.replaceAll(' ','-')}`" class="text-black">
                    <h4>{{ item.title }}</h4>
                  </nuxt-link>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text class="pa-5 px-5">
                  <nuxt-link :to="`/topic/${item.id}-${item.title.replaceAll(' ','-')}`" class="text-black">
                    <h7>{{ item.description }}</h7>
                  </nuxt-link>
                </v-card-text>
                <v-divider></v-divider>
                <div class="pa-1 px-3 d-flex align-center justify-space-between">
                  <div class="d-flex" style="gap:5px">
                    <nuxt-link :to="`/forum/${item?.categoryId}-${item.categoryTitle.replaceAll(' ','-')}`">
                      <v-btn color="theme-blue" class="border-none" prepend-icon="mdi-tag-outline">{{ item?.categoryTitle
                        ?? '#دسته بندی'
                      }}</v-btn>
                    </nuxt-link>
                  </div>
                  <v-card-item>
                    <v-btn variant="tonal" color="theme-blue" class="rounded-xl" :to="`/topic/${item.id}-${item.title.replaceAll(' ','-')}`">
                      <small>مشاهده موضوعات ({{ item.postCount }})</small>
                    </v-btn>
                    <small class="my-auto mr-3">{{ dateConverter.someTimeAgo(item.createdOn) }}</small>
                  </v-card-item>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-btn color="theme-blue" class="w-100 mt-5 rounded-xl" @click="getNewData"
            v-if="state.payload.topicHeader.pageIndex < state.payload.totalPages">بیشتر</v-btn>
        </div>

        <v-card v-if="state.payload.totalPages == 0" class="rounded-xl mt-5 text-center" elevation="0">
          <v-card-item class="pa-10">
            <strong class="text-grey">
            این تالار هنوز خالیه :(
            </strong>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <mj-dialog v-model="state.dialogAdd" title="افزودن تاپیک جدید" :action-btn="true" :cancel-btn="true"
    action-type="primary" @action-callback="postTopic" size="sm">
    <v-form @submit.prevent="postTopic" ref="verifyForm">
      <v-text-field v-model="state.newTopic.title" :rules="validator.forum.title" variant="outlined"
        label="عنوان"></v-text-field>
      <v-textarea v-model="state.newTopic.description" :rules="validator.forum.description" variant="outlined"
        label="توضیحات"></v-textarea>
    </v-form>
  </mj-dialog>
</template>

<style scoped>
.fixed-bar {
  position: sticky;
  position: -webkit-sticky;
  /* for Safari */
  top: 120px;
  z-index: 2;
}</style>