<template>
<div>
  <div class="presets-container">
    <div>
      {{$t('settings.presets')}}
      <label for="style-switcher" class='select'>
        <select id="style-switcher" v-model="selected" class="style-switcher">
          <option v-for="style in availableStyles"
                  :value="style"
                  :style="{
                          backgroundColor: style[1],
                          color: style[3]
                          }">
            {{style[0]}}
          </option>
        </select>
        <i class="icon-down-open"/>
      </label>
    </div>
    <div class="import-export">
      <button class="btn" @click="exportCurrentTheme">{{ $t('settings.export_theme') }}</button>
      <button class="btn" @click="importTheme">{{ $t('settings.import_theme') }}</button>
      <p v-if="invalidThemeImported" class="import-warning">{{ $t('settings.invalid_theme_imported') }}</p>
    </div>
  </div>

  <div class="preview-container" :style="previewRules">
    <div class="panel dummy">
      <div class="panel-heading">Preview</div>
      <div class="panel-body theme-preview-content">
        <div class="avatar">
          ( ͡° ͜ʖ ͡°)
        </div>
        <h4>Content</h4>
        <br>
        A bunch of more content and
        <a style="color: var(--link)">a nice lil' link</a>
        <i style="color: var(--cBlue)" class="icon-reply"/>
        <i style="color: var(--cGreen)" class="icon-retweet"/>
        <i style="color: var(--cRed)" class="icon-cancel"/>
        <i style="color: var(--cOrange)" class="icon-star"/>
        <br>
        <button class="btn">Button</button>
      </div>
    </div>
  </div>

  <div class="color-container">
    <p>{{$t('settings.theme_help')}}</p>
    <h3>Basic colors!!</h3>
    <div>
      <div class="color-item">
        <ColorInput name="bgColor" v-model="bgColorLocal" :label="$t('settings.background')"/>
        <OpacityInput name="bgOpacity" v-model="bgOpacityLocal" :fallback="previewTheme.opacity.bg || 1"/>
        <ColorInput name="textColor" v-model="textColorLocal" :label="$t('settings.text')"/>
        <ContrastRatio :contrast="previewContrast.bgText"/>
        <ColorInput name="linkColor" v-model="linkColorLocal" :label="$t('settings.links')"/>
        <ContrastRatio :contrast="previewContrast.bgLink"/>
      </div>
      <div class="color-item">
        <ColorInput name="fgColor" v-model="fgColorLocal" :label="$t('settings.foreground')"/>
        <ColorInput name="fgTextColor" v-model="fgTextColorLocal" :label="$t('settings.text')" :fallback="previewTheme.colors.fgText"/>
        <ColorInput name="fgLinkColor" v-model="fgLinkColorLocal" :label="$t('settings.links')" :fallback="previewTheme.colors.fgLink"/>
      </div>
      <div class="color-item">
        <ColorInput name="cRedColor" v-model="cRedColorLocal" :label="$t('settings.cRed')"/>
        <ColorInput name="cBlueColor" v-model="cBlueColorLocal" :label="$t('settings.cBlue')"/>
      </div>
      <div class="color-item">
        <ColorInput name="cGreenColor" v-model="cGreenColorLocal" :label="$t('settings.cGreen')"/>
        <ColorInput name="cOrangeColor" v-model="cOrangeColorLocal" :label="$t('settings.cOrange')"/>
      </div>
      <div class="color-item wide">
        <h4>Alert opacity</h4>
        <OpacityInput name="alertOpacity" v-model="alertOpacityLocal" fallback="previewTheme.opacity.alert || 1"/>
      </div>
    </div>

    <h3>More customs!</h3>
    <div>
      <div class="color-item">
        <h4>Panel header</h4>
        <ColorInput name="panelColor" v-model="panelColorLocal" :fallback="fgColorLocal" :label="$t('settings.background')"/>
        <OpacityInput name="panelOpacity" v-model="panelOpacityLocal" :fallback="previewTheme.opacity.panel || 1"/>
        <ColorInput name="panelTextColor" v-model="panelTextColorLocal" :fallback="previewTheme.colors.panelText" :label="$t('settings.links')"/>
        <ContrastRatio :contrast="previewContrast.panelText" large="1"/>
        <ColorInput name="panelFaintColor" v-model="panelFaintColorLocal" :fallback="previewTheme.colors.panelFaint" :label="$t('settings.faint')"/>
      </div>
      <div class="color-item">
        <h4>Top bar</h4>
        <ColorInput name="topBarColor" v-model="topBarColorLocal" :fallback="fgColorLocal" :label="$t('settings.background')"/>
        <ColorInput name="topBarTextColor" v-model="topBarTextColorLocal" :fallback="previewTheme.colors.topBarText" :label="$t('settings.text')"/>
        <ContrastRatio :contrast="previewContrast.topBarText"/>
        <ColorInput name="topBarLinkColor" v-model="topBarLinkColorLocal" :fallback="previewTheme.colors.topBarLink" :label="$t('settings.links')"/>
        <ContrastRatio :contrast="previewContrast.topBarLink"/>
      </div>
      <div class="color-item">
        <h4>Inputs</h4>
        <ColorInput name="inputColor" v-model="inputColorLocal" :fallback="fgColorLocal" :label="$t('settings.background')"/>
        <OpacityInput name="inputOpacity" v-model="inputOpacityLocal" :fallback="previewTheme.opacity.input || 1"/>
        <ColorInput name="inputTextColor" v-model="inputTextColorLocal" :fallback="previewTheme.colors.inputText" :label="$t('settings.text')"/>
      </div>
      <div class="color-item">
        <h4>Buttons</h4>
        <ColorInput name="btnColor" v-model="btnColorLocal" :fallback="fgColorLocal" :label="$t('settings.background')"/>
        <OpacityInput name="btnOpacity" v-model="btnOpacityLocal" :fallback="previewTheme.opacity.btn || 1"/>
        <ColorInput name="btnTextColor" v-model="btnTextColorLocal" :fallback="previewTheme.colors.btnText" :label="$t('settings.text')"/>
        <ContrastRatio :contrast="previewContrast.btnText"/>
      </div>
      <div class="color-item">
        <h4>Borders</h4>
        <ColorInput name="borderColor" v-model="borderColorLocal" :fallback="previewTheme.colors.border" label="Color"/>
        <OpacityInput name="borderOpacity" v-model="borderOpacityLocal" :fallback="previewTheme.opacity.border || 1"/>
      </div>
      <div class="color-item">
        <h4>Faint text</h4>
        <ColorInput name="faintColor" v-model="faintColorLocal" :fallback="previewTheme.colors.faint || 1" :label="$t('settings.text')"/>
        <ColorInput name="faintLinkColor" v-model="faintLinkColorLocal" :fallback="previewTheme.colors.faintLink" :label="$t('settings.links')"/>
        <OpacityInput name="faintOpacity" v-model="faintOpacityLocal" fallback="previewTheme.opacity.faint"/>
      </div>
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

  <div class="apply-container">
    <button class="btn submit" @click="setCustomTheme">{{$t('general.apply')}}</button>
  </div>
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

