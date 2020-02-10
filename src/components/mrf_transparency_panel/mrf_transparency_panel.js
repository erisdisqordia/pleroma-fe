import { mapState } from 'vuex'
import { get } from 'lodash'

const MRFTransparencyPanel = {
  computed: {
    ...mapState({
      federationPolicy: state => get(state, 'instance.federationPolicy'),
      mrfPolicies: state => get(state, 'instance.federationPolicy.mrf_policies', []),
      quarantineInstances: state => get(state, 'instance.federationPolicy.quarantined_instances', []),
      acceptInstances: state => get(state, 'instance.federationPolicy.mrf_simple.accept', []),
      rejectInstances: state => get(state, 'instance.federationPolicy.mrf_simple.reject', []),
      ftlRemovalInstances: state => get(state, 'instance.federationPolicy.mrf_simple.federated_timeline_removal', []),
      mediaNsfwInstances: state => get(state, 'instance.federationPolicy.mrf_simple.media_nsfw', []),
      mediaRemovalInstances: state => get(state, 'instance.federationPolicy.mrf_simple.media_removal', []),
      keywordsFtlRemoval: state => get(state, 'instance.federationPolicy.mrf_keyword.federated_timeline_removal', []),
      keywordsReject: state => get(state, 'instance.federationPolicy.mrf_keyword.reject', []),
      keywordsReplace: state => get(state, 'instance.federationPolicy.mrf_keyword.replace', [])
    }),
    hasInstanceSpecificPolicies () {
      return this.quarantineInstances.length ||
        this.acceptInstances.length ||
        this.rejectInstances.length ||
        this.ftlRemovalInstances.length ||
        this.mediaNsfwInstances.length ||
        this.mediaRemovalInstances.length
    },
    hasKeywordPolicies () {
      return this.keywordsFtlRemoval.length ||
        this.keywordsReject.length ||
        this.keywordsReplace.length
    }
  }
}

export default MRFTransparencyPanel
