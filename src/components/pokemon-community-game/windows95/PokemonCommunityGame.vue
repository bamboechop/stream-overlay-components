<template>
  <div class="pokemon-community-game">
    <ProgramTitleBar
      icon-path="/programs/windows95/pokemon-community-game.icon.png"
      title="Pokémon Community Game" />
    <div class="pokemon-community-game__frame-container">
      <iframe
        class="pokemon-community-game__frame"
        src="https://poketwitch.bframework.de/info/events/show_current_pokemon/?gif=true&question_mark=true"
        title="Pokemon Community Game"></iframe>
    </div>
    <ProgramBottomBar />
  </div>
</template>

<script lang="ts" setup>
import ProgramTitleBar from '@/components/general/windows95/ProgramTitleBar.vue';
import ProgramBottomBar from '@/components/general/windows95/ProgramBottomBar.vue';
</script>

<style lang="scss" scoped>
.pokemon-community-game {
  background-color: #c3c3c3;
  border-bottom: 2px solid #000;
  border-left: 2px solid #efefef;
  border-right: 2px solid #000;
  border-top: 2px solid #efefef;
  display: grid;
  gap: 2px;
  grid-template-rows: 18px 1fr 20px;
  padding: 2px;

  &__frame {
    border: 0;
    height: 166px;
    width: 166px;
  }

  &__frame-container {
    border: 1px solid #7f7f7f;
    display: flex;
    justify-content: center;
    justify-self: center;
    width: 100%;
  }
}
</style>
