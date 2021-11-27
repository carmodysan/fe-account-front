<template>
    <v-container fill-height fluid>
        <div align="center" justify="center">
            <v-data-table :headers="headers" :items="operations" item-key="id">

            </v-data-table>
        </div>
    </v-container>
</template>

<style scoped>

</style>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'MADetails',

    data: () => ({
        maId: '',
        operations: [],
    }),

    methods: {
        initOperationsTable() {

        }
    },

    computed: {
		...mapGetters({
			user: 'auth/getUser',
		}),

        headers () {
            return [
                {
                    text: 'Date de l\'opération',
                    align: 'start',
                    sortable: false,
                    value: 'dateOp'
                },
                { text: 'Catégorie', value: 'category' },
                { text: 'Libellé', value: 'Description' },
                { text: 'Débit', value: 'debit' },
                { text: 'Crédit', value: 'credit' },
                { text: 'Pointée ?', value: 'checked' },
            ]
        }
    },

    created() {
        this.maId = this.$route.params.maId;
        this.operations = this.$route.params.operations;
    }
}
</script>