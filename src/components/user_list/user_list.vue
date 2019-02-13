<template functional>
  <div class="user-list">
    <basic-user-card
      v-for="entry in entries"
      :key="entry.id"
      :user="entry"
    />
  </div>
</template>

<script src="./user_list.js"></script>