<template>
  <Modal
    v-if="isLoggedIn && !resettingForm"
    :is-open="modalActivated"
    class="post-form-modal-view"
    @backdropClicked="closeModal"
  >
    <div class="post-form-modal-panel panel">
      <div class="panel-heading">
        {{ $t('post_status.new_status') }}
      </div>
      <PostStatusForm
        class="panel-body"
        v-bind="params"
        @posted="closeModal"
      />
    </div>
  </Modal>
</template>

<script src="./post_status_modal.js"></script>

<style lang="scss">
.modal-view.post-form-modal-view {
  align-items: flex-start;
  textarea {
    min-height: 80px;
  }
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
