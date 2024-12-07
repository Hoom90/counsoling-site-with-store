<template>
    <div>
      <Uploader @update:model-value="uploadImage" 
                :hasImage="false" 
                style="max-width: 300px;" 
                :multiple="false" 
                :is-private="false" />
  
      <BaseImage v-if="state.formData?.imageList?.length > 0" 
               :src="state.selectedImage.id" 
               class="mt-1" />
  
      <v-btn v-if="state.selectedImage" 
             class="bg-green w-50" 
             prepend-icon="mdi-check" 
             @click="setToPrimaryImage" 
             :disabled="state.selectedImage?.isDefault">
        عکس شاخص
      </v-btn>
  
      <v-btn v-if="state.selectedImage" 
             class="bg-red w-50" 
             prepend-icon="mdi-delete-forever" 
             @click="deleteUploadedImage">
        حذف
      </v-btn>
  
      <div v-if="state.formData?.imageList.length > 0" 
           class="d-flex justify-center ga-1 mb-1 mt-1">
        <BaseImage v-for="image in state.formData?.imageList" 
                 :key="image.id" 
                 class="border" 
                 style="max-width: 50px;cursor: pointer;" 
                 :src="image.id" 
                 @click="selectImage(image)" />
      </div>
  
      <p v-if="state.imageError && state.formData?.imageList.length == 0" 
         class="px-5 py-1 text-red">
        بارگزاری حداقل یک عکس الزامی است.
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ImageUploader',
    data() {
      return {
        state: {
          formData: {
            imageList: []
          },
          selectedImage: null,
          imageError: false
        }
      };
    },
    methods: {
      uploadImage(value) {
        const maxLength = 3;
        if (this.state.formData.imageList.length < maxLength) {
          this.state.formData.imageList.push({ id: value, isDefault: false });
        }
        this.state.formData.imageList[0].isDefault = true;
        this.state.selectedImage = this.state.formData.imageList[0];
      },
      deleteUploadedImage() {
        this.state.formData.imageList = this.state.formData.imageList.filter(
          image => image.id !== this.state.selectedImage.id
        );
        if (this.state.selectedImage.isDefault && this.state.formData.imageList.length > 0) {
          this.state.formData.imageList[0].isDefault = true;
        }
        this.state.selectedImage = this.state.formData.imageList[0] || null;
      },
      setToPrimaryImage() {
        this.state.formData.imageList.forEach(image => {
          image.isDefault = false;
        });
        const primaryImage = this.state.formData.imageList.find(
          image => image.id === this.state.selectedImage.id
        );
        if (primaryImage) primaryImage.isDefault = true;
        this.state.imageError = false;
      },
      selectImage(image) {
        this.state.selectedImage = image;
      }
    }
  };
  </script>
  
  <style scoped>
  .mt-1 {
    margin-top: 8px;
  }
  .mb-1 {
    margin-bottom: 8px;
  }
  .border {
    border: 1px solid #ccc;
  }
  .w-50 {
    width: 50%;
  }
  .bg-green {
    background-color: green;
    color: white;
  }
  .bg-red {
    background-color: red;
    color: white;
  }
  .text-red {
    color: red;
  }
  </style>
  