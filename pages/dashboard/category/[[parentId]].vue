<script setup>
definePageMeta({
  middleware: 'route-check',
  layout: 'dashboard'
});
const router = useRouter()
const route = useRoute()
const verifyForm = ref({});
const state = reactive({
  categories: [],
  dialogAdd: false,
  parents: [],
  categoryData: {
    id: null,
    title: null,
    sort: 0,
    description: null,
    imageId:null,
    parentId: route.params.parentId == '' ? null : route.params.parentId
  },
  selectedData: null,
  formTitle: null,
  dialogDelete: false,
})

const resetForm = () => {
  state.categoryData.id = null
  state.categoryData.title = null
  state.categoryData.sort = 0
  state.categoryData.description = null
}

onMounted(()=>{
  getData()
  dashboardbreadcrumbstore().setBreadCrumbs([
    {
      title: 'دسته ها ',
      disabled: true,
      to: '/dashboard/category',
    }])
})


const getData = async () => {
  const payload = {
    parentId: state.categoryData.parentId
  }
  if(route.query.search) payload.searchFilters = [{field:'title',operator:6,value:route.query.search}]
  await axiosApi().post(apiPath.Category.get.paged, payload)
    .then((res) => {
      state.categories = res.data;
      if (state.categoryData.parentId) parents()
    })
    .catch(e => common.showError(e?.data?.messages))
}

const postData = async () => {
  await axiosApi().post(apiPath.Category.post, state.categoryData)
    .then((res) => {
      common.showMessage("دسته ثبت شد")
      getData()
      resetForm()
      closeDialog()
    }).catch((error) => common.showError(error?.data?.messages))
}

const putData = async () => {
  await axiosApi().put(apiPath.Category.update, state.categoryData)
  .then((res) => {
    common.showMessage("دسته ویرایش شد")
    getData()
    resetForm()
  }).catch((error) => common.showError(error?.data?.messages))
  closeDialog()
}

const deleteData = async (r) => {
  if (r) {
    await axiosApi().delete(apiPath.Category.delete + state.categoryData.id)
    .then(r => {
      getData()
      common.showMessage('این دسته حذف شد.')
    }).catch(e => common.showError(e?.data?.messages))
  }
  closeDialog()
}

const parents = async () => {
  await axiosApi().get(apiPath.Category.get.parents + route.params.parentId)
    .then(r => {
      let list = []
      for (const item of r.data?.parents) {
        list.push({
          title: item.title,
          disabled: false,
          to: '/dashboard/category/' + item.id,
        })
      }
      dashboardbreadcrumbstore().setBreadCrumbs([
        {
          title: 'دسته ها ',
          disabled: false,
          to: '/dashboard/category',
        }, ...list,
        {
          title: r.data.title,
          disabled: true,
          to: '/dashboard/category/',
        }])

    }).catch(e => {
      common.showError(e?.data?.messages)
    })
}


const save = async (r) => {
  if (r) {
    const { valid } = await verifyForm.value.validate()
    if (!valid) return
    state.categoryData.id ? putData() : postData()
  }
  closeDialog()
}

const closeDialog = () => {
  state.dialogAdd = false
  state.dialogDelete = false
  state.dialogView = false
  resetForm()
}

const handleShowDialog = (row) => {
  if (row) {
    state.dialogAdd = true
    state.categoryData = { ...row }
    state.formTitle = "ویرایش"
    state.isEdit = true
  }
  else {
    state.dialogAdd = true;
    state.formTitle = 'افزودن'
    state.isEdit = false
  }
}

const handleDelete = (data) => {
  state.categoryData = data
  state.dialogDelete = true
}

const changePageing = () => {
  let path = '/dashboard/category'
  let query = null
  if (state.searchFilters && state.searchFilters != '') query = { ...query, search: state.searchFilters }
  router.replace({ path, query })
  setTimeout(() => {
    getData()
  }, 50);
}

</script>

<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>دسته بندی</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn class="bg-blue-grey-lighten-1" size="large" @click="handleShowDialog()">
      <v-icon class="ml-2">mdi-plus-circle-multiple</v-icon>
      ایجاد دسته جدید
    </v-btn>
  </v-toolbar>

  <v-card>
    <v-card-text>
      <v-row>
        <v-col cols="12" xs="6" sm="4" md="10"></v-col>
        <v-col cols="12" xs="6" sm="4" md="2">
          <v-form @submit.prevent="changePageing">
            <v-text-field v-model="state.searchFilters" @blur="changePageing" @click:append-inner="changePageing"
              append-inner-icon="mdi-magnify" type="search" variant="outlined" density="compact" label="جستجو"
              hide-details></v-text-field>
          </v-form>
        </v-col>
      </v-row>
    </v-card-text>
    <v-table>
      <thead>
        <tr>
          <th> ردیف </th>
          <th> عنوان </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in state.categories" :key="item.id">
          <td>{{ i + 1 }}</td>
          <td>{{ item.title }}</td>
          <td>
            <div class="float-left">
              <v-btn class="bg-teal" :to="'/dashboard/category/' + item.id">
                <v-icon>mdi-source-fork</v-icon>
                زیر دسته
              </v-btn>
              <v-btn variant="text" color="orange" icon="mdi-pen" @click="handleShowDialog(item)"></v-btn>
              <v-btn variant="text" color="red" icon="mdi-delete" @click="handleDelete(item)"></v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>

  <!-- new item form / edit item form -->
  <mj-dialog v-model="state.dialogAdd" :title="state.formTitle + ' دسته بندی '" :action-btn="true"
    :action-btn-text="state.isEdit ? 'تایید' : 'اضافه شود'" :cancel-btn="true" action-type="primary"
    @action-callback="save" size="sm">
    <v-form @submit.prevent="save" ref="verifyForm">

      <v-text-field v-model="state.categoryData.title" density="compact" variant="outlined" label="عنوان*"
        :rules="validator.category.title"></v-text-field>

      <v-text-field v-model="state.categoryData.sort" density="compact" type="number" variant="outlined"
        label="جایگاه"></v-text-field>

      <v-textarea v-model="state.categoryData.description" density="compact" variant="outlined"
        label="توضیحات"></v-textarea>

      <Uploader v-model="state.categoryData.imageId" class="mx-auto" style="max-width: 150px;" />
      <button class="d-none"></button>
    </v-form>
  </mj-dialog>

  <!-- delete item form -->
  <mj-dialog v-model="state.dialogDelete" :title="'حذف ' + state.categoryData.title" :action-btn="true"
    action-btn-text="حذف شود" :cancel-btn="true" action-type="error" @action-callback="deleteData" size="sm">
    <p>
      دسته '{{ state.categoryData.title }}' حذف می شود.
      <br />
      آیا مطمئن هستید؟ عملیات حذف غیر قابل بازگشت است!
    </p>

  </mj-dialog>
</template>