import InstanceSpecificPanel from '../instance_specific_panel/instance_specific_panel.vue'
import BlockListPanel from '../block_list_panel/block_list_panel.vue'
import FeaturesPanel from '../features_panel/features_panel.vue'
import TermsOfServicePanel from '../terms_of_service_panel/terms_of_service_panel.vue'
import StaffPanel from '../staff_panel/staff_panel.vue'
import MRFTransparencyPanel from '../mrf_transparency_panel/mrf_transparency_panel.vue'

const About = {
  components: {
    InstanceSpecificPanel,
    FeaturesPanel,
    TermsOfServicePanel,
    StaffPanel,
    BlockListPanel,
    MRFTransparencyPanel
  },
  computed: {
    showFeaturesPanel () { return this.$store.state.instance.showFeaturesPanel },
    showBlocks () { return this.$store.state.instance.instanceBlocks },
    currentUser () { return this.$store.state.users.currentUser },
    showInstanceSpecificPanel () {
      return this.$store.state.instance.showInstanceSpecificPanel &&
        !this.$store.getters.mergedConfig.hideISP &&
        this.$store.state.instance.instanceSpecificPanelContent
    }
  }
}

export default About
