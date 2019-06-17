<template>
<div class="setting-item mfa-settings" v-if="readyInit && settings.available">

  <div class="mfa-heading">
    <h2>{{$t('settings.mfa.title')}}</h2>
  </div>

  <div>
    <div class="setting-item" v-if="!setupInProgress">
      <!-- Enabled methods -->
      <h3>{{$t('settings.mfa.authentication_methods')}}</h3>
      <totp-item :settings="settings" @deactivate="fetchSettings" @activate="activateOTP"/>
      <br />

      <div v-if="settings.enabled"> <!-- backup codes block-->
        <recovery-codes :backup-codes="backupCodes" v-if="!confirmNewBackupCodes" />
        <button class="btn btn-default" @click="getBackupCodes" v-if="!confirmNewBackupCodes">
          {{$t('settings.mfa.generate_new_recovery_codes')}}
        </button>

        <div v-if="confirmNewBackupCodes">
          <confirm @confirm="confirmBackupCodes" @cancel="cancelBackupCodes"
                   :disabled="backupCodes.inProgress">
            <p class="warning">{{$t('settings.mfa.warning_of_generate_new_codes')}}</p>
          </confirm>
        </div>
      </div>
    </div>

    <div v-if="setupInProgress"> <!-- setup block-->

      <h3>{{$t('settings.mfa.setup_otp')}}</h3>

      <recovery-codes :backup-codes="backupCodes" v-if="!setupOTPInProgress"/>


      <button class="btn btn-default" @click="cancelSetup" v-if="canSetupOTP">
        {{$t('general.cancel')}}
      </button>

      <button class="btn btn-default" v-if="canSetupOTP" @click="setupOTP">
        {{$t('settings.mfa.setup_otp')}}
      </button>

      <template v-if="setupOTPInProgress">
        <i v-if="prepareOTP">{{$t('settings.mfa.wait_pre_setup_otp')}}</i>

        <div v-if="confirmOTP">
          <div class="setup-otp">
            <div class="qr-code">
              <h4>{{$t('settings.mfa.scan.title')}}</h4>
              <p>{{$t('settings.mfa.scan.desc')}}</p>
              <qrcode :value="otpSettings.provisioning_uri" :options="{ width: 200 }"></qrcode>
              <p>
                {{$t('settings.mfa.scan.secret_code')}}:
                {{otpSettings.key}}
              </p>
            </div>

            <div class="verify">
              <h4>{{$t('general.verify')}}</h4>
              <p>{{$t('settings.mfa.verify.desc')}}</p>
              <input type="text" v-model="otpConfirmToken">

              <p>{{$t('settings.enter_current_password_to_confirm')}}:</p>
              <input type="password" v-model="currentPassword">
              <div class="confirm-otp-actions">
                <button class="btn btn-default" @click="doConfirmOTP">
                  {{$t('settings.mfa.confirm_and_enable')}}
                </button>
                <button class="btn btn-default" @click="cancelSetup">
                  {{$t('general.cancel')}}
                </button>
              </div>
              <div class="alert error" v-if="error">{{error}}</div>
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
@import '../../_variables.scss';
.warning {
  color: $fallback--cOrange;
  color: var(--cOrange, $fallback--cOrange);
}
.mfa-settings {
  .mfa-heading, .method-item {
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
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
