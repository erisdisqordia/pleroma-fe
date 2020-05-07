<template>
  <div class="theme-tab">
    <div class="presets-container">
      <div class="save-load">
        <div
          v-if="themeWarning"
          class="theme-warning"
        >
          <div class="alert warning">
            {{ themeWarningHelp }}
          </div>
          <div class="buttons">
            <template v-if="themeWarning.type === 'snapshot_source_mismatch'">
              <button
                class="btn"
                @click="forceLoad"
              >
                {{ $t('settings.style.switcher.use_source') }}
              </button>
              <button
                class="btn"
                @click="forceSnapshot"
              >
                {{ $t('settings.style.switcher.use_snapshot') }}
              </button>
            </template>
            <template v-else-if="themeWarning.noActionsPossible">
              <button
                class="btn"
                @click="dismissWarning"
              >
                {{ $t('general.dismiss') }}
              </button>
            </template>
            <template v-else>
              <button
                class="btn"
                @click="forceLoad"
              >
                {{ $t('settings.style.switcher.load_theme') }}
              </button>
              <button
                class="btn"
                @click="dismissWarning"
              >
                {{ $t('settings.style.switcher.keep_as_is') }}
              </button>
            </template>
          </div>
        </div>
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

    <preview :style="previewRules" />

    <keep-alive>
      <tab-switcher key="style-tweak">
        <div
          :label="$t('settings.style.common_colors._tab_label')"
          class="color-container"
        >
          <div class="tab-header">
            <p>{{ $t('settings.theme_help') }}</p>
            <div class="tab-header-buttons">
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
            <ContrastRatio :contrast="previewContrast.bgCRed" />
            <ColorInput
              v-model="cBlueColorLocal"
              name="cBlueColor"
              :label="$t('settings.cBlue')"
            />
            <ContrastRatio :contrast="previewContrast.bgCBlue" />
          </div>
          <div class="color-item">
            <ColorInput
              v-model="cGreenColorLocal"
              name="cGreenColor"
              :label="$t('settings.cGreen')"
            />
            <ContrastRatio :contrast="previewContrast.bgCGreen" />
            <ColorInput
              v-model="cOrangeColorLocal"
              name="cOrangeColor"
              :label="$t('settings.cOrange')"
            />
            <ContrastRatio :contrast="previewContrast.bgCOrange" />
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
            <h4>{{ $t('settings.style.advanced_colors.post') }}</h4>
            <ColorInput
              v-model="postLinkColorLocal"
              name="postLinkColor"
              :fallback="previewTheme.colors.accent"
              :label="$t('settings.links')"
            />
            <ContrastRatio :contrast="previewContrast.postLink" />
            <ColorInput
              v-model="postGreentextColorLocal"
              name="postGreentextColor"
              :fallback="previewTheme.colors.cGreen"
              :label="$t('settings.greentext')"
            />
            <ContrastRatio :contrast="previewContrast.postGreentext" />
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
            <ContrastRatio
              :contrast="previewContrast.alertErrorText"
              large="true"
            />
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
            <ContrastRatio
              :contrast="previewContrast.alertWarningText"
              large="true"
            />
            <ColorInput
              v-model="alertNeutralColorLocal"
              name="alertNeutral"
              :label="$t('settings.style.advanced_colors.alert_neutral')"
              :fallback="previewTheme.colors.alertNeutral"
            />
            <ColorInput
              v-model="alertNeutralTextColorLocal"
              name="alertNeutralText"
              :label="$t('settings.text')"
              :fallback="previewTheme.colors.alertNeutralText"
            />
            <ContrastRatio
              :contrast="previewContrast.alertNeutralText"
              large="true"
            />
            <OpacityInput
              v-model="alertOpacityLocal"
              name="alertOpacity"
              :fallback="previewTheme.opacity.alert"
            />
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
            <ContrastRatio
              :contrast="previewContrast.badgeNotificationText"
              large="true"
            />
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
              large="true"
            />
            <ColorInput
              v-model="panelLinkColorLocal"
              name="panelLinkColor"
              :fallback="previewTheme.colors.panelLink"
              :label="$t('settings.links')"
            />
            <ContrastRatio
              :contrast="previewContrast.panelLink"
              large="true"
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
            <ColorInput
              v-model="btnPanelTextColorLocal"
              name="btnPanelTextColor"
              :fallback="previewTheme.colors.btnPanelText"
              :label="$t('settings.style.advanced_colors.panel_header')"
            />
            <ContrastRatio :contrast="previewContrast.btnPanelText" />
            <ColorInput
              v-model="btnTopBarTextColorLocal"
              name="btnTopBarTextColor"
              :fallback="previewTheme.colors.btnTopBarText"
              :label="$t('settings.style.advanced_colors.top_bar')"
            />
            <ContrastRatio :contrast="previewContrast.btnTopBarText" />
            <h5>{{ $t('settings.style.advanced_colors.pressed') }}</h5>
            <ColorInput
              v-model="btnPressedColorLocal"
              name="btnPressedColor"
              :fallback="previewTheme.colors.btnPressed"
              :label="$t('settings.background')"
            />
            <ColorInput
              v-model="btnPressedTextColorLocal"
              name="btnPressedTextColor"
              :fallback="previewTheme.colors.btnPressedText"
              :label="$t('settings.text')"
            />
            <ContrastRatio :contrast="previewContrast.btnPressedText" />
            <ColorInput
              v-model="btnPressedPanelTextColorLocal"
              name="btnPressedPanelTextColor"
              :fallback="previewTheme.colors.btnPressedPanelText"
              :label="$t('settings.style.advanced_colors.panel_header')"
            />
            <ContrastRatio :contrast="previewContrast.btnPressedPanelText" />
            <ColorInput
              v-model="btnPressedTopBarTextColorLocal"
              name="btnPressedTopBarTextColor"
              :fallback="previewTheme.colors.btnPressedTopBarText"
              :label="$t('settings.style.advanced_colors.top_bar')"
            />
            <ContrastRatio :contrast="previewContrast.btnPressedTopBarText" />
            <h5>{{ $t('settings.style.advanced_colors.disabled') }}</h5>
            <ColorInput
              v-model="btnDisabledColorLocal"
              name="btnDisabledColor"
              :fallback="previewTheme.colors.btnDisabled"
              :label="$t('settings.background')"
            />
            <ColorInput
              v-model="btnDisabledTextColorLocal"
              name="btnDisabledTextColor"
              :fallback="previewTheme.colors.btnDisabledText"
              :label="$t('settings.text')"
            />
            <ColorInput
              v-model="btnDisabledPanelTextColorLocal"
              name="btnDisabledPanelTextColor"
              :fallback="previewTheme.colors.btnDisabledPanelText"
              :label="$t('settings.style.advanced_colors.panel_header')"
            />
            <ColorInput
              v-model="btnDisabledTopBarTextColorLocal"
              name="btnDisabledTopBarTextColor"
              :fallback="previewTheme.colors.btnDisabledTopBarText"
              :label="$t('settings.style.advanced_colors.top_bar')"
            />
            <h5>{{ $t('settings.style.advanced_colors.toggled') }}</h5>
            <ColorInput
              v-model="btnToggledColorLocal"
              name="btnToggledColor"
              :fallback="previewTheme.colors.btnToggled"
              :label="$t('settings.background')"
            />
            <ColorInput
              v-model="btnToggledTextColorLocal"
              name="btnToggledTextColor"
              :fallback="previewTheme.colors.btnToggledText"
              :label="$t('settings.text')"
            />
            <ContrastRatio :contrast="previewContrast.btnToggledText" />
            <ColorInput
              v-model="btnToggledPanelTextColorLocal"
              name="btnToggledPanelTextColor"
              :fallback="previewTheme.colors.btnToggledPanelText"
              :label="$t('settings.style.advanced_colors.panel_header')"
            />
            <ContrastRatio :contrast="previewContrast.btnToggledPanelText" />
            <ColorInput
              v-model="btnToggledTopBarTextColorLocal"
              name="btnToggledTopBarTextColor"
              :fallback="previewTheme.colors.btnToggledTopBarText"
              :label="$t('settings.style.advanced_colors.top_bar')"
            />
            <ContrastRatio :contrast="previewContrast.btnToggledTopBarText" />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.tabs') }}</h4>
            <ColorInput
              v-model="tabColorLocal"
              name="tabColor"
              :fallback="previewTheme.colors.tab"
              :label="$t('settings.background')"
            />
            <ColorInput
              v-model="tabTextColorLocal"
              name="tabTextColor"
              :fallback="previewTheme.colors.tabText"
              :label="$t('settings.text')"
            />
            <ContrastRatio :contrast="previewContrast.tabText" />
            <ColorInput
              v-model="tabActiveTextColorLocal"
              name="tabActiveTextColor"
              :fallback="previewTheme.colors.tabActiveText"
              :label="$t('settings.text')"
            />
            <ContrastRatio :contrast="previewContrast.tabActiveText" />
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
            <h4>{{ $t('settings.style.advanced_colors.highlight') }}</h4>
            <ColorInput
              v-model="highlightColorLocal"
              name="highlight"
              :label="$t('settings.background')"
              :fallback="previewTheme.colors.highlight"
            />
            <ColorInput
              v-model="highlightTextColorLocal"
              name="highlightText"
              :label="$t('settings.text')"
              :fallback="previewTheme.colors.highlightText"
            />
            <ContrastRatio :contrast="previewContrast.highlightText" />
            <ColorInput
              v-model="highlightLinkColorLocal"
              name="highlightLink"
              :label="$t('settings.links')"
              :fallback="previewTheme.colors.highlightLink"
            />
            <ContrastRatio :contrast="previewContrast.highlightLink" />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.popover') }}</h4>
            <ColorInput
              v-model="popoverColorLocal"
              name="popover"
              :label="$t('settings.background')"
              :fallback="previewTheme.colors.popover"
            />
            <OpacityInput
              v-model="popoverOpacityLocal"
              name="popoverOpacity"
              :fallback="previewTheme.opacity.popover"
              :disabled="popoverOpacityLocal === 'transparent'"
            />
            <ColorInput
              v-model="popoverTextColorLocal"
              name="popoverText"
              :label="$t('settings.text')"
              :fallback="previewTheme.colors.popoverText"
            />
            <ContrastRatio :contrast="previewContrast.popoverText" />
            <ColorInput
              v-model="popoverLinkColorLocal"
              name="popoverLink"
              :label="$t('settings.links')"
              :fallback="previewTheme.colors.popoverLink"
            />
            <ContrastRatio :contrast="previewContrast.popoverLink" />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.selectedPost') }}</h4>
            <ColorInput
              v-model="selectedPostColorLocal"
              name="selectedPost"
              :label="$t('settings.background')"
              :fallback="previewTheme.colors.selectedPost"
            />
            <ColorInput
              v-model="selectedPostTextColorLocal"
              name="selectedPostText"
              :label="$t('settings.text')"
              :fallback="previewTheme.colors.selectedPostText"
            />
            <ContrastRatio :contrast="previewContrast.selectedPostText" />
            <ColorInput
              v-model="selectedPostLinkColorLocal"
              name="selectedPostLink"
              :label="$t('settings.links')"
              :fallback="previewTheme.colors.selectedPostLink"
            />
            <ContrastRatio :contrast="previewContrast.selectedPostLink" />
          </div>
          <div class="color-item">
            <h4>{{ $t('settings.style.advanced_colors.selectedMenu') }}</h4>
            <ColorInput
              v-model="selectedMenuColorLocal"
              name="selectedMenu"
              :label="$t('settings.background')"
              :fallback="previewTheme.colors.selectedMenu"
            />
            <ColorInput
              v-model="selectedMenuTextColorLocal"
              name="selectedMenuText"
              :label="$t('settings.text')"
              :fallback="previewTheme.colors.selectedMenuText"
            />
            <ContrastRatio :contrast="previewContrast.selectedMenuText" />
            <ColorInput
              v-model="selectedMenuLinkColorLocal"
              name="selectedMenuLink"
              :label="$t('settings.links')"
              :fallback="previewTheme.colors.selectedMenuLink"
            />
            <ContrastRatio :contrast="previewContrast.selectedMenuLink" />
          </div>
          <div class="color-item">
            <h4>{{ $t('chats.chats') }}</h4>
            <ColorInput
              v-model="chatBgColorLocal"
              name="chatBgColor"
              :fallback="previewTheme.colors.bg || 1"
              :label="$t('settings.background')"
            />
            <h5>{{ $t('settings.style.advanced_colors.chat.incoming') }}</h5>
            <ColorInput
              v-model="chatMessageIncomingBgColorLocal"
              name="chatMessageIncomingBgColor"
              :fallback="previewTheme.colors.bg || 1"
              :label="$t('settings.background')"
            />
            <ColorInput
              v-model="chatMessageIncomingTextColorLocal"
              name="chatMessageIncomingTextColor"
              :fallback="previewTheme.colors.text || 1"
              :label="$t('settings.text')"
            />
            <ColorInput
              v-model="chatMessageIncomingLinkColorLocal"
              name="chatMessageIncomingLinkColor"
              :fallback="previewTheme.colors.link || 1"
              :label="$t('settings.links')"
            />
            <ColorInput
              v-model="chatMessageIncomingBorderColorLocal"
              name="chatMessageIncomingBorderLinkColor"
              :fallback="previewTheme.colors.fg || 1"
              :label="$t('settings.style.advanced_colors.chat.border')"
            />
            <h5>{{ $t('settings.style.advanced_colors.chat.outgoing') }}</h5>
            <ColorInput
              v-model="chatMessageOutgoingBgColorLocal"
              name="chatMessageOutgoingBgColor"
              :fallback="previewTheme.colors.bg || 1"
              :label="$t('settings.background')"
            />
            <ColorInput
              v-model="chatMessageOutgoingTextColorLocal"
              name="chatMessageOutgoingTextColor"
              :fallback="previewTheme.colors.text || 1"
              :label="$t('settings.text')"
            />
            <ColorInput
              v-model="chatMessageOutgoingLinkColorLocal"
              name="chatMessageOutgoingLinkColor"
              :fallback="previewTheme.colors.link || 1"
              :label="$t('settings.links')"
            />
            <ColorInput
              v-model="chatMessageOutgoingBorderColorLocal"
              name="chatMessageOutgoingBorderLinkColor"
              :fallback="previewTheme.colors.bg || 1"
              :label="$t('settings.style.advanced_colors.chat.border')"
            />
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
          <RangeInput
            v-model="chatMessageRadiusLocal"
            name="chatMessageRadius"
            :label="$t('settings.chatMessageRadius')"
            :fallback="previewTheme.radii.chatMessage || 2"
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
          <ShadowControl
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

<script src="./theme_tab.js"></script>

<style src="./theme_tab.scss" lang="scss"></style>
