import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import FEIcon from '../components/icons/FEIcon'

Vue.use(Vuetify);

const opts = {
    icons: {
        values: {
            feicon: {
                component: FEIcon,
            }
        }
    }
}

export default new Vuetify(opts);
