<template>
  <div>
    <textarea
      v-if="multiline"
      ref="textarea"
      :value="text"
      :id="id"
      @input="text = $event.target.value, $emit('input', $event.target.value), autoResize && resize($event)" 
      @click="setCaret"
      @keyup="setCaret" :placeholder="placeholder" rows="1" :class="classObj"
      @keydown.down="cycleForward"
      @keydown.up="cycleBackward"
      @keydown.shift.tab="cycleBackward"
      @keydown.tab="cycleForward"
      @keydown.enter="replaceCandidate"
      @drop="drop && drop()"
      @dragover.prevent="dragoverPrevent && dragoverPrevent()"
      @paste="paste && paste()"
      @keydown.meta.enter="keydownMetaEnter && keydownMetaEnter()"
      @keyup.ctrl.enter="keyupCtrlEnter && keyupCtrlEnter()">
    </textarea>
    <input
      v-else
      ref="textarea"
      :value="text"
      :id="id"
      @input="text = $event.target.value, $emit('input', $event.target.value), autoResize && resize($event)" 
      @click="setCaret"
      @keyup="setCaret" :placeholder="placeholder" rows="1" :class="classObj"
      @keydown.down="cycleForward"
      @keydown.up="cycleBackward"
      @keydown.shift.tab="cycleBackward"
      @keydown.tab="cycleForward"
      @keydown.enter="replaceCandidate"
      @drop="drop && drop()"
      @dragover.prevent="dragoverPrevent && dragoverPrevent()"
      @paste="paste && paste()"
      @keydown.meta.enter="keydownMetaEnter && keydownMetaEnter()"
      @keyup.ctrl.enter="keyupCtrlEnter && keyupCtrlEnter()"/>
    <div style="position:relative;" v-if="candidates">
      <div class="autocomplete-panel">
        <div v-for="candidate in candidates" @click="replace(candidate.utf || (candidate.screen_name + ' '))">
          <div class="autocomplete" :class="{ highlighted: candidate.highlighted }">
            <span v-if="candidate.img"><img :src="candidate.img"></img></span>
            <span v-else>{{candidate.utf}}</span>
            <span>{{candidate.screen_name}}<small>{{candidate.name}}</small></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./autocomplete_input.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.autocomplete-panel {
  margin: 0 0.5em 0 0.5em;
  border-radius: $fallback--tooltipRadius;
  border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
  position: absolute;
  z-index: 1;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5);
  // this doesn't match original but i don't care, making it uniform.
  box-shadow: var(--popupShadow);
  min-width: 75%;
  background: $fallback--bg;
  background: var(--bg, $fallback--bg);
  color: $fallback--lightText;
  color: var(--lightText, $fallback--lightText);
}

.autocomplete {
  cursor: pointer;
  padding: 0.2em 0.4em 0.2em 0.4em;
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  display: flex;

  img {
    width: 24px;
    height: 24px;
    border-radius: $fallback--avatarRadius;
    border-radius: var(--avatarRadius, $fallback--avatarRadius);
    object-fit: contain;
  }

  span {
    line-height: 24px;
    margin: 0 0.1em 0 0.2em;
  }

  small {
    margin-left: .5em;
    color: $fallback--faint;
    color: var(--faint, $fallback--faint);
  }

  &.highlighted {
    background-color: $fallback--fg;
    background-color: var(--lightBg, $fallback--fg);
  }
}
</style>
