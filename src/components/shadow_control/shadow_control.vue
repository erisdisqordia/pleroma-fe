<template>
  <div
    class="shadow-control"
    :class="{ disabled: !present }"
  >
    <div class="shadow-preview-container">
      <div
        :disabled="!present"
        class="y-shift-control"
      >
        <input
          v-model="selected.y"
          :disabled="!present"
          class="input-number"
          type="number"
        >
        <div class="wrap">
          <input
            v-model="selected.y"
            :disabled="!present"
            class="input-range"
            type="range"
            max="20"
            min="-20"
          >
        </div>
      </div>
      <div class="preview-window">
        <div
          class="preview-block"
          :style="style"
        />
      </div>
      <div
        :disabled="!present"
        class="x-shift-control"
      >
        <input
          v-model="selected.x"
          :disabled="!present"
          class="input-number"
          type="number"
        >
        <div class="wrap">
          <input
            v-model="selected.x"
            :disabled="!present"
            class="input-range"
            type="range"
            max="20"
            min="-20"
          >
        </div>
      </div>
    </div>

    <div class="shadow-tweak">
      <div
        :disabled="usingFallback"
        class="id-control style-control"
      >
        <label
          for="shadow-switcher"
          class="select"
          :disabled="!ready || usingFallback"
        >
          <select
            id="shadow-switcher"
            v-model="selectedId"
            class="shadow-switcher"
            :disabled="!ready || usingFallback"
          >
            <option
              v-for="(shadow, index) in cValue"
              :key="index"
              :value="index"
            >
              {{ $t('settings.style.shadows.shadow_id', { value: index }) }}
            </option>
          </select>
          <FAIcon
            icon="chevron-down"
            class="select-down-icon"
          />
        </label>
        <button
          class="btn btn-default"
          :disabled="!ready || !present"
          @click="del"
        >
          <FAIcon
            fixed-width
            icon="times"
          />
        </button>
        <button
          class="btn btn-default"
          :disabled="!moveUpValid"
          @click="moveUp"
        >
          <FAIcon
            fixed-width
            icon="chevron-up"
          />
        </button>
        <button
          class="btn btn-default"
          :disabled="!moveDnValid"
          @click="moveDn"
        >
          <FAIcon
            fixed-width
            icon="chevron-down"
          />
        </button>
        <button
          class="btn btn-default"
          :disabled="usingFallback"
          @click="add"
        >
          <FAIcon
            fixed-width
            icon="plus"
          />
        </button>
      </div>
      <div
        :disabled="!present"
        class="inset-control style-control"
      >
        <label
          for="inset"
          class="label"
        >
          {{ $t('settings.style.shadows.inset') }}
        </label>
        <input
          id="inset"
          v-model="selected.inset"
          :disabled="!present"
          name="inset"
          class="input-inset"
          type="checkbox"
        >
        <label
          class="checkbox-label"
          for="inset"
        />
      </div>
      <div
        :disabled="!present"
        class="blur-control style-control"
      >
        <label
          for="spread"
          class="label"
        >
          {{ $t('settings.style.shadows.blur') }}
        </label>
        <input
          id="blur"
          v-model="selected.blur"
          :disabled="!present"
          name="blur"
          class="input-range"
          type="range"
          max="20"
          min="0"
        >
        <input
          v-model="selected.blur"
          :disabled="!present"
          class="input-number"
          type="number"
          min="0"
        >
      </div>
      <div
        :disabled="!present"
        class="spread-control style-control"
      >
        <label
          for="spread"
          class="label"
        >
          {{ $t('settings.style.shadows.spread') }}
        </label>
        <input
          id="spread"
          v-model="selected.spread"
          :disabled="!present"
          name="spread"
          class="input-range"
          type="range"
          max="20"
          min="-20"
        >
        <input
          v-model="selected.spread"
          :disabled="!present"
          class="input-number"
          type="number"
        >
      </div>
      <ColorInput
        v-model="selected.color"
        :disabled="!present"
        :label="$t('settings.style.common.color')"
        :fallback="currentFallback.color"
        :show-optional-tickbox="false"
        name="shadow"
      />
      <OpacityInput
        v-model="selected.alpha"
        :disabled="!present"
      />
      <i18n
        path="settings.style.shadows.hintV3"
        tag="p"
      >
        <code>--variable,mod</code>
      </i18n>
    </div>
  </div>
</template>

<script src="./shadow_control.js" ></script>

<style lang="scss">
@import '../../_variables.scss';
.shadow-control {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1em;

  .shadow-preview-container,
  .shadow-tweak {
    margin: 5px 6px 0 0;
  }
  .shadow-preview-container {
    flex: 0;
    display: flex;
    flex-wrap: wrap;

    $side: 15em;

    input[type=number] {
      width: 5em;
      min-width: 2em;
    }
    .x-shift-control,
    .y-shift-control {
      display: flex;
      flex: 0;

      &[disabled=disabled] *{
        opacity: .5
      }

    }

    .x-shift-control {
      align-items: flex-start;
    }

    .x-shift-control .wrap,
    input[type=range] {
      margin: 0;
      width: $side;
      height: 2em;
    }
    .y-shift-control {
      flex-direction: column;
      align-items: flex-end;
      .wrap {
        width: 2em;
        height: $side;
      }
      input[type=range] {
        transform-origin: 1em 1em;
        transform: rotate(90deg);
      }
    }
    .preview-window {
      flex: 1;
      background-color: #999999;
      display: flex;
      align-items: center;
      justify-content: center;
      background-image:
      linear-gradient(45deg, #666666 25%, transparent 25%),
      linear-gradient(-45deg, #666666 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #666666 75%),
      linear-gradient(-45deg, transparent 75%, #666666 75%);
      background-size: 20px 20px;
      background-position:0 0, 0 10px, 10px -10px, -10px 0;

      border-radius: $fallback--inputRadius;
      border-radius: var(--inputRadius, $fallback--inputRadius);

      .preview-block {
        width: 33%;
        height: 33%;
        background-color: $fallback--bg;
        background-color: var(--bg, $fallback--bg);
        border-radius: $fallback--panelRadius;
        border-radius: var(--panelRadius, $fallback--panelRadius);
      }
    }
  }

  .shadow-tweak {
    flex: 1;
    min-width: 280px;

    .id-control {
      align-items: stretch;
      .select, .btn {
        min-width: 1px;
        margin-right: 5px;
      }
      .btn {
        padding: 0 .4em;
        margin: 0 .1em;
      }
      .select {
        flex: 1;
        select {
          align-self: initial;
        }
      }
    }
  }
}
</style>
