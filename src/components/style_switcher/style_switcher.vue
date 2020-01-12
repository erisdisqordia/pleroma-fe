<template>
  <div class="style-switcher">
    <div class="presets-container">
      <div class="save-load">
        <ExportImport
          :export-object="exportedTheme"
          :export-label="$t(&quot;settings.export_theme&quot;)"
          :import-label="$t(&quot;settings.import_theme&quot;)"
          :import-failed-text="$t(&quot;settings.invalid_theme_imported&quot;)"
          :on-import="onImport"
          :validator="importValidator"
        >
          <template slot="before">
            <div class="presets">
              {{ $t('settings.presets') }}
              <label
                for="preset-switcher"
                class="select"
              >
                <select
                  id="preset-switcher"
                  v-model="selected"
                  class="preset-switcher"
                >
                  <option
                    v-for="style in availableStyles"
                    :key="style.name"
                    :value="style"
                    :style="{
                      backgroundColor: style[1] || (style.theme || style.source).colors.bg,
                      color: style[3] || (style.theme || style.source).colors.text
                    }"
                  >
                    {{ style[0] || style.name }}
                  </option>
                </select>
                <i class="icon-down-open" />
              </label>
            </div>
          </template>
        </ExportImport>
      </div>
      <div class="save-load-options">
        <span class="keep-option">
          <Checkbox v-model="keepColor">
            {{ $t('settings.style.switcher.keep_color') }}
          </Checkbox>
        </span>
        <span class="keep-option">
          <Checkbox v-model="keepShadows">
            {{ $t('settings.style.switcher.keep_shadows') }}
          </Checkbox>
        </span>
        <span class="keep-option">
          <Checkbox v-model="keepOpacity">
            {{ $t('settings.style.switcher.keep_opacity') }}
          </Checkbox>
        </span>
        <span class="keep-option">
          <Checkbox v-model="keepRoundness">
            {{ $t('settings.style.switcher.keep_roundness') }}
          </Checkbox>
        </span>
        <span class="keep-option">
          <Checkbox v-model="keepFonts">
            {{ $t('settings.style.switcher.keep_fonts') }}
          </Checkbox>
        </span>
        <p>{{ $t('settings.style.switcher.save_load_hint') }}</p>
      </div>
    </div>

    <div class="preview-container">
      <preview :style="previewRules" />
    </div>

    <keep-alive>
      <tab-switcher key="style-tweak">
        <div
          :label="$t('settings.style.common_colors._tab_label')"
          class="color-container"
        >
          <div class="tab-header">
            <p>{{ $t('settings.theme_help') }}</p>
            <button
              class="btn"
              @click="clearOpacity"
            >
              {{ $t('settings.style.switcher.clear_opacity') }}
            </button>
            <button
              class="btn"
              @click="clearV1"
            >
              {{ $t('settings.style.switcher.clear_all') }}
            </button>
          </div>
          <p>{{ $t('settings.theme_help_v2_1') }}</p>
          <h4>{{ $t('settings.style.common_colors.main') }}</h4>
          <div class="color-item">
            <ColorInput
              v-model="bgColorLocal"
              name="bgColor"
              :label="$t('settings.background')"
            />
            <OpacityInput
              v-model="bgOpacityLocal"
              name="bgOpacity"
              :fallback="previewTheme.opacity.bg"
            />
            <ColorInput
              v-model="textColorLocal"
              name="textColor"
              :label="$t('settings.text')"
            />
            <ContrastRatio :contrast="previewContrast.bgText" />
            <ColorInput
              v-model="accentColorLocal"
              name="accentColor"
              :fallback="previewTheme.colors.link"
              :label="$t('settings.accent')"
              :show-optional-tickbox="typeof linkColorLocal !== 'undefined'"
            />
            <ColorInput
              v-model="linkColorLocal"
              name="linkColor"
              :fallback="previewTheme.colors.accent"
              :label="$t('settings.links')"
              :show-optional-tickbox="typeof accentColorLocal !== 'undefined'"
            />
            <ContrastRatio :contrast="previewContrast.bgLink" />
          </div>
          <div class="color-item">
            <ColorInput
              v-model="fgColorLocal"
              name="fgColor"
              :label="$t('settings.foreground')"
            />
            <ColorInput
              v-model="fgTextColorLocal"
              name="fgTextColor"
              :label="$t('settings.text')"
              :fallback="previewTheme.colors.fgText"
            />
            <ColorInput
              v-model="fgLinkColorLocal"
              name="fgLinkColor"
              :label="$t('settings.links')"
              :fallback="previewTheme.colors.fgLink"
            />
            <p>{{ $t('settings.style.common_colors.foreground_hint') }}</p>
          </div>
          <h4>{{ $t('settings.style.common_colors.rgbo') }}</h4>
          <div class="color-item">
            <ColorInput
              v-model="cRedColorLocal"
              name="cRedColor"
              :label="$t('settings.cRed')"
            />
            <ContrastRatio :contrast="previewContrast.bgRed" />
            <ColorInput
              v-model="cBlueColorLocal"
              name="cBlueColor"
              :label="$t('settings.cBlue')"
            />
            <ContrastRatio :contrast="previewContrast.bgBlue" />
          </div>
          <div class="color-item">
            <ColorInput
              v-model="cGreenColorLocal"
              name="cGreenColor"
              :label="$t('settings.cGreen')"
            />
            <ContrastRatio :contrast="previewContrast.bgGreen" />
            <ColorInput
              v-model="cOrangeColorLocal"
              name="cOrangeColor"
              :label="$t('settings.cOrange')"
            />
            <ContrastRatio :contrast="previewContrast.bgOrange" />
          </div>
          <p>{{ $t('settings.theme_help_v2_2') }}</p>
        </div>

        <div
          :label="$t('settings.style.advanced_colors._tab_label')"
          class="color-container"
        >
          <div class="tab-header">
            <p>{{ $t('settings.theme_help') }}</p>
            <button
              class="btn"
              @click="clearOpacity"
            >
              {{ $t('settings.style.switcher.clear_opacity') }}
            </button>
            <button
              class="btn"
              @click="clearV1"
            >
              {{ $t('settings.style.switcher.clear_all') }}
            </button>
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.alert') }}</h4>
            <ColorInput
              v-model="alertErrorColorLocal"
              name="alertError"
              :label="$t('settings.style.advanced_colors.alert_error')"
              :fallback="previewTheme.colors.alertError"
            />
            <ColorInput
              v-model="alertErrorTextColorLocal"
              name="alertErrorText"
              :label="$t('settings.text')"
              :fallback="previewTheme.colors.alertErrorText"
            />
            <ContrastRatio :contrast="previewContrast.alertErrorText" large="1"/>
            <ColorInput
              v-model="alertWarningColorLocal"
              name="alertWarning"
              :label="$t('settings.style.advanced_colors.alert_warning')"
              :fallback="previewTheme.colors.alertWarning"
            />
            <ColorInput
              v-model="alertWarningTextColorLocal"
              name="alertWarningText"
              :label="$t('settings.text')"
              :fallback="previewTheme.colors.alertWarningText"
            />
            <ContrastRatio :contrast="previewContrast.alertWarningText" large="1"/>
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.badge') }}</h4>
            <ColorInput
              v-model="badgeNotificationColorLocal"
              name="badgeNotification"
              :label="$t('settings.style.advanced_colors.badge_notification')"
              :fallback="previewTheme.colors.badgeNotification"
            />
            <ColorInput
              v-model="badgeNotificationTextColorLocal"
              name="badgeNotificationText"
              :label="$t('settings.text')"
              :fallback="previewTheme.colors.badgeNotificationText"
            />
            <ContrastRatio :contrast="previewContrast.badgeNotificationText" large="1" />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.panel_header') }}</h4>
            <ColorInput
              v-model="panelColorLocal"
              name="panelColor"
              :fallback="previewTheme.colors.panel"
              :label="$t('settings.background')"
            />
            <OpacityInput
              v-model="panelOpacityLocal"
              name="panelOpacity"
              :fallback="previewTheme.opacity.panel"
              :disabled="panelColorLocal === 'transparent'"
            />
            <ColorInput
              v-model="panelTextColorLocal"
              name="panelTextColor"
              :fallback="previewTheme.colors.panelText"
              :label="$t('settings.text')"
            />
            <ContrastRatio
              :contrast="previewContrast.panelText"
              large="1"
            />
            <ColorInput
              v-model="panelLinkColorLocal"
              name="panelLinkColor"
              :fallback="previewTheme.colors.panelLink"
              :label="$t('settings.links')"
            />
            <ContrastRatio
              :contrast="previewContrast.panelLink"
              large="1"
            />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.top_bar') }}</h4>
            <ColorInput
              v-model="topBarColorLocal"
              name="topBarColor"
              :fallback="previewTheme.colors.topBar"
              :label="$t('settings.background')"
            />
            <ColorInput
              v-model="topBarTextColorLocal"
              name="topBarTextColor"
              :fallback="previewTheme.colors.topBarText"
              :label="$t('settings.text')"
            />
            <ContrastRatio :contrast="previewContrast.topBarText" />
            <ColorInput
              v-model="topBarLinkColorLocal"
              name="topBarLinkColor"
              :fallback="previewTheme.colors.topBarLink"
              :label="$t('settings.links')"
            />
            <ContrastRatio :contrast="previewContrast.topBarLink" />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.inputs') }}</h4>
            <ColorInput
              v-model="inputColorLocal"
              name="inputColor"
              :fallback="previewTheme.colors.input"
              :label="$t('settings.background')"
            />
            <OpacityInput
              v-model="inputOpacityLocal"
              name="inputOpacity"
              :fallback="previewTheme.opacity.input"
              :disabled="inputColorLocal === 'transparent'"
            />
            <ColorInput
              v-model="inputTextColorLocal"
              name="inputTextColor"
              :fallback="previewTheme.colors.inputText"
              :label="$t('settings.text')"
            />
            <ContrastRatio :contrast="previewContrast.inputText" />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.buttons') }}</h4>
            <ColorInput
              v-model="btnColorLocal"
              name="btnColor"
              :fallback="previewTheme.colors.btn"
              :label="$t('settings.background')"
            />
            <OpacityInput
              v-model="btnOpacityLocal"
              name="btnOpacity"
              :fallback="previewTheme.opacity.btn"
              :disabled="btnColorLocal === 'transparent'"
            />
            <ColorInput
              v-model="btnTextColorLocal"
              name="btnTextColor"
              :fallback="previewTheme.colors.btnText"
              :label="$t('settings.text')"
            />
            <ContrastRatio :contrast="previewContrast.btnText" />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.borders') }}</h4>
            <ColorInput
              v-model="borderColorLocal"
              name="borderColor"
              :fallback="previewTheme.colors.border"
              :label="$t('settings.style.common.color')"
            />
            <OpacityInput
              v-model="borderOpacityLocal"
              name="borderOpacity"
              :fallback="previewTheme.opacity.border"
              :disabled="borderColorLocal === 'transparent'"
            />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.faint_text') }}</h4>
            <ColorInput
              v-model="faintColorLocal"
              name="faintColor"
              :fallback="previewTheme.colors.faint"
              :label="$t('settings.text')"
            />
            <ColorInput
              v-model="faintLinkColorLocal"
              name="faintLinkColor"
              :fallback="previewTheme.colors.faintLink"
              :label="$t('settings.links')"
            />
            <ColorInput
              v-model="panelFaintColorLocal"
              name="panelFaintColor"
              :fallback="previewTheme.colors.panelFaint"
              :label="$t('settings.style.advanced_colors.panel_header')"
            />
            <OpacityInput
              v-model="faintOpacityLocal"
              name="faintOpacity"
              :fallback="previewTheme.opacity.faint"
            />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.underlay') }}</h4>
            <ColorInput
              v-model="underlayColorLocal"
              name="underlay"
              :label="$t('settings.style.advanced_colors.underlay')"
              :fallback="previewTheme.colors.underlay"
            />
            <OpacityInput
              v-model="underlayOpacityLocal"
              name="underlayOpacity"
              :fallback="previewTheme.opacity.underlay"
              :disabled="underlayOpacityLocal === 'transparent'"
            />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.poll') }}</h4>
            <ColorInput
              v-model="pollColorLocal"
              name="poll"
              :label="$t('settings.background')"
              :fallback="previewTheme.colors.poll"
            />
            <ColorInput
              v-model="pollTextColorLocal"
              name="pollText"
              :label="$t('settings.text')"
              :fallback="previewTheme.colors.pollText"
            />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.icons') }}</h4>
            <ColorInput
              v-model="iconColorLocal"
              name="icon"
              :label="$t('settings.style.advanced_colors.icons')"
              :fallback="previewTheme.colors.icon"
            />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.lightBg') }}</h4>
            <ColorInput
              v-model="lightBgColorLocal"
              name="lightBg"
              :label="$t('settings.style.advanced_colors.lightBg')"
              :fallback="previewTheme.colors.lightBg"
            />
            <ColorInput
              v-model="lightBgTextColorLocal"
              name="lightBgText"
              :label="$t('settings.text')"
              :fallback="previewTheme.colors.lightBgText"
            />
            <ContrastRatio :contrast="previewContrast.lightBgText" />
            <ColorInput
              v-model="lightBgLinkColorLocal"
              name="lightBgLink"
              :label="$t('settings.links')"
              :fallback="previewTheme.colors.lightBgLink"
            />
            <ContrastRatio :contrast="previewContrast.lightBgLink" />
          </div>
        </div>

        <div
          :label="$t('settings.style.radii._tab_label')"
          class="radius-container"
        >
          <div class="tab-header">
            <p>{{ $t('settings.radii_help') }}</p>
            <button
              class="btn"
              @click="clearRoundness"
            >
              {{ $t('settings.style.switcher.clear_all') }}
            </button>
          </div>
          <RangeInput
            v-model="btnRadiusLocal"
            name="btnRadius"
            :label="$t('settings.btnRadius')"
            :fallback="previewTheme.radii.btn"
            max="16"
            hard-min="0"
          />
          <RangeInput
            v-model="inputRadiusLocal"
            name="inputRadius"
            :label="$t('settings.inputRadius')"
            :fallback="previewTheme.radii.input"
            max="9"
            hard-min="0"
          />
          <RangeInput
            v-model="checkboxRadiusLocal"
            name="checkboxRadius"
            :label="$t('settings.checkboxRadius')"
            :fallback="previewTheme.radii.checkbox"
            max="16"
            hard-min="0"
          />
          <RangeInput
            v-model="panelRadiusLocal"
            name="panelRadius"
            :label="$t('settings.panelRadius')"
            :fallback="previewTheme.radii.panel"
            max="50"
            hard-min="0"
          />
          <RangeInput
            v-model="avatarRadiusLocal"
            name="avatarRadius"
            :label="$t('settings.avatarRadius')"
            :fallback="previewTheme.radii.avatar"
            max="28"
            hard-min="0"
          />
          <RangeInput
            v-model="avatarAltRadiusLocal"
            name="avatarAltRadius"
            :label="$t('settings.avatarAltRadius')"
            :fallback="previewTheme.radii.avatarAlt"
            max="28"
            hard-min="0"
          />
          <RangeInput
            v-model="attachmentRadiusLocal"
            name="attachmentRadius"
            :label="$t('settings.attachmentRadius')"
            :fallback="previewTheme.radii.attachment"
            max="50"
            hard-min="0"
          />
          <RangeInput
            v-model="tooltipRadiusLocal"
            name="tooltipRadius"
            :label="$t('settings.tooltipRadius')"
            :fallback="previewTheme.radii.tooltip"
            max="50"
            hard-min="0"
          />
        </div>

        <div
          :label="$t('settings.style.shadows._tab_label')"
          class="shadow-container"
        >
          <div class="tab-header shadow-selector">
            <div class="select-container">
              {{ $t('settings.style.shadows.component') }}
              <label
                for="shadow-switcher"
                class="select"
              >
                <select
                  id="shadow-switcher"
                  v-model="shadowSelected"
                  class="shadow-switcher"
                >
                  <option
                    v-for="shadow in shadowsAvailable"
                    :key="shadow"
                    :value="shadow"
                  >
                    {{ $t('settings.style.shadows.components.' + shadow) }}
                  </option>
                </select>
                <i class="icon-down-open" />
              </label>
            </div>
            <div class="override">
              <label
                for="override"
                class="label"
              >
                {{ $t('settings.style.shadows.override') }}
              </label>
              <input
                id="override"
                v-model="currentShadowOverriden"
                name="override"
                class="input-override"
                type="checkbox"
              >
              <label
                class="checkbox-label"
                for="override"
              />
            </div>
            <button
              class="btn"
              @click="clearShadows"
            >
              {{ $t('settings.style.switcher.clear_all') }}
            </button>
          </div>
          <shadow-control
            v-model="currentShadow"
            :ready="!!currentShadowFallback"
            :fallback="currentShadowFallback"
          />
          <div v-if="shadowSelected === 'avatar' || shadowSelected === 'avatarStatus'">
            <i18n
              path="settings.style.shadows.filter_hint.always_drop_shadow"
              tag="p"
            >
              <code>filter: drop-shadow()</code>
            </i18n>
            <p>{{ $t('settings.style.shadows.filter_hint.avatar_inset') }}</p>
            <i18n
              path="settings.style.shadows.filter_hint.drop_shadow_syntax"
              tag="p"
            >
              <code>drop-shadow</code>
              <code>spread-radius</code>
              <code>inset</code>
            </i18n>
            <i18n
              path="settings.style.shadows.filter_hint.inset_classic"
              tag="p"
            >
              <code>box-shadow</code>
            </i18n>
            <p>{{ $t('settings.style.shadows.filter_hint.spread_zero') }}</p>
          </div>
        </div>

        <div
          :label="$t('settings.style.fonts._tab_label')"
          class="fonts-container"
        >
          <div class="tab-header">
            <p>{{ $t('settings.style.fonts.help') }}</p>
            <button
              class="btn"
              @click="clearFonts"
            >
              {{ $t('settings.style.switcher.clear_all') }}
            </button>
          </div>
          <FontControl
            v-model="fontsLocal.interface"
            name="ui"
            :label="$t('settings.style.fonts.components.interface')"
            :fallback="previewTheme.fonts.interface"
            no-inherit="1"
          />
          <FontControl
            v-model="fontsLocal.input"
            name="input"
            :label="$t('settings.style.fonts.components.input')"
            :fallback="previewTheme.fonts.input"
          />
          <FontControl
            v-model="fontsLocal.post"
            name="post"
            :label="$t('settings.style.fonts.components.post')"
            :fallback="previewTheme.fonts.post"
          />
          <FontControl
            v-model="fontsLocal.postCode"
            name="postCode"
            :label="$t('settings.style.fonts.components.postCode')"
            :fallback="previewTheme.fonts.postCode"
          />
        </div>
      </tab-switcher>
    </keep-alive>

    <div class="apply-container">
      <button
        class="btn submit"
        :disabled="!themeValid"
        @click="setCustomTheme"
      >
        {{ $t('general.apply') }}
      </button>
      <button
        class="btn"
        @click="clearAll"
      >
        {{ $t('settings.style.switcher.reset') }}
      </button>
    </div>
  </div>
</template>

<script src="./style_switcher.js"></script>

<style src="./style_switcher.scss" lang="scss"></style>
