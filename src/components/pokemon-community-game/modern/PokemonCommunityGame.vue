<template>
  <WindowFrame
    :active
    class="pokemon-community-game-window"
    title="Pokémon Co...">
    <iframe
      class="pokemon-community-game"
      src="https://poketwitch.bframework.de/info/events/show_current_pokemon/?gif=true&question_mark=true"
      title="Pokemon Community Game"></iframe>
  </WindowFrame>
</template>

<script lang="ts" setup>
import WindowFrame from '@/components/desktop/WindowFrame.vue';

defineProps<{ active?: boolean }>();
</script>

<style lang="scss" scoped>
.pokemon-community-game {
  background-color: rgba(14, 14, 16, 0.25);
  border: 0;
  border-radius: 4px;
  height: 166px;
  width: 166px;
}

.pokemon-community-game-window {
  width: max-content;
}
</style>
