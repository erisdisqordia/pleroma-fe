<template>
  <div class="poll-form" v-if="visible">
    <div class="poll-option" v-for="(option, index) in options" :key="index">
      <div class="input-container">
        <input
          class="poll-option-input"
          type="text"
          :placeholder="$t('polls.option')"
          :maxlength="maxLength"
          :id="`poll-${index}`"
          v-model="options[index]"
          @change="updatePollToParent"
          @keydown.enter.stop.prevent="nextOption(index)"
        >
      </div>
      <div class="icon-container" v-if="options.length > 2">
        <i class="icon-cancel" @click="deleteOption(index)"></i>
      </div>
    </div>
    <a
      v-if="options.length < maxOptions"
      class="add-option faint"
      @click="addOption"
    >
      <i class="icon-plus" />
      {{ $t("polls.add_option") }}
    </a>
    <div class="poll-type-expiry">
      <div class="poll-type" :title="$t('polls.type')">
        <label for="poll-type-selector" class="select">
          <select class="select" v-model="pollType" @change="updatePollToParent">
            <option value="single">{{$t('polls.single_choice')}}</option>
            <option value="multiple">{{$t('polls.multiple_choices')}}</option>
          </select>
          <i class="icon-down-open"/>
        </label>
      </div>
      <div class="poll-expiry" :title="$t('polls.expiry')">
        <input 
          type="number"
          class="expiry-amount hide-number-spinner"
          :min="minExpirationInCurrentUnit"
          :max="maxExpirationInCurrentUnit"
          v-model="expiryAmount"
          @change="expiryAmountChange"
        >
        <label class="expiry-unit select">
          <select 
            v-model="expiryUnit"
            @change="expiryAmountChange"
          >
            <option v-for="unit in expiryUnits" :value="unit">
              {{ $t(`time.${unit}_short`, ['']) }}
            </option>
          </select>
          <i class="icon-down-open"/>
        </label>
      </div>
    </div>
  </div>
</template>

<script src="./poll_form.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.poll-form {
  display: flex;
  flex-direction: column;
  padding: 0 0.5em 0.5em;

  .add-option {
    align-self: flex-start;
    padding-top: 0.25em;
    cursor: pointer;
  }

  .poll-option {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 0.25em;
  }

  .input-container {
    width: 100%;
    input {
      // Hack: dodge the floating X icon
      padding-right: 2.5em;
      width: 100%;
    }
  }

  .icon-container {
    // Hack: Move the icon over the input box
    width: 2em;
    margin-left: -2em;
    z-index: 1;
  }

  .poll-type-expiry {
    margin-top: 0.5em;
    display: flex;
    width: 100%;
  }

  .poll-type {
    margin-right: 0.75em;
    flex: 1 1 60%;
    .select {
      border: none;
      box-shadow: none;
      background-color: transparent;
    }
  }

  .poll-expiry {
    display: flex;

    .expiry-amount {
      width: 3em;
      text-align: right;
    }

    .expiry-unit {
      border: none;
      box-shadow: none;
      background-color: transparent;
    }
  }
}
</style>
