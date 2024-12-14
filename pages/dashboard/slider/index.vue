<script setup>
definePageMeta({
  middleware: 'route-check',
  layout: 'dashboard'
});
const verifyForm = ref({});
const slidePic = ref()
const state = reactive({
  slider: {},
  sliderId: 0,
  editDialog: false,
  deleteDialog: false,
  formTitle: null,
  sliders: [],
  editState: false,
  slides: [],
  slide: {},
  imageId: null,
  editDialogSlide: false,
  isEdit: false
})

onMounted(()=>{
  getData()
  dashboardbreadcrumbstore().setBreadCrumbs([
    {
      title: 'اسلایدر ',
      disabled: true,
      to: '/dashboard/slider',
    }])
})

const getData = async () => {
  axiosApi().get(apiPath.Slider.get.all)
    .then((res) => state.sliders = res.data)
    .catch((error) => common.showError(error?.data?.messages))
}

const saveSlider = async (s) => {
  if (s){
    const { valid } = await verifyForm.value.validate()
    if (!valid) return
  
    if(state.slider.title.length < 4){
      common.showError('عنوان حداقل باید 4 کاراکتر داشته باشد')
      return
    }
    state.editState ? putSlider() : postNewSlider()
  }
  state.editDialog = false
}

const postNewSlider = async () => {
  await axiosApi().post(apiPath.Slider.post, state.slider)
    .then(res => {
      common.showMessage(res.messages)
      getData()
    })
    .catch(error => common.showError(error?.data?.messages))
    closeDialog()
}

const putSlider = async () => {
  await axiosApi().put(apiPath.Slider.update, state.slider)
    .then(res => {
      common.showMessage(res.messages)
      getData()
    })
    .catch(error => common.showError(error?.data?.messages))
    closeDialog()
}

const deleteSlider = async (r) => {
  if (r) {
    await axiosApi().delete(apiPath.Slider.delete + state.slider.id)
      .then(res => {
        common.showMessage(res.messages)
        getData()
        selectSlider([state.sliderId])
      })
      .catch(error => common.showError(error?.data?.messages))
      closeDialog()
  }
  state.deleteDialog = false
}

const closeDialog = () => {
  state.slider = {}
  state.editDialog = false;
  state.deleteDialog = false
}

const handleSelect = (item) => {
  state.editDialog = true;
  state.editState = false
  state.slider = {}
  if (item) {
    state.slider = { ...item }
    state.editState = true
  }
}

const handleDelete = (item) => {
  state.deleteDialog = true
  if (item){
    state.slider = { ...item }
    state.slides = []
  }
}

const selectSlider = (id) => {
  state.sliderId = id[0]
  if (state.sliderId)
    axiosApi().get(apiPath.Slide.get.all + id)
      .then(res => {
        state.slides = res.data
      })
      .catch(error => {
        common.showError(error?.data?.messages)
      })
      .finally(() => {
      })
}

const postSlide = async () => {
  const { valid } = await verifyForm.value.validate()

  if(!state.imageId){
    slidePic.value.style.color = 'red';
    return
  }

  if(!valid) return


  slidePic.value.style.color = '';

  state.slide.imageId = state.imageId
  state.slide.parentId = state.sliderId

  await axiosApi().post(apiPath.Slide.post, state.slide)
    .then(res => {
      state.editDialogSlide = false
      common.showMessage(res.messages)
      selectSlider([state.sliderId])
    })
    .catch(error => common.showError(error?.data?.messages))
}

const putSilde = async () => {
  const { valid } = await verifyForm.value.validate()
  if(!state.imageId){
    slidePic.value.style.color = 'red';
    return
  }

  if(!valid) return

  slidePic.value.style.color = '';

  state.slide.imageId = state.imageId
  state.slide.parentId = state.sliderId

  await axiosApi().put(apiPath.Slide.update, state.slide)
    .then(res => {
      state.editDialogSlide = false
      common.showMessage(res.messages)
      selectSlider([state.sliderId])
    })
    .catch(error => common.showError(error?.data?.messages))
}

const selectSlide = (item) => {
  if (state.sliderId) {
    state.editDialogSlide = true
    state.isEdit = false
    state.imageFile = null
    state.imagePath = null
    state.slide = {}
    if (item) {
      state.slide = { ...item }
      state.imageFile = state.slide.imageId
      state.imageId = state.slide.imageId
      state.isEdit = true
    }
  }
}

const saveSlide = (s) => {
  if (s) {
    state.isEdit ? putSilde() : postSlide()
  }
  else {
    state.editDialogSlide = false
    state.imageId = null
    state.imageFile = null
    state.slide = {}
  }
}

