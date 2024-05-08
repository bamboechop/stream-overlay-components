<template>
  <template v-if="theme === 'modern'">
    <ModernTheme :programs="programs" />
  </template>
  <template v-if="theme === 'windows-95'">
    <Windows95Theme :programs="programs" />
  </template>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import ModernTheme from '@/components/task-bar/modern/TaskBar.vue';
import Windows95Theme from '@/components/task-bar/windows95/TaskBar.vue';
import type { IProgram } from '@/components/task-bar/task-bar.interface';
import { useTwitchStore } from '@/stores/twitch.store';
import { useTwitchStreamInfo } from '@/composables/twitch-stream-info.composable';
import { useSearchParamsComposable } from '@/composables/theme.composable';

const { amountOfPrograms, theme } = useSearchParamsComposable();

const themePath = theme.value.replace('-', '');

const store = useTwitchStore();
const { category } = storeToRefs(store);

useTwitchStreamInfo();

const programs = computed<IProgram[]>(() => {
  let mediaPlayerIcon = `/programs/${themePath}/player.icon.png`;

  if (theme.value === 'modern') {
    switch (category.value) {
      case 'Bloons TD 6':
        mediaPlayerIcon = `/programs/${themePath}/bloons-td-6.icon.png`;
        break;
      case 'Brotato':
        mediaPlayerIcon = `/programs/${themePath}/brotato.icon.png`;
        break;
      case 'Cities: Skylines II':
        mediaPlayerIcon = `/programs/${themePath}/cities-skylines-ii.icon.png`;
        break;
      case 'Cult of the Lamb':
        mediaPlayerIcon = `/programs/${themePath}/cult-of-the-lamb.icon.png`;
        break;
      case 'Dorfromantik':
        mediaPlayerIcon = `/programs/${themePath}/dorfromantik.icon.png`;
        break;
      case 'Deep Rock Galactic: Survivor':
        mediaPlayerIcon = `/programs/${themePath}/drg-survivor.icon.png`;
        break;
      case 'Golf It!':
        mediaPlayerIcon = `/programs/${themePath}/golf-it.icon.png`;
        break;
      case 'Minecraft':
        mediaPlayerIcon = `/programs/${themePath}/minecraft.icon.png`;
        break;
      case 'Project Zomboid':
        mediaPlayerIcon = `/programs/${themePath}/project-zomboid.icon.png`;
        break;
      case 'Pokémon Trading Card Game Live':
        mediaPlayerIcon = `/programs/${themePath}/ptcgl.icon.png`;
        break;
      case 'shapez':
        mediaPlayerIcon = `/programs/${themePath}/shapez.icon.png`;
        break;
      case 'Stray':
        mediaPlayerIcon = `/programs/${themePath}/stray.icon.png`;
        break;
      case 'Trackmania':
        mediaPlayerIcon = `/programs/${themePath}/trackmania.icon.png`;
        break;
      case 'UNO':
        mediaPlayerIcon = `/programs/${themePath}/uno.icon.png`;
        break;
      case 'URBO: Dream One':
        mediaPlayerIcon = `/programs/${themePath}/urbo.icon.png`;
        break;
      case 'Just Chatting':
      case 'Media Player':
      default:
        mediaPlayerIcon = `/programs/${themePath}/player.icon.png`;
    }
  }

  return [
    {
      active: false,
      iconPath: mediaPlayerIcon,
      text: category.value,
    },
    {
      active: true,
      iconPath: `/programs/${themePath}/chat.icon.png`,
      text: 'Chat',
    },
    {
      active: false,
      iconPath: `/programs/${themePath}/pokemon-community-game.icon.png`,
      text: 'Pokémon Community Game',
    },
    {
      active: false,
      iconPath: `/programs/${themePath}/webcam.icon.png`,
      text: 'Webcam',
    },
  ].slice(0, amountOfPrograms);
});
</script>