.apply-container,
.radius-container,
.color-container > div,
.presets-container {
  display: flex;

  p {
    flex: 2 0 100%;
    margin-top: 2em;
    margin-bottom: .5em;
  }
}

.radius-container {
  flex-direction: column;
}

.color-container > div{
  flex-wrap: wrap;
  justify-content: space-between;
}

.presets-container {
  justify-content: center;
  .import-export {
    display: flex;

    .btn {
      margin-left: .5em;
    }
  }
}

.preview-container {
  border-top: 1px dashed;
  border-bottom: 1px dashed;
  border-color: $fallback--border;
  border-color: var(--border, $fallback--border);
  margin: 1em -1em 0;
  padding: 1em;

  .btn {
    margin-top: 1em;
    min-height: 30px;
    width: 10em;
  }
}

.apply-container {
  justify-content: center;
}

.radius-item,
.color-item {
  min-width: 20em;
  margin: 5px 6px 0 0;
  display:flex;
  flex-direction: column;
  flex: 1 1 0;

  &.wide {
    min-width: 60%
  }
  &:not(.wide):nth-child(2n+1) {
    margin-right: 7px;

  }

  .color, .opacity {
    display:flex;
    align-items: baseline;
  }

  h4 {
    margin-top: 1em;
  }

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

.theme-radius-in {
  min-width: 1em;
}

.theme-radius-in {
  max-width: 7em;
  flex: 1;
}

.theme-radius-lb{
  max-width: 50em;
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
