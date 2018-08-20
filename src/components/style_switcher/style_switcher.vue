<template>
  <div>
    <div>{{$t('settings.presets')}}
      <label for="style-switcher" class='select'>
        <select id="style-switcher" v-model="selected" class="style-switcher">
          <option v-for="style in availableStyles" :value="style" :style="{
                  backgroundColor: style[1],
                  color: style[3]
                  }">{{style[0]}}</option>
        </select>
        <i class="icon-down-open"/>
      </label>
    </div>
    <div>
      <button class="btn" @click="exportCurrentTheme">{{ $t('settings.export_theme') }}</button>
      <button class="btn" @click="importTheme">{{ $t('settings.import_theme') }}</button>
      <p v-if="invalidThemeImported" class="import-warning">{{ $t('settings.invalid_theme_imported') }}</p>
    </div>
    <div class="color-container">
      <p>{{$t('settings.theme_help')}}</p>
      <div class="color-item">
        <label for="bgcolor" class="theme-color-lb">{{$t('settings.background')}}</label>
        <input id="bgcolor" class="theme-color-cl" type="color" v-model="bgColorLocal">
        <input id="bgcolor-t" class="theme-color-in" type="text" v-model="bgColorLocal">
      </div>
      <div class="color-item">
        <label for="fgcolor" class="theme-color-lb">{{$t('settings.foreground')}}</label>
        <input id="fgcolor" class="theme-color-cl" type="color" v-model="btnColorLocal">
        <input id="fgcolor-t" class="theme-color-in" type="text" v-model="btnColorLocal">
      </div>
      <div class="color-item">
        <label for="textcolor" class="theme-color-lb">{{$t('settings.text')}}</label>
        <input id="textcolor" class="theme-color-cl" type="color" v-model="textColorLocal">
        <input id="textcolor-t" class="theme-color-in" type="text" v-model="textColorLocal">
      </div>
      <div class="color-item">
        <label for="linkcolor" class="theme-color-lb">{{$t('settings.links')}}</label>
        <input id="linkcolor" class="theme-color-cl" type="color" v-model="linkColorLocal">
        <input id="linkcolor-t" class="theme-color-in" type="text" v-model="linkColorLocal">
      </div>
      <div class="color-item">
        <label for="redcolor" class="theme-color-lb">{{$t('settings.cRed')}}</label>
        <input id="redcolor" class="theme-color-cl" type="color" v-model="redColorLocal">
        <input id="redcolor-t" class="theme-color-in" type="text" v-model="redColorLocal">
      </div>
      <div class="color-item">
        <label for="bluecolor" class="theme-color-lb">{{$t('settings.cBlue')}}</label>
        <input id="bluecolor" class="theme-color-cl" type="color" v-model="blueColorLocal">
        <input id="bluecolor-t" class="theme-color-in" type="text" v-model="blueColorLocal">
      </div>
      <div class="color-item">
        <label for="greencolor" class="theme-color-lb">{{$t('settings.cGreen')}}</label>
        <input id="greencolor" class="theme-color-cl" type="color" v-model="greenColorLocal">
        <input id="greencolor-t" class="theme-color-in" type="green" v-model="greenColorLocal">
      </div>
      <div class="color-item">
        <label for="orangecolor" class="theme-color-lb">{{$t('settings.cOrange')}}</label>
        <input id="orangecolor" class="theme-color-cl" type="color" v-model="orangeColorLocal">
        <input id="orangecolor-t" class="theme-color-in" type="text" v-model="orangeColorLocal">
      </div>
    </div>
    <div class="radius-container">
      <p>{{$t('settings.radii_help')}}</p>
      <div class="radius-item">
        <label for="btnradius" class="theme-radius-lb">{{$t('settings.btnRadius')}}</label>
        <input id="btnradius" class="theme-radius-rn" type="range" v-model="btnRadiusLocal" max="16">
        <input id="btnradius-t" class="theme-radius-in" type="text" v-model="btnRadiusLocal">
      </div>
      <div class="radius-item">
        <label for="inputradius" class="theme-radius-lb">{{$t('settings.inputRadius')}}</label>
        <input id="inputradius" class="theme-radius-rn" type="range" v-model="inputRadiusLocal" max="16">
        <input id="inputradius-t" class="theme-radius-in" type="text" v-model="inputRadiusLocal">
      </div>
      <div class="radius-item">
        <label for="panelradius" class="theme-radius-lb">{{$t('settings.panelRadius')}}</label>
        <input id="panelradius" class="theme-radius-rn" type="range" v-model="panelRadiusLocal" max="50">
        <input id="panelradius-t" class="theme-radius-in" type="text" v-model="panelRadiusLocal">
      </div>
      <div class="radius-item">
        <label for="avatarradius" class="theme-radius-lb">{{$t('settings.avatarRadius')}}</label>
        <input id="avatarradius" class="theme-radius-rn" type="range" v-model="avatarRadiusLocal" max="28">
        <input id="avatarradius-t" class="theme-radius-in" type="green" v-model="avatarRadiusLocal">
      </div>
      <div class="radius-item">
        <label for="avataraltradius" class="theme-radius-lb">{{$t('settings.avatarAltRadius')}}</label>
        <input id="avataraltradius" class="theme-radius-rn" type="range" v-model="avatarAltRadiusLocal" max="28">
        <input id="avataraltradius-t" class="theme-radius-in" type="text" v-model="avatarAltRadiusLocal">
      </div>
      <div class="radius-item">
        <label for="attachmentradius" class="theme-radius-lb">{{$t('settings.attachmentRadius')}}</label>
        <input id="attachmentrradius" class="theme-radius-rn" type="range" v-model="attachmentRadiusLocal" max="50">
        <input id="attachmentradius-t" class="theme-radius-in" type="text" v-model="attachmentRadiusLocal">
      </div>
      <div class="radius-item">
        <label for="tooltipradius" class="theme-radius-lb">{{$t('settings.tooltipRadius')}}</label>
        <input id="tooltipradius" class="theme-radius-rn" type="range" v-model="tooltipRadiusLocal" max="20">
        <input id="tooltipradius-t" class="theme-radius-in" type="text" v-model="tooltipRadiusLocal">
      </div>
    </div>
    <div :style="{
                 '--btnRadius': btnRadiusLocal + 'px',
                 '--inputRadius': inputRadiusLocal + 'px',
                 '--panelRadius': panelRadiusLocal + 'px',
                 '--avatarRadius': avatarRadiusLocal + 'px',
                 '--avatarAltRadius': avatarAltRadiusLocal + 'px',
                 '--tooltipRadius': tooltipRadiusLocal + 'px',
                 '--attachmentRadius': attachmentRadiusLocal + 'px'
                 }">
      <div class="panel dummy">
        <div class="panel-heading" :style="{ 'background-color': btnColorLocal, 'color': textColorLocal }">Preview</div>
        <div class="panel-body theme-preview-content" :style="{ 'background-color': bgColorLocal, 'color': textColorLocal }">
          <div class="avatar" :style="{
                                      'border-radius': avatarRadiusLocal + 'px'
                                      }">
            ( ͡° ͜ʖ ͡°)
          </div>
          <h4>Content</h4>
          <br>
          A bunch of more content and
          <a :style="{ color: linkColorLocal }">a nice lil' link</a>
          <i :style="{ color: blueColorLocal }" class="icon-reply"/>
          <i :style="{ color: greenColorLocal }" class="icon-retweet"/>
          <i :style="{ color: redColorLocal }" class="icon-cancel"/>
          <i :style="{ color: orangeColorLocal }" class="icon-star"/>
          <br>
          <button class="btn" :style="{ 'background-color': btnColorLocal, 'color': textColorLocal }">Button</button>
        </div>
      </div>
    </div>
    <button class="btn" @click="setCustomTheme">{{$t('general.apply')}}</button>
  </div>
