<template>
  <div :label="$t('settings.version.title')">
    <div class="setting-item">
      <ul class="setting-list">
        <li>
          <p>{{ $t('settings.version.backend_version') }}</p>
          <ul class="option-list">
            <li>
              <a
                :href="backendVersionLink"
                target="_blank"
              >{{ backendVersion }}</a>
            </li>
          </ul>
        </li>
        <li>
          <p>{{ $t('settings.version.frontend_version') }}</p>
          <ul class="option-list">
            <li>
              <a
                :href="frontendVersionLink"
                target="_blank"
              >{{ frontendVersion }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
<script src="./version_tab.js">
