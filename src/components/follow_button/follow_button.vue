<template>
  <button
    class="btn btn-default btn-block follow-button"
    :class="{ pressed: isPressed }"
    :disabled="inProgress"
    :title="$t(title)"
    @click="doClick"
  >
    {{ $t(label) }}
  </button>
</template>

<script src="./follow_button.js"></script>
