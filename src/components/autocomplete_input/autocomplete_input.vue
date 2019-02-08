<template>
  <div>
    <textarea
      ref="textarea"
      :value="text"
      @input="text = $event.target.value, $emit('input', $event.target.value), autoResize && resize($event)" 
      @click="setCaret"
      @keyup="setCaret" :placeholder="$t('post_status.default')" rows="1" :class="classObj"
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