</script>
<template>
  <v-row class="mb-3">
    <v-col cols="12" md="4">
      <v-card>
        <v-card-title class="d-flex">
          اسلایدر
          <v-btn class="bg-blue-grey-lighten-1 ms-auto" size="large" @click="handleSelect()">
            <v-icon class="ml-2">mdi-plus-circle-multiple</v-icon>
            ایجاد اسلایدر جدید
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-list class="mt-3" select-strategy="single-independent" @update:selected="selectSlider">
          <v-list-item v-for="slider in state.sliders" :key="slider.id" :value="slider.id">
            <v-list-item-title> {{ slider.title }} </v-list-item-title>
            <template v-slot:append>
              <v-list-item-action start>
                <v-btn variant="text" color="orange" icon="mdi-pen" @click="handleSelect(slider)"></v-btn>
                <v-btn variant="text" color="red" icon="mdi-delete" @click="handleDelete(slider)"></v-btn>
              </v-list-item-action>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="12" md="8">
      <v-card>
        <v-card-title class="d-flex align-center">
          اسلاید
          <v-btn @click="selectSlide()" class="bg-blue-grey-lighten-1 ms-auto" size="large" :disabled="state.sliderId == 0 ? true : false">
            <v-icon class="ml-2">mdi-plus-circle-multiple</v-icon>
            ایجاد اسلاید جدید
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>


        <div class="ma-3">

          <v-row>
            <v-col cols="6" md="4" lg="3" v-for="item in state.slides" :key="item.id">
              <v-card>
                <BaseImage :src="item.imageId" min-height="125" style="cursor: pointer;" @click="selectSlide(item)"/>
                <v-card-text>
                  <span>{{ item.title }}</span>
                  <div class="d-flex justify-end">
                    <v-btn @click="selectSlide(item)" color="orange" variant="text" icon="mdi-pencil"></v-btn>
                    <v-btn @click="handleDelete(item)" color="red" variant="text" icon="mdi-delete"></v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

      </v-card>
    </v-col>
  </v-row>

  <!-- edit Slide form -->
  <mj-dialog v-model="state.editDialogSlide" title="اسلاید" :action-btn="true" action-btn-text="ذخیره" :cancel-btn="true"
    action-type="primary" @action-callback="saveSlide" size="sm">
    <v-form @submit.prevent="saveSlide" ref="verifyForm">

      <v-text-field v-model="state.slide.title" variant="outlined" label="عنوان اسلاید" :rules="validator.slider.title"></v-text-field>
      <v-text-field v-model="state.slide.description" variant="outlined" label="توضیحات"></v-text-field>
      <v-text-field v-model="state.slide.link" variant="outlined" label="لینک"></v-text-field>
      <v-row>
        <v-col cols="6">
          <v-text-field v-model="state.slide.sort" type="number" variant="outlined" label="ترتیب"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-switch class="justify-center d-flex v-locale--is-ltr" v-model="state.slide.isActive"
            color="blue-grey-lighten-1" :label="state.slide?.isActive ? 'فعال' : 'غیر فعال'"></v-switch>
        </v-col>
      </v-row>
      <p ref="slidePic">عکس اسلاید*</p>
      <div class="d-flex justify-center">
        <imageUploader v-model="state.imageId" style="width: 300px;"/>
      </div>
    </v-form>
  </mj-dialog>





  <!-- edit Slider form -->
  <mj-dialog v-model="state.editDialog" title="اسلایدر" :action-btn="true" action-btn-text="ذخیره" :cancel-btn="true"
    action-type="primary" @action-callback="saveSlider" size="sm">
    <v-form @submit.prevent="saveSlider" ref="verifyForm">
      <v-text-field v-model="state.slider.title" variant="outlined" label="نام اسلایدر را وارد کنید" :rules="validator.slider.title"></v-text-field>
      <v-switch class="justify-center d-flex v-locale--is-ltr" v-model="state.slider.isActive" color="blue-grey-lighten-1"
        :label="state.slider?.isActive ? 'فعال' : 'غیر فعال'"></v-switch>
    </v-form>
  </mj-dialog>


  <!-- delete item form -->
  <mj-dialog v-model="state.deleteDialog" title="حذف" :action-btn="true" action-btn-text="حذف شود" :cancel-btn="true"
    action-type="error" @action-callback="deleteSlider" size="sm">
    <p>
      '{{ state.slider?.title }}' حذف می شود.
      <br />
      آیا مطمئن هستید؟ عملیات حذف غیر قابل بازگشت است!
    </p>
  </mj-dialog>
</template>

