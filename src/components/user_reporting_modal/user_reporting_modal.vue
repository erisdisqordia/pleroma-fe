<template>
  <Modal
    v-if="isOpen"
    @backdropClicked="closeModal"
  >
    <div class="user-reporting-panel panel">
      <div class="panel-heading">
        <div class="title">
          {{ $t('user_reporting.title', [user.screen_name]) }}
        </div>
      </div>
      <div class="panel-body">
        <div class="user-reporting-panel-left">
          <div>
            <p>{{ $t('user_reporting.add_comment_description') }}</p>
            <textarea
              v-model="comment"
              class="form-control"
              :placeholder="$t('user_reporting.additional_comments')"
              rows="1"
              @input="resize"
            />
          </div>
          <div v-if="!user.is_local">
            <p>{{ $t('user_reporting.forward_description') }}</p>
            <Checkbox v-model="forward">
              {{ $t('user_reporting.forward_to', [remoteInstance]) }}
            </Checkbox>
          </div>
          <div>
            <button
              class="btn btn-default"
              :disabled="processing"
              @click="reportUser"
            >
              {{ $t('user_reporting.submit') }}
            </button>
            <div
              v-if="error"
              class="alert error"
            >
              {{ $t('user_reporting.generic_error') }}
            </div>
          </div>
        </div>
        <div class="user-reporting-panel-right">
          <List :items="statuses">
            <template
              slot="item"
              slot-scope="{item}"
            >
              <div class="status-fadein user-reporting-panel-sitem">
                <Status
                  :in-conversation="false"
                  :focused="false"
                  :statusoid="item"
                />
                <Checkbox
                  :checked="isChecked(item.id)"
                  @change="checked => toggleStatus(checked, item.id)"
                />
              </div>
            </template>
          </List>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script src="./user_reporting_modal.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.user-reporting-panel {
  width: 90vw;
  max-width: 700px;
  min-height: 20vh;
  max-height: 80vh;

  .panel-heading {
    .title {
      text-align: center;
      // TODO: Consider making these as default of panel
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .panel-body {
    display: flex;
    flex-direction: column-reverse;
    border-top: 1px solid;
    border-color: $fallback--border;
    border-color: var(--border, $fallback--border);
    overflow: hidden;
  }

  &-left {
    padding: 1.1em 0.7em 0.7em;
    line-height: 1.4em;
    box-sizing: border-box;

    > div {
      margin-bottom: 1em;

      &:last-child {
        margin-bottom: 0;
      }
    }

    p {
      margin-top: 0;
    }

    textarea.form-control {
      line-height: 16px;
      resize: none;
      overflow: hidden;
      transition: min-height 200ms 100ms;
      min-height: 44px;
      width: 100%;
    }

    .btn {
      min-width: 10em;
      padding: 0 2em;
    }

    .alert {
      margin: 1em 0 0 0;
      line-height: 1.3em;
    }
  }

  &-right {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  &-sitem {
    display: flex;
    justify-content: space-between;

    /* TODO cleanup this */
    > .Status {
      flex: 1;
    }

    > .checkbox {
      margin: 0.75em;
    }
  }

  @media all and (min-width: 801px) {
    .panel-body {
      flex-direction: row;
    }

    &-left {
      width: 50%;
      max-width: 320px;
      border-right: 1px solid;
      border-color: $fallback--border;
      border-color: var(--border, $fallback--border);
      padding: 1.1em;

      > div {
        margin-bottom: 2em;
      }
    }

    &-right {
      width: 50%;
      flex: 1 1 auto;
      margin-bottom: 12px;
    }
  }
}
</style>
