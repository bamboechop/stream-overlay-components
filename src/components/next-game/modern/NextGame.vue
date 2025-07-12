<template>
  <WindowFrame
    :active="active"
    class="next-game-window"
    title="Next Game">
    <div class="next-game">
      <p class="next-game__description">
        Ich besitze eine Steam Bibliothek mit über 680 Spielen. Davon sind über 400 Spiele bis heute ungespielt. Das ändert sich ab sofort.<br />
        Der Zufall entscheidet, welches Spiel wir als nächstes gemeinsam im Stream spielen.
      </p>
      <h2 class="next-game__heading">
        Die Regeln
      </h2>
      <ul class="next-game__list">
        <li class="next-game__list-item">
          Jedes Spiel wird zufällig ausgewählt.
        </li>
        <li class="next-game__list-item">
          Jedes gewählte Spiel wird zumindest für eine Stunde im Stream gespielt.
        </li>
      </ul>
      <h2 class="next-game__heading">
        Kategorie
      </h2>
      <div class="next-game__categories">
        <FlipText
          ref="categoryFlipText"
          :words="categories"
          @word-selected="handleCategorySelected" />
      </div>
      <h2 class="next-game__heading">
        Spiel
      </h2>
      <div class="next-game__categories">
        <FlipText
          ref="gameFlipText"
          :words="games"
          @word-selected="handleGameSelected" />
      </div>
      <p class="next-game__credits">
        Idee inspiriert von unstablesparkey und seinen "Steam Roulette" Reels auf Instagram.
      </p>
      <div
        class="next-game__overlay"
        :class="{ 'next-game__overlay--visible': selectedGame }">
        Gewonnen hat
        <p class="next-game__selected-game">
          {{ selectedGame }}!
        </p>
        Zur Auswahl standen: {{ games.join(', ') }}.
      </div>
    </div>
  </WindowFrame>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import FlipText from './FlipText.vue';
import WindowFrame from '@/components/desktop/WindowFrame.vue';
import { UNPLAYED_GAMES } from '@/common/constants/unplayed-games.constant';
import { useEventStreamComposable } from '@/composables/event-stream.composable';

defineProps<{ active?: boolean }>();

const { on } = useEventStreamComposable();

const categories = [
  '4X Strategy',
  'Action',
  'Action RPG',
  'Action-Adventure',
  'Adventure',
  'Arcade',
  'Battle Royale',
  'Beat \'em up',
  'Business Simulation',
  'Card Game',
  'City Building',
  'Compilation',
  'Exploration',
  'Farming Simulation',
  'Fighting',
  'First-Person Shooter',
  'Flight Simulator',
  'Grand Strategy',
  'Hidden Object',
  'Interactive Fiction',
  'Metroidvania',
  'Military Simulator',
  'MOBA',
  'Music',
  'Party Game',
  'Physics Sandbox',
  'Pinball',
  'Platformer',
  'Point-and-Click Adventure',
  'Puzzle',
  'Puzzle Platformer',
  'Racing',
  'Real-Time Strategy',
  'Roguelike',
  'Role-Playing Game',
  'Run and Gun',
  'Simulation',
  'Sports',
  'Stealth',
  'Stealth Platformer',
  'Strategy',
  'Survival',
  'Survival Horror',
  'Third-Person Shooter',
  'Time Management',
  'Tower Defense',
  'Turn-Based Strategy',
  'Visual Novel',
];

const selectedCategory = ref<string | null>(null);
const selectedGame = ref<string | null>(null);
const categoryFlipText = ref<InstanceType<typeof FlipText> | null>(null);
const gameFlipText = ref<InstanceType<typeof FlipText> | null>(null);

const games = computed(() => {
  if (!selectedCategory.value) {
    return [];
  }

  return UNPLAYED_GAMES.filter(game => game.genre === selectedCategory.value).map(game => game.name);
});

function handleCategorySelected(category: string) {
  selectedCategory.value = category;
}

function handleGameSelected(game: string) {
  selectedGame.value = game;
}

onMounted(() => {
  on('overlay.roll.category', () => {
    selectedCategory.value = null;
    selectedGame.value = null;
    categoryFlipText.value?.toggleAutoCycle();
  });

  on('overlay.roll.game', () => {
    gameFlipText.value?.toggleAutoCycle();
  });
});
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

  .next-game {
    background-color: #0e0e10;
    border-radius: $window-frame-border-radius - $window-frame-padding;
    color: #fff;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    gap: 12px;
    line-height: 1.5;
    padding: 12px 24px;
    position: relative;

    &__credits {
      font-size: 12px;
      margin: 0;
      text-align: right;
    }

    &__description {
      margin: 0;
    }

    &__heading {
      margin: 0;
    }

    &__list {
      font-size: 14px;
      margin: 0;
      padding: 0 0 0 24px;
    }

    &__list-item {
      list-style-type: square;
    }

    &__overlay {
      align-items: center;
      background-color: rgba(0, 0, 0, 0.85);
      border-radius: $window-frame-border-radius - $window-frame-padding;
      bottom: 0;
      color: #dedede;
      display: flex;
      flex-direction: column;
      font-size: 24px;
      gap: 24px;
      justify-content: center;
      left: 0;
      opacity: 0;
      padding: 24px;
      pointer-events: none;
      position: absolute;
      right: 0;
      text-align: center;
      transition: opacity 0.3s ease-in-out;
      top: 0;
      z-index: 10;
    }

    &__overlay--visible {
      opacity: 1;
    }

    &__selected-game {
      color: #fff;
      font-family: 'Doto', sans-serif;
      font-size: 48px;
      font-weight: 600;
      margin: 0;
    }
  }
</style>
