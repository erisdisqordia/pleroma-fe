<template>
  <div>
    <div class="method-item">
      <strong>{{ $t('settings.mfa.otp') }}</strong>
      <button
        v-if="!isActivated"
        class="btn btn-default"
        @click="doActivate"
      >
        {{ $t('general.enable') }}
      </button>

      <button
        v-if="isActivated"
        class="btn btn-default"
        :disabled="deactivate"
        @click="doDeactivate"
      >
        {{ $t('general.disable') }}
      </button>
    </div>

    <confirm
      v-if="deactivate"
      :disabled="inProgress"
      @confirm="confirmDeactivate"
      @cancel="cancelDeactivate"
    >
      {{ $t('settings.enter_current_password_to_confirm') }}:
      <input
        v-model="currentPassword"
        type="password"
      >
    </confirm>
    <div
      v-if="error"
      class="alert error"
    >
      {{ error }}
    </div>
  </div>
</template>
<script src="./mfa_totp.js"></script>
