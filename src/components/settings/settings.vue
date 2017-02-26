<template>
  <div class="settings panel panel-default base00-background">
    <div class="panel-heading base01-background base04">
      Settings
    </div>
    <div class="panel-body">
      <div class="setting-item">
        <h2>Theme</h2>
        <style-switcher></style-switcher>
      </div>
      <div class="setting-item">
        <h2>Attachments</h2>
        <input type="checkbox" id="hideAttachments" v-model="hideAttachmentsLocal">
        <label for="hideAttachments">Hide Attachments</label>
        <input type="checkbox" id="hideNsfw" v-model="hideNsfwLocal">
        <label for="hideNsfw">Enable clickthrough NSFW attachment hiding</label>
      </div>
    </div>
  </div>
</template>

<script src="./settings.js">
</script>

<style>
 .setting-item {
   margin: 1em 1em 1.4em;
 }
</style>
