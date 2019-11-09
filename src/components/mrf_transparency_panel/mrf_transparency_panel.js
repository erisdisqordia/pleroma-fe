import { mapState } from 'vuex'

const MRFTransparencyPanel = {
  computed: mapState({
    federationPolicy: state => state.instance.federationPolicy,
    mrfPolicies: state => state.instance.federationPolicy.mrf_policies,
    acceptInstances: state => state.instance.federationPolicy.mrf_simple.accept,
    rejectInstances: state => state.instance.federationPolicy.mrf_simple.reject,
    quarantineInstances: state => state.instance.federationPolicy.quarantined_instances,
    ftlRemovalInstances: state => state.instance.federationPolicy.mrf_simple.federated_timeline_removal,
    mediaNsfwInstances: state => state.instance.federationPolicy.mrf_simple.media_nsfw,
    mediaRemovalInstances: state => state.instance.federationPolicy.mrf_simple.media_removal
  })
}

export default MRFTransparencyPanel
