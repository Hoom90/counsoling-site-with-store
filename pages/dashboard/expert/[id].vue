<script setup>
import validator from "~/composables/validator";
const verfyTiptap = ref(null)
const verifyForm = ref(null);
const route = useRoute()
const state = reactive({
    expert: {},
    province: [],
    showDatePicker: false,
    uploadImage: false,
    currentDate: dateConverter.convertToJalali(new Date()),
    imageError: false,
})


onMounted(() => {
    getExpert()
    state.expert.dateOfBirth = new Date()
    dashboardbreadcrumbstore().setBreadCrumbs([
        {
            title: 'متخصصان ',
            disabled: false,
            to: '/dashboard/expert/list',
        },
        {
            title: 'ویرایش متخصص',
            disabled: true,
            to: '/dashboard/expert/list',
        }])
})

const getExpert = async () => {
    await axiosApi().get(apiPath.Expert.get.byId(route.params.id))
        .then(r => {
            state.expert = r.data
            state.selectedImage = state.expert.imageIds.find(x=>x)
            getProvinces()
        })
        .catch(e => common.showError(e.data?.messages))
        state.loadEditor=true
}

const getProvinces = async () => {
    await axiosApi().get(apiPath.Province.get.cities)
        .then((res) => state.province = res.data)
        .catch((error) => common.showError(error?.data?.messages))
}

const putData = async () => {
    state.imageError = false
    if (state.expert.imageIds.length == 0) state.imageError = true
    const tiptapValid = verfyTiptap.value.validateContent(state.expert.additionalText)
    const { valid } = await verifyForm.value.validate()
    if (!valid || !tiptapValid || state.imageError) return
    await axiosApi().put(apiPath.Expert.update, state.expert)
        .then(r => common.showMessage("متخصص ویرایش شد"))
        .catch(e => common.showError(e?.data?.messages))
}

const uploadImage = (value) => {
  state.expert.imageIds.push(value)
  state.selectedImage = state.expert.imageIds.find(x=>x)
}

const deleteUploadedImage = () => {
  state.expert.imageIds = state.expert.imageIds.filter(image => image != state.selectedImage);
  if(state.expert.imageIds.length > 0) state.selectedImage = state.expert.imageIds.find(x=>x)
  else state.selectedImage = null
}
</script>

<template>
    <v-form @submit.prevent="putData" ref="verifyForm">
        <v-row>
            <v-col cols="12" md="8" lg="9">
                <v-card>
                    <v-card-title>
                        مشخصات کارشناس
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field label="نام*" variant="outlined" v-model="state.expert.firstName"
                                    :rules="validator.expert.firstName"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="نام خانوادگی*" variant="outlined" :rules="validator.expert.lastName"
                                    v-model="state.expert.lastName"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="شماره موبایل*" variant="outlined" :rules="validator.expert.phoneNumber"
                                    v-model="state.expert.phoneNumber"></v-text-field>
                            </v-col>

                            <v-col cols="12" sm="6">
                                <v-row>
                                    <v-col cols="12" sm="6">
                                        <v-checkbox label="تائید متخصص" v-model="state.expert.isConfirm" />
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-checkbox label="قفل تغیر اطلاعات" v-model="state.expert.changeProfileLock" />
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="کد ملی*" variant="outlined" :rules="validator.expert.nationalCode"
                                    v-model="state.expert.nationalCode"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="تاریخ تولد" variant="outlined" readonly v-model="state.currentDate"
                                    @click="state.showDatePicker = true" :rules="validator.expert.nationalCode"
                                    id="birthDayDatePicker"></v-text-field>
                                <date-picker append-to="#mainForm" v-model="state.expert.dateOfBirth"
                                    :show="state.showDatePicker" simple format="YYYY-MM-DD" display-format="jYYYY/jMM/jDD"
                                    custom-input="#birthDayDatePicker" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select label="جنسیت" variant="outlined" v-model="state.expert.gender"
                                    :rules="validator.expert.gender"
                                    :items="constract.gender" :item-title="constract.gender.title"
                                    :item-value="constract.gender.id"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="هزینه کارشناس*" type="number" variant="outlined"
                                    :rules="validator.expert.counselingAmount"
                                    v-model="state.expert.counselingAmount"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-autocomplete label="محل تولد" :items="state.province" :rules="validator.expert.placeOfBirth"
                                    item-title="fullTitle" item-value="id" v-model="state.expert.placeOfBirth"
                                    variant="outlined"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="کد نظام پزشکی*" variant="outlined" :rules="validator.expert.medicalNumber"
                                    v-model="state.expert.medicalNumber"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-autocomplete label="مدرک" :items="constract.grade" item-value="id" item.title="title"
                                    :rules="validator.expert.grade" v-model="state.expert.grade"
                                    variant="outlined"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field label="جمله انگیزشی" variant="outlined"
                                    v-model="state.expert.motivationalSentence"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <BaseTiptap v-if="state.loadEditor" ref="verfyTiptap" v-model="state.expert.additionalText"  label="رزومه کارشناس*" rules="وارد کردن رزومه الزامی است"/>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="4" lg="3">
                <v-card class="mb-3">
                    <v-card-text>
                        <v-btn block type="submit" class="bg-blue-grey-lighten-1" size="x-large">ذخیره</v-btn>
                    </v-card-text>
                </v-card>
        
                <v-card class="mb-5">
                    <v-card-text>
                        <BaseCategorySelect v-model="state.expert.categoryIds" label="تخصص کارشناس" :rules="validator.expert.categoryIds" hide-details/>
                    </v-card-text>
                </v-card>
                
                <v-card class="mb-5">
                    <v-card-text>
                        <p v-if="state.imageError" class="text-red"><v-icon>mdi-alert</v-icon>عکس مدارک نمیتواند خالی باشد!</p>
                        <small>
                            <ul class="px-5 text-orange">
                                <li>شناسنامه(همه صفحات)</li>
                                <li>کارت ملی(پشت و رو)</li>
                                <li>مدرک تحصیلی(معتبر)</li>
                            </ul>
                        </small>
                        <Uploader @update:model-value="uploadImage" text="بارگزاری مدارک کارشناس" :hasImage="false" :multiple="true"/>
                        <v-card v-if="state.expert?.imageIds?.length > 0" flat class="border mt-1">
                            <BaseImage :src="state.selectedImage" class="mt-1 w-100" />
                            <v-btn v-if="state.selectedImage" class="position-absolute bg-red" style="top: 0;left: 0;" icon="mdi-delete-forever" @click="deleteUploadedImage"></v-btn>
                        </v-card>
                        <div v-if="state.expert?.imageIds.length > 0" class="d-flex justify-center ga-1 mb-1 mt-1">
                            <BaseImage v-for="image in state.expert?.imageIds" class="border cursor-pointer" style="max-width: 50px;" :src="image" @click="state.selectedImage = image" />
                        </div>
                    </v-card-text>
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