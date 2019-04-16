<template>
  <div>
    <button
      @click.prevent="subscribe"
      class="btn btn-default follow-card-follow-button"
      :disabled="inProgress"
      v-if="!user.subscribing"
    >
      Subscribe
    </button>
    <button
      @click.prevent="unsubscribe"
      class="btn btn-default follow-card-follow-button pressed"
      :disabled="inProgress"
      v-else
    >
      Subscribing!
    </button>
  </div>
</template>

<script src="./subscribe_button.js"></script>
