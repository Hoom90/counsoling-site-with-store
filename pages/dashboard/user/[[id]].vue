<script setup>
definePageMeta({
  middleware: 'route-check',
  layout: 'dashboard'
});
const router = useRouter()
const route = useRoute()
const verifyForm = ref({});
const state = reactive({
    pageTitle: "افزودن",
    showDatePicker: false,
    user: {},
    expert: {},
    province: [],
    categories: [],
})

onMounted(() => {
    dashboardbreadcrumbstore().setBreadCrumbs([
        {
            title: 'کاربران ',
            disabled: false,
            to: '/dashboard/user/list',
        },
        {
            title: `${state.pageTitle} کاربر`,
            disabled: true,
        }])
    if (route.params.id) {
        state.pageTitle = "ویرایش"
    }
    if (route.params.id) getUsers()
    getCategory()
    getProvinces()
})


const getUsers = async () => {
    await axiosApi().get(apiPath.Users.get.single + route.params.id)
        .then((res) => state.user = res.data)
        .catch((error) => common.showError(error?.data?.messages))
}

const getCategory = async () => {
    await axiosApi().get(apiPath.Category.get.all)
        .then((res) => state.categories = res.data)
        .catch((error) => common.showError(error?.data?.messages))
}

const getProvinces = async () => {
    await axiosApi().get(apiPath.Province.get.cities)
        .then((res) => state.province = res.data)
        .catch((error) => common.showError(error?.data?.messages))
}

const addUser = async () => {
    await axiosApi().post(apiPath.Users.post, state.user)
        .then((res) => {
            common.showMessage("کاربر ایجاد شد")
            router.replace(`/dashboard/user/${res.data}`)
        }).catch(e => common.showError(e?.data?.messages))
}

const updateUser = async () => {
    await axiosApi().put(apiPath.Users.update, state.user)
        .then((res) => common.showMessage("کاربر ویرایش شد"))
        .catch(e => common.showError(e?.data?.messages))
}

const save = async () => {
    const { valid } = await verifyForm.value.validate()
    if (valid) route.params.id ? updateUser() : addUser()
}
</script>
<template>
    <v-form @submit.prevent="save" ref="verifyForm" id="mainForm">
        <v-row>
            <v-col cols="12" md="8" lg="9">
                <v-card class="mb-5">
                    <v-card-title>مشخصات کاربر</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field label="نام*" variant="outlined" v-model="state.user.firstName"
                                    :rules="validator.user.firstName()"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="نام خانوادگی*" variant="outlined" v-model="state.user.lastName"
                                    :rules="validator.user.lastName()"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-text-field label="شماره موبایل*" variant="outlined" v-model="state.user.phoneNumber"
                                    :rules="validator.user.phoneNumber('شماره موبایل')"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="آدرس" variant="outlined"
                                    v-model="state.user.address"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea rows="2" label="توضیحات" variant="outlined"
                                    v-model="state.user.description"></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <div class="d-flex">
                                    <v-checkbox v-model="state.user.isActive" label="فعال" color="info"
                                        hide-details></v-checkbox>
                                    <v-checkbox v-model="state.user.isRegistered" label="تکمیل ثبت نام" color="info"
                                        hide-details></v-checkbox>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>

                </v-card>
            </v-col>
            <v-col cols="12" md="4" lg="3">
                <v-card class="pa-3 mb-5">
                    <div class="align-items-center text-center">
                        <Uploader v-model="state.user.imageId" />
                        <hr class="my-4" />
                        <v-btn type="submit" variant="tonal" class="bg-blue-grey-lighten-1" block>ذخیره اطلاعات</v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-form>
</template>

<style>
.profile-image {
    border: solid 1px #b3b3b3;
    padding: 3px;
}

.cursor-pointer {
    cursor: pointer;
}

.customDatePicker {
    display: flex;
    justify-content: space-between;
    border: 1px solid rgb(133, 133, 133);
    padding: 15px;
    border-radius: 3px;

}

.customDatePicker input {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
}
</style>