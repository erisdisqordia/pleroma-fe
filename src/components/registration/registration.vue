<template>
  <div class="settings panel panel-default base00-background">
    <div class="panel-heading base01-background base04">
      Registration
    </div>
    <div class="panel-body">
      <form v-on:submit.prevent='submit(user)' class='registration-form'>
        <div class='container'>
          <div class='text-fields'>
            <div class='form-group'>
              <label for='username'>Username</label>
              <input :disabled="registering" v-model='user.username' class='form-control' id='username' placeholder='e.g. lain'>
            </div>
            <div class='form-group'>
              <label for='fullname'>Fullname</label>
              <input :disabled="registering" v-model='user.fullname' class='form-control' id='fullname' placeholder='e.g. Lain Iwakura'>
            </div>
            <div class='form-group'>
              <label for='email'>Email</label>
              <input :disabled="registering" v-model='user.email' class='form-control' id='email' type="email">
            </div>
            <div class='form-group'>
              <label for='bio'>Bio</label>
              <input :disabled="registering" v-model='user.bio' class='form-control' id='bio'>
            </div>
            <div class='form-group'>
              <label for='password'>Password</label>
              <input :disabled="registering" v-model='user.password' class='form-control' id='password' type='password'>
            </div>
            <div class='form-group'>
              <label for='password_confirmation'>Password confirmation</label>
              <input :disabled="registering" v-model='user.confirm' class='form-control' id='password_confirmation' type='password'>
            </div>
            <div class='form-group'>
              <button :disabled="registering" type='submit' class='btn btn-default base05 base01-background'>Submit</button>
            </div>
          </div>
          <div class='terms-of-service'>
            <h4>Terms of Service</h4>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
        <div v-if="error" class='form-group'>
          <div class='error base05'>{{error}}</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script src="./registration.js"></script>
<style lang="scss">

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
    flex: 0 1 55%;
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
    border: solid;
    border-width: 1px;
    border-color: silver;
    border-radius: 5px;
    line-height:16px;
    padding: 5px;
    resize: vertical;
  }

  input {
    border-width: 1px;
    border-style: solid;
    border-color: silver;
    border-radius: 5px;
    padding: 0.1em 0.2em 0.2em 0.2em;
  }

  .btn {
    //align-self: flex-start;
    //width: 10em;
    margin-top: 0.6em;
    height: 28px;
  }

  .error {
    border-radius: 5px;
    text-align: center;
    margin: 0.5em 0.6em 0;
    background-color: rgba(255, 48, 16, 0.65);
    min-height: 28px;
    line-height: 28px;
  }
}

@media all and (max-width: 959px) {
  .registration-form .container {
    flex-direction: column-reverse;
  }
}
</style>
