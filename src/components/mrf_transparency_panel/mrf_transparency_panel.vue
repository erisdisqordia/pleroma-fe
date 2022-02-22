<template>
  <div
    v-if="federationPolicy"
    class="mrf-transparency-panel"
  >
    <div class="panel panel-default base01-background">
      <div class="panel-heading timeline-heading base02-background">
        <div class="title">
          {{ $t("about.mrf.federation") }}
        </div>
      </div>
      <div class="panel-body">
        <div class="mrf-section">
          <h2>{{ $t("about.mrf.mrf_policies") }}</h2>
          <p>{{ $t("about.mrf.mrf_policies_desc") }}</p>

          <ul>
            <li
              v-for="policy in mrfPolicies"
              :key="policy"
              v-text="policy"
            />
          </ul>

          <h2 v-if="hasInstanceSpecificPolicies">
            {{ $t("about.mrf.simple.simple_policies") }}
          </h2>

          <div v-if="acceptInstances.length">
            <h4>{{ $t("about.mrf.simple.accept") }}</h4>

            <p>{{ $t("about.mrf.simple.accept_desc") }}</p>

            <ul>
              <li
                v-for="instance in acceptInstances"
                :key="instance"
                v-text="instance"
              />
            </ul>
          </div>

          <div v-if="rejectInstances.length">
            <h4>{{ $t("about.mrf.simple.reject") }}</h4>

            <p>{{ $t("about.mrf.simple.reject_desc") }}</p>

            <ul class="reject-list">
              <li
                v-for="instance in rejectInstances"
                :key="instance"
                v-text="instance"
              />
            </ul>
          </div>

          <div v-if="ftlRemovalInstances.length">
            <h4>{{ $t("about.mrf.simple.ftl_removal") }}</h4>

            <p>{{ $t("about.mrf.simple.ftl_removal_desc") }}</p>

            <ul>
              <li
                v-for="instance in ftlRemovalInstances"
                :key="instance"
                v-text="instance"
              />
            </ul>
          </div>

          <div v-if="mediaNsfwInstances.length">
            <h4>{{ $t("about.mrf.simple.media_nsfw") }}</h4>

            <p>{{ $t("about.mrf.simple.media_nsfw_desc") }}</p>

            <ul>
              <li
                v-for="instance in mediaNsfwInstances"
                :key="instance"
                v-text="instance"
              />
            </ul>
          </div>

          <div v-if="mediaRemovalInstances.length">
            <h4>{{ $t("about.mrf.simple.media_removal") }}</h4>

            <p>{{ $t("about.mrf.simple.media_removal_desc") }}</p>

            <ul>
              <li
                v-for="instance in mediaRemovalInstances"
                :key="instance"
                v-text="instance"
              />
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
.mrf-transparency-panel {
  padding-bottom: 20px;
}
.reject-list {
  columns: 2;
}
</style>
