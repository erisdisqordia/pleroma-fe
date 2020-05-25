<template>
  <div :label="$t('settings.security_tab')">
    <div class="setting-item">
      <h2>{{ $t('settings.change_email') }}</h2>
      <div>
        <p>{{ $t('settings.new_email') }}</p>
        <input
          v-model="newEmail"
          type="email"
          autocomplete="email"
        >
      </div>
      <div>
        <p>{{ $t('settings.current_password') }}</p>
        <input
          v-model="changeEmailPassword"
          type="password"
          autocomplete="current-password"
        >
      </div>
      <button
        class="btn btn-default"
        @click="changeEmail"
      >
        {{ $t('general.submit') }}
      </button>
      <p v-if="changedEmail">
        {{ $t('settings.changed_email') }}
      </p>
      <template v-if="changeEmailError !== false">
        <p>{{ $t('settings.change_email_error') }}</p>
        <p>{{ changeEmailError }}</p>
      </template>
    </div>

    <div class="setting-item">
      <h2>{{ $t('settings.change_password') }}</h2>
      <div>
        <p>{{ $t('settings.current_password') }}</p>
        <input
          v-model="changePasswordInputs[0]"
          type="password"
        >
      </div>
      <div>
        <p>{{ $t('settings.new_password') }}</p>
        <input
          v-model="changePasswordInputs[1]"
          type="password"
        >
      </div>
      <div>
        <p>{{ $t('settings.confirm_new_password') }}</p>
        <input
          v-model="changePasswordInputs[2]"
          type="password"
        >
      </div>
      <button
        class="btn btn-default"
        @click="changePassword"
      >
        {{ $t('general.submit') }}
      </button>
      <p v-if="changedPassword">
        {{ $t('settings.changed_password') }}
      </p>
      <p v-else-if="changePasswordError !== false">
        {{ $t('settings.change_password_error') }}
      </p>
      <p v-if="changePasswordError">
        {{ changePasswordError }}
      </p>
    </div>

    <div class="setting-item">
      <h2>{{ $t('settings.oauth_tokens') }}</h2>
      <table class="oauth-tokens">
        <thead>
          <tr>
            <th>{{ $t('settings.app_name') }}</th>
            <th>{{ $t('settings.valid_until') }}</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="oauthToken in oauthTokens"
            :key="oauthToken.id"
          >
            <td>{{ oauthToken.appName }}</td>
            <td>{{ oauthToken.validUntil }}</td>
            <td class="actions">
              <button
                class="btn btn-default"
                @click="revokeToken(oauthToken.id)"
              >
                {{ $t('settings.revoke_token') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <mfa />
    <div class="setting-item">
      <h2>{{ $t('settings.delete_account') }}</h2>
      <p v-if="!deletingAccount">
        {{ $t('settings.delete_account_description') }}
      </p>
      <div v-if="deletingAccount">
        <p>{{ $t('settings.delete_account_instructions') }}</p>
        <p>{{ $t('login.password') }}</p>
        <input
          v-model="deleteAccountConfirmPasswordInput"
          type="password"
        >
        <button
          class="btn btn-default"
          @click="deleteAccount"
        >
          {{ $t('settings.delete_account') }}
        </button>
      </div>
      <p v-if="deleteAccountError !== false">
        {{ $t('settings.delete_account_error') }}
      </p>
      <p v-if="deleteAccountError">
        {{ deleteAccountError }}
      </p>
      <button
        v-if="!deletingAccount"
        class="btn btn-default"
        @click="confirmDelete"
      >
        {{ $t('general.submit') }}
      </button>
    </div>
  </div>
</template>

<script src="./security_tab.js"></script>
<!-- <style lang="scss" src="./profile.scss"></style> -->
