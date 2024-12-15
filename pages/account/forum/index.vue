<script setup>
definePageMeta({ layout: 'account', middleware: 'route-check', })
const verifyForm = ref({});
const router = useRouter();
const state= reactive({
  pagination: {
    pageIndex: 0,
    pageSize:0,
    totalPages:0,
    totalCount: 0,
  },
  records: [],
  category: [],
  current: {},
  currentTitle: '',
  addModal:false,
  editModal:false,
  deleteModal:false,
})

//#region GET
onMounted(()=>{
  getData()
  getCategory()
});

const getData = async () => {
  await axiosApi().post(apiPath.ExpertTopic.post.pagination,state.pagination)
  .then((res)=>{
    state.records = res.data
    state.pagination = res.metadata
  })
  .catch((error)=>common.showError(error?.data?.messages))
}

const getCategory = async () =>{
  await axiosApi().post(apiPath.public.Category.post,{})
  .then((res)=>state.category = res.data)
  .catch((error)=>common.showError(error?.data?.messages))
}

const changePageing = () => {
  router.replace({ path: '/account/forum', query: { size: state.pagination.pageSize, index: state.pagination.pageIndex }})

  setTimeout(() => {
    getData()
  }, 50);
}
//#endregion

//#region POST
const postData = async (r) =>{
  if(r){
    const { valid } = await verifyForm.value.validate()
    if (!valid) return

    await axiosApi().post(apiPath.ExpertTopic.post.add,state.current)
    .then((res)=>{
      common.showMessage(res.message)
      getData()
    })
    .catch((error)=>common.showError(error?.data?.messages))
  }
  state.dialogAdd = false
  state.newTopic={
    title:null,
    description:null,
    categoryId:null,
    isActive:true,
  }
  state.addModal = false
  state.current = {}
}
//#endregion

//#region EDIT
const editData = async (r) =>{
  if(r){
    const { valid } = await verifyForm.value.validate()
    if (!valid) return

    let payload = {
      id: state.current.id,
      title: state.current.title,
      isActive: state.current.isActive,
      description: state.current.description,
      categoryId: state.current.categoryId,
    }
    await axiosApi().put(apiPath.ExpertTopic.put,payload)
    .then((res)=>{
      common.showMessage(res.messages)
      getData()
    })
    .catch((error)=>common.showError(error.messages))
  }
  state.editModal = false
  state.current = {}
}
//#endregion

//#region DELETE
const deleteData = async (r) =>{
  if(r){
    await axiosApi().delete(apiPath.ExpertTopic.delete(state.current.id))
    .then(res=>{
      common.showMessage(res.messages)
      getData()
    })
    .catch(error=>common.showError(error?.data?.messages))
  }
  state.deleteModal = false
  state.current = {}
}
//#endregion

const handleAdd = () =>{
  state.addModal = true
  state.current = {}
}

const handleEdit = (item) =>{
  state.editModal = true
  state.current = {...item}
  state.currentTitle = {...item}.title
}

const handleDelete = (item) =>{ 
  state.deleteModal = true
  state.current = item
}

</script>

