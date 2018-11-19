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

    <div class="preview-container">
      <div class="panel dummy" :style="previewRules">
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

    <p>{{$t('settings.theme_help')}}</p>
    <tab-switcher>
      <div label="Basic" class="color-container">
        <div class="color-item">
          <h4>Main colors</h4>
          <ColorInput name="bgColor" v-model="bgColorLocal" :label="$t('settings.background')"/>
          <OpacityInput name="bgOpacity" v-model="bgOpacityLocal" :fallback="previewTheme.opacity.bg || 1"/>
          <ColorInput name="textColor" v-model="textColorLocal" :label="$t('settings.text')"/>
          <ContrastRatio :contrast="previewContrast.bgText"/>
          <ColorInput name="linkColor" v-model="linkColorLocal" :label="$t('settings.links')"/>
          <ContrastRatio :contrast="previewContrast.bgLink"/>
        </div>
        <div class="color-item">
          <h4>Panel header, top bar, buttons, text fields</h4>
          <ColorInput name="fgColor" v-model="fgColorLocal" :label="$t('settings.foreground')"/>
          <ColorInput name="fgTextColor" v-model="fgTextColorLocal" :label="$t('settings.text')" :fallback="previewTheme.colors.fgText"/>
          <ColorInput name="fgLinkColor" v-model="fgLinkColorLocal" :label="$t('settings.links')" :fallback="previewTheme.colors.fgLink"/>
          <p>See "Advanced" tab for more detailed control</p>
        </div>
        <div class="color-item">
          <h4>Icons, alerts, etc.</h4>
          <ColorInput name="cRedColor" v-model="cRedColorLocal" :label="$t('settings.cRed')"/>
          <ContrastRatio :contrast="previewContrast.bgRed"/>
          <ColorInput name="cBlueColor" v-model="cBlueColorLocal" :label="$t('settings.cBlue')"/>
          <ContrastRatio :contrast="previewContrast.bgBlue"/>
        </div>
        <div class="color-item">
          <h4>.</h4>
          <ColorInput name="cGreenColor" v-model="cGreenColorLocal" :label="$t('settings.cGreen')"/>
          <ContrastRatio :contrast="previewContrast.bgGreen"/>
          <ColorInput name="cOrangeColor" v-model="cOrangeColorLocal" :label="$t('settings.cOrange')"/>
          <ContrastRatio :contrast="previewContrast.bgOrange"/>
        </div>
      </div>

      <div label="Advanced" class="color-container">
        <div class="color-item">
          <h4>Alerts</h4>
          <ColorInput name="alertError" v-model="alertErrorColorLocal" :label="$t('settings.error')" :fallback="previewTheme.colors.alertError"/>
          <ContrastRatio :contrast="previewContrast.alertError"/>
        </div>
        <div class="color-item">
          <h4>Badges</h4>
          <ColorInput name="badgeNotification" v-model="badgeNotificationColorLocal" :label="$t('settings.notification')" :fallback="previewTheme.colors.badgeNotification"/>
        </div>
        <div class="color-item">
          <h4>Panel header</h4>
          <ColorInput name="panelColor" v-model="panelColorLocal" :fallback="fgColorLocal" :label="$t('settings.background')"/>
          <OpacityInput name="panelOpacity" v-model="panelOpacityLocal" :fallback="previewTheme.opacity.panel || 1"/>
          <ColorInput name="panelTextColor" v-model="panelTextColorLocal" :fallback="previewTheme.colors.panelText" :label="$t('settings.links')"/>
          <ContrastRatio :contrast="previewContrast.panelText" large="1"/>
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
          <h4>Text fields</h4>
          <ColorInput name="inputColor" v-model="inputColorLocal" :fallback="fgColorLocal" :label="$t('settings.background')"/>
          <OpacityInput name="inputOpacity" v-model="inputOpacityLocal" :fallback="previewTheme.opacity.input || 1"/>
          <ColorInput name="inputTextColor" v-model="inputTextColorLocal" :fallback="previewTheme.colors.inputText" :label="$t('settings.text')"/>
          <ContrastRatio :contrast="previewContrast.inputText"/>
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
          <ColorInput name="panelFaintColor" v-model="panelFaintColorLocal" :fallback="previewTheme.colors.panelFaint" :label="$t('settings.panel')"/>
          <OpacityInput name="faintOpacity" v-model="faintOpacityLocal" :fallback="previewTheme.opacity.faint || 0.5"/>
        </div>
      </div>
      <div label="Roundness" class="radius-container">
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
      <div label="Shadow Realm" class="shadow-container">
        <div>
          Shadow
          <label for="shadow-switcher" class="shadow-selector select">
            <select id="shadow-switcher" v-model="shadowSelected" class="shadow-switcher">
              <option v-for="shadow in shadowsAvailable"
                      :value="shadow">
                {{shadow}}
              </option>
            </select>
            <i class="icon-down-open"/>
          </label>
          <label for="override" class="label">
            Override
          </label>
          <input
            v-model="currentShadowOverriden"
            name="override"
            id="override"
            class="input-override"
            type="checkbox">
          <label class="checkbox-label" for="override"></label>
        </div>
        <shadow-control v-if="currentShadowFallback" :fallback="currentShadowFallback" v-model="currentShadow"/>
      </div>
    </tab-switcher>

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
.color-container,
.presets-container {
  display: flex;

  p {
    margin-left: 1em
  }
}

.radius-container {
  flex-direction: column;
}

.color-container{
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
  background: var(--body-background-image);
  background-size: cover;
  background-position: 50% 50%;

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
