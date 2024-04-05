<template>
  <button
    class="program-button"
    :class="{ 'program-button--active': active }"
    type="button">
    <img
      alt=""
      class="program-button__icon"
      :src="iconPath" />
    <span class="program-button__text">{{ text }}</span>
  </button>
</template>

<script lang="ts" setup>
defineProps<{ active: boolean; iconPath: string; text: string }>();
</script>

<style lang="scss" scoped>
.program-button {
  align-items: center;
  background-color: transparent;
  border-bottom: 1px solid #000;
  border-left: 1px solid #fff;
  border-right: 1px solid #000;
  border-top: 1px solid #fff;
  color: inherit;
  display: flex;
  flex: 0 0 155px;
  font-size: inherit;
  font-family: inherit;
  gap: 4px;
  line-height: 1;
  overflow: hidden;
  padding: 1px 3px 1px 2px;
  text-align: left;

  &__icon {
    width: 16px;
  }

  &__text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.program-button--active {
  background-image: linear-gradient(45deg, #fff 25%, transparent 25%), linear-gradient(-45deg, #fff 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #fff 75%), linear-gradient(-45deg, transparent 75%, #fff 75%);
  background-size: 2px 2px;
  background-position: 0 0, 0 1px, 1px -1px, -1px 0px;
  border-bottom-color: #fff;
  border-left-color: #000;
  border-right-color: #fff;
  border-top-color: #000;
}
</style>
