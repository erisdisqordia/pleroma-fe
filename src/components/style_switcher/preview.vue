<template>
<div class="panel dummy">
  <div class="panel-heading">
    <div class="title">
      {{$t('settings.style.preview.header')}}
      <span class="badge badge-notification">
        99
      </span>
    </div>
    <span class="faint">
      {{$t('settings.style.preview.header_faint')}}
    </span>
    <span class="alert error">
      {{$t('settings.style.preview.error')}}
    </span>
    <button class="btn">
      {{$t('settings.style.preview.button')}}
    </button>
  </div>
  <div class="panel-body theme-preview-content">
    <div class="post">
      <div class="avatar">
        ( ͡° ͜ʖ ͡°)
      </div>
      <div class="content">
        <h4>
          {{$t('settings.style.preview.content')}}
        </h4>

        <i18n path="settings.style.preview.text">
          <code style="font-family: var(--postCodeFont)">
            {{$t('settings.style.preview.mono')}}
          </code>
          <a style="color: var(--link)">
            {{$t('settings.style.preview.link')}}
          </a>
        </i18n>

        <div class="icons">
          <i style="color: var(--cBlue)" class="button-icon icon-reply"/>
          <i style="color: var(--cGreen)" class="button-icon icon-retweet"/>
          <i style="color: var(--cOrange)" class="button-icon icon-star"/>
          <i style="color: var(--cRed)" class="button-icon icon-cancel"/>
        </div>
      </div>
    </div>

    <div class="after-post">
      <div class="avatar-alt">
        :^)
      </div>
      <div class="content">
        <i18n path="settings.style.preview.fine_print" tag="span" class="faint">
          <a style="color: var(--faintLink)">
            {{$t('settings.style.preview.faint_link')}}
          </a>
        </i18n>
      </div>
    </div>
    <div class="separator"></div>

    <span class="alert error">
      {{$t('settings.style.preview.error')}}
    </span>
    <input :value="$t('settings.style.preview.input')" type="text">

    <div class="actions">
      <span class="checkbox">
        <input checked="very yes" type="checkbox" id="preview_checkbox">
        <label for="preview_checkbox">{{$t('settings.style.preview.checkbox')}}</label>
      </span>
      <button class="btn">
        {{$t('settings.style.preview.button')}}
      </button>
    </div>
  </div>
</div>
</template>
