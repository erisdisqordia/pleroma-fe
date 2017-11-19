<template>
  <div>
    <p>{{$t('settings.presets')}}</p>
    <select v-model="selected" class="style-switcher">
      <option v-for="style in availableStyles" :value="style">{{style[0]}}</option>
    </select>
    <p>{{$t('settings.theme_help')}}</p>
    <div class="color-container">
      <div class="color-item">
        <label for="bgcolor" class="base04">{{$t('settings.background')}}</label>
        <input id="bgcolor" class="theme-color-in" type="text" v-model="bgColorLocal">
      </div>
      <div class="color-item">
        <label for="fgcolor" class="base04">{{$t('settings.foreground')}}</label>
        <input id="fgcolor" class="theme-color-in" type="text" v-model="fgColorLocal">
      </div>
      <div class="color-item">
        <label for="textcolor" class="base04">{{$t('settings.text')}}</label>
        <input id="textcolor" class="theme-color-in" type="text" v-model="textColorLocal">
      </div>
      <div class="color-item">
        <label for="linkcolor" class="base04">{{$t('settings.links')}}</label>
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
    <button class="btn base02-background base04" @click="setCustomTheme">{{$t('general.apply')}}</button>
  </div>
</template>

<script src="./style_switcher.js"></script>

<style lang="scss">
 .style-switcher {
   margin-right: 1em;
 }

 .color-container {
   display: flex;
   flex-wrap: wrap;
 }

 .color-item {
   max-width: 9em;
   display:flex;
   flex-wrap:wrap;
 }

 .theme-color-in {
   max-width: 8em;
   border-radius: 2px;
   border: 0;
   padding: 5px;
   margin: 5px 0 5px 0;
 }

 .theme-preview-content {
   padding: 20px;
 }
</style>
