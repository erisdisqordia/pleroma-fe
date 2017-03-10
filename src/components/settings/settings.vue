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
        <ul class="setting-list">
            <li>
                <input type="checkbox" id="hideAttachments" v-model="hideAttachmentsLocal">
                <label for="hideAttachments">Hide attachments in timeline</label>
            </li>
            <li>
                <input type="checkbox" id="hideAttachmentsInConv" v-model="hideAttachmentsInConvLocal">
                <label for="hideAttachmentsInConv">Hide attachments in conversations</label>
            </li>
            <li>
                <input type="checkbox" id="hideNsfw" v-model="hideNsfwLocal">
                <label for="hideNsfw">Enable clickthrough NSFW attachment hiding</label>
            </li>
        </ul>
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
 .setting-list {
   list-style-type: none;
 }
</style>
