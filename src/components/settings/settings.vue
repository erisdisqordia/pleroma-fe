<template>
  <div class="settings panel panel-default">
    <div class="panel-heading">
      {{$t('settings.settings')}}
    </div>
    <div class="panel-body">
      <div class="setting-item">
        <h2>{{$t('settings.theme')}}</h2>
        <style-switcher></style-switcher>
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
                <input type="checkbox" id="autoload" v-model="autoloadlocal">
                <label for="autoload">{{$t('settings.autoload')}}</label>
            </li>
            <li>
                <input type="checkbox" id="streaming" v-model="streamingLocal">
                <label for="streaming">{{$t('settings.streaming')}}</label>
            </li>
            <li>
                <input type="checkbox" id="hoverPreview" v-model="hoverPreviewLocal">
                <label for="hoverPreview">{{$t('settings.reply_link_preview')}}</label>
            </li>
            <li>
                <input type="checkbox" id="stopGifs" v-model="stopGifs">
                <label for="stopGifs">{{$t('settings.stop_gifs')}}</label>
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
</style>
