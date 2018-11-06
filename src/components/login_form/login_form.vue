<template>
  <div class="login panel panel-default">
    <!-- Default panel contents -->
    <div class="panel-heading">
      {{$t('login.login')}}
    </div>
    <div class="panel-body">
      <form v-on:submit.prevent='oAuthLogin'  class="login-form">
        <div class='form-group'>
          <div class='login-bottom'>
            <div><router-link :to="{name: 'registration'}" v-if='registrationOpen' class='register'>{{$t('login.register')}}</router-link></div>
            <button :disabled="loggingIn" type='submit' class='btn btn-default'>{{$t('login.login')}}</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script src="./login_form.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.login-form {
  .btn {
    min-height: 28px;
    width: 10em;
  }

  .error {
    text-align: center;
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
}
</style>
