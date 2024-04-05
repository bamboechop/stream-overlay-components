<template>
  <section class="task-bar-view">
    <hr class="task-bar-view__border" />
    <div class="task-bar-view__elements">
      <ButtonComponent
        icon-path="/windows-95/windows.png"
        text="Start" />
      <div class="task-bar-view__programs">
        <template
          v-for="program of programs"
          :key="program.text">
          <ProgramButton
            :active="program.active"
            :icon-path="program.iconPath"
            :text="program.text" />
        </template>
      </div>
      <StatusAndTimePanel />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ButtonComponent from '@/components/ButtonComponent.vue';
import ProgramButton from '@/components/ProgramButton.vue';
import StatusAndTimePanel from '@/components/StatusAndTimePanel.vue';

const programs = ref([
  { active: false, iconPath: '/programs/player.icon.png', text: 'Media Player' },
  { active: true, iconPath: '/programs/chat.icon.png', text: 'Chat' },
  { active: false, iconPath: '/programs/pokemon-community-game.icon.png', text: 'Pokémon Community Game' },
]);
</script>

<style lang="scss" scoped>
.task-bar-view {
  background-color: #c3c3c3;
  height: 29px;
  padding-top: 2px;

  * {
    font-family: 'Windows-95', Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  }

  &__border {
    background-color: #fff;
    border: 0;
    height: 1px;
    margin: 0;
  }

  &__elements {
    display: grid;
    grid-template-columns: 54px 1fr minmax(auto, 114px);
    padding: 2px;
  }

  &__programs {
    display: flex;
    gap: 3px;
    justify-content: start;
  }
}
</style>
