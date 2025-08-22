<template>
  <div class="chat-messages">
    <StreamTogetherInfoBox />
    <ul
      ref="messagesList"
      class="chat-messages__list">
      <template
        v-for="(message, index) of messages"
        :key="message.id">
        <template v-if="message.msgType === 'action'">
          <ActionMessage
            :ref="(el) => messageRefs[messages.length - (index + 1)] = el as ComponentPublicInstance<typeof ActionMessage>"
            v-bind="message"
            :message-index="messages.length - (index + 1)"
            :message-offset="getMessageOffset(messages.length - (index + 1))"
            @images-loaded="calculateMessageHeights" />
        </template>
        <template v-if="message.msgType === 'chat'">
          <ChatMessage
            :ref="(el) => messageRefs[messages.length - (index + 1)] = el as ComponentPublicInstance<typeof ChatMessage>"
            v-bind="message"
            :message-index="messages.length - (index + 1)"
            :message-offset="getMessageOffset(messages.length - (index + 1))"
            @images-loaded="calculateMessageHeights" />
        </template>
        <template v-if="message.msgType === 'raid'">
          <RaidMessage
            :ref="(el) => messageRefs[messages.length - (index + 1)] = el as ComponentPublicInstance<typeof RaidMessage>"
            v-bind="message"
            :message-index="messages.length - (index + 1)"
            :message-offset="getMessageOffset(messages.length - (index + 1))"
            @images-loaded="calculateMessageHeights" />
        </template>
        <template v-if="message.msgType === 'resub'">
          <ResubMessage
            :ref="(el) => messageRefs[messages.length - (index + 1)] = el as ComponentPublicInstance<typeof ResubMessage>"
            v-bind="message"
            :message-index="messages.length - (index + 1)"
            :message-offset="getMessageOffset(messages.length - (index + 1))"
            @images-loaded="calculateMessageHeights" />
        </template>
        <template v-if="message.msgType === 'subgift'">
          <SubGiftMessage
            :ref="(el) => messageRefs[messages.length - (index + 1)] = el as ComponentPublicInstance<typeof SubGiftMessage>"
            v-bind="message"
            :message-index="messages.length - (index + 1)"
            :message-offset="getMessageOffset(messages.length - (index + 1))"
            @images-loaded="calculateMessageHeights" />
        </template>
        <template v-if="message.msgType === 'subscription'">
          <SubscriptionMessage
            :ref="(el) => messageRefs[messages.length - (index + 1)] = el as ComponentPublicInstance<typeof SubscriptionMessage>"
            v-bind="message"
            :message-index="messages.length - (index + 1)"
            :message-offset="getMessageOffset(messages.length - (index + 1))"
            @images-loaded="calculateMessageHeights" />
        </template>
      </template>
    </ul>
    <audio
      ref="chatNotificationAudio"
      style="display: none;"></audio>
    
    <!-- Debug Raid Buttons (remove in production) -->
    <div class="debug-raid-buttons">
      <h4>🚨 Debug Raid Notifications</h4>
      <div class="debug-buttons">
        <button @click="testRaidSound(1)" class="debug-btn tiny">1 viewer</button>
        <button @click="testRaidSound(3)" class="debug-btn tiny">3 viewers</button>
        <button @click="testRaidSound(5)" class="debug-btn small">5 viewers</button>
        <button @click="testRaidSound(10)" class="debug-btn small">10 viewers</button>
        <button @click="testRaidSound(20)" class="debug-btn medium">20 viewers</button>
        <button @click="testRaidSound(50)" class="debug-btn medium">50 viewers</button>
        <button @click="testRaidSound(100)" class="debug-btn large">100 viewers</button>
        <button @click="testRaidSound(200)" class="debug-btn large">200 viewers</button>
        <button @click="testRaidSound(500)" class="debug-btn large">500 viewers</button>
        <button @click="stopAllRaidSounds()" class="debug-btn stop">🛑 Stop All</button>
      </div>
      <div class="debug-info">
        <p>Playing: {{ isRaidSoundPlaying ? 'Yes' : 'No' }} | Active sounds: {{ raidAudioElements.length }}</p>
        <p>Spatial Audio: {{ ENABLE_SPATIAL_AUDIO ? 'Enabled' : 'Disabled' }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { type ComponentPublicInstance, nextTick, onMounted, ref, watch } from 'vue';
import { useMediaControls } from '@vueuse/core';
import StreamTogetherInfoBox from './StreamTogetherInfoBox.vue';
import { useTwitchStore } from '@/stores/twitch.store';
import ActionMessage from '@/components/chat/modern/messages/Action.vue';
import ChatMessage from '@/components/chat/modern/messages/Message.vue';
import RaidMessage from '@/components/chat/modern/messages/Raid.vue';
import ResubMessage from '@/components/chat/modern/messages/Resub.vue';
import SubGiftMessage from '@/components/chat/modern/messages/SubGift.vue';
import SubscriptionMessage from '@/components/chat/modern/messages/Subscription.vue';
import { broadcasterInfo } from '@/composables/twitch-chat.composable';
import { PRIMARY_BOT_ACCOUNT_USERNAME } from '@/common/constants/bot-accounts.constant';
import type { IChat, IRaid } from '@/common/interfaces/index.interface';

const store = useTwitchStore();
const { messages } = storeToRefs(store);

const messagesList = ref<HTMLElement>();
const messageRefs = ref<ComponentPublicInstance<typeof ActionMessage | typeof ChatMessage | typeof RaidMessage | typeof ResubMessage | typeof SubGiftMessage | typeof SubscriptionMessage>[]>([]);
const messageHeights = ref<number[]>([]);

const chatNotificationAudio = ref<HTMLAudioElement | null>(null);
const canPlayNotificationSound = ref(false);
const isSoundPlaying = ref(false);
let notificationCooldownTimeout: number | null = null;

const { currentTime, playing, volume } = useMediaControls(chatNotificationAudio, {
  src: '/audio/chat-notification.mp3',
});

// Raid notification system
const raidAudioElements = ref<HTMLAudioElement[]>([]);
const audioPool = ref<HTMLAudioElement[]>([]);
const isRaidSoundPlaying = ref(false);
const RAID_SOUND_DURATION = 1000;
const MAX_OVERLAP_PERCENT = 0.8;
const MAX_AUDIO_POOL_SIZE = 12; // Conservative limit for browser compatibility
const ENABLE_SPATIAL_AUDIO = false; // Set to true to enable stereo panning

function getMessageOffset(index: number): number {
  let offset = 0;

  for (let i = 0; i < index; i++) {
    offset += (messageHeights.value[i] || 0) + 8;
  }

  return offset;
}

async function calculateMessageHeights() {
  await nextTick();

  const newHeights: number[] = [];

  messageRefs.value.forEach((messageRef, index) => {
    if (!messageRef?.$el) {
      // can trigger when a message is deleted on Twitch
      newHeights[index] = 0;
      return;
    }
    newHeights[index] = messageRef.$el.getBoundingClientRect().height;
  });

  messageHeights.value = newHeights;
}

function shouldPlayNotificationSound(message: IChat) {
  return message.msgType === 'chat' && ![broadcasterInfo.name.toLowerCase(), PRIMARY_BOT_ACCOUNT_USERNAME.toLowerCase()].includes(message.userName?.toLowerCase() ?? '');
}

function calculateRaidSoundTimings(viewerCount: number) {
  // Play one sound for each viewer, no capping
  const maxSounds = viewerCount;
  let useFullCascade = true;
  
  if (viewerCount <= 3) {
    // Tiny raids: sequential play, no cascade
    useFullCascade = false;
  }
  
  const timings: { startTime: number; panPosition: number }[] = [];
  
  if (!useFullCascade) {
    // Sequential play for tiny raids
    for (let i = 0; i < maxSounds; i++) {
      timings.push({
        startTime: i * RAID_SOUND_DURATION,
        panPosition: (Math.random() - 0.5) * 2 // Random pan between -1 and 1
      });
    }
  } else {
    // Cascading play with intelligent overlap management
    let currentTime = 0;
    
    for (let i = 0; i < maxSounds; i++) {
      timings.push({
        startTime: currentTime,
        panPosition: (Math.random() - 0.5) * 2
      });
      
      if (i === 0) {
        // First sound plays completely
        currentTime += RAID_SOUND_DURATION;
      } else {
        // Smooth asymptotic curve that approaches max overlap gradually
        const TRANSITION_LENGTH = Math.min(15, Math.max(8, maxSounds * 0.3)); // Adaptive transition length
        
        // Dynamic ramp speed based on raid size
        let CURVE_STEEPNESS = 2.5; // Base steepness
        if (maxSounds > 50) {
          CURVE_STEEPNESS += 1.5; // +1.5 for raids > 50 viewers (total 4.0)
        } else if (maxSounds > 25) {
          CURVE_STEEPNESS += 0.8; // +0.8 for raids > 25 viewers (total 3.3)
        }
        
        // Smooth asymptotic approach to max overlap
        // Uses a modified exponential curve that approaches but never quite reaches MAX_OVERLAP_PERCENT
        const progressRatio = Math.min(i / TRANSITION_LENGTH, 1.0);
        const asymptoteApproach = 1 - Math.pow(1 - progressRatio, CURVE_STEEPNESS);
        const overlapPercent = asymptoteApproach * MAX_OVERLAP_PERCENT;
        
        // Next sound starts earlier based on calculated overlap
        const overlapTime = RAID_SOUND_DURATION * overlapPercent;
        currentTime += RAID_SOUND_DURATION - overlapTime;
      }
    }
  }
  
  return timings;
}

function initializeAudioPool() {
  // Create a limited pool of reusable audio elements
  audioPool.value = [];
  for (let i = 0; i < MAX_AUDIO_POOL_SIZE; i++) {
    const audio = new Audio('/audio/raid-notification.mp3');
    audio.volume = volume.value * 0.5;
    audio.preload = 'auto';
    audioPool.value.push(audio);
  }
}

function getAvailableAudioElement(): HTMLAudioElement | null {
  // Find an audio element that's not currently playing
  const availableAudio = audioPool.value.find(audio => 
    audio.paused || audio.ended || audio.currentTime === 0
  );
  
  if (availableAudio) {
    // Reset the audio element
    availableAudio.currentTime = 0;
    availableAudio.volume = volume.value * 0.5;
    return availableAudio;
  }
  
  return null; // No available audio elements
}

function playRaidAudioWithPanning(audio: HTMLAudioElement, panPosition: number) {
  // Only add spatial audio if enabled
  if (ENABLE_SPATIAL_AUDIO) {
    try {
      if (!(audio as any)._audioContext) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audio);
        const stereoPanner = audioContext.createStereoPanner();
        
        // Set stereo pan position (-1 = full left, 0 = center, +1 = full right)
        stereoPanner.pan.value = panPosition;
        
        source.connect(stereoPanner);
        stereoPanner.connect(audioContext.destination);
        
        // Store context to avoid recreating
        (audio as any)._audioContext = audioContext;
        (audio as any)._stereoPanner = stereoPanner;
      } else {
        // Update existing panner position
        (audio as any)._stereoPanner.pan.value = panPosition;
      }
    } catch (error) {
      // Fallback to basic audio without spatial positioning
      console.warn('Web Audio API not available, using basic audio:', error);
    }
  }
  
  return audio.play();
}

