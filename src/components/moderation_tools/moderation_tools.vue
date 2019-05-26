<template>
<div class='block' style='position: relative'>
  <Popper
    trigger="click"
    @hide='showDropDown = false'
    append-to-body
    :options="{
      placement: 'bottom-end',
      modifiers: {
        arrow: { enabled: true },
        offset: { offset: '0, 5px' },
      }
    }">
    <div class="popper-wrapper">
      <div class="dropdown-menu">
        <span v-if='user.is_local'>
          <button class="dropdown-item" @click='toggleRight("admin")'>
            {{ $t(!!user.rights.admin ? 'user_card.admin_menu.revoke_admin' : 'user_card.admin_menu.grant_admin') }}
          </button>
          <button class="dropdown-item" @click='toggleRight("moderator")'>
            {{ $t(!!user.rights.moderator ? 'user_card.admin_menu.revoke_moderator' : 'user_card.admin_menu.grant_moderator') }}
          </button>
          <div role="separator" class="dropdown-divider"></div>
        </span>
        <button class="dropdown-item" @click='toggleActivationStatus()'>
          {{ $t(!!user.deactivated ? 'user_card.admin_menu.activate_account' : 'user_card.admin_menu.deactivate_account') }}
        </button>
        <button class="dropdown-item" @click='deleteUserDialog(true)'>
          {{ $t('user_card.admin_menu.delete_account') }}
        </button>
        <div role="separator" class="dropdown-divider" v-if='hasTagPolicy'></div>
        <span v-if='hasTagPolicy'>
          <button class="dropdown-item" @click='toggleTag(tags.FORCE_NSFW)'>
            {{ $t('user_card.admin_menu.force_nsfw') }}
            <span class="menu-checkbox" v-bind:class="{ 'menu-checkbox-checked': hasTag(tags.FORCE_NSFW) }"></span>
          </button>
          <button class="dropdown-item" @click='toggleTag(tags.STRIP_MEDIA)'>
            {{ $t('user_card.admin_menu.strip_media') }}
            <span class="menu-checkbox" v-bind:class="{ 'menu-checkbox-checked': hasTag(tags.STRIP_MEDIA) }"></span>
          </button>
          <button class="dropdown-item" @click='toggleTag(tags.FORCE_UNLISTED)'>
            {{ $t('user_card.admin_menu.force_unlisted') }}
            <span class="menu-checkbox" v-bind:class="{ 'menu-checkbox-checked': hasTag(tags.FORCE_UNLISTED) }"></span>
          </button>
          <button class="dropdown-item" @click='toggleTag(tags.SANDBOX)'>
            {{ $t('user_card.admin_menu.sandbox') }}
            <span class="menu-checkbox" v-bind:class="{ 'menu-checkbox-checked': hasTag(tags.SANDBOX) }"></span>
          </button>
          <button class="dropdown-item" v-if='user.is_local' @click='toggleTag(tags.DISABLE_REMOTE_SUBSCRIPTION)'>
            {{ $t('user_card.admin_menu.disable_remote_subscription') }}
            <span class="menu-checkbox" v-bind:class="{ 'menu-checkbox-checked': hasTag(tags.DISABLE_REMOTE_SUBSCRIPTION) }"></span>
          </button>
          <button class="dropdown-item" v-if='user.is_local' @click='toggleTag(tags.DISABLE_ANY_SUBSCRIPTION)'>
            {{ $t('user_card.admin_menu.disable_any_subscription') }}
            <span class="menu-checkbox" v-bind:class="{ 'menu-checkbox-checked': hasTag(tags.DISABLE_ANY_SUBSCRIPTION) }"></span>
          </button>
          <button class="dropdown-item" v-if='user.is_local' @click='toggleTag(tags.QUARANTINE)'>
            {{ $t('user_card.admin_menu.quarantine') }}
            <span class="menu-checkbox" v-bind:class="{ 'menu-checkbox-checked': hasTag(tags.QUARANTINE) }"></span>
          </button>
        </span>
      </div>
    </div>
    <button slot="reference" v-bind:class="{ pressed: showDropDown }" @click='toggleMenu'>
      {{ $t('user_card.admin_menu.moderation') }}
    </button>
  </Popper>
  <DialogModal v-if="showDeleteUserDialog" :onCancel='deleteUserDialog.bind(this, false)'>
    <span slot="header">{{ $t('user_card.admin_menu.delete_user') }}</span>
    <p>{{ $t('user_card.admin_menu.delete_user_confirmation') }}</p>
    <span slot="footer">
      <button @click='deleteUserDialog(false)'>
        {{ $t('general.cancel') }}
      </button>
      <button class="danger" @click='deleteUser()'>
        {{ $t('user_card.admin_menu.delete_user') }}
      </button>
    </span>
  </DialogModal>
</div>
</template>

<script src="./moderation_tools.js"></script>

<style lang="scss">
@import '../../_variables.scss';
@import '../popper/popper.scss';

.menu-checkbox {
  float: right;
  min-width: 22px;
  max-width: 22px;
  min-height: 22px;
  max-height: 22px;
  line-height: 22px;
  text-align: center;
  border-radius: 0px;
  background-color: $fallback--fg;
  background-color: var(--input, $fallback--fg);
  box-shadow: 0px 0px 2px black inset;
  box-shadow: var(--inputShadow);

  &.menu-checkbox-checked::after {
    content: '✔';
  }
}

</style>
