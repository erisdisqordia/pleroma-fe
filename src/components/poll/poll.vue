<template>
  <div
    class="poll"
    :class="containerClass"
  >
    <div
      v-for="(option, index) in options"
      :key="index"
      class="poll-option"
    >
      <div
        v-if="showResults"
        :title="resultTitle(option)"
        class="option-result"
      >
        <div class="option-result-label">
          <span class="result-percentage">
            {{ percentageForOption(option.votes_count) }}%
          </span>
          <span v-html="option.title_html"></span>
        </div>
        <div
          class="result-fill"
          :style="{ 'width': `${percentageForOption(option.votes_count)}%` }"
        />
      </div>
      <div
        v-else
        @click="activateOption(index)"
      >
        <input
          v-if="poll.multiple"
          type="checkbox"
          :disabled="loading"
          :value="index"
        >
        <input
          v-else
          type="radio"
          :disabled="loading"
          :value="index"
        >
        <label class="option-vote">
          <div>{{ option.title }}</div>
        </label>
      </div>
    </div>
    <div class="footer faint">
      <button
        v-if="!showResults"
        class="btn btn-default poll-vote-button"
        type="button"
        :disabled="isDisabled"
        @click="vote"
      >
        {{ $t('polls.vote') }}
      </button>
      <div class="total">
        {{ totalVotesCount }} {{ $t("polls.votes") }}&nbsp;·&nbsp;
      </div>
      <i18n :path="expired ? 'polls.expired' : 'polls.expires_in'">
        <Timeago
          :time="expiresAt"
          :auto-update="60"
          :now-threshold="0"
        />
      </i18n>
    </div>
  </div>
</template>

<script src="./poll.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.poll {
  .votes {
    display: flex;
    flex-direction: column;
    margin: 0 0 0.5em;
  }
  .poll-option {
    margin: 0.75em 0.5em;
  }
  .option-result {
    height: 100%;
    display: flex;
    flex-direction: row;
    position: relative;
    color: $fallback--lightText;
    color: var(--lightText, $fallback--lightText);
  }
  .option-result-label {
    display: flex;
    align-items: center;
    padding: 0.1em 0.25em;
    z-index: 1;
  }
  .result-percentage {
    width: 3.5em;
    flex-shrink: 0;
  }
  .result-fill {
    height: 100%;
    position: absolute;
    color: $fallback--text;
    color: var(--pollText, $fallback--text);
    background-color: $fallback--lightBg;
    background-color: var(--poll, $fallback--lightBg);
    border-radius: $fallback--panelRadius;
    border-radius: var(--panelRadius, $fallback--panelRadius);
    top: 0;
    left: 0;
    transition: width 0.5s;
  }
  .option-vote {
    display: flex;
    align-items: center;
  }
  input {
    width: 3.5em;
  }
  .footer {
    display: flex;
    align-items: center;
  }
  &.loading * {
    cursor: progress;
  }
  .poll-vote-button {
    padding: 0 0.5em;
    margin-right: 0.5em;
  }
}
</style>