function playRaidNotificationSounds(viewerCount: number) {
  if (isRaidSoundPlaying.value) {
    return; // Don't overlap raid sequences
  }
  
  isRaidSoundPlaying.value = true;
  const timings = calculateRaidSoundTimings(viewerCount);
  
  console.log(`🚨 Playing ${timings.length} raid sounds with audio pool of ${MAX_AUDIO_POOL_SIZE} elements`);
  
  // Clear active tracking array
  raidAudioElements.value = [];
  
  let soundsPlayed = 0;
  let soundsSkipped = 0;
  
  // Schedule each sound
  timings.forEach((timing, index) => {
    setTimeout(() => {
      const audio = getAvailableAudioElement();
      
      if (audio) {
        soundsPlayed++;
        raidAudioElements.value.push(audio);
        
        // Set up cleanup when sound ends
        const cleanup = () => {
          const audioIndex = raidAudioElements.value.indexOf(audio);
          if (audioIndex > -1) {
            raidAudioElements.value.splice(audioIndex, 1);
          }
          
          // Remove this specific event listener
          audio.removeEventListener('ended', cleanup);
          audio.removeEventListener('pause', cleanup);
        };
        
        audio.addEventListener('ended', cleanup);
        audio.addEventListener('pause', cleanup);
        
        // Play with spatial positioning
        playRaidAudioWithPanning(audio, timing.panPosition).catch(error => {
          console.warn('Error playing raid notification sound:', error);
          cleanup(); // Clean up on error
        });
        
      } else {
        soundsSkipped++;
        console.warn(`Skipped raid sound ${index + 1}/${timings.length} - no available audio elements (${soundsSkipped} skipped so far)`);
      }
    }, timing.startTime);
  });
  
  // Fallback to reset playing flag after maximum possible duration
  const maxDuration = Math.max(...timings.map(t => t.startTime)) + RAID_SOUND_DURATION + 1000;
  setTimeout(() => {
    isRaidSoundPlaying.value = false;
    console.log(`🎵 Raid sequence complete: ${soundsPlayed} played, ${soundsSkipped} skipped`);
  }, maxDuration);
}

