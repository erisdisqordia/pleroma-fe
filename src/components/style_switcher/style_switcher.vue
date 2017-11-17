<template>
  <div>
    <select v-model="selected" class="style-switcher">
      <option v-for="style in availableStyles" :value="style">{{style[0]}}</option>
    </select>
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
</template>

<script src="./style_switcher.js"></script>

<style lang="scss">
 .style-switcher {
   margin-right: 1em;
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
