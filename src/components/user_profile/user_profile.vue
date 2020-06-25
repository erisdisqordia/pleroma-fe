<template>
  <div>
    <div
      v-if="user"
      class="user-profile panel panel-default"
    >
      <UserCard
        :user-id="userId"
        :switcher="true"
        :selected="timeline.viewing"
        :allow-zooming-avatar="true"
        rounded="top"
      />
      <div
        v-if="user.fields_html && user.fields_html.length > 0"
        class="user-profile-fields"
      >
        <dl
          v-for="(field, index) in user.fields_html"
          :key="index"
          class="user-profile-field"
        >
          <!-- eslint-disable vue/no-v-html -->
          <dt
            :title="user.fields_text[index].name"
            class="user-profile-field-name"
            @click.prevent="linkClicked"
            v-html="field.name"
          />
          <dd
            :title="user.fields_text[index].value"
            class="user-profile-field-value"
            @click.prevent="linkClicked"
            v-html="field.value"
          />
          <!-- eslint-enable vue/no-v-html -->
        </dl>
      </div>
      <tab-switcher
        :active-tab="tab"
        :render-only-focused="true"
        :on-switch="onTabSwitch"
      >
        <Timeline
          key="statuses"
          :label="$t('user_card.statuses')"
          :count="user.statuses_count"
          :embedded="true"
          :title="$t('user_profile.timeline_title')"
          :timeline="timeline"
          timeline-name="user"
          :user-id="userId"
          :pinned-status-ids="user.pinnedStatusIds"
          :in-profile="true"
        />
        <div
          v-if="followsTabVisible"
          key="followees"
          :label="$t('user_card.followees')"
          :disabled="!user.friends_count"
        >
          <FriendList :user-id="userId">
            <template
              slot="item"
              slot-scope="{item}"
            >
              <FollowCard :user="item" />
            </template>
          </FriendList>
        </div>
        <div
          v-if="followersTabVisible"
          key="followers"
          :label="$t('user_card.followers')"
          :disabled="!user.followers_count"
        >
          <FollowerList :user-id="userId">
            <template
              slot="item"
              slot-scope="{item}"
            >
              <FollowCard
                :user="item"
                :no-follows-you="isUs"
              />
            </template>
          </FollowerList>
        </div>
        <Timeline
          key="media"
          :label="$t('user_card.media')"
          :disabled="!media.visibleStatuses.length"
          :embedded="true"
          :title="$t('user_card.media')"
          timeline-name="media"
          :timeline="media"
          :user-id="userId"
          :in-profile="true"
        />
        <Timeline
          v-if="isUs"
          key="favorites"
          :label="$t('user_card.favorites')"
          :disabled="!favorites.visibleStatuses.length"
          :embedded="true"
          :title="$t('user_card.favorites')"
          timeline-name="favorites"
          :timeline="favorites"
          :in-profile="true"
        />
      </tab-switcher>
    </div>
    <div
      v-else
      class="panel user-profile-placeholder"
    >
      <div class="panel-heading">
        <div class="title">
          {{ $t('settings.profile_tab') }}
        </div>
      </div>
      <div class="panel-body">
        <span v-if="error">{{ error }}</span>
        <i
          v-else
          class="icon-spin3 animate-spin"
        />
      </div>
    </div>
  </div>
</template>

<script src="./user_profile.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.user-profile {
  flex: 2;
  flex-basis: 500px;

  .user-profile-fields {
    margin: 0 0.5em;
    img {
      object-fit: contain;
      vertical-align: middle;
      max-width: 100%;
      max-height: 400px;

      &.emoji {
        width: 18px;
        height: 18px;
      }
    }

    .user-profile-field {
      display: flex;
      margin: 0.25em auto;
      max-width: 32em;
      border: 1px solid var(--border, $fallback--border);
      border-radius: $fallback--inputRadius;
      border-radius: var(--inputRadius, $fallback--inputRadius);

      .user-profile-field-name {
        flex: 0 1 30%;
        font-weight: 500;
        text-align: right;
        color: var(--lightText);
        min-width: 120px;
        border-right: 1px solid var(--border, $fallback--border);
      }

      .user-profile-field-value {
        flex: 1 1 70%;
        color: var(--text);
        margin: 0 0 0 0.25em;
      }

      .user-profile-field-name, .user-profile-field-value {
        line-height: 18px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        padding: 0.5em 1.5em;
        box-sizing: border-box;
      }
    }
  }

  .userlist-placeholder {
    display: flex;
    justify-content: center;
    align-items: middle;
    padding: 2em;
  }

  .timeline-heading {
    display: flex;
    justify-content: center;

    .loadmore-button, .alert {
      flex: 1;
    }

    .loadmore-button {
      height: 28px;
      margin: 10px .6em;
    }

    .title, .loadmore-text {
      display: none
    }
  }
}
.user-profile-placeholder {
  .panel-body {
    display: flex;
    justify-content: center;
    align-items: middle;
    padding: 7em;
  }
}
</style>