function testRaidSound(viewerCount: number) {
  console.log(`🚨 Testing raid notification with ${viewerCount} viewers`);
  playRaidNotificationSounds(viewerCount);
}

function stopAllRaidSounds() {
  console.log('🛑 Stopping all raid sounds');
  
  // Stop all audio elements in the pool
  audioPool.value.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
  
  // Clear active tracking
  raidAudioElements.value = [];
  
  // Reset playing flag
  isRaidSoundPlaying.value = false;
}

function playNotificationSound() {
  if (!canPlayNotificationSound.value || isSoundPlaying.value) {
    return;
  }

  isSoundPlaying.value = true;

  try {
    currentTime.value = 0;
    playing.value = true;

    canPlayNotificationSound.value = false;
    
    if (notificationCooldownTimeout) {
      clearTimeout(notificationCooldownTimeout);
    }
    
    notificationCooldownTimeout = setTimeout(() => {
      canPlayNotificationSound.value = true;
      isSoundPlaying.value = false;
    }, 10 * 1000);

  } catch (error) {
    console.warn('Error playing chat notification sound:', error);
    isSoundPlaying.value = false;
  }
}

watch(messages, () => {
  calculateMessageHeights();
 
  const latestMessage = messages.value.at(-1);
  if (latestMessage) {
    if (shouldPlayNotificationSound(latestMessage as IChat)) {
      playNotificationSound();
    }
    
    // Check for raid messages and play raid notification sounds
    if (latestMessage.msgType === 'raid') {
      const raidMessage = latestMessage as IRaid;
      const viewerCount = raidMessage.viewerCount || 1;
      playRaidNotificationSounds(viewerCount);
    }
  }
}, { deep: true });

