<template>
  <div class="poll" v-bind:class="containerClass">
    <div
      class="poll-option"
      v-for="(option, index) in poll.options"
      :key="index"
    >
      <div v-if="showResults" :title="resultTitle(option)" class="option-result">
        <div class="option-result-label">
          <span class="result-percentage">
            {{percentageForOption(option.votes_count)}}%
          </span>
          <span>{{option.title}}</span>
        </div>
        <div
          class="result-fill"
          :style="{ 'width': `${percentageForOption(option.votes_count)}%` }"
        >     
        </div> 
      </div>
      <div v-else @click="activateOption(index)">
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
        <label>
          {{option.title}}
        </label>
      </div>
    </div>
    <div class="footer faint">
      <button
        v-if="!showResults"
        class="btn btn-default poll-vote-button"
        type="button"
        @click="vote"
        :disabled="isDisabled"
      >
        {{$t('polls.vote')}}
      </button>
      <div class="total">
        {{totalVotesCount}} {{ $t("polls.votes") }}&nbsp;·&nbsp;
      </div>
      <i18n :path="expired ? 'polls.expired' : 'polls.expires_in'">
        <Timeago :time="this.poll.expires_at" :auto-update="60" :now-threshold="0" />
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
    margin: 0.5em 0;
    height: 1.5em;
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
  }
  .result-fill {
    height: 100%;
    position: absolute;
    background-color: $fallback--lightBg;
    background-color: var(--linkBg, $fallback--lightBg);
    border-radius: $fallback--panelRadius;
    border-radius: var(--panelRadius, $fallback--panelRadius);
    top: 0;
    left: 0;
    transition: width 0.5s;
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
