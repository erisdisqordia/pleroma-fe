<template>
  <button
    class="btn btn-default follow-button"
    :class="{ toggled: isPressed }"
    :disabled="inProgress"
    :title="title"
    @click="onClick"
  >
    {{ label }}
  </button>
</template>

<script src="./follow_button.js"></script>
