<template>
<div class="login panel panel-default">
  <!-- Default panel contents -->

  <div class="panel-heading">{{$t('login.login')}}</div>

  <div class="panel-body">
    <form class='login-form' @submit.prevent='submit'>
      <template v-if="isPasswordAuth">
        <div class='form-group'>
          <label for='username'>{{$t('login.username')}}</label>
          <input :disabled="loggingIn" v-model='user.username'
                 class='form-control' id='username'
                 :placeholder="$t('login.placeholder')">
        </div>
        <div class='form-group'>
          <label for='password'>{{$t('login.password')}}</label>
          <input :disabled="loggingIn" v-model='user.password'
                 ref='passwordInput' class='form-control' id='password' type='password'>
        </div>
      </template>

      <div class="form-group" v-if="isTokenAuth">
        <p>{{$t('login.description')}}</p>
      </div>

      <div class='form-group'>
        <div class='login-bottom'>
          <div>
            <router-link :to="{name: 'registration'}"
                         v-if='registrationOpen'
                         class='register'>
              {{$t('login.register')}}
            </router-link>
          </div>
          <button :disabled="loggingIn" type='submit' class='btn btn-default'>
            {{$t('login.login')}}
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

<script src="./login_form.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.login-form {
  display: flex;
  flex-direction: column;
  padding: 0.6em;

  .btn {
    min-height: 28px;
    width: 10em;
  }

  .register {
    flex: 1 1;
  }

  .login-bottom {
    margin-top: 1.0em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    padding: 0.3em 0.5em 0.6em;
    line-height:24px;
  }

  .form-bottom {
    display: flex;
    padding: 0.5em;
    height: 32px;

    button {
      width: 10em;
    }

    p {
      margin: 0.35em;
      padding: 0.35em;
      display: flex;
    }
  }

  .error {
    text-align: center;

    animation-name: shakeError;
    animation-duration: 0.4s;
    animation-timing-function: ease-in-out;
  }
}
</style>
