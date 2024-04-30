<template>
  <div class="no-viewer-note">
    Du arbeitest an etwas und möchtest es hier im Stream sehen?
    <br />
    Dann geh auf <span class="no-viewer-note__link">{{ baseUrl }}</span> und erstelle eine Notiz!
    <br />
    Für mehr Informationen gib <span class="no-viewer-note__command">!coworking</span> im Chat ein.
  </div>
</template>

<script lang="ts" setup>
const baseUrl = import.meta.env.VITE_DIGITAL_DOPPLER_BASE_URL;
</script>

<style lang="scss" scoped>
.no-viewer-note {
  background-color: rgba(0, 0, 0, .5);
  border-radius: 12px;
  color: #fff;
  font-size: 2rem;
  letter-spacing: 0.15px;
  line-height: 1.5;
  margin: auto 64px 64px 64px;
  padding: 32px 42px;

  &__command {
    font-style: italic;
    font-weight: 700;
  }

  &__link {
    font-weight: 700;
    text-decoration: underline;
  }
}
</style>
