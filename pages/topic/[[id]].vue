<script setup>
const messageInput = ref({})
const route = useRoute()
const state = reactive({
  category: [],
  post: [],
  metadata: {
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: true,
    parameters: null,
    topicId: route.params.id.split('-').find(x => x),
  },
  newPost: {
    message: null,
    topicId: route.params.id.split('-').find(x => x),
    parentId: null,
  },
  replyTo: null,
  question: {
    title: null,
    description: null,
    categoryTitle: null,
    expertFirstName: null,
    expertLastName: null,
  },
  panel: [0, 1],
})

const getCategories = () => {
  fetchApi.get(apiPath.public.Category.post)
    .then((res) => state.category = res.data.value.data)
    .catch((error) => common.showError(error?.data?.messages))
}

const getTopic = () => {
  fetchApi.get(apiPath.public.Topic.get.byId(route.params.id.split('-').find(x => x)))
    .then((res) => {
      state.question = res.data.value.data
      setHead()
      setBreadCrumbs()
    })
    .catch((error) => common.showError(error?.data?.messages))
}

const getpost = async () => {
  state.metadata.topicId = route.params.id.split('-').find(x => x)
  state.newPost.topicId = route.params.id.split('-').find(x => x)
  fetchApi.post(apiPath.public.Post.post.pagination, { body: state.metadata })
    .then((res) => {
      state.post = res.data.value.data
      state.metadata = res.data.value.metadata
    })
    .catch((error) => common.showError(error?.data?.messages))
}

getpost()
getTopic()
getCategories()

const addNewPost = async () => {
  if (state.newPost.message) {
    await axiosApi().post(apiPath.public.Post.post.add, { body: state.newPost })
      .then((res) => {
        common.showMessage(res.message)
        getpost()
      })
      .catch((error) => common.showError(error?.data?.messages))
  }
  state.newPost.message = null
  state.newPost.parentId = null
}

// const handleReply = (id) =>{
//   state.replyTo = null
//   state.newPost.parentId = id
//   state.replyTo = state.post.find(item => item.id == id)
//   messageInput.value.focus()
// }

const handleReply = (id) => {
  state.newPost.parentId = id; // Set the parent ID to the post being replied to
};

const clearReply = () => {
  state.newPost = {
    message: null,
    topicId: route.params.id.split('-').find(x => x),
    parentId: null,
  }
  state.replyTo = null
}

const setHead = () => {
  useHead({
    title: `${state.question.title}`,
    meta: [{ name: 'description', content: `${state.question.description}` }],
    meta: [{ name: 'keywords', content: `${state.question.title},${state.question.categoryTitle},${state.question.expertFirstName},${state.question.expertLastName}` }],
  })
}

const setBreadCrumbs = () => {
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
      title: state.question?.title,
      disabled: true,
      to: '/',
    },
  ])
}

</script>
<template>
  <v-container>
    <v-row>
      <!-- Sidebar Panel -->
      <v-col cols="12" md="4" lg="3" class="d-none d-sm-block">
        <ForumExpantionPanel :isClose="state.panel" :categories="state.category" />
      </v-col>
  
      <!-- Main Content -->
      <v-col cols="12" md="8" lg="9">
  
        <!-- Question Card -->
        <v-card v-if="state.question" class="rounded-xl mb-3" elevation="0">
          <v-card-item>
            <div class="d-flex mt-3">
              <div class="w-100">
                <h2 class="text-18">{{ state.question.title }}</h2>
  
                <!-- Expert Info -->
                <v-card flat variant="text" class="d-flex gap-2 py-3" :to="`/expert/${state.question.expertId}`">
                  <v-avatar size="60" class="border">
                    <BaseImage class="rounded-circle" :is-thumbnail="true" />
                  </v-avatar>
                  <div class="d-flex flex-column">
                    <h3 class="text-16">
                      {{ `${state.question.expertFirstName ?? ''} ${state.question.expertLastName ?? ''}` }}
                    </h3>
                    <p class="text-12">{{ dateConverter.someTimeAgo(state.question.createdOn) }}</p>
                  </div>
                </v-card>
  
                <!-- Category Button -->
                <v-btn color="theme-blue" rounded="xl" variant="tonal"
                  :to="`/forum/${state.question.categoryId}-${state.question.categoryTitle.replaceAll(' ', '-')}`">
                  <h3 class="text-12">{{ state.question.categoryTitle ?? '#دسته بندی' }}</h3>
                </v-btn>
  
                <!-- Description -->
                <p class="my-3">{{ state.question.description ?? '' }}</p>
  
                <v-divider></v-divider>
  
                <!-- New Post Input -->
                <v-textarea v-if="state.newPost" label="ایجاد متن جدید" variant="outlined" auto-grow clearable rows="1"
                  ref="messageInput" v-model="state.newPost.message" prepend-inner-icon="mdi-send"
                  @click:prepend-inner="addNewPost" class="py-3" hide-details />
              </div>
            </div>
          </v-card-item>
        </v-card>
  
        <!-- Posts Section -->
        <v-list two-line class="rounded-xl bg-transparent">
          <v-list-item v-for="item in state.post" :key="item.id" class="mb-3 pa-0">
            <v-card class="rounded-xl" elevation="0">
              <v-card-text>
                <!-- Post Header -->
                <div class="d-flex justify-space-between">
                  <h3 class="mr-3">{{ `${item.firstName} ${item.lastName}` }}</h3>
                  <small class="my-auto">{{ dateConverter.someTimeAgo(item.createdOn) }}</small>
                </div>
              </v-card-text>
  
              <v-divider></v-divider>
  
              <!-- Post Content -->
              <v-card-text>
                <div v-if="item.parentId" class="mb-3">
                  <p>در پاسخ به:</p>
                  <v-card flat class="rounded-xl mt-3 bg-grey-lighten-3">
                    <v-card-text>
                      <h5>{{ `${state.post.find(t => t.id === item.parentId)?.firstName} ${state.post.find(t => t.id ===
                        item.parentId)?.lastName}` }}</h5>
                      <small>{{ dateConverter.someTimeAgo(state.post.find(t => t.id === item.parentId)?.createdOn)
                        }}</small>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-text>
                      <p>{{ state.post.find(t => t.id === item.parentId)?.message }}</p>
                    </v-card-text>
                  </v-card>
                </div>
                <p>{{ item.message }}</p>
              </v-card-text>
  
              <v-divider></v-divider>
  
              <!-- Reply Button -->
              <div class="text-left pa-3">
                <v-btn color="blue" variant="plain" @click="handleReply(item.id)">پاسخ دادن</v-btn>
              </div>
  
              <!-- Reply Input -->
              <v-textarea v-if="state.newPost.parentId" label="پاسخ دادن" variant="outlined" auto-grow clearable rows="1"
                ref="messageInput" v-model="state.newPost.message" prepend-inner-icon="mdi-send"
                @click:prepend-inner="addNewPost" class="pa-3" hide-details />
            </v-card>
          </v-list-item>
        </v-list>
  
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.fixed-bar {
  position: sticky;
  position: -webkit-sticky;
  /* for Safari */
  top: 120px;
  z-index: 2;
}
</style>