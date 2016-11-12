<template>
  <div class="login panel panel-default">
    <!-- Default panel contents -->
    <div class="panel-heading">
      Log in
    </div>
    <div class="panel-body">
      <form v-on:submit.prevent='submit(user)'>
        <div class='form-group'>
          <label for='username'>Username</label>
          <input :disabled="loggingIn" v-model='user.username' class='form-control' id='username' placeholder='e.g. lain'>
        </div>
        <div class='form-group'>
          <label for='password'>Password</label>
          <input :disabled="loggingIn" v-model='user.password' class='form-control' id='password' type='password'>
        </div>
        <div class='form-group'>
          <button :disabled="loggingIn" type='submit' class='btn btn-default'>Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script src="./login_form.js" ></script>