</template>

<script src="./style_switcher.js"></script>

<style lang="scss">
@import '../../_variables.scss';
.style-switcher {
  margin-right: 1em;
}

.import-warning {
  color: $fallback--cRed;
  color: var(--cRed, $fallback--cRed);
}

.radius-container,
.color-container {
  display: flex;

  p {
    margin-top: 2em;
    margin-bottom: .5em;
  }
}
.radius-container {
  flex-direction: column;
}

.color-container {
  flex-wrap: wrap;
  justify-content: space-between;
}

.radius-item,
.color-item {
  min-width: 20em;
  display:flex;
  flex: 1 1 0;
  align-items: baseline;
  margin: 5px 6px 5px 0;

  label {
    color: var(--faint, $fallback--faint);
  }
}

.radius-item {
  flex-basis: auto;
}

.theme-radius-rn,
.theme-color-cl {
  border: 0;
  box-shadow: none;
  background: transparent;
  color: var(--faint, $fallback--faint);
  align-self: stretch;
}

.theme-color-cl,
.theme-radius-in,
.theme-color-in {
  margin-left: 4px;
}

.theme-color-in {
  min-width: 4em;
}

.theme-radius-in {
  min-width: 1em;
}

.theme-radius-in,
.theme-color-in {
  max-width: 7em;
  flex: 1;
}

.theme-radius-lb,
.theme-color-lb {
  flex: 2;
  min-width: 7em;
}

.theme-radius-lb{
  max-width: 50em;
}

.theme-color-lb {
  max-width: 10em;
}

.theme-color-cl {
  padding: 1px;
  max-width: 8em;
  height: 100%;
  flex: 0;
  min-width: 2em;
  cursor: pointer;
}

.theme-preview-content {
  padding: 20px;
}

.dummy {
  .avatar {
    background: linear-gradient(135deg, #b8e1fc 0%,#a9d2f3 10%,#90bae4 25%,#90bcea 37%,#90bff0 50%,#6ba8e5 51%,#a2daf5 83%,#bdf3fd 100%);
    color: black;
    text-align: center;
    height: 48px;
    line-height: 48px;
    width: 48px;
    float: left;
    margin-right: 1em;
  }
}
</style>
