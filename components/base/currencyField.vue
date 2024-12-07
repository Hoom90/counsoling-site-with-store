<script setup>
const props = defineProps(['modelValue','prefix','size','variant','label','class','rules'])
const emits = defineEmits(['update:modelValue'])
const state = reactive({
    currencyValue:'0',
})

onMounted(()=>{
    state.currencyValue = props.modelValue
})

const formatCurrency = () => {
  let value = state.currencyValue;
  value = value.toString().replace(/,/g, '');
  if (!isNaN(value) && value !== '') {
    state.currencyValue = parseInt(value).toLocaleString();
  } else {
    state.currencyValue = '';
  }
};
</script>
<template>
    <v-text-field v-model="state.currencyValue" :label="props.label" :variant="props.variant" :size="props.size"
        outlined :prefix="props.prefix" @input="formatCurrency" :rules="props.rules"
        :class="props.class"></v-text-field>
</template>