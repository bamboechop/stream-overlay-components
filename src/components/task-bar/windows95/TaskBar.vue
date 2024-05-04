<template>
  <section class="task-bar">
    <hr class="task-bar__border" />
    <div class="task-bar__elements">
      <ButtonComponent
        icon-path="/windows-95/windows.png"
        text="Start" />
      <div class="task-bar__programs">
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
import ProgramButton from '@/components/task-bar/windows95/ProgramButton.vue';
import StatusAndTimePanel from '@/components/task-bar/windows95/StatusAndTimePanel.vue';
import ButtonComponent from '@/components/task-bar/windows95/ButtonComponent.vue';
import type { IProgram } from '@/components/task-bar/task-bar.interface';

defineProps<{ programs: IProgram[] }>();
</script>

<style lang="scss" scoped>
.task-bar {
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
    gap: 3px;
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
