<template>
  <div class="settings panel panel-default base00-background">
    <div class="panel-heading base01-background base04">
      Registration
    </div>
    <div class="panel-body">
      <form v-on:submit.prevent='submit(user)' class='registration-form'>
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
     form {
         display: flex;
         flex-direction: column;
         padding: 0.6em;
     }

     .form-group {
         display: flex;
         flex-direction: column;
         padding: 0.3em 0.5em 0.6em;
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
