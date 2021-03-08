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
              class="button-default dropdown-item"
              @click="toggleRight(&quot;admin&quot;)"
            >
              {{ $t(!!user.rights.admin ? 'user_card.admin_menu.revoke_admin' : 'user_card.admin_menu.grant_admin') }}
            </button>
            <button
              class="button-default dropdown-item"
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
            class="button-default dropdown-item"
            @click="toggleActivationStatus()"
          >
            {{ $t(!!user.deactivated ? 'user_card.admin_menu.activate_account' : 'user_card.admin_menu.deactivate_account') }}
          </button>
          <button
            class="button-default dropdown-item"
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
              class="button-default dropdown-item"
              @click="toggleTag(tags.FORCE_NSFW)"
            >
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.FORCE_NSFW) }"
              />
              {{ $t('user_card.admin_menu.force_nsfw') }}
            </button>
            <button
              class="button-default dropdown-item"
              @click="toggleTag(tags.STRIP_MEDIA)"
            >
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.STRIP_MEDIA) }"
              />
              {{ $t('user_card.admin_menu.strip_media') }}
            </button>
            <button
              class="button-default dropdown-item"
              @click="toggleTag(tags.FORCE_UNLISTED)"
            >
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.FORCE_UNLISTED) }"
              />
              {{ $t('user_card.admin_menu.force_unlisted') }}
            </button>
            <button
              class="button-default dropdown-item"
              @click="toggleTag(tags.SANDBOX)"
            >
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.SANDBOX) }"
              />
              {{ $t('user_card.admin_menu.sandbox') }}
            </button>
            <button
              v-if="user.is_local"
              class="button-default dropdown-item"
              @click="toggleTag(tags.DISABLE_REMOTE_SUBSCRIPTION)"
            >
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.DISABLE_REMOTE_SUBSCRIPTION) }"
              />
              {{ $t('user_card.admin_menu.disable_remote_subscription') }}
            </button>
            <button
              v-if="user.is_local"
              class="button-default dropdown-item"
              @click="toggleTag(tags.DISABLE_ANY_SUBSCRIPTION)"
            >
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.DISABLE_ANY_SUBSCRIPTION) }"
              />
              {{ $t('user_card.admin_menu.disable_any_subscription') }}
            </button>
            <button
              v-if="user.is_local"
              class="button-default dropdown-item"
              @click="toggleTag(tags.QUARANTINE)"
            >
              <span
                class="menu-checkbox"
                :class="{ 'menu-checkbox-checked': hasTag(tags.QUARANTINE) }"
              />
              {{ $t('user_card.admin_menu.quarantine') }}
            </button>
          </span>
        </div>
      </div>
      <button
        slot="trigger"
        class="btn button-default btn-block"
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
            class="btn button-default"
            @click="deleteUserDialog(false)"
          >
            {{ $t('general.cancel') }}
          </button>
          <button
            class="btn button-default danger"
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

.moderation-tools-popover {
  height: 100%;
  .trigger {
    display: flex !important;
    height: 100%;
  }
}
</style>
