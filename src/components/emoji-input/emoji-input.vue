<template>
<div class="emoji-input">
  <slot></slot>
  <div ref="panel" class="autocomplete-panel" :class="{ hide: suggestions}">
    <div class="autocomplete-panel-body">
      <div
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click.stop.prevent="replace(suggestion.replacement)"
        class="autocomplete-item"
        :class="{ highlighted: suggestion.highlighted }"
        >
        <span v-if="suggestion.img">
          <img :src="suggestion.img" />
        </span>
        <span v-else>{{suggestion.replacement}}</span>
        <span>{{suggestion.displayText}}</span>
        <span>{{suggestion.detailText}}</span>
        </div>
    </div>
  </div>
</div>
</template>

<script src="./emoji-input.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.emoji-input {
  display: flex;
  flex-direction: column;

  &.hide {
    display: none
  }

  .autocomplete-panel {
    position: absolute;
    z-index: 9;
    margin-top: 2px;
  }

  input, textarea {
    flex: 1;
  }
}
</style>
