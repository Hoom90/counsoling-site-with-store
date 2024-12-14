<script setup>
import signImage from "@/assets/svg/red-warning-signs.svg"
definePageMeta({
  middleware: 'route-check',
  layout: 'dashboard'
});
const route = useRoute()
const router = useRouter()
const state = reactive({
  dialogDelete: false,
  current: {},
  commentList: [],
  metadata:{
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: true,
    parameters: null
  },
  readyMessages: [
      "ممنون از شما",
      "دیدگاه شما پس از بررسی توسط کارشناس جواب داده خواهد شد",
      "سلام، با تشکر از دیدگاه زیبای شما",
      "این مورد را از طریق تیکت پیگیری نمایید",
      "سلام لطفا برای رسیدن به جواب با کارشناس پشتیبانی در ارتباط باشید"
  ],
  insertReadyMessage: null,
  formData: {
    contentId: null,
    message: null,
    publishStatus: true,
    anonymousUserName: null,
    parentId: 0
  },
  formReply: {
    published: true,
    message: null,
    parentId: null
  }
})

onMounted(()=>{
  getData()
  dashboardbreadcrumbstore().setBreadCrumbs([
    {
      title: 'دیدگاه ها ',
      disabled: true,
      to: '/dashboard/comment/list',
    }])
})

const getData = async () => {
  const payload = {}
  if(route.query.index) payload.pageIndex = route.query.index
  if(route.query.size) payload.pageSize = route.query.size
  if(route.query.search) payload.searchFilters = [{field:'message',operator:6,value:route.query.search}]
  await axiosApi().post(apiPath.Comment.get.list,payload)
  .then((res)=>{
    state.commentList = res.data
    state.metadata = res.metadata
  })
  .catch(error=>common.showError(error?.data?.messages))
}

const replyToComment = async (id) => {
  const payload = {
    message : state.formReply.message,
    published: state.formReply.published,
    parentId: id,
  }
  await axiosApi().post(apiPath.Comment.post,payload)
  .then(res => getData())
  .catch(error=>common.showError(error?.data?.messages))
}

const enableComment = async (commentId) =>{
  const payload={
    id: commentId,
    publishStatus: true
  }
  await axiosApi().put(apiPath.Comment.publishComment,payload)
  .then(res => getData())
  .catch(error=>common.showError(error?.data?.messages))
}

const dialogDelete = (row) => {
  state.dialogDelete = true,
  state.current = row
}

const deleteComment = async (res) => {
  if(res){
    await axiosApi().delete(apiPath.Comment.delete + state.current.id, state.formData)
        .then(res => {
          common.showMessage("دیدگاه با موفقیت حذف شد")
          getData()
        })
        .catch(error=>common.showError(error?.data?.messages))
  }
  state.dialogDelete = false
}

