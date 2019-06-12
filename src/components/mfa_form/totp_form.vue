<template>
<div class="login panel panel-default">
  <!-- Default panel contents -->

  <div class="panel-heading">
    {{$t('login.heading.totp')}}
  </div>

  <div class="panel-body">
    <form class='login-form' @submit.prevent='submit'>
      <div class='form-group'>
        <label for='code'>
          {{$t('login.authentication_code')}}
        </label>
        <input v-model='code' class='form-control' id='code'>
      </div>

      <div class='form-group'>
        <div class='login-bottom'>
          <div>
            <a href="#" @click.prevent="requireRecovery">
              {{$t('login.enter_recovery_code')}}
            </a>
            <br />
            <a href="#" @click.prevent="abortMFA">
              {{$t('general.cancel')}}
            </a>
          </div>
          <button type='submit' class='btn btn-default'>
            {{$t('general.verify')}}
          </button>
        </div>
      </div>
    </form>
  </div>

  <div v-if="error" class='form-group'>
    <div class='alert error'>
      {{error}}
      <i class="button-icon icon-cancel" @click="clearError"></i>
    </div>
  </div>
</div>
</template>
<script src="./totp_form.js"></script>
