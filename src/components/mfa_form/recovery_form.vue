<template>
  <div class="login panel panel-default">
    <!-- Default panel contents -->

    <div class="panel-heading">
      {{ $t('login.heading.recovery') }}
    </div>

    <div class="panel-body">
      <form
        class="login-form"
        @submit.prevent="submit"
      >
        <div class="form-group">
          <label for="code">{{ $t('login.recovery_code') }}</label>
          <input
            id="code"
            v-model="code"
            class="form-control"
          >
        </div>

        <div class="form-group">
          <div class="login-bottom">
            <div>
              <a
                href="#"
                @click.prevent="requireTOTP"
              >
                {{ $t('login.enter_two_factor_code') }}
              </a>
              <br>
              <a
                href="#"
                @click.prevent="abortMFA"
              >
                {{ $t('general.cancel') }}
              </a>
            </div>
            <button
              type="submit"
              class="btn btn-default"
            >
              {{ $t('general.verify') }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <div
      v-if="error"
      class="form-group"
    >
      <div class="alert error">
        {{ error }}
        <FAIcon
          class="fa-scale-110 fa-old-padding"
          icon="times"
          @click="clearError"
        />
      </div>
    </div>
  </div>
</template>
<script src="./recovery_form.js" ></script>
