<template>
  <Popper
    trigger="click"
    @hide='showDropDown = false'
    append-to-body
    v-if="enabled && showPopper"
    :options="{
      placement: 'top',
      modifiers: {
        arrow: { enabled: true },
        offset: { offset: '0, 5px' },
      }
    }"
  >
    <div class="popper-wrapper">
      <div class="dropdown-menu">
        <button class="dropdown-item dropdown-item-icon" @click.prevent="pinStatus" v-if="!status.pinned && canPin">
          <i class="icon-pin"></i><span>{{$t("status.pin")}}</span>
        </button>
        <button class="dropdown-item dropdown-item-icon" @click.prevent="unpinStatus" v-if="status.pinned && canPin">
          <i class="icon-pin"></i><span>{{$t("status.unpin")}}</span>
        </button>
        <button class="dropdown-item dropdown-item-icon" @click.prevent="deleteStatus" v-if="canDelete">
          <i class="icon-cancel"></i><span>{{$t("status.delete")}}</span>
        </button>
      </div>
    </div>
    <div class="button-icon" slot="reference" @click="toggleMenu">
      <i class='icon-ellipsis' :class="{'icon-clicked': showDropDown}"></i>
    </div>
  </Popper>
</template>

<script src="./extra_buttons.js" ></script>

<style lang="scss">
@import '../../_variables.scss';
@import '../popper/popper.scss';

.icon-ellipsis {
  cursor: pointer;

  &:hover, &.icon-clicked {
    color: $fallback--text;
    color: var(--text, $fallback--text);
  }
}
</style>
