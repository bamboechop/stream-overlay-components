<template>
  <button
    class="button-component"
    type="button">
    <img
      alt=""
      class="button__icon"
      :src="iconPath" />
    {{ text }}
  </button>
</template>

<script lang="ts" setup>
defineProps<{
  iconPath: string;
  text: string;
}>();
</script>

<style lang="scss" scoped>
.button-component {
  align-items: center;
  background: transparent;
  border-bottom: 1px solid #000;
  border-left: 1px solid #fff;
  border-right: 1px solid #000;
  border-top: 1px solid #fff;
  color: inherit;
  display: flex;
  font-family: inherit;
  font-size: inherit;
  gap: 4px;
  height: 100%;
  padding: 2px;
  width: 100%;

  &__icon {
    height: 14px;
  }
}
</style>