const changePageing = () => {
  let path = '/dashboard/comment/list'
  let query = null
  if (state.metadata.pageSize && state.metadata.pageSize != 10) query = { ...query, size: state.metadata.pageSize }
  if (state.metadata.pageIndex && state.metadata.pageIndex != 1) query = { ...query, index: state.metadata.pageIndex }
  if (state.searchFilters && state.searchFilters != '') query = { ...query, search: state.searchFilters }
  router.replace({ path, query })
  setTimeout(() => {
    getData()
  }, 50);
}
</script>
<template>
  <v-toolbar class="mb-5" :elevation="1" color="white" rounded>
    <v-toolbar-title>دیدگاه ها</v-toolbar-title>
  </v-toolbar>

  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="8"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-form @submit.prevent="changePageing">
            <v-text-field v-model="state.searchFilters" @blur="changePageing" @click:append-inner="changePageing"
              append-inner-icon="mdi-magnify" type="search" variant="outlined" density="compact" label="جستجوی دیدگاه"
              hide-details></v-text-field>
          </v-form>
        </v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-select v-model="state.metadata.pageSize" :items="contracts.pageSize" variant="outlined" density="compact"
            label="تعداد نمایش" @update:modelValue="changePageing" hide-details></v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-table size="x-large">
      <thead>
        <tr>
          <th>ردیف</th>
          <th>عنوان</th>
          <th>زمان ارسال</th>
          <th class="text-center" width="200"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(comment, index) in state.commentList" :key="comment.id">
          <td>{{ ((state.metadata.pageIndex - 1) * state.metadata.pageSize + index) + 1 }}</td>
          <td>
            <div>
              <small class="text-grey-lighten-1">
                <span class="text-grey-lighten-1">ارسال کننده: </span>
                {{ comment.anonymousUserName }}
              </small>
            </div>
            <div>
              <small class="text-grey-lighten-1">
                <span>مربوط به:</span>
                <nuxt-link v-if="comment.contentId"
                  :to="`/${comment.contentType == 1 ? 'news' : 'article'}/${comment.contentId}/${comment.contentTitle.replaceAll(' ','-')}`">
                  {{ comment.contentTitle }}
                </nuxt-link>
                <nuxt-link v-if="comment.expertId" :to="`/expert/${comment.expertId}`">
                  {{ comment.expertName}}
                </nuxt-link>
                <span v-if="!comment.expertId && !comment.contentId"> شما</span>
              </small>
            </div>
            <div class="d-flex">
              <span class="text-grey-lighten-1">دیدگاه: </span>
              <span style="max-width: 750px">{{ comment.message }}</span>
            </div>
          </td>
          <td>
            <div class="text-no-wrap">{{ dateConverter.someTimeAgo(comment.createdOn) }}</div>
          </td>
          <td class="text-end">
            <div class="d-flex float-left align-center">
              <v-btn v-if="!comment.publishStatus" class="bg-orange text-white" @click="enableComment(comment.id)">
                <v-icon>mdi-alert</v-icon>
                تایید نشده
              </v-btn>
              <v-dialog transition="dialog-top-transition" width="auto">
                <template v-slot:activator="{ props }">
                  <v-btn variant="text" v-bind="props" icon="mdi-reply" color="blue"></v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card width="400">
                    <v-toolbar class="bg-grey-darken-3 px-5"
                      :title="`ارسال جواب به: `+comment.firstname+' '+comment.lastName">
                      <v-icon @click="isActive.value = false">mdi-close</v-icon>
                    </v-toolbar>
                    <v-card-text class="py-8">
                      <v-form @submit.prevent="replyToComment(comment.id)">
                        <v-select v-if="!state.formData.message" v-model="state.insertReadyMessage" label="پاسخ های آماده" :items="state.readyMessages"
                          variant="outlined" return-object single-line @update:model-value="state.formReply.message = state.insertReadyMessage"></v-select>

                        <v-textarea clearable clear-icon="mdi-close-circle" label="جواب..."
                          v-model="state.formReply.message" rows="2" auto-grow row-height="15"
                          variant="outlined"></v-textarea>
                        <v-switch label="انتشار دیدگاه" :model-value="true" color="info"
                          v-model="state.formReply.published"></v-switch>
                        <v-btn variant="elevated" color="info" block
                          @click="replyToComment(comment.id), isActive.value = false">ارسال</v-btn>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </template>
              </v-dialog>
              <v-btn variant="text" icon="mdi-delete" color="red" @click="dialogDelete(comment)"></v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination v-if="state.metadata.totalCount > state.metadata.pageSize" :total-visible="6"
      :length="state.metadata.totalPages" v-model="state.metadata.pageIndex" class="mx-auto"
      @update:modelValue="changePageing">
    </v-pagination>
  </v-card>

  <mj-dialog v-model="state.dialogDelete" title="حذف دیدگاه" :action-btn="true" action-btn-text="حذف شود"
    :cancel-btn="true" action-type="error" @action-callback="deleteComment" size="xs">
    <div class="d-flex align-end justify-center ga-3">
      <v-img :src="signImage" style="max-width: 70px;"></v-img>
      <div>
        <strong>عملیات حذف غیر قابل بازگشت است.</strong>
        <p>آیا از حذف این دیدگاه اطمینان دارید؟</p>
      </div>
    </div>
  </mj-dialog>
</template>
