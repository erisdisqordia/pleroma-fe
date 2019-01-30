<template>
  <div class="settings panel panel-default">
    <div class="panel-heading">
      {{$t('registration.registration')}}
    </div>
    <div class="panel-body">
      <form v-on:submit.prevent='submit(user)' class='registration-form'>
        <div class='container'>
          <div class='text-fields'>
            <div class='form-group' :class="{ 'form-group--error': $v.user.username.$error }">
              <label class='form--label' for='sign-up-username'>{{$t('login.username')}}</label>
              <input :disabled="isPending" v-model.trim='$v.user.username.$model' class='form-control' id='sign-up-username' placeholder='e.g. lain'>
            </div>
            <div class="form-error" v-if="$v.user.username.$dirty">
              <ul>
                <li v-if="!$v.user.username.required">
                  <span>{{$t('registration.validations.username_required')}}</span>
                </li>
              </ul>
            </div>

            <div class='form-group' :class="{ 'form-group--error': $v.user.fullname.$error }">
              <label class='form--label' for='sign-up-fullname'>{{$t('registration.fullname')}}</label>
              <input :disabled="isPending" v-model.trim='$v.user.fullname.$model' class='form-control' id='sign-up-fullname' placeholder='e.g. Lain Iwakura'>
            </div>
            <div class="form-error" v-if="$v.user.fullname.$dirty">
              <ul>
                <li v-if="!$v.user.fullname.required">
                  <span>{{$t('registration.validations.fullname_required')}}</span>
                </li>
              </ul>
            </div>

            <div class='form-group' :class="{ 'form-group--error': $v.user.email.$error }">
              <label class='form--label' for='email'>{{$t('registration.email')}}</label>
              <input :disabled="isPending" v-model='$v.user.email.$model' class='form-control' id='email' type="email">
            </div>
            <div class="form-error" v-if="$v.user.email.$dirty">
              <ul>
                <li v-if="!$v.user.email.required">
                  <span>{{$t('registration.validations.email_required')}}</span>
                </li>
              </ul>
            </div>

            <div class='form-group'>
              <label class='form--label' for='bio'>{{$t('registration.bio')}}</label>
              <input :disabled="isPending" v-model='user.bio' class='form-control' id='bio'>
            </div>

            <div class='form-group' :class="{ 'form-group--error': $v.user.password.$error }">
              <label class='form--label' for='sign-up-password'>{{$t('login.password')}}</label>
              <input :disabled="isPending" v-model='user.password' class='form-control' id='sign-up-password' type='password'>
            </div>
            <div class="form-error" v-if="$v.user.password.$dirty">
              <ul>
                <li v-if="!$v.user.password.required">
                  <span>{{$t('registration.validations.password_required')}}</span>
                </li>
              </ul>
            </div>

            <div class='form-group' :class="{ 'form-group--error': $v.user.confirm.$error }">
              <label class='form--label' for='sign-up-password-confirmation'>{{$t('registration.password_confirm')}}</label>
              <input :disabled="isPending" v-model='user.confirm' class='form-control' id='sign-up-password-confirmation' type='password'>
            </div>
            <div class="form-error" v-if="$v.user.confirm.$dirty">
              <ul>
                <li v-if="!$v.user.confirm.required">
                  <span>{{$t('registration.validations.password_confirmation_required')}}</span>
                </li>
                <li v-if="!$v.user.confirm.sameAsPassword">
                  <span>{{$t('registration.validations.password_confirmation_match')}}</span>
                </li>
              </ul>
            </div>

            <div class="form-group" id="captcha-group" v-if="captcha.type != 'none'">
              <label class='form--label' for='captcha-label'>{{$t('captcha')}}</label>

              <template v-if="captcha.type == 'kocaptcha'">
                <img v-bind:src="captcha.url" v-on:click="setCaptcha">

                <sub>{{$t('registration.new_captcha')}}</sub>

                <input :disabled="isPending"
                  v-model='captcha.solution'
                  class='form-control' id='captcha-answer' type='text' autocomplete="off">
              </template>
            </div>

            <div class='form-group' v-if='token' >
              <label for='token'>{{$t('registration.token')}}</label>
              <input disabled='true' v-model='token' class='form-control' id='token' type='text'>
            </div>
            <div class='form-group'>
              <button :disabled="isPending" type='submit' class='btn btn-default'>{{$t('general.submit')}}</button>
            </div>
          </div>

          <div class='terms-of-service' v-html="termsOfService">
          </div>
        </div>
        <div v-if="serverValidationErrors.length" class='form-group'>
          <div class='alert error'>
            <span v-for="error in serverValidationErrors">{{error}}</span>
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
