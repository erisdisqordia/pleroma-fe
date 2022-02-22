<template>
  <div class="staff-panel">
    <div class="panel panel-default base01-background">
      <div class="panel-heading timeline-heading base02-background">
        <div class="title">
          <FAIcon
            icon="pastafarianism"
          />
          {{ $t("about.staff") }}
        </div>
      </div>
      <div class="panel-body">
        <div
          v-for="group in groupedStaffAccounts"
          :key="group.role"
          class="staff-group"
        >
          <h4>The Admin Team</h4>
          <basic-user-card
            v-for="user in group.users"
            :key="user.screen_name"
            :user="user"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./staff_panel.js" ></script>

<style lang="scss">

.staff-group {
  padding-left: 1em;
  padding-top: 0.2em;
  padding-bottom: 2px;

  .basic-user-card {
    padding: 0.6em 0.4em;
    padding-left: 0;
    display: inline-block;
  }

  .basic-user-card-collapsed-content {
    display: none;
  }

  .still-image {
    border-radius: 15px;
  }

}

</style>
