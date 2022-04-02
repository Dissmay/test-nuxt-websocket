import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

export default function ({ store }) {
    Vue.use(
        new VueSocketIO({
            debug: true,
            connection: 'http://185.233.36.144:3000',
            vuex: {
                store,
                actionPrefix: 'SOCKET_',
                mutationPrefix: 'SOCKET_'
            }
        })
    )
}
