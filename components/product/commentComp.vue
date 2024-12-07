<script setup>
import { userStore } from "@/stores/userStore"
import apiPath from "~/composables/api-path"
const props = defineProps(['isAutoPublishActive'])
const route = useRoute()
const user = userStore()
onMounted(() => {
  state.commentFormData.anonymousUserName = user.getAuth ? user.getUser.firstName+ ' ' +user.getUser.lastName : ''
  getComments()
})

const state = reactive({
  commentList: [],
  expand: false,
  payload: {
    pageSize: 20,
    pageIndex: 1,
    productId: route.params.id,
  },
  commentFormData: {
    productId: route.params.id,
    message: null,
    anonymousUserName: null,
    anonymousUserEmail: null,
    parentId: null
  },
})

const getComments = async () => {
  await axiosApi().post(apiPath.public.Comment.get, state.payload)
      .then(comments => state.commentList = comments.data)
      .catch((error) => common.showError(error?.data?.messages))
}

const saveComment = async () => {
  await axiosApi().post(apiPath.public.Comment.add_product_comment, state.commentFormData)
      .then( res => {
        if (res){
          state.expand = true
          let timer = setTimeout(() => {
            state.expand = false
            clearTimeout(timer)
          }, 2000);
          state.commentFormData.message = null
          getComments()
        }
      })
      .catch((error) => common.showError(error?.data?.messages))
}
</script>
<template>
<v-card id="Comment" class="rounded-xl">
  <v-card-title>دیدگاه کاربران</v-card-title>
  <v-divider></v-divider>
  <v-card-text>
    <v-form @submit.prevent="saveComment">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
              v-model="state.commentFormData.anonymousUserName"
              variant="outlined"
              label="نام و نام خانوادگی"
              :focused="!user.getAuth"
              :readonly="user.getAuth"
              density="compact"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
              variant="outlined"
              label="ایمیل"
              density="compact"
              v-model="state.commentFormData.anonymousUserEmail"
          >{{ user.getUser.email }}</v-text-field>
        </v-col>
      </v-row>
      <v-textarea
          id="message"
          v-model="state.commentFormData.message"
          variant="outlined"
          rows="3"
          :focused="user.getAuth"
          label="متن..."></v-textarea>
      <v-row class="justify-center">
        <v-col cols="12" md="6" lg="4">
          <v-btn type="submit" block color="info" variant="outlined">ارسال</v-btn>
        </v-col>
      </v-row>
      <v-expand-transition v-if="!props.isAutoPublishActive">
        <v-alert
            text="دیدگاه شما با موفقیت ثبت گردید و پس از تایید ناظر منتشر خواهد شد."
            class="mt-5"
            variant="tonal"
            type="success"
            color="success"
            v-show="state.expand"
        ></v-alert>
      </v-expand-transition>
      <v-expand-transition v-if="props.isAutoPublishActive">
        <v-alert
            text="دیدگاه شما ثبت شد"
            class="mt-5"
            variant="tonal"
            type="success"
            color="success"
            v-show="state.expand"
        ></v-alert>
      </v-expand-transition>
    </v-form>
  </v-card-text>
  <hr>
  <v-card-text>
    <v-row no-gutters v-for="comment in state.commentList" :key="comment.id" class="mb-3">
      <v-col :cols="comment.subComment.length > 0?'11':'12'" md="8">
        <v-card flat color="grey-lighten-3" class="w-100 rounded-xl" :class="comment.subComment.length>0?'rounded-be-0':''">
          <v-card-text class="pa-3 px-5">
            <span>
              {{ comment.anonymousUserName }}
            </span>
            <small class="ms-3 text-grey">
              {{ dateConverter.someTimeAgo(comment.createdOn) }}
            </small>
            <p class="mt-2">{{ comment.message }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" v-if="comment.subComment.length > 0">
        <v-row v-for="reply in comment.subComment" :key="reply.id" >
          <v-col cols="12" md="10">
            <v-card flat color="grey-lighten-1" class="w-100 rounded-right-top-none rounded-left-top-xl rounded-bottom-xl">
              <v-card-text class="pa-3 px-10">
                <span>
                  <strong>پاسخ مدیر سایت به </strong>
                </span>
                <span>{{ reply.anonymousUserName }}</span>
                <span>
                  <small class="mr-3 text-grey-lighten-4">
                    {{ dateConverter.someTimeAgo(reply.createdOn) }}
                  </small>
                </span>
                <p class="mt-2">{{ reply.message }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card-text>
</v-card>
</template>