<template>
  <div class="login panel panel-default">
    <!-- Default panel contents -->
    <div class="panel-heading">
      {{ $t('login.login') }}
    </div>
    <div class="panel-body">
      <form
        v-if="loginMethod == 'password'"
        class="login-form"
        @submit.prevent="submit(user)"
      >
        <div class="form-group">
          <label for="username">{{ $t('login.username') }}</label>
          <input
            id="username"
            v-model="user.username"
            :disabled="loggingIn"
            class="form-control"
            :placeholder="$t('login.placeholder')"
          >
        </div>
        <div class="form-group">
          <label for="password">{{ $t('login.password') }}</label>
          <input
            id="password"
            v-model="user.password"
            :disabled="loggingIn"
            class="form-control"
            type="password"
          >
        </div>
        <div class="form-group">
          <div class="login-bottom">
            <div>
              <router-link
                v-if="registrationOpen"
                :to="{name: 'registration'}"
                class="register"
              >
                {{ $t('login.register') }}
              </router-link>
            </div>
            <button
              :disabled="loggingIn"
              type="submit"
              class="btn btn-default"
            >
              {{ $t('login.login') }}
            </button>
          </div>
        </div>
      </form>

      <form
        v-if="loginMethod == 'token'"
        class="login-form"
        @submit.prevent="oAuthLogin"
      >
        <div class="form-group">
          <p>{{ $t('login.description') }}</p>
        </div>
        <div class="form-group">
          <div class="login-bottom">
            <div>
              <router-link
                v-if="registrationOpen"
                :to="{name: 'registration'}"
                class="register"
              >
                {{ $t('login.register') }}
              </router-link>
            </div>
            <button
              :disabled="loggingIn"
              type="submit"
              class="btn btn-default"
            >
              {{ $t('login.login') }}
            </button>
          </div>
        </div>
      </form>

      <div
        v-if="authError"
        class="form-group"
      >
        <div class="alert error">
          {{ authError }}
          <i
            class="button-icon icon-cancel"
            @click="clearError"
          />
        </div>
      </div>
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

.login {
  .error {
    text-align: center;

    animation-name: shakeError;
    animation-duration: 0.4s;
    animation-timing-function: ease-in-out;
  }
}
</style>
