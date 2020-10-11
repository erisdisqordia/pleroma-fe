<template>
  <div>
    <Popover
      trigger="click"
      class="moderation-tools-popover"
      placement="bottom"
      :offset="{ y: 5 }"
      @show="setToggled(true)"
      @close="setToggled(false)"
    >
      <div slot="content">
        <div class="dropdown-menu">
          <span v-if="user.is_local">
            <button
              class="dropdown-item"
              @click="toggleRight(&quot;admin&quot;)"
            >
              {{ $t(!!user.rights.admin ? 'user_card.admin_menu.revoke_admin' : 'user_card.admin_menu.grant_admin') }}
            </button>
            <button
              class="dropdown-item"
              @click="toggleRight(&quot;moderator&quot;)"
            >
              {{ $t(!!user.rights.moderator ? 'user_card.admin_menu.revoke_moderator' : 'user_card.admin_menu.grant_moderator') }}
            </button>
            <div
              role="separator"
              class="dropdown-divider"
            />
          </span>
          <button
            class="dropdown-item"
            @click="toggleActivationStatus()"
          >
            {{ $t(!!user.deactivated ? 'user_card.admin_menu.activate_account' : 'user_card.admin_menu.deactivate_account') }}
          </button>
          <button
            class="dropdown-item"
            @click="deleteUserDialog(true)"
          >
            {{ $t('user_card.admin_menu.delete_account') }}
          </button>
          <div
            v-if="hasTagPolicy"
            role="separator"
            class="dropdown-divider"
          />
          <span v-if="hasTagPolicy">
            <button
              class="dropdown-item"
              @click="toggleTag(tags.FORCE_NSFW)"
            >
              {{ $t('user_card.admin_menu.force_nsfw') }}
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.FORCE_NSFW) }"
              />
            </button>
            <button
              class="dropdown-item"
              @click="toggleTag(tags.STRIP_MEDIA)"
            >
              {{ $t('user_card.admin_menu.strip_media') }}
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.STRIP_MEDIA) }"
              />
            </button>
            <button
              class="dropdown-item"
              @click="toggleTag(tags.FORCE_UNLISTED)"
            >
              {{ $t('user_card.admin_menu.force_unlisted') }}
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.FORCE_UNLISTED) }"
              />
            </button>
            <button
              class="dropdown-item"
              @click="toggleTag(tags.SANDBOX)"
            >
              {{ $t('user_card.admin_menu.sandbox') }}
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.SANDBOX) }"
              />
            </button>
            <button
              v-if="user.is_local"
              class="dropdown-item"
              @click="toggleTag(tags.DISABLE_REMOTE_SUBSCRIPTION)"
            >
              {{ $t('user_card.admin_menu.disable_remote_subscription') }}
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.DISABLE_REMOTE_SUBSCRIPTION) }"
              />
            </button>
            <button
              v-if="user.is_local"
              class="dropdown-item"
              @click="toggleTag(tags.DISABLE_ANY_SUBSCRIPTION)"
            >
              {{ $t('user_card.admin_menu.disable_any_subscription') }}
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.DISABLE_ANY_SUBSCRIPTION) }"
              />
            </button>
            <button
              v-if="user.is_local"
              class="dropdown-item"
              @click="toggleTag(tags.QUARANTINE)"
            >
              {{ $t('user_card.admin_menu.quarantine') }}
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.QUARANTINE) }"
              />
            </button>
          </span>
        </div>
      </div>
      <button
        slot="trigger"
        class="btn btn-default btn-block"
        :class="{ toggled }"
      >
        {{ $t('user_card.admin_menu.moderation') }}
      </button>
    </Popover>
    <portal to="modal">
      <DialogModal
        v-if="showDeleteUserDialog"
        :on-cancel="deleteUserDialog.bind(this, false)"
      >
        <template slot="header">
          {{ $t('user_card.admin_menu.delete_user') }}
        </template>
        <p>{{ $t('user_card.admin_menu.delete_user_confirmation') }}</p>
        <template slot="footer">
          <button
            class="btn btn-default"
            @click="deleteUserDialog(false)"
          >
            {{ $t('general.cancel') }}
          </button>
          <button
            class="btn btn-default danger"
            @click="deleteUser()"
          >
            {{ $t('user_card.admin_menu.delete_user') }}
          </button>
        </template>
      </DialogModal>
    </portal>
  </div>
</template>

<script src="./moderation_tools.js"></script>

<style lang="scss">
@import '../../_variables.scss';

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
    content: '✓';
  }
}

.moderation-tools-popover {
  height: 100%;
  .trigger {
    display: flex !important;
    height: 100%;
  }
}
</style>
