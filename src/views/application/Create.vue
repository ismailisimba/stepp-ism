<template>
    <v-container>
        <v-row class="pb-2">
            <v-col clas>
                <h2 class="text-subtitle-3 text-pageHeading"> {{ $t('addProgram') }}</h2>
            </v-col>
            <v-spacer></v-spacer>
            <v-col>

            </v-col>
        </v-row>
        <div class="pa-5">
            <Form></Form>
        </div>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Form from "./Form.vue"

export default defineComponent({
    name: "ProgramCreate",

    components: { Form }

})

</script>