onMounted(() => {
  calculateMessageHeights();
  volume.value = 0.25;
  
  // Initialize the audio pool for raid notifications
  initializeAudioPool();
 
  notificationCooldownTimeout = setTimeout(() => {
    canPlayNotificationSound.value = true;
  }, 10 * 1000);
});
</script>

<style lang="scss" scoped>
.chat-messages {
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  line-height: 1.5;
  overflow-anchor: auto;
  overflow: hidden;
  position: relative;
  width: 100%;

  &__list {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
  }
}

/* Debug Raid Buttons - Remove in production */
.debug-raid-buttons {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #ff6b6b;
  font-family: monospace;
  z-index: 9999;
  min-width: 300px;
  
  h4 {
    margin: 0 0 10px 0;
    color: #ff6b6b;
    font-size: 14px;
  }
}

.debug-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;
}

.debug-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s ease;
  
  &.tiny {
    background: #4CAF50;
    color: white;
    
    &:hover {
      background: #45a049;
    }
  }
  
  &.small {
    background: #2196F3;
    color: white;
    
    &:hover {
      background: #1976D2;
    }
  }
  
  &.medium {
    background: #FF9800;
    color: white;
    
    &:hover {
      background: #F57C00;
    }
  }
  
  &.large {
    background: #F44336;
    color: white;
    
    &:hover {
      background: #D32F2F;
    }
  }
  
  &.stop {
    background: #9C27B0;
    color: white;
    grid-column: 1 / -1;
    
    &:hover {
      background: #7B1FA2;
    }
  }
}

.debug-info {
  font-size: 11px;
  color: #ccc;
  border-top: 1px solid #333;
  padding-top: 8px;
  
  p {
    margin: 0;
  }
}
</style>
