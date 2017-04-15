<template>
  <div class="login panel panel-default base00-background">
    <!-- Default panel contents -->
    <div class="panel-heading base01-background base04">
      Log in
    </div>
    <div class="panel-body">
      <form v-on:submit.prevent='submit(user)' class='login-form'>
        <div class='form-group'>
          <label for='username'>Username</label>
          <input :disabled="loggingIn" v-model='user.username' class='form-control' id='username' placeholder='e.g. lain'>
        </div>
        <div class='form-group'>
          <label for='password'>Password</label>
          <input :disabled="loggingIn" v-model='user.password' class='form-control' id='password' type='password'>
        </div>
        <div class='form-group'>
          <button :disabled="loggingIn" type='submit' class='btn btn-default base05 base01-background'>Submit</button>
        </div>
        <div v-if="authError" class='form-group'>
          <div class='error base05'>{{authError}}</div>
        </div>
        <div class='form-group'>
          <router-link :to="{name: 'registration'}">Register new account</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script src="./login_form.js" ></script>

<style lang="scss">

.login-form {
  input {
    border-width: 1px;
    border-style: solid;
    border-color: silver;
    border-radius: 5px;
    padding: 0.1em 0.2em 0.2em 0.2em;
  }

  .btn {
    margin-top: 1.0em;
    min-height: 28px;
  }

  .error {
    border-radius: 5px;
    text-align: center;
    background-color: rgba(255, 48, 16, 0.65);
    min-height: 28px;
    line-height: 28px;
  }
}

</style>
