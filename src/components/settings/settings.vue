<template>
  <div class="settings panel panel-default base00-background">
    <div class="panel-heading base02-background base04">
      {{$t('settings.settings')}}
    </div>
    <div class="panel-body">
      <div class="setting-item">
        <h2>{{$t('settings.theme')}}</h2>
        <style-switcher></style-switcher>
      </div>
      <div class="setting-item">
        <h3>Custom theme</h3>
        <p>Enter hex color codes (#aabbcc) into the text fields.</p>
        <div class="color-container">
          <div class="color-item">
            <label for="bgcolor" class="base04">Background</label>
            <input id="bgcolor" class="theme-color-in" type="text" v-model="bgColorLocal">
          </div>
          <div class="color-item">
            <label for="fgcolor" class="base04">Foreground</label>
            <input id="fgcolor" class="theme-color-in" type="text" v-model="fgColorLocal">
          </div>
          <div class="color-item">
            <label for="textcolor" class="base04">Text</label>
            <input id="textcolor" class="theme-color-in" type="text" v-model="textColorLocal">
          </div>
          <div class="color-item">
            <label for="linkcolor" class="base04">Links</label>
            <input id="linkcolor" class="theme-color-in" type="text" v-model="linkColorLocal">
          </div>
        </div>
        <div>
          <div class="panel">
            <div class="panel-heading" :style="{ 'background-color': fgColorLocal, 'color': textColorLocal }">Preview</div>
            <div class="panel-body theme-preview-content" :style="{ 'background-color': bgColorLocal, 'color': textColorLocal }">
              <h4>Content</h4>
              <br>
              A bunch of more content and
              <a :style="{ 'color': linkColorLocal }">a nice lil' link</a>
              <br>
              <button class="btn" :style="{ 'background-color': fgColorLocal, 'color': textColorLocal }">Button</button>
            </div>
          </div>
        </div>
        <button class="btn base02-background base04" @click="setCustomTheme">Submit</button>
      </div>
      <div class="setting-item">
        <h2>{{$t('settings.filtering')}}</h2>
        <p>{{$t('settings.filtering_explanation')}}</p>
        <textarea id="muteWords" v-model="muteWordsString"></textarea>
      </div>
      <div class="setting-item">
        <h2>{{$t('settings.attachments')}}</h2>
        <ul class="setting-list">
            <li>
                <input type="checkbox" id="hideAttachments" v-model="hideAttachmentsLocal">
                <label for="hideAttachments">{{$t('settings.hide_attachments_in_tl')}}</label>
            </li>
            <li>
                <input type="checkbox" id="hideAttachmentsInConv" v-model="hideAttachmentsInConvLocal">
                <label for="hideAttachmentsInConv">{{$t('settings.hide_attachments_in_convo')}}</label>
            </li>
            <li>
                <input type="checkbox" id="hideNsfw" v-model="hideNsfwLocal">
                <label for="hideNsfw">{{$t('settings.nsfw_clickthrough')}}</label>
            </li>
            <li>
                <input type="checkbox" id="autoLoad" v-model="autoLoadLocal">
                <label for="autoLoad">{{$t('settings.autoload')}}</label>
            </li>
            <li>
                <input type="checkbox" id="streaming" v-model="streamingLocal">
                <label for="streaming">{{$t('settings.streaming')}}</label>
            </li>
            <li>
                <input type="checkbox" id="hoverPreview" v-model="hoverPreviewLocal">
                <label for="hoverPreview">{{$t('settings.reply_link_preview')}}</label>
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

   .old-avatar {
     width: 128px;
     border-radius: 5px;
   }

   .new-avatar {
     object-fit: cover;
     width: 128px;
     height: 128px;
     border-radius: 5px;
   }

   .btn {
     margin-top: 1em;
     min-height: 28px;
     width: 10em;
   }
 }
 .setting-list {
   list-style-type: none;
 }

 .color-container {
   display: flex;
 }

 .color-item {
   max-width: 7em;
   display:flex;
   flex-wrap:wrap;
 }

 .theme-color-in {
   max-width: 6em;
   border-radius: 2px;
   border: 0;
   padding: 5px;
   margin: 5px 0 5px 0;
 }

 .theme-preview-content {
   padding: 20px;
 }
</style>
