<script setup>
const props = defineProps(['modelValue', 'rules' ,'items', 'disabled','label','multiple'])
const emits = defineEmits(['update:modelValue'])
const state = reactive({
  categoryList: [],
  selectedCategories: props.modelValue,
  selectedreadonlyCategories: null,
})

watch(() => props.modelValue, () => {
  state.selectedCategories = props.modelValue
})
</script>

<template>
      <v-autocomplete v-model="state.selectedCategories" variant="outlined" :chips="props.multiple ?? true" closable-chips :multiple="props.multiple ?? true" :rules="props.rules"
        :label="props.label ?? 'انتخاب دسته بندی'" :items="props.items" item-title="fullTitle" item-value="id"
        @update:model-value="emits('update:modelValue', state.selectedCategories)" v-if="!props.disabled ?? true">
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props" :class="{ 'text-center text-grey-lighten-1 bg-grey-lighten-4': !item?.raw?.selectable }"
            :disabled="!item?.raw?.selectable" :title="item?.raw?.fullTitle"></v-list-item>
        </template>
      </v-autocomplete>
      <v-list v-else>
          <v-list-item v-for="(item, index) in state.selectedreadonlyCategories" :title="item.fullTitle" :key="index"></v-list-item>
      </v-list>
</template>