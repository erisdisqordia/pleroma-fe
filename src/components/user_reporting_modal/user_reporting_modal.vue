<template>
<div class="modal-view" @click="closeModal" v-if="isOpen">
  <div class="user-reporting-panel panel" @click.stop="">
    <div class="panel-heading">{{$t('user_reporting.title', [user.screen_name])}}</div>
    <div class="panel-body">
      <div class="user-reporting-panel-left">
        <div>
          <p>{{$t('user_reporting.add_comment_description')}}</p>
          <textarea
            v-model="comment"
            class="form-control"
            :placeholder="$t('user_reporting.additional_comments')"
            rows="1"
            @input="resize"
          />
        </div>
        <div v-if="!user.is_local">
          <p>{{$t('user_reporting.forward_description')}}</p>
          <Checkbox v-model="forward">{{$t('user_reporting.forward_to', [remoteInstance])}}</Checkbox>
        </div>
        <div>
          <button class="btn btn-default" @click="reportUser" :disabled="processing">{{$t('user_reporting.submit')}}</button>
          <div class="alert error" v-if="error">
            {{$t('user_reporting.generic_error')}}
          </div>
        </div>
      </div>
      <div class="user-reporting-panel-right">
        <div v-for="status in statuses" :key="status.id" class="status-fadein">
          <Status :inConversation="false" :focused="false" :statusoid="status" />
          <Checkbox :checked="isChecked(status.id)" @change="checked => toggleStatus(checked, status.id)" />
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script src="./user_reporting_modal.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.user-reporting-panel {
  width: 90vw;
  max-width: 700px;

  .panel-body {
    display: flex;
    border-top: 1px solid;
    border-color: $fallback--border;
    border-color: var(--border, $fallback--border);
  }

  &-left {
    width: 50%;
    padding: 1.1em;
    border-right: 1px solid;
    border-color: $fallback--border;
    border-color: var(--border, $fallback--border);
    max-width: 320px;
    line-height: 1.4em;
    box-sizing: border-box;

    > div {
      margin-bottom: 2em;

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
    }
  }

  &-right {
    width: 50%;
    flex: 1 1 auto;
    min-height: 20vh;
    max-height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;

    > div {
      display: flex;
      justify-content: space-between;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-color: $fallback--border;
      border-color: var(--border, $fallback--border);

      .checkbox {
        margin: 0.75em;
      }
    }
  }
}
</style>
