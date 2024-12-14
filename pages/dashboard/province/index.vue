<script setup>
definePageMeta({
  middleware: 'route-check',
  layout: 'dashboard'
});
const route = useRoute();
const state = reactive({
  data: [],
  newItem: {
    id: null,
    title: null,
    parentId: null,
  },
  breadcrumb: {
    parentId: null,
    title: null,
  },
  deleteModalState: false,
  formTitle: null,
  modalTitle: null,
})

onMounted(() => {
  getData()
})

watch(() => route.query, () => {
  getData()
})

const getData = () =>{
  state.formTitle = route.query?.id ? 'شهر ' : 'استان '
  if (route.query?.id) {
    state.breadcrumb = {
      parentId: route.query?.id,
      title: route.query?.name,
    }
    getCity()
  }
  else getProvince()
}

const getProvince = async () => {
  await axiosApi().get(apiPath.Province.get.list)
    .then(res => {
      state.data = res.data
      dashboardbreadcrumbstore().setBreadCrumbs([
        {
          title: 'استان ها ',
          disabled: true,
          to: '/dashboard/province',
        }])
    })
    .catch(error => common.showError(error?.data?.messages))
}

const getCity = async () => {
  await axiosApi().get(apiPath.Province.get.byParent(state.breadcrumb.parentId))
    .then(res => {
      state.data = res.data
      dashboardbreadcrumbstore().setBreadCrumbs([
        {
          title: 'استان ها',
          disabled: false,
          to: '/dashboard/province',
        },
        {
          title: state.breadcrumb.title,
          disabled: true,
          to: '/dashboard/province/',
        }])
    })
    .catch(e => common.showError(e?.data?.messages))
}
</script>

<template>
  <v-toolbar class="mb-5" color="white" elevation="1" rounded>
    <v-toolbar-title>{{`${state.formTitle} ها` }}</v-toolbar-title>
  </v-toolbar>

  <v-card>
    <v-table>
      <thead>
        <tr>
          <th>ردیف</th>
          <th>نام</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in state.data" :key="item.id">
          <td>{{ i + 1 }}</td>
          <td>{{ item.title }}</td>
          <td>
            <div class="float-left">
              <v-btn variant="text" class="rounded bg-blue" icon="mdi-chevron-left" :to="`/dashboard/province?id=${item.id}&name=${item.title}`" v-if="!item.parentId"></v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-card>
</template>