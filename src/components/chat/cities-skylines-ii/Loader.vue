<template>
  <span class="loader"></span>
</template>

<style lang="scss" scoped>
$size: 48px;

.loader {
  animation: rotation 1s linear infinite;
  border: 3px solid;
  border-color: #e1f8ff #e1f8ff transparent transparent;
  border-radius: 50%;
  box-sizing: border-box;
  display: inline-block;
  height: $size;
  position: relative;
  width: $size;

  &::after,
  &::before {
    animation: rotationBack 0.5s linear infinite;
    border: 3px solid;
    border-color: transparent transparent #84e2ff #84e2ff;
    border-radius: 50%;
    bottom: 0;
    box-sizing: border-box;
    content: '';
    height: $size - 8px;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
    transform-origin: center center;
    width: $size - 8px;
  }

  &::before {
    animation: rotation 1.5s linear infinite;
    border-color: #12c8ff #12c8ff transparent transparent;
    height: $size - 16px;
    width: $size - 16px;
  }
}

@keyframes rotation {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
}

@keyframes rotationBack {
  0% { transform: rotate(0deg) }
  100% { transform: rotate(-360deg) }
}
</style>
