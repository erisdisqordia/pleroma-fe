<template>
<div class="style-switcher">
  <div class="presets-container">
    <div class="save-load">
      <export-import
        :exportObject='exportedTheme'
        :exportLabel='$t("settings.export_theme")'
        :importLabel='$t("settings.import_theme")'
        :importFailedText='$t("settings.invalid_theme_imported")'
        :onImport='onImport'
        :validator='importValidator'>
        <template slot="before">
          <div class="presets">
            {{$t('settings.presets')}}
            <label for="preset-switcher" class='select'>
              <select id="preset-switcher" v-model="selected" class="preset-switcher">
                <option v-for="style in availableStyles"
                        :value="style"
                        :style="{
                                backgroundColor: style[1] || style.theme.colors.bg,
                                color: style[3] || style.theme.colors.text
                                }">
                  {{style[0] || style.name}}
                </option>
              </select>
              <i class="icon-down-open"/>
            </label>
          </div>
        </template>
      </export-import>
    </div>
    <div class="save-load-options">
      <span class="keep-option">
        <input
          id="keep-color"
          type="checkbox"
          v-model="keepColor">
        <label for="keep-color">{{$t('settings.style.switcher.keep_color')}}</label>
      </span>
      <span class="keep-option">
        <input
          id="keep-shadows"
          type="checkbox"
          v-model="keepShadows">
        <label for="keep-shadows">{{$t('settings.style.switcher.keep_shadows')}}</label>
      </span>
      <span class="keep-option">
        <input
          id="keep-opacity"
          type="checkbox"
          v-model="keepOpacity">
        <label for="keep-opacity">{{$t('settings.style.switcher.keep_opacity')}}</label>
      </span>
      <span class="keep-option">
        <input
          id="keep-roundness"
          type="checkbox"
          v-model="keepRoundness">
        <label for="keep-roundness">{{$t('settings.style.switcher.keep_roundness')}}</label>
      </span>
      <span class="keep-option">
        <input
          id="keep-fonts"
          type="checkbox"
          v-model="keepFonts">
        <label for="keep-fonts">{{$t('settings.style.switcher.keep_fonts')}}</label>
      </span>
      <p>{{$t('settings.style.switcher.save_load_hint')}}</p>
    </div>
  </div>

  <div class="preview-container">
    <preview :style="previewRules"/>
  </div>

  <keep-alive>
    <tab-switcher key="style-tweak">
      <div :label="$t('settings.style.common_colors._tab_label')" class="color-container">
        <div class="tab-header">
          <p>{{$t('settings.theme_help')}}</p>
          <button class="btn" @click="clearOpacity">{{$t('settings.style.switcher.clear_opacity')}}</button>
          <button class="btn" @click="clearV1">{{$t('settings.style.switcher.clear_all')}}</button>
        </div>
        <p>{{$t('settings.theme_help_v2_1')}}</p>
        <h4>{{ $t('settings.style.common_colors.main') }}</h4>
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
          <p>{{ $t('settings.style.common_colors.foreground_hint') }}</p>
        </div>
        <h4>{{ $t('settings.style.common_colors.rgbo') }}</h4>
        <div class="color-item">
          <ColorInput name="cRedColor" v-model="cRedColorLocal" :label="$t('settings.cRed')"/>
          <ContrastRatio :contrast="previewContrast.bgRed"/>
          <ColorInput name="cBlueColor" v-model="cBlueColorLocal" :label="$t('settings.cBlue')"/>
          <ContrastRatio :contrast="previewContrast.bgBlue"/>
        </div>
        <div class="color-item">
          <ColorInput name="cGreenColor" v-model="cGreenColorLocal" :label="$t('settings.cGreen')"/>
          <ContrastRatio :contrast="previewContrast.bgGreen"/>
          <ColorInput name="cOrangeColor" v-model="cOrangeColorLocal" :label="$t('settings.cOrange')"/>
          <ContrastRatio :contrast="previewContrast.bgOrange"/>
        </div>
        <p>{{$t('settings.theme_help_v2_2')}}</p>
      </div>

      <div :label="$t('settings.style.advanced_colors._tab_label')" class="color-container">
        <div class="tab-header">
          <p>{{$t('settings.theme_help')}}</p>
          <button class="btn" @click="clearOpacity">{{$t('settings.style.switcher.clear_opacity')}}</button>
          <button class="btn" @click="clearV1">{{$t('settings.style.switcher.clear_all')}}</button>
        </div>
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
          <ColorInput name="panelTextColor" v-model="panelTextColorLocal" :fallback="previewTheme.colors.panelText" :label="$t('settings.text')"/>
          <ContrastRatio :contrast="previewContrast.panelText" large="1"/>
          <ColorInput name="panelLinkColor" v-model="panelLinkColorLocal" :fallback="previewTheme.colors.panelLink" :label="$t('settings.links')"/>
          <ContrastRatio :contrast="previewContrast.panelLink" large="1"/>
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
          <ColorInput name="borderColor" v-model="borderColorLocal" :fallback="previewTheme.colors.border" :label="$t('settings.style.common.color')"/>
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
        <div class="tab-header">
          <p>{{$t('settings.radii_help')}}</p>
          <button class="btn" @click="clearRoundness">{{$t('settings.style.switcher.clear_all')}}</button>
        </div>
        <RangeInput name="btnRadius" :label="$t('settings.btnRadius')" v-model="btnRadiusLocal" :fallback="previewTheme.radii.btn" max="16" hardMin="0"/>
        <RangeInput name="inputRadius" :label="$t('settings.inputRadius')" v-model="inputRadiusLocal" :fallback="previewTheme.radii.input" max="9" hardMin="0"/>
        <RangeInput name="checkboxRadius" :label="$t('settings.checkboxRadius')" v-model="checkboxRadiusLocal" :fallback="previewTheme.radii.checkbox" max="16" hardMin="0"/>
        <RangeInput name="panelRadius" :label="$t('settings.panelRadius')" v-model="panelRadiusLocal" :fallback="previewTheme.radii.panel" max="50" hardMin="0"/>
        <RangeInput name="avatarRadius" :label="$t('settings.avatarRadius')" v-model="avatarRadiusLocal" :fallback="previewTheme.radii.avatar" max="28" hardMin="0"/>
        <RangeInput name="avatarAltRadius" :label="$t('settings.avatarAltRadius')" v-model="avatarAltRadiusLocal" :fallback="previewTheme.radii.avatarAlt" max="28" hardMin="0"/>
        <RangeInput name="attachmentRadius" :label="$t('settings.attachmentRadius')" v-model="attachmentRadiusLocal" :fallback="previewTheme.radii.attachment" max="50" hardMin="0"/>
        <RangeInput name="tooltipRadius" :label="$t('settings.tooltipRadius')" v-model="tooltipRadiusLocal" :fallback="previewTheme.radii.tooltip" max="50" hardMin="0"/>
      </div>

      <div :label="$t('settings.style.shadows._tab_label')" class="shadow-container">
        <div class="tab-header shadow-selector">
          <div class="select-container">
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
          <button class="btn" @click="clearShadows">{{$t('settings.style.switcher.clear_all')}}</button>
        </div>
        <shadow-control :ready="!!currentShadowFallback" :fallback="currentShadowFallback" v-model="currentShadow"/>
        <div v-if="shadowSelected === 'avatar' || shadowSelected === 'avatarStatus'">
          <i18n path="settings.style.shadows.filter_hint.always_drop_shadow" tag="p">
            <code>filter: drop-shadow()</code>
          </i18n>
          <p>{{$t('settings.style.shadows.filter_hint.avatar_inset')}}</p>
          <i18n path="settings.style.shadows.filter_hint.drop_shadow_syntax" tag="p">
            <code>drop-shadow</code>
            <code>spread-radius</code>
            <code>inset</code>
          </i18n>
          <i18n path="settings.style.shadows.filter_hint.inset_classic" tag="p">
            <code>box-shadow</code>
          </i18n>
          <p>{{$t('settings.style.shadows.filter_hint.spread_zero')}}</p>
        </div>
      </div>

      <div :label="$t('settings.style.fonts._tab_label')" class="fonts-container">
        <div class="tab-header">
          <p>{{$t('settings.style.fonts.help')}}</p>
          <button class="btn" @click="clearFonts">{{$t('settings.style.switcher.clear_all')}}</button>
        </div>
        <FontControl
          name="ui"
          v-model="fontsLocal.interface"
          :label="$t('settings.style.fonts.components.interface')"
          :fallback="previewTheme.fonts.interface"
          no-inherit="1"/>
        <FontControl
          name="input"
          v-model="fontsLocal.input"
          :label="$t('settings.style.fonts.components.input')"
          :fallback="previewTheme.fonts.input"/>
        <FontControl
          name="post"
          v-model="fontsLocal.post"
          :label="$t('settings.style.fonts.components.post')"
          :fallback="previewTheme.fonts.post"/>
        <FontControl
          name="postCode"
          v-model="fontsLocal.postCode"
          :label="$t('settings.style.fonts.components.postCode')"
          :fallback="previewTheme.fonts.postCode"/>
      </div>
    </tab-switcher>
  </keep-alive>

  <div class="apply-container">
    <button class="btn submit" :disabled="!themeValid" @click="setCustomTheme">{{$t('general.apply')}}</button>
    <button class="btn" @click="clearAll">{{$t('settings.style.switcher.reset')}}</button>
  </div>
</div>
</template>

<script src="./style_switcher.js"></script>

<style src="./style_switcher.scss" lang="scss"></style>
