<template>
  <div
    v-if="visible"
    class="poll-form"
  >
    <div
      v-for="(option, index) in options"
      :key="index"
      class="poll-option"
    >
      <div class="input-container">
        <input
          :id="`poll-${index}`"
          v-model="options[index]"
          size="1"
          class="poll-option-input"
          type="text"
          :placeholder="$t('polls.option')"
          :maxlength="maxLength"
          @change="updatePollToParent"
          @keydown.enter.stop.prevent="nextOption(index)"
        >
      </div>
      <div
        v-if="options.length > 2"
        class="icon-container"
      >
        <FAIcon
          icon="times"
          class="delete"
          @click="deleteOption(index)"
        />
      </div>
    </div>
    <a
      v-if="options.length < maxOptions"
      class="add-option faint"
      @click="addOption"
    >
      <FAIcon
        icon="plus"
        size="sm"
      />

      {{ $t("polls.add_option") }}
    </a>
    <div class="poll-type-expiry">
      <div
        class="poll-type"
        :title="$t('polls.type')"
      >
        <label
          for="poll-type-selector"
          class="select"
        >
          <select
            v-model="pollType"
            class="select"
            @change="updatePollToParent"
          >
            <option value="single">{{ $t('polls.single_choice') }}</option>
            <option value="multiple">{{ $t('polls.multiple_choices') }}</option>
          </select>
          <FAIcon
            class="select-down-icon"
            icon="chevron-down"
          />
        </label>
      </div>
      <div
        class="poll-expiry"
        :title="$t('polls.expiry')"
      >
        <input
          v-model="expiryAmount"
          type="number"
          class="expiry-amount hide-number-spinner"
          :min="minExpirationInCurrentUnit"
          :max="maxExpirationInCurrentUnit"
          @change="expiryAmountChange"
        >
        <label class="expiry-unit select">
          <select
            v-model="expiryUnit"
            @change="expiryAmountChange"
          >
            <option
              v-for="unit in expiryUnits"
              :key="unit"
              :value="unit"
            >
              {{ $t(`time.${unit}_short`, ['']) }}
            </option>
          </select>
          <FAIcon
            class="select-down-icon"
            icon="chevron-down"
          />
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
    padding-left: 0.1em;
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
    width: 1.5em;
    margin-left: -1.5em;
    z-index: 1;

    .delete {
      cursor: pointer;

      &:hover {
        color: inherit;
      }
    }
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
