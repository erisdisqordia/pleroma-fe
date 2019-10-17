<template>
  <button
    class="btn btn-default follow-button"
    :class="{ pressed: isPressed }"
    :disabled="inProgress"
    :title="title"
    @click="onClick"
  >
    {{ label }}
  </button>
</template>

<script src="./follow_button.js"></script>
