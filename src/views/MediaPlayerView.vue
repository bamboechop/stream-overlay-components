<template>
  <section class="media-player-view">
    <template v-if="theme === 'windows-95'">
      <Windows95Theme />
    </template>
    <template v-if="theme === 'modern'">
      <ModernTheme />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import ModernTheme from '@/components/media-player/modern/MediaPlayer.vue';
import Windows95Theme from '@/components/media-player/windows95/MediaPlayer.vue';
import { useTwitchStreamInfo } from '@/composables/twitch-stream-info.composable';
import { useSearchParamsComposable } from '@/composables/theme.composable';
import { useApplicationStore } from '@/stores/application.store';
import { useTwitchStore } from '@/stores/twitch.store';

const { theme, themePath } = useSearchParamsComposable();

useTwitchStreamInfo();

const applicationStore = useApplicationStore();
const { addActiveApplication, removeActiveApplication } = applicationStore;

const twitchStore = useTwitchStore();
const { category } = storeToRefs(twitchStore);

const iconPath = computed(() => {
  if (theme.value !== 'modern') {
    return `/programs/${themePath}/player.icon.png`;
  }

  switch (category.value) {
    case 'Bloons TD 6':
      return `/programs/${themePath}/bloons-td-6.icon.png`;
    case 'Brotato':
      return `/programs/${themePath}/brotato.icon.png`;
    case 'Cities: Skylines II':
      return `/programs/${themePath}/cities-skylines-ii.icon.png`;
    case 'Cult of the Lamb':
      return `/programs/${themePath}/cult-of-the-lamb.icon.png`;
    case 'Dorfromantik':
      return `/programs/${themePath}/dorfromantik.icon.png`;
    case 'Deep Rock Galactic: Survivor':
      return `/programs/${themePath}/drg-survivor.icon.png`;
    case 'Golf It!':
      return `/programs/${themePath}/golf-it.icon.png`;
    case 'Minecraft':
      return `/programs/${themePath}/minecraft.icon.png`;
    case 'Mini Metro':
      return `/programs/${themePath}/mini-metro.icon.png`;
    case 'Mini Motorways':
      return `/programs/${themePath}/mini-motorways.icon.png`;
    case 'Project Zomboid':
      return `/programs/${themePath}/project-zomboid.icon.png`;
    case 'Pokémon Trading Card Game Live':
      return `/programs/${themePath}/ptcgl.icon.png`;
    case 'shapez':
      return `/programs/${themePath}/shapez.icon.png`;
    case 'Stray':
      return `/programs/${themePath}/stray.icon.png`;
    case 'Trackmania':
      return `/programs/${themePath}/trackmania.icon.png`;
    case 'UNO':
      return `/programs/${themePath}/uno.icon.png`;
    case 'URBO: Dream One':
      return `/programs/${themePath}/urbo.icon.png`;
    case 'Just Chatting':
    case 'Media Player':
    default:
      return `/programs/${themePath}/player.icon.png`;
  }
});

onMounted(() => {
  window.addEventListener('beforeunload', () => {
    removeActiveApplication(category.value);
  });
});

watch(category, (newCategory, oldCategory) => {
  if (oldCategory) {
    removeActiveApplication(oldCategory);
  }
  if (oldCategory && newCategory !== oldCategory) {
    addActiveApplication({
      active: false,
      iconPath: iconPath.value,
      id: newCategory,
      text: newCategory,
    });
  }
}, {
  immediate: true,
});
</script>

<style lang="scss" scoped>
.media-player-view {
  height: 100vh;
  width: 100vw;
}
</style>
