<script setup>
const verifyForm = ref({});
const route = useRoute()
const user = userStore()
const state = reactive({
  topic: [],
  category: [],
  metadata: {
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: true,
    parameters: null,
    categoryId:null,
  },
  keywords: '',
  newTopic: {
    title: null,
    description: null,
    categoryId: null,
    isActive: true,
  },
  dialogAdd: false,
  panel: [0, 1],
})

const getCategories = () =>{
  fetchApi.get(apiPath.public.Category.post)
    .then((res) => {
      state.category = res.data.value.data
      state.keywords = state.category.map(item => item.title).join(',');
      setHead()
    })
    .catch((error) => common.showError(error?.data?.messages))
}

const getSSRData = () => {
  if (route.params.id) {
    state.metadata.categoryId = route.params.id.split('-').find(x => x)
    state.newTopic.categoryId = route.params.id.split('-').find(x => x)
  }else {
    delete state.metadata.categoryId;
  }
  fetchApi.get(apiPath.public.Topic.post.pagination + common.jsonToQueryString(state.metadata))
    .then((res) => {
      state.topic = state.topic.concat(res.data.value.data)
      state.metadata = res.data.value.metadata
      setPageBreadcrumb()
    })
    .catch((error) => common.showError(error?.data?.messages))
}

getCategories()
getSSRData()

const getNewData = () => {
  state.metadata.pageIndex++
  getSSRData()
}

const setHead = () => {
  useHead({
    title: route.params.id ? `تالار گفتگو - ${state.category.find(x => x.id == route.params.id.split('-').find(x => x)).title}` : 'تالار گفتگو',
    meta: [
      { name: 'description', content: route.params.id ? `تالار گفتگو - ${state.category.find(x => x.id == route.params.id.split('-').find(x => x))}` : 'تالار گفتگو' },
      { name: 'keywords', content: `${state.keywords}` },
    ]
  })
}

const setPageBreadcrumb = () => {
  const temp = [
    {
      title: 'خانه',
      to: '/',
    },
    {
      title: 'تالار گفتگو',
      to: '/forum',
    },
  ]
  if (route.params.id) {
    const page = {
      title: state.category?.find(item => item.id == route.params.id.split('-').find(x => x))?.title ?? '',
      to: route.params.id.split('-').find(x => x),
    }
    temp.push(page)
  }
  publicbreadcrumbstore().setBreadCrumbs(temp)
}

//#region POST
const postTopic = async (r) => {
  if (r) {
    const { valid } = await verifyForm.value.validate()
    if (valid) {
      await axiosApi().post(apiPath.ExpertTopic.post.add, state.newTopic)
        .then((res) => {
          common.showMessage(res.message)
          state.topic = []
          getSSRData()
        })
        .catch((error) => common.showError(error?.data?.messages))
    }
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
  <v-container>
    <v-card class="w-100 d-md-none rounded-xl mb-6" elevation="0">
      <v-card-item>
        <div class="d-flex justify-space-between align-center">
          <h3 class="pa-1">{{ `موضوعات گفتگو ${route.params.id ? state.category?.find(item => item.id ==
            route.params.id.split('-').find(x=>x))?.title ?? '' : ''}` }}</h3>
          <v-btn color="blue" variant="tonal" v-if="(user.getIsAdmin || user.getIsConsultant) && route.params.id.split('-').find(x=>x)"
            @click="state.dialogAdd = !state.dialogAdd">افزودن موضوع جدید</v-btn>
        </div>
      </v-card-item>
    </v-card>
    <v-row>
      <v-card flat variant="text" class="d-md-none">
        <v-sheet class="mx-auto bg-transparent">
          <v-slide-group>
            <v-slide-group-item v-for="(item,index) in state.category" :key="index">
              <v-btn class="ma-2 bg-teal" rounded :to="`/forum/${item.id}-${item.title.replaceAll(' ','-')}`">
                {{ item.title }}
              </v-btn>
            </v-slide-group-item>
          </v-slide-group>
        </v-sheet>
      </v-card>
      <v-col cols="12" md="4" lg="3" class="d-none d-md-block">
        <forum-expantion-panel :isClose="state.panel" :categories="state.category" />
      </v-col>
      <v-col cols="12" md="8" lg="9">

        <v-card class="d-none d-md-block rounded-xl mb-3" elevation="0">
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
                    <p>{{ item.description }}</p>
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
            v-if="state.metadata.totalCount > state.metadata.pageSize && state.metadata.totalPages > state.metadata.pageIndex">بیشتر</v-btn>
        </div>

        <v-card v-if="state.metadata.totalCount == 0" class="rounded-xl mt-5 text-center" elevation="0">
          <v-card-item class="pa-10">
            <strong class="text-grey">
              این تالار هنوز خالیه
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