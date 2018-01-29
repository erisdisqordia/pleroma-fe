<template>
  <div class='still-image' :class='{ animated: animated }' >
    <canvas ref="canvas" v-if="animated"></canvas>
    <img ref="src" :src="src" :referrerpolicy="referrerpolicy" v-on:load="drawCanvas"/>
  </div>
</template>

<script src="./still-image.js"></script>

<style lang="scss">
@import '../../_variables.scss';
.still-image {
    position: relative;
    
    &:hover canvas {
        display: none;
    }
    
    &.animated {
        &:hover::before,
        img {
            visibility: hidden
        }
        
        &:hover img {
            visibility: visible
        }

        &::before {
            content: 'gif';
            position: absolute;
            top: 5px;
            left: 5px;
            background: rgba(255,255,255,.5);
            display: block;
            padding: 2px;
            z-index: 2;
        }
    }

    canvas {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
    }
}
</style>