<template>
  <fieldset class="myFieldset rounded-xl mb-5 d-flex align-center ga-5">
    <v-btn icon="mdi-chevron-right" class="bg-teal d-md-none" to="/account/home"></v-btn>
    <p class="text-18"><strong>تالار های گفتگوی من</strong></p>
    <v-spacer></v-spacer>
    <v-btn color="info" variant="tonal" class="d-none d-md-block" @click="handleAdd">افزودن تاپیک جدید</v-btn>
  </fieldset>

  <!-- records > cardlist -->
  <v-card flat class="d-md-none mb-5" v-for="(item, index) in state.records" :key="index">
    <v-row no-gutters>
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <small>{{ item.categoryTitle }}</small>
        <div>
          <v-chip v-if="item.isActive" variant="text" color="green">
            <strong>
              <small>فعال</small>
            </strong>
          </v-chip>
          <v-chip v-else variant="text" color="red">
            <strong>
              <small>غیرفعال</small>
            </strong>
          </v-chip>
          <v-menu close-on-content-click location="end">
              <template #activator="{ props }">
                <v-btn v-bind="props" class="rounded-0 border-none" icon="mdi-dots-vertical"></v-btn>
              </template>
              <v-list class="pa-0">
                <v-list-item :to="`/topic/${item.categoryId}/${item.id}`" class="text-teal">
                  <v-list-item-title>
                    <v-icon>mdi-eye-outline</v-icon>
                    <span>مشاهده</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleEdit(item)" class="text-orange">
                  <v-list-item-title>
                    <v-icon>mdi-pen</v-icon>
                    <span>ویرایش</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="handleDelete(item)" class="text-red">
                  <v-list-item-title>
                    <v-icon>mdi-delete-outline</v-icon>
                    <span>حذف</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
        </div>
      </v-col>
      <v-col cols="12" class="text-16">
        <strong>{{ item.title }}</strong>
      </v-col>
      <v-col cols="12" class="mb-3">
        <small>{{ item.description }}</small>
      </v-col>
      <v-col cols="6" class="text-grey">
        <small>
          <v-icon color="grey">mdi-calendar-outline</v-icon>
          <span>{{ dateConverter.convertToJalali(item.createdOn) }}</span>
        </small>
      </v-col>
      <v-col cols="6" class="text-grey" dir="ltr">
        <small>
          <span>تعداد پیام: </span>
          <span>{{ item.postCount }}</span>
        </small>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </v-card>
  <v-card flat class="d-md-none mt-5">
    <v-pagination v-if="state.pagination.totalCount > state.pagination.pageSize" :length="state.pagination.totalPages"
      v-model="state.pagination.pageIndex" class="mx-auto" @update:modelValue="changePageing">
    </v-pagination>
  </v-card>

  <!-- table -->
  <fieldset class="d-none d-md-block myFieldset rounded-xl">
  <v-table>
    <thead>
      <tr>
        <th>ردیف</th>
        <th>عنوان</th>
        <th>دسته‌بندی</th>
        <th>وضعیت</th>
        <th>تاریخ ایجاد</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in state.records" :key="item.id">
        <td>{{ ((state.pagination.pageIndex - 1) * state.pagination.pageSize + index) + 1 }}</td>
        <td>{{ item.title }}</td>
        <td>{{ item.categoryTitle }}</td>
        <td>
          <v-chip :color="item.isActive ? 'green' : 'red'">
            {{ item.isActive ? 'فعال' : 'غیرفعال' }}
          </v-chip>
        </td>
        <td>{{ dateConverter.convertToJalali(item.createdOn) }}</td>
        <td class="text-end">
          <v-menu close-on-content-click location="end">
            <template #activator="{ props }">
              <v-btn v-bind="props" class="h-100 rounded-0 border-none" icon="mdi-dots-vertical"></v-btn>
            </template>
            <v-list class="pa-0">
              <v-list-item :to="`/topic/${item.categoryId}/${item.id}`" class="text-teal">
                <v-list-item-title>
                  <v-icon>mdi-eye-outline</v-icon>
                  <span>مشاهده</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="handleEdit(item)" class="text-orange">
                <v-list-item-title>
                  <v-icon>mdi-pen</v-icon>
                  <span>ویرایش</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="handleDelete(item)" class="text-red">
                <v-list-item-title>
                  <v-icon>mdi-delete-outline</v-icon>
                  <span>حذف</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </td>
      </tr>
    </tbody>
  </v-table>
  <v-pagination
    :length="state.pagination.totalPages"
    v-model="state.pagination.pageIndex"
    class="mx-auto"
    @update:modelValue="changePageing"
  />
</fieldset>


  <mj-dialog v-model="state.addModal" title="تاپیک جدید افزودن" :action-btn="true" :cancel-btn="true"
    action-type="primary" @action-callback="postData" size="sm">
    <v-form @submit.prevent="postData" ref="verifyForm">

      <v-text-field v-model="state.current.title" variant="outlined" label="عنوان"
        :rules="validator.category.title"></v-text-field>

      <v-select :items="state.category" v-model="state.current.categoryId" label="انتخاب دسته" variant="outlined"
        item-title="title" item-value="id" :rules="validator.category.categoryId"></v-select>

      <v-textarea v-model="state.current.description" variant="outlined" label="توضیحات"
        :rules="validator.description"></v-textarea>
    </v-form>
  </mj-dialog>

  <mj-dialog v-model="state.editModal" :title="`ویرایش < ${state.currentTitle} >`" :action-btn="true" :cancel-btn="true"
    action-type="primary" @action-callback="editData" size="sm">
    <v-form @submit.prevent="editData" ref="verifyForm">

      <v-text-field v-model="state.current.title" variant="outlined" label="عنوان"
        :rules="validator.category.title"></v-text-field>

      <v-select :items="state.category" v-model="state.current.categoryId" label="انتخاب دسته" variant="outlined"
        item-title="title" item-value="id" :rules="validator.category.categoryId"></v-select>

      <v-textarea v-model="state.current.description" variant="outlined" label="توضیحات"></v-textarea>
    </v-form>
  </mj-dialog>

  <mj-dialog v-model="state.deleteModal" title="حذف" :action-btn="true" action-btn-text="حذف شود" :cancel-btn="true"
    action-type="error" @action-callback="deleteData" size="sm">
    <p>{{ state.current.title }} حذف می شود.<br />آیا اطمینان دارید؟</p>
  </mj-dialog>
</template>
