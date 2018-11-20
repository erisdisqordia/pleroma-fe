<template>
<div class="style-switcher">
  <div class="presets-container">
    <div>
      {{$t('settings.presets')}}
      <label for="preset-switcher" class='select'>
        <select id="preset-switcher" v-model="selected" class="preset-switcher">
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
  <keep-alive>
    <tab-switcher key="style-tweak">
      <div :label="$t('settings.style.basic_colors._tab_label')" class="color-container">
        <div class="color-item">
          <h4>{{ $t('settings.style.basic_colors.main') }}</h4>
          <ColorInput name="bgColor" v-model="bgColorLocal" :label="$t('settings.background')"/>
          <OpacityInput name="bgOpacity" v-model="bgOpacityLocal" :fallback="previewTheme.opacity.bg || 1"/>
          <ColorInput name="textColor" v-model="textColorLocal" :label="$t('settings.text')"/>
          <ContrastRatio :contrast="previewContrast.bgText"/>
          <ColorInput name="linkColor" v-model="linkColorLocal" :label="$t('settings.links')"/>
          <ContrastRatio :contrast="previewContrast.bgLink"/>
        </div>
        <div class="color-item">
          <h4>{{ $t('settings.style.basic_colors.foreground') }}</h4>
          <ColorInput name="fgColor" v-model="fgColorLocal" :label="$t('settings.foreground')"/>
          <ColorInput name="fgTextColor" v-model="fgTextColorLocal" :label="$t('settings.text')" :fallback="previewTheme.colors.fgText"/>
          <ColorInput name="fgLinkColor" v-model="fgLinkColorLocal" :label="$t('settings.links')" :fallback="previewTheme.colors.fgLink"/>
          <p>{{ $t('settings.style.basic_colors.foreground_hint') }}</p>
        </div>
        <div class="color-item">
          <h4>{{ $t('settings.style.basic_colors.rgbo') }}</h4>
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

      <div :label="$t('settings.style.advanced_colors._tab_label')" class="color-container">
        <div class="color-item">
          <h4>{{ $t('settings.style.advanced_colors.alert') }}</h4>
          <ColorInput name="alertError" v-model="alertErrorColorLocal" :label="$t('settings.style.advanced_colors.alert_error')" :fallback="previewTheme.colors.alertError"/>
          <ContrastRatio :contrast="previewContrast.alertError"/>
        </div>
        <div class="color-item">
          <h4>{{ $t('settings.style.advanced_colors.badge') }}</h4>
          <ColorInput name="badgeNotification" v-model="badgeNotificationColorLocal" :label="$t('settings.style.advanced_colors.badge_notification')" :fallback="previewTheme.colors.badgeNotification"/>
        </div>
        <div class="color-item">
          <h4>{{ $t('settings.style.advanced_colors.panel_header') }}</h4>
          <ColorInput name="panelColor" v-model="panelColorLocal" :fallback="fgColorLocal" :label="$t('settings.background')"/>
          <OpacityInput name="panelOpacity" v-model="panelOpacityLocal" :fallback="previewTheme.opacity.panel || 1"/>
          <ColorInput name="panelTextColor" v-model="panelTextColorLocal" :fallback="previewTheme.colors.panelText" :label="$t('settings.links')"/>
          <ContrastRatio :contrast="previewContrast.panelText" large="1"/>
        </div>
        <div class="color-item">
          <h4>{{ $t('settings.style.advanced_colors.top_bar') }}</h4>
          <ColorInput name="topBarColor" v-model="topBarColorLocal" :fallback="fgColorLocal" :label="$t('settings.background')"/>
          <ColorInput name="topBarTextColor" v-model="topBarTextColorLocal" :fallback="previewTheme.colors.topBarText" :label="$t('settings.text')"/>
          <ContrastRatio :contrast="previewContrast.topBarText"/>
          <ColorInput name="topBarLinkColor" v-model="topBarLinkColorLocal" :fallback="previewTheme.colors.topBarLink" :label="$t('settings.links')"/>
          <ContrastRatio :contrast="previewContrast.topBarLink"/>
        </div>
        <div class="color-item">
          <h4>{{ $t('settings.style.advanced_colors.inputs') }}</h4>
          <ColorInput name="inputColor" v-model="inputColorLocal" :fallback="fgColorLocal" :label="$t('settings.background')"/>
          <OpacityInput name="inputOpacity" v-model="inputOpacityLocal" :fallback="previewTheme.opacity.input || 1"/>
          <ColorInput name="inputTextColor" v-model="inputTextColorLocal" :fallback="previewTheme.colors.inputText" :label="$t('settings.text')"/>
          <ContrastRatio :contrast="previewContrast.inputText"/>
        </div>
        <div class="color-item">
          <h4>{{ $t('settings.style.advanced_colors.buttons') }}</h4>
          <ColorInput name="btnColor" v-model="btnColorLocal" :fallback="fgColorLocal" :label="$t('settings.background')"/>
          <OpacityInput name="btnOpacity" v-model="btnOpacityLocal" :fallback="previewTheme.opacity.btn || 1"/>
          <ColorInput name="btnTextColor" v-model="btnTextColorLocal" :fallback="previewTheme.colors.btnText" :label="$t('settings.text')"/>
          <ContrastRatio :contrast="previewContrast.btnText"/>
        </div>
        <div class="color-item">
          <h4>{{ $t('settings.style.advanced_colors.borders') }}</h4>
          <ColorInput name="borderColor" v-model="borderColorLocal" :fallback="previewTheme.colors.border" label="Color"/>
          <OpacityInput name="borderOpacity" v-model="borderOpacityLocal" :fallback="previewTheme.opacity.border || 1"/>
        </div>
        <div class="color-item">
          <h4>{{ $t('settings.style.advanced_colors.faint_text') }}</h4>
          <ColorInput name="faintColor" v-model="faintColorLocal" :fallback="previewTheme.colors.faint || 1" :label="$t('settings.text')"/>
          <ColorInput name="faintLinkColor" v-model="faintLinkColorLocal" :fallback="previewTheme.colors.faintLink" :label="$t('settings.links')"/>
          <ColorInput name="panelFaintColor" v-model="panelFaintColorLocal" :fallback="previewTheme.colors.panelFaint" :label="$t('settings.style.advanced_colors.panel_header')"/>
          <OpacityInput name="faintOpacity" v-model="faintOpacityLocal" :fallback="previewTheme.opacity.faint || 0.5"/>
        </div>
      </div>
      <div :label="$t('settings.style.radii._tab_label')" class="radius-container">
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
      <div :label="$t('settings.style.shadows._tab_label')" class="shadow-container">
        <div class="shadow-selector">
          <div>
            {{$t('settings.style.shadows.component')}}
            <label for="shadow-switcher" class="select">
              <select id="shadow-switcher" v-model="shadowSelected" class="shadow-switcher">
                <option v-for="shadow in shadowsAvailable"
                        :value="shadow">
                  {{$t('settings.style.shadows.components.' + shadow)}}
                </option>
              </select>
              <i class="icon-down-open"/>
            </label>
          </div>
          <div class="override">
            <label for="override" class="label">
              {{$t('settings.style.shadows.override')}}
            </label>
            <input
              v-model="currentShadowOverriden"
              name="override"
              id="override"
              class="input-override"
              type="checkbox">
            <label class="checkbox-label" for="override"></label>
          </div>
        </div>
        <shadow-control :fallback="currentShadowFallback" v-model="currentShadow"/>
      </div>
    </tab-switcher>
  </keep-alive>

  <div class="apply-container">
    <button class="btn submit" @click="setCustomTheme">{{$t('general.apply')}}</button>
  </div>
</div>
</template>

<script src="./style_switcher.js"></script>

<style src="./style_switcher.scss" lang="scss"></style>
