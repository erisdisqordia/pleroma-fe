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
        <h2>Filtering</h2>
        <p>All notices containing these words will be muted, one per line</p>
        <textarea id="muteWords" v-model="muteWordsString"></textarea>
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
            <li>
                <input type="checkbox" id="autoLoad" v-model="autoLoadLocal">
                <label for="autoLoad">Enable automatic loading when scrolled to the bottom</label>
            </li>
            <li>
                <input type="checkbox" id="hoverPreview" v-model="hoverPreviewLocal">
                <label for="hoverPreview">Enable reply-link preview on mouse hover</label>
            </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script src="./settings.js">
</script>

<style lang="scss">
 .setting-item {
   margin: 1em 1em 1.4em;
   textarea {
     width: 100%;
     height: 100px;
   }
 }
 .setting-list {
   list-style-type: none;
 }
</style>
