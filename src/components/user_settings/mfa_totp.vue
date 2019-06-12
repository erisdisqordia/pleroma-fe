<template>
<div>
  <div class="method-item">
    <strong>{{$t('settings.mfa.otp')}}</strong>
    <button class="btn btn-default" v-if="!isActivated" @click="doActivate">
      {{$t('general.enable')}}
    </button>

    <button class="btn btn-default" :disabled="deactivate" @click="doDeactivate"
            v-if="isActivated">
      {{$t('general.disable')}}
    </button>
  </div>

  <confirm @confirm="confirmDeactivate" @cancel="cancelDeactivate"
           :disabled="inProgress" v-if="deactivate">
    {{$t('settings.enter_current_password_to_confirm')}}:
    <input type="password" v-model="currentPassword">
  </confirm>
  <div class="alert error" v-if="error">{{error}}</div>
</div>
</template>
<script src="./mfa_totp.js"></script>
