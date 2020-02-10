<template>
  <div
    v-if="federationPolicy"
    class="mrf-transparency-panel"
  >
    <div class="panel panel-default base01-background">
      <div class="panel-heading timeline-heading base02-background">
        <div class="title">
          {{ $t("about.federation") }}
        </div>
      </div>
      <div class="panel-body">
        <div class="mrf-section">
          <h2>{{ $t("about.mrf_policies") }}</h2>
          <p>{{ $t("about.mrf_policies_desc") }}</p>

          <ul>
            <li
              v-for="policy in mrfPolicies"
              :key="policy"
              v-text="policy"
            />
          </ul>

          <h2 v-if="hasInstanceSpecificPolicies">
            {{ $t("about.mrf_policy_simple") }}
          </h2>

          <div v-if="acceptInstances.length">
            <h4>{{ $t("about.mrf_policy_simple_accept") }}</h4>

            <p>{{ $t("about.mrf_policy_simple_accept_desc") }}</p>

            <ul>
              <li
                v-for="instance in acceptInstances"
                :key="instance"
                v-text="instance"
              />
            </ul>
          </div>

          <div v-if="rejectInstances.length">
            <h4>{{ $t("about.mrf_policy_simple_reject") }}</h4>

            <p>{{ $t("about.mrf_policy_simple_reject_desc") }}</p>

            <ul>
              <li
                v-for="instance in rejectInstances"
                :key="instance"
                v-text="instance"
              />
            </ul>
          </div>

          <div v-if="quarantineInstances.length">
            <h4>{{ $t("about.mrf_policy_simple_quarantine") }}</h4>

            <p>{{ $t("about.mrf_policy_simple_quarantine_desc") }}</p>

            <ul>
              <li
                v-for="instance in quarantineInstances"
                :key="instance"
                v-text="instance"
              />
            </ul>
          </div>

          <div v-if="ftlRemovalInstances.length">
            <h4>{{ $t("about.mrf_policy_simple_ftl_removal") }}</h4>

            <p>{{ $t("about.mrf_policy_simple_ftl_removal_desc") }}</p>

            <ul>
              <li
                v-for="instance in ftlRemovalInstances"
                :key="instance"
                v-text="instance"
              />
            </ul>
          </div>

          <div v-if="mediaNsfwInstances.length">
            <h4>{{ $t("about.mrf_policy_simple_media_nsfw") }}</h4>

            <p>{{ $t("about.mrf_policy_simple_media_nsfw_desc") }}</p>

            <ul>
              <li
                v-for="instance in mediaNsfwInstances"
                :key="instance"
                v-text="instance"
              />
            </ul>
          </div>

          <div v-if="mediaRemovalInstances.length">
            <h4>{{ $t("about.mrf_policy_simple_media_removal") }}</h4>

            <p>{{ $t("about.mrf_policy_simple_media_removal_desc") }}</p>

            <ul>
              <li
                v-for="instance in mediaRemovalInstances"
                :key="instance"
                v-text="instance"
              />
            </ul>
          </div>

          <h2 v-if="hasKeywordPolicies">
            {{ $t("about.mrf.keyword.keyword_policies") }}
          </h2>

          <div v-if="keywordsFtlRemoval.length">
            <h4>{{ $t("about.mrf.keyword.ftl_removal") }}</h4>

            <ul>
              <li
                v-for="keyword in keywordsFtlRemoval"
                :key="keyword"
                v-text="keyword"
              />
            </ul>
          </div>

          <div v-if="keywordsReject.length">
            <h4>{{ $t("about.mrf.keyword.reject") }}</h4>

            <ul>
              <li
                v-for="keyword in keywordsReject"
                :key="keyword"
                v-text="keyword"
              />
            </ul>
          </div>

          <div v-if="keywordsReplace.length">
            <h4>{{ $t("about.mrf.keyword.replace") }}</h4>

            <ul>
              <li
                v-for="keyword in keywordsReplace"
                :key="keyword"
              >
                {{ keyword.pattern }}
                {{ $t("about.mrf.keyword.is_replaced_by") }}
                {{ keyword.replacement }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./mrf_transparency_panel.js"></script>

<style lang="scss">
.mrf-section {
  margin: 1em;
}
</style>
