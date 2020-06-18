<template>
  <tab-switcher
    :scrollable-tabs="true"
    class="mutes-and-blocks-tab"
  >
    <div :label="$t('settings.blocks_tab')">
      <div class="usersearch-wrapper">
        <Autosuggest
          :filter="filterUnblockedUsers"
          :query="queryUserIds"
          :placeholder="$t('settings.search_user_to_block')"
        >
          <BlockCard
            slot-scope="row"
            :user-id="row.item"
          />
        </Autosuggest>
      </div>
      <BlockList
        :refresh="true"
        :get-key="i => i"
      >
        <template
          slot="header"
          slot-scope="{selected}"
        >
          <div class="bulk-actions">
            <ProgressButton
              v-if="selected.length > 0"
              class="btn btn-default bulk-action-button"
              :click="() => blockUsers(selected)"
            >
              {{ $t('user_card.block') }}
              <template slot="progress">
                {{ $t('user_card.block_progress') }}
              </template>
            </ProgressButton>
            <ProgressButton
              v-if="selected.length > 0"
              class="btn btn-default"
              :click="() => unblockUsers(selected)"
            >
              {{ $t('user_card.unblock') }}
              <template slot="progress">
                {{ $t('user_card.unblock_progress') }}
              </template>
            </ProgressButton>
          </div>
        </template>
        <template
          slot="item"
          slot-scope="{item}"
        >
          <BlockCard :user-id="item" />
        </template>
        <template slot="empty">
          {{ $t('settings.no_blocks') }}
        </template>
      </BlockList>
    </div>

    <div :label="$t('settings.mutes_tab')">
      <tab-switcher>
        <div label="Users">
          <div class="usersearch-wrapper">
            <Autosuggest
              :filter="filterUnMutedUsers"
              :query="queryUserIds"
              :placeholder="$t('settings.search_user_to_mute')"
            >
              <MuteCard
                slot-scope="row"
                :user-id="row.item"
              />
            </Autosuggest>
          </div>
          <MuteList
            :refresh="true"
            :get-key="i => i"
          >
            <template
              slot="header"
              slot-scope="{selected}"
            >
              <div class="bulk-actions">
                <ProgressButton
                  v-if="selected.length > 0"
                  class="btn btn-default"
                  :click="() => muteUsers(selected)"
                >
                  {{ $t('user_card.mute') }}
                  <template slot="progress">
                    {{ $t('user_card.mute_progress') }}
                  </template>
                </ProgressButton>
                <ProgressButton
                  v-if="selected.length > 0"
                  class="btn btn-default"
                  :click="() => unmuteUsers(selected)"
                >
                  {{ $t('user_card.unmute') }}
                  <template slot="progress">
                    {{ $t('user_card.unmute_progress') }}
                  </template>
                </ProgressButton>
              </div>
            </template>
            <template
              slot="item"
              slot-scope="{item}"
            >
              <MuteCard :user-id="item" />
            </template>
            <template slot="empty">
              {{ $t('settings.no_mutes') }}
            </template>
          </MuteList>
        </div>

        <div :label="$t('settings.domain_mutes')">
          <div class="domain-mute-form">
            <Autosuggest
              :filter="filterUnMutedDomains"
              :query="queryKnownDomains"
              :placeholder="$t('settings.type_domains_to_mute')"
            >
              <DomainMuteCard
                slot-scope="row"
                :domain="row.item"
              />
            </Autosuggest>
          </div>
          <DomainMuteList
            :refresh="true"
            :get-key="i => i"
          >
            <template
              slot="header"
              slot-scope="{selected}"
            >
              <div class="bulk-actions">
                <ProgressButton
                  v-if="selected.length > 0"
                  class="btn btn-default"
                  :click="() => unmuteDomains(selected)"
                >
                  {{ $t('domain_mute_card.unmute') }}
                  <template slot="progress">
                    {{ $t('domain_mute_card.unmute_progress') }}
                  </template>
                </ProgressButton>
              </div>
            </template>
            <template
              slot="item"
              slot-scope="{item}"
            >
              <DomainMuteCard :domain="item" />
            </template>
            <template slot="empty">
              {{ $t('settings.no_mutes') }}
            </template>
          </DomainMuteList>
        </div>
      </tab-switcher>
    </div>
  </tab-switcher>
</template>

<script src="./mutes_and_blocks_tab.js"></script>
<style lang="scss" src="./mutes_and_blocks_tab.scss"></style>
