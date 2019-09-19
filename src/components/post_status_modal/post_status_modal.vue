<template>
  <div
    v-if="isOpen"
    class="post-form-modal-view modal-view"
    @click="closeModal"
  >
    <div
      class="post-form-modal-panel panel"
      @click.stop=""
    >
      <div class="panel-heading">
        {{ $t('post_status.new_status') }}
      </div>
      <PostStatusForm
        class="panel-body"
        @posted="closeModal"
      />
    </div>
  </div>
</template>

<script src="./post_status_modal.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.post-form-modal-view {
  align-items: flex-start;
}

.post-form-modal-panel {
  flex-shrink: 0;
  margin-top: 25%;
  margin-bottom: 2em;
  width: 100%;
  max-width: 700px;

  @media (orientation: landscape) {
    margin-top: 8%;
  }
}
</style>
