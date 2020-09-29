
const VideoAttachment = {
  props: ['attachment', 'controls'],
  data () {
    return {
      blocksSuspend: false,
      // Start from true because removing "loop" property seems buggy in Vue
      hasAudio: true
    }
  },
  computed: {
    loopVideo () {
      if (this.$store.getters.mergedConfig.loopVideoSilentOnly) {
        return !this.hasAudio
      }
      return this.$store.getters.mergedConfig.loopVideo
    }
  },
  methods: {
    onPlaying (e) {
      this.setHasAudio(e)
      if (this.loopVideo) {
        this.$emit('play', { looping: true })
        return
      }
      this.$emit('play')
    },
    onPaused (e) {
      this.$emit('pause')
    },
    setHasAudio (e) {
      const target = e.srcElement || e.target
      // If hasAudio is false, we've already marked this video to not have audio,
      // a video can't gain audio out of nowhere so don't bother checking again.
      if (!this.hasAudio) return
      if (typeof target.webkitAudioDecodedByteCount !== 'undefined') {
        // non-zero if video has audio track
        if (target.webkitAudioDecodedByteCount > 0) return
      }
      if (typeof target.mozHasAudio !== 'undefined') {
        // true if video has audio track
        if (target.mozHasAudio) return
      }
      if (typeof target.audioTracks !== 'undefined') {
        if (target.audioTracks.length > 0) return
      }
      this.hasAudio = false
    }
  }
}

export default VideoAttachment
