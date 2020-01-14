<template>
  <div class="settings panel panel-default">
    <div class="panel-heading">
      {{ $t('registration.registration') }}
    </div>
    <div class="panel-body">
      <form
        class="registration-form"
        @submit.prevent="submit(user)"
      >
        <div class="container">
          <div class="text-fields">
            <div
              class="form-group"
              :class="{ 'form-group--error': $v.user.username.$error }"
            >
              <label
                class="form--label"
                for="sign-up-username"
              >{{ $t('login.username') }}</label>
              <input
                id="sign-up-username"
                v-model.trim="$v.user.username.$model"
                :disabled="isPending"
                class="form-control"
                :placeholder="$t('registration.username_placeholder')"
              >
            </div>
            <div
              v-if="$v.user.username.$dirty"
              class="form-error"
            >
              <ul>
                <li v-if="!$v.user.username.required">
                  <span>{{ $t('registration.validations.username_required') }}</span>
                </li>
              </ul>
            </div>

            <div
              class="form-group"
              :class="{ 'form-group--error': $v.user.fullname.$error }"
            >
              <label
                class="form--label"
                for="sign-up-fullname"
              >{{ $t('registration.fullname') }}</label>
              <input
                id="sign-up-fullname"
                v-model.trim="$v.user.fullname.$model"
                :disabled="isPending"
                class="form-control"
                :placeholder="$t('registration.fullname_placeholder')"
              >
            </div>
            <div
              v-if="$v.user.fullname.$dirty"
              class="form-error"
            >
              <ul>
                <li v-if="!$v.user.fullname.required">
                  <span>{{ $t('registration.validations.fullname_required') }}</span>
                </li>
              </ul>
            </div>

            <div
              class="form-group"
              :class="{ 'form-group--error': $v.user.email.$error }"
            >
              <label
                class="form--label"
                for="email"
              >{{ $t('registration.email') }}</label>
              <input
                id="email"
                v-model="$v.user.email.$model"
                :disabled="isPending"
                class="form-control"
                type="email"
              >
            </div>
            <div
              v-if="$v.user.email.$dirty"
              class="form-error"
            >
              <ul>
                <li v-if="!$v.user.email.required">
                  <span>{{ $t('registration.validations.email_required') }}</span>
                </li>
              </ul>
            </div>

            <div class="form-group">
              <label
                class="form--label"
                for="bio"
              >{{ $t('registration.bio') }} ({{ $t('general.optional') }})</label>
              <textarea
                id="bio"
                v-model="user.bio"
                :disabled="isPending"
                class="form-control"
                :placeholder="bioPlaceholder"
              />
            </div>

            <div
              class="form-group"
              :class="{ 'form-group--error': $v.user.password.$error }"
            >
              <label
                class="form--label"
                for="sign-up-password"
              >{{ $t('login.password') }}</label>
              <input
                id="sign-up-password"
                v-model="user.password"
                :disabled="isPending"
                class="form-control"
                type="password"
              >
            </div>
            <div
              v-if="$v.user.password.$dirty"
              class="form-error"
            >
              <ul>
                <li v-if="!$v.user.password.required">
                  <span>{{ $t('registration.validations.password_required') }}</span>
                </li>
              </ul>
            </div>

            <div
              class="form-group"
              :class="{ 'form-group--error': $v.user.confirm.$error }"
            >
              <label
                class="form--label"
                for="sign-up-password-confirmation"
              >{{ $t('registration.password_confirm') }}</label>
              <input
                id="sign-up-password-confirmation"
                v-model="user.confirm"
                :disabled="isPending"
                class="form-control"
                type="password"
              >
            </div>
            <div
              v-if="$v.user.confirm.$dirty"
              class="form-error"
            >
              <ul>
                <li v-if="!$v.user.confirm.required">
                  <span>{{ $t('registration.validations.password_confirmation_required') }}</span>
                </li>
                <li v-if="!$v.user.confirm.sameAsPassword">
                  <span>{{ $t('registration.validations.password_confirmation_match') }}</span>
                </li>
              </ul>
            </div>

            <div
              v-if="captcha.type != 'none'"
              id="captcha-group"
              class="form-group"
            >
              <label
                class="form--label"
                for="captcha-label"
              >{{ $t('registration.captcha') }}</label>

              <template v-if="['kocaptcha', 'native'].includes(captcha.type)">
                <img
                  :src="captcha.url"
                  @click="setCaptcha"
                >

                <sub>{{ $t('registration.new_captcha') }}</sub>

                <input
                  id="captcha-answer"
                  v-model="captcha.solution"
                  :disabled="isPending"
                  class="form-control"
                  type="text"
                  autocomplete="off"
                >
              </template>
            </div>

            <div
              v-if="token"
              class="form-group"
            >
              <label for="token">{{ $t('registration.token') }}</label>
              <input
                id="token"
                v-model="token"
                disabled="true"
                class="form-control"
                type="text"
              >
            </div>
            <div class="form-group">
              <button
                :disabled="isPending"
                type="submit"
                class="btn btn-default"
              >
                {{ $t('general.submit') }}
              </button>
            </div>
          </div>

          <!-- eslint-disable vue/no-v-html -->
          <div
            class="terms-of-service"
            v-html="termsOfService"
          />
          <!-- eslint-enable vue/no-v-html -->
        </div>
        <div
          v-if="serverValidationErrors.length"
          class="form-group"
        >
          <div class="alert error">
            <span
              v-for="error in serverValidationErrors"
              :key="error"
            >{{ error }}</span>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script src="./registration.js"></script>
<style lang="scss">
@import '../../_variables.scss';
$validations-cRed: #f04124;

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

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    padding: 0.3em 0.0em 0.3em;
    line-height:24px;
    margin-bottom: 1em;
  }

  .form-group--error {
    animation-name: shakeError;
    animation-duration: .6s;
    animation-timing-function: ease-in-out;
  }

  .form-group--error .form--label {
    color: $validations-cRed;
    color: var(--cRed, $validations-cRed);
  }

  .form-error {
    margin-top: -0.7em;
    text-align: left;

    span {
      font-size: 12px;
    }
  }

  .form-error ul {
    list-style: none;
    padding: 0 0 0 5px;
    margin-top: 0;

    li::before {
      content: "• ";
    }
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
    margin-top: 0.6em;
    height: 28px;
  }

  .error {
    text-align: center;
  }
}

@media all and (max-width: 800px) {
  .registration-form .container {
    flex-direction: column-reverse;
  }
}
</style>
