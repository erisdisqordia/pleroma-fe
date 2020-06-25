<template>
  <div
    v-if="readyInit && settings.available"
    class="setting-item mfa-settings"
  >
    <div class="mfa-heading">
      <h2>{{ $t('settings.mfa.title') }}</h2>
    </div>

    <div>
      <div
        v-if="!setupInProgress"
        class="setting-item"
      >
        <!-- Enabled methods -->
        <h3>{{ $t('settings.mfa.authentication_methods') }}</h3>
        <totp-item
          :settings="settings"
          @deactivate="fetchSettings"
          @activate="activateOTP"
        />
        <br>

        <div v-if="settings.enabled">
          <!-- backup codes block-->
          <recovery-codes
            v-if="!confirmNewBackupCodes"
            :backup-codes="backupCodes"
          />
          <button
            v-if="!confirmNewBackupCodes"
            class="btn btn-default"
            @click="getBackupCodes"
          >
            {{ $t('settings.mfa.generate_new_recovery_codes') }}
          </button>

          <div v-if="confirmNewBackupCodes">
            <confirm
              :disabled="backupCodes.inProgress"
              @confirm="confirmBackupCodes"
              @cancel="cancelBackupCodes"
            >
              <p class="warning">
                {{ $t('settings.mfa.warning_of_generate_new_codes') }}
              </p>
            </confirm>
          </div>
        </div>
      </div>

      <div v-if="setupInProgress">
        <!-- setup block-->

        <h3>{{ $t('settings.mfa.setup_otp') }}</h3>

        <recovery-codes
          v-if="!setupOTPInProgress"
          :backup-codes="backupCodes"
        />

        <button
          v-if="canSetupOTP"
          class="btn btn-default"
          @click="cancelSetup"
        >
          {{ $t('general.cancel') }}
        </button>

        <button
          v-if="canSetupOTP"
          class="btn btn-default"
          @click="setupOTP"
        >
          {{ $t('settings.mfa.setup_otp') }}
        </button>

        <template v-if="setupOTPInProgress">
          <i v-if="prepareOTP">{{ $t('settings.mfa.wait_pre_setup_otp') }}</i>

          <div v-if="confirmOTP">
            <div class="setup-otp">
              <div class="qr-code">
                <h4>{{ $t('settings.mfa.scan.title') }}</h4>
                <p>{{ $t('settings.mfa.scan.desc') }}</p>
                <qrcode
                  :value="otpSettings.provisioning_uri"
                  :options="{ width: 200 }"
                />
                <p>
                  {{ $t('settings.mfa.scan.secret_code') }}:
                  {{ otpSettings.key }}
                </p>
              </div>

              <div class="verify">
                <h4>{{ $t('general.verify') }}</h4>
                <p>{{ $t('settings.mfa.verify.desc') }}</p>
                <input
                  v-model="otpConfirmToken"
                  type="text"
                >

                <p>{{ $t('settings.enter_current_password_to_confirm') }}:</p>
                <input
                  v-model="currentPassword"
                  type="password"
                >
                <div class="confirm-otp-actions">
                  <button
                    class="btn btn-default"
                    @click="doConfirmOTP"
                  >
                    {{ $t('settings.mfa.confirm_and_enable') }}
                  </button>
                  <button
                    class="btn btn-default"
                    @click="cancelSetup"
                  >
                    {{ $t('general.cancel') }}
                  </button>
                </div>
                <div
                  v-if="error"
                  class="alert error"
                >
                  {{ error }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script src="./mfa.js"></script>
<style lang="scss">
@import '../../../../_variables.scss';
.mfa-settings {
  .mfa-heading, .method-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
  }

  .warning {
    color: $fallback--cOrange;
    color: var(--cOrange, $fallback--cOrange);
  }

  .setup-otp {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .qr-code {
      flex: 1;
      padding-right: 10px;
    }
    .verify { flex: 1; }
    .error { margin: 4px 0 0 0; }
    .confirm-otp-actions {
      button {
        width: 15em;
        margin-top: 5px;
      }

    }
  }
}
</style>
