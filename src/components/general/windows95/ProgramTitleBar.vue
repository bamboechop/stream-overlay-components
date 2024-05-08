<template>
  <header
    class="program-title-bar"
    :class="{ 'program-title-bar--active': active }">
    <img
      alt=""
      class="program-title-bar__icon"
      :src="iconPath" />
    <span class="program-title-bar__title">{{ title }}</span>
    <div class="program-title-bar__buttons">
      <template
        v-for="(icon, index) of buttonIcons"
        :key="`program-title-bar-buttons-${index}`">
        <button
          class="program-title-bar__button"
          type="button">
          <img
            alt=""
            :src="icon" />
        </button>
      </template>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

withDefaults(defineProps<{ active?: boolean; iconPath: string; title: string }>(), { active: false });

const buttonIcons = ref(['/windows-95/minimize.png', '/windows-95/maximize.png', '/windows-95/close.png']);
</script>

<style lang="scss" scoped>
.program-title-bar {
  align-items: center;
  background-color: #808080;
  color: #c4c2c4;
  display: grid;
  gap: 4px;
  grid-template-columns: 14px 1fr min-content;
  height: 100%;
  line-height: 1;
  padding: 2px;
  text-align: left;
  width: 100%;

  &__button {
    align-items: end;
    background-color: #c6c6c6;
    border-bottom: 1px solid #000;
    border-left: 1px solid #fff;
    border-right: 1px solid #000;
    border-top: 1px solid #fff;
    display: flex;
    height: 100%;
    justify-content: center;
    padding: 1px;
    width: 16px;

    &:last-of-type {
      align-items: center;
      margin-left: 2px;
    }

    img {
      margin: 0 auto;
    }
  }

  &__buttons {
    display: flex;
    height: 100%;
    place-items: center;
  }

  &__icon {
    display: inline-flex;
    height: 14px;
    place-items: center;
  }

  &__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.program-title-bar--active {
  background-color: #000082;
  color: #fff;
}
</style>
