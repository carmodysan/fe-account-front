<template>
    <v-container>
        Home {{ user.email }}
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Home',

    computed: {
        ...mapGetters({
            user: 'auth/getUser',
        })
    }
}
</script>