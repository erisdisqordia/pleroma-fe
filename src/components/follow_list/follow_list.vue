<template>
  <div class="follow-list">
    <user-card
      v-for="entry in entries"
      :key="entry.id" :user="entry"
      :showFollows="true"
    />
    <div class="text-center panel-footer">
      <a v-if="error" @click="fetchEntries" class="alert error">
        {{$t('general.generic_error')}}
      </a>
      <i v-else-if="loading" class="icon-spin3 animate-spin"/>
      <span v-else-if="bottomedOut"></span>
      <a v-else @click="fetchEntries">{{$t('general.more')}}</a>
    </div>
  </div>
</template>

<script src="./follow_list.js"></script>

<style lang="scss">

.follow-list {
  .panel-footer {
    padding: 10px;
  }

  .error {
    font-size: 14px;
  }
}

</style>
