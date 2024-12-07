<script setup>
import validator from "@/composables/validator";
const verfyTiptap = ref(null)
const verifyForm = ref(null);
const route = useRoute()
const router = useRouter()
const state = reactive({
  pageData: [],
  categoryList: [],
  files: [],
  formData: {
    title: null,
    body: null,
    summary: null,
    status: 2,
    categoryIds: [],
    contentType: 3,
    commentShow: false,
    commentStatus: false,
    keywordList: [],
    imageIds: [],
  },
  loadEditor:false,
  imageError:false,
})

onMounted(() => {
  load()
  dashboardbreadcrumbstore().setBreadCrumbs([
    {
      title: 'صفحه ها ',
      disabled: false,
      to: '/dashboard/page/list',
    }, {
      title: 'صفحه جدید ',
      disabled: true,
      to: '/dashboard/page/add/',
    }])
})

/**
 * create Page
 * @param event
 * @returns {Promise<void>}
 */
const save = async (event) => {
  state.imageError = false
  const tiptapValid = verfyTiptap.value.validateContent(state.formData.body)
  const { valid } = await verifyForm.value.validate()
  if (!valid || !tiptapValid) return

  if(state.formData.title.length < 4){
    common.showError('عنوان حداقل باید 4 کاراکتر داشته باشد')
    return
  }

  if(state.formData.title.length > 4 && !state.imageError){
    if (state.formData?.id) {
      await axiosApi().put(apiPath.Page.update, state.formData)
        .then(r => common.showMessage('صفحه با موفقیت ویرایش شد'))
        .catch(e => common.showError(e?.data?.messages))
    }
    else {
      await axiosApi().post(apiPath.Page.post, state.formData)
        .then(r => {
          common.showMessage('صفحه با موفقیت ذخیره شد')
          router.push('/dashboard/page/edit/' + r.data)
        }).catch(e => {
          common.showError(e?.data?.messages)
        })
    }
  }
}

/**
 * edit Page
 * @returns {Promise<void>}
 */
const load = async () => {
  if (Number(route.params.id))
    await axiosApi().get(apiPath.Page.get.byId + route.params.id)
      .then(r => {
        state.formData = r.data
        dashboardbreadcrumbstore().setBreadCrumbs([
          {
            title: 'صفحه ها ',
            disabled: false,
            to: '/dashboard/page/list',
          }, {
            title: state.formData.title,
            disabled: true,
            to: '/dashboard/page/edit/' + state.formData.id,
          }])
      })
      .catch(e => common.showError(e?.data?.messages))
  state.loadEditor = true
}

const uploadImage = (value) => {
  const maxLength = 1
  state.imageError = false
  if (state.formData.imageIds.length < maxLength) state.formData.imageIds.push(value)
  state.selectedImage = state.formData.imageIds.find(x=>x)
}

const deleteUploadedImage = () => {
  state.formData.imageIds = state.formData.imageIds.filter(image => image.id != state.selectedImage.id);
  if(state.formData.imageIds.length > 0 && state.selectedImage.isDefault){
    state.formData.imageIds.find(x => x).isDefault = true
  }
  if(state.formData.imageIds.length > 0) state.selectedImage = state.formData.imageIds.find(x=>x)
  else state.selectedImage = null
state.imageError = true
}

</script>
<template>
  <v-form @submit.prevent="save" ref="verifyForm">
    <v-row>
      <v-col cols="12" md="8" lg="9">
        <v-card>
          <v-card-text>
            <v-text-field v-model="state.formData.title" variant="outlined" size="x-large" label="عنوان صفحه*"
              :rules="validator.content.title"></v-text-field>

            <BaseTiptap v-if="state.loadEditor" ref="verfyTiptap" v-model="state.formData.body"  label="محتوای صفحه*" rules="وارد کردن محتوای صفحه الزامی است"/>

            <v-row class="mt-3">
              <v-col cols="12" lg="3" sm="6">
                <v-checkbox v-model="state.formData.commentStatus" label="نمایش نظرات"></v-checkbox>
              </v-col>
              <v-col cols="12" lg="3" sm="6">
                <v-checkbox v-model="state.formData.commentShow" label="نمایش خودکار نظرات"></v-checkbox>
              </v-col>
            </v-row>

          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" lg="3">

        <v-card class="mb-5">
          <v-card-text>
            <v-btn block type="submit" class="bg-blue-grey-lighten-1" size="x-large">ذخیره</v-btn>
            <v-divider class="mt-4"></v-divider>
            <div class="d-flex">
              <label for="status" class="mt-4">ذخیره به عنوان پیش نویس</label>
              <v-switch id="status" v-model="state.formData.status" class="d-inline-flex justify-end"
              :false-value="2" :true-value="1" color="red"></v-switch>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="mb-5">
          <Uploader v-if="state.formData?.imageIds?.length < 1" @update:model-value="uploadImage" :hasImage="false" :multiple="false" :is-private="false"/>
          <BaseImage v-if="state.formData?.imageIds?.length > 0" :src="state.selectedImage" class="mt-1" />
          <v-btn v-if="state.selectedImage" class="bg-red w-100" prepend-icon="mdi-delete-forever" @click="deleteUploadedImage">حذف</v-btn>
        </v-card>

        <v-card class="mb-5">
          <v-card-title class="d-flex">
            <span>برچسب ها </span>
            <v-card variant="text" icon rounded>
              <v-icon size="16">mdi-help-circle-outline</v-icon>
              <v-tooltip activator="parent" location="top">
                <small>(برچسب ها برای نمایش در موتور های جستجو استفاده میشوند)</small>
              </v-tooltip>
            </v-card>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-combobox v-model="state.formData.keywordList" chips clearable multiple filled placeholder="مثال: برچسب (enter)"
              variant="outlined" hide-details>
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip small v-bind="attrs" :input-value="selected" close @click="select" @click:close="remove(item)">
                  {{ item }}
                </v-chip>
              </template>
            </v-combobox>
            <p class="text-orange">
              <small>
                <v-icon>mdi-information-outline</v-icon>
                <span class="mr-1">برای ثبت برچسب بعد از اتمام کلید Enter را فشار دهید</span>
              </small>
              </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>