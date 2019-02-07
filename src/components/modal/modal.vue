<template>
  <transition name="modal">
    <div class="modal-mask" @click="close" v-if="show">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{title}}</h3>
        </div>
        <slot></slot>
        <a class="modal-close" @click="close"><i class="icon-cancel"></i></a>
      </div>
    </div>
  </transition>
</template>

<script src="./modal.js"></script>

<style lang="scss">
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(27,31,35,.5);
  transition: opacity .3s ease;
}

.modal-container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 450px;
  margin: 10vh auto;
  max-height: 80vh;
  max-width: 90vw;
  background-color: #fff;
  border: 1px solid #444d56;
  border-radius: 3px;
  box-shadow: 0 0 18px rgba(0,0,0,.4);
  transition: all .3s ease;
}

.modal-header {
  flex: none;
  background-color: #f6f8fa;
  border-bottom: 1px solid #d1d5da;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  padding: 16px;
  margin: 0;
}

h3.modal-title {
  font-size: 14px;
  font-weight: 600;
  color: #24292e;
  margin: 0;
}

.modal-close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 16px;
  cursor: pointer;
}

.modal-body {
  border-bottom: 1px solid #e1e4e8;
  padding: 16px;
  overflow-y: auto;
}

.modal-footer {
  flex: none;
  border-top: 1px solid #e1e4e8;
  margin-top: -1px;
  padding: 16px;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
