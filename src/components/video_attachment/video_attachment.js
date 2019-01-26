
const VideoAttachment = {
  props: ['attachment', 'controls'],
  data () {
    return {
      loopVideo: this.$store.state.config.loopVideo
    }
  },
  methods: {
    onVideoDataLoad (e) {
      const target = e.srcElement || e.target
      if (typeof target.webkitAudioDecodedByteCount !== 'undefined') {
        // non-zero if video has audio track
        if (target.webkitAudioDecodedByteCount > 0) {
          this.loopVideo = this.loopVideo && !this.$store.state.config.loopVideoSilentOnly
        }
      } else if (typeof target.mozHasAudio !== 'undefined') {
        // true if video has audio track
        if (target.mozHasAudio) {
          this.loopVideo = this.loopVideo && !this.$store.state.config.loopVideoSilentOnly
        }
      } else if (typeof target.audioTracks !== 'undefined') {
        if (target.audioTracks.length > 0) {
          this.loopVideo = this.loopVideo && !this.$store.state.config.loopVideoSilentOnly
        }
      }
    }
  }
}

export default VideoAttachment
