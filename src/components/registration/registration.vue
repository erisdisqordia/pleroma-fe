<template>
  <div class="settings panel panel-default">
    <div class="panel-heading">
      {{$t('registration.registration')}}
    </div>
    <div class="panel-body">
      <form v-on:submit.prevent='submit(user)' class='registration-form'>
        <div class='container'>
          <div class='text-fields'>
            <div class='form-group'>
              <label for='username'>{{$t('login.username')}}</label>
              <input :disabled="registering" v-model='user.username' class='form-control' id='username' placeholder='e.g. lain'>
            </div>
            <div class='form-group'>
              <label for='fullname'>{{$t('registration.fullname')}}</label>
              <input :disabled="registering" v-model='user.fullname' class='form-control' id='fullname' placeholder='e.g. Lain Iwakura'>
            </div>
            <div class='form-group'>
              <label for='email'>{{$t('registration.email')}}</label>
              <input :disabled="registering" v-model='user.email' class='form-control' id='email' type="email">
            </div>
            <div class='form-group'>
              <label for='bio'>{{$t('registration.bio')}}</label>
              <input :disabled="registering" v-model='user.bio' class='form-control' id='bio'>
            </div>
            <div class='form-group'>
              <label for='password'>{{$t('login.password')}}</label>
              <input :disabled="registering" v-model='user.password' class='form-control' id='password' type='password'>
            </div>
            <div class='form-group'>
              <label for='password_confirmation'>{{$t('registration.password_confirm')}}</label>
              <input :disabled="registering" v-model='user.confirm' class='form-control' id='password_confirmation' type='password'>
            </div>
            <!--
            <div class='form-group'>
              <label for='captcha'>Captcha</label>
              <img src='/qvittersimplesecurity/captcha.jpg' alt='captcha' class='captcha'>
              <input :disabled="registering" v-model='user.captcha' placeholder='Enter captcha' type='test' class='form-control' id='captcha'>
            </div>
            -->
            <div class='form-group' v-if='token' >
              <label for='token'>{{$t('registration.token')}}</label>
              <input disabled='true' v-model='token' class='form-control' id='token' type='text'>
            </div>
            <div class='form-group'>
              <button :disabled="registering" type='submit' class='btn btn-default'>{{$t('general.submit')}}</button>
            </div>
          </div>
          <div class='terms-of-service' v-html="termsofservice">
          </div>
        </div>
        <div v-if="error" class='form-group'>
          <div class='alert error'>{{error}}</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script src="./registration.js"></script>
<style lang="scss">
@import '../../_variables.scss';

.registration-form {
  display: flex;
  flex-direction: column;
  margin: 0.6em;

  .container {
    display: flex;
    flex-direction: row;
    //margin-bottom: 1em;
  }

  .terms-of-service {
    flex: 0 1 50%;
    margin: 0.8em;
  }

  .text-fields {
    margin-top: 0.6em;
    flex: 1 0;
    display: flex;
    flex-direction: column;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    padding: 0.3em 0.0em 0.3em;
    line-height:24px;
  }

  form textarea {
    line-height:16px;
    resize: vertical;
  }

  .captcha {
    max-width: 350px;
    margin-bottom: 0.4em;
  }

  .btn {
    //align-self: flex-start;
    //width: 10em;
    margin-top: 0.6em;
    height: 28px;
  }

  .error {
    text-align: center;
  }
}

@media all and (max-width: 959px) {
  .registration-form .container {
    flex-direction: column-reverse;
  }
}
</style>
