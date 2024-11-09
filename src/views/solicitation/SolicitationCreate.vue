<template>
  <v-container>
    <v-row class="pb-3">
      <v-col cols="12">
        <PageHeader :text="pageTitle" />
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <Loading v-if="isGettingSol" />

    <v-stepper v-else v-model="step" mobile-breakpoint="sm" :items="items">
      <template v-slot:item.1>
        <v-container>
          <SolForm
            ref="solForm"
            :solicitation="solicitation"
            :show-submit-btn="false"
          />
        </v-container>
      </template>

      <template v-slot:item.2>
        <SolicitationQuestions
          v-if="solicitation"
          :solId="solicitation.id"
          :solName="solicitation.name"
          :questionUrl="questionUrl"
          :isUpdating="solId ? true : false"
          ref="qForm"
        />
      </template>

      <template v-slot:actions>
        <div class="d-flex pa-5 mx-5">
          <v-btn
            class="text-none"
            prepend-icon="mdi-arrow-left-circle-outline"
            :disabled="disablePreviousButton"
            rounded="pill"
            @click="goToSolForm"
            >{{ t("previous") }}</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            class="text-none"
            color="primary"
            rounded="pill"
            append-icon="mdi-arrow-right-circle-outline"
            :loading="isSubmitingSolForm || isSubmitingQForm"
            @click.prevent="onNext()"
            >{{ nextButtonText }}</v-btn
          >
        </div>
      </template>
    </v-stepper>
  </v-container>
  <Snackbar
    :color="snackBarColor"
    :message="snackBarMessage"
    :show="snackBarShow"
  />
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import SolForm from "./components/SolicitationForm.vue";
import SolicitationQuestions from "./components/SolicitationQuestions.vue";
import { computed, onMounted, ref } from "vue";
import { Solicitation } from "@/models/Solicitation";
import { useRoute } from "vue-router";
import { get } from "@/services/solicitation_service";
import { SnackbarColor } from "@/types/types";
import Loading from "@/views/components/loaders/default.vue";
import router from "@/router";
import Snackbar from "../components/snackbars/Default.vue";
import PageHeader from "../components/others/PageHeader.vue";

const route = useRoute();
const { t } = useI18n();
const solForm = ref<any>(null);
const qForm = ref<any>(null);
const step = ref<number>(1);
const items = [t("solicitationInfo"), t("solicitationQuestions")];
const solId = ref<string>(route.params.solId as string);
const isGettingSol = ref<boolean>();
const solicitation = ref<Solicitation>();

//SNACKBAR
const snackBarShow = ref(false);
const snackBarColor = ref<SnackbarColor>("success");
const snackBarMessage = ref("");

const hideSnackBar = async () => {
  snackBarShow.value = false;
  snackBarMessage.value = "";
  snackBarColor.value = "success";
};

const showSnackBar = (color: SnackbarColor, message: string) => {
  snackBarColor.value = color;
  snackBarMessage.value = message;
  snackBarShow.value = true;
};

const isSubmitingSolForm = ref<boolean>(false);
const isSubmitingQForm = ref<boolean>(false);

const onNext = () => {
  if (step.value == 1) submitSolForm();
  else submitQForm();
};

const submitSolForm = async () => {
  if (solForm.value) {
    hideSnackBar();
    try {
      isSubmitingSolForm.value = true;
      await solForm.value.submit().then((r: Solicitation) => {
        solicitation.value = r;
        step.value = 2;
        isSubmitingSolForm.value = false;
      });
    } catch (error) {
      isSubmitingSolForm.value = false;

      showSnackBar("error", t("generalErrorMessage"));
      console.error(error);
    }
  }
};

const submitQForm = async () => {
  if (qForm.value) {
    hideSnackBar();
    try {
      isSubmitingQForm.value = true;
      await qForm.value.submit().then(() => {
        router.push({
          name: "solicitations.show",
          params: { id: solicitation.value ? solicitation.value.id : "" },
        });
        isSubmitingQForm.value = false;
      });
    } catch (error) {
      isSubmitingQForm.value = false;
      
      let errorMessage = "";

// Check if the error is an Axios error with a response
if (error.response && error.response.data) {
  // If the server provided an error message, use it
  if (error.response.data.message) {
    errorMessage = error.response.data.message;
  } else {
    // Fallback to a generic message if no specific message is provided
    errorMessage = t("generalErrorMessage");
  }
} else if (error.message) {
  // For non-Axios errors or errors without a response
  errorMessage = error.message;
} else {
  // Final fallback
  errorMessage = t("generalErrorMessage");
}

showSnackBar("error", errorMessage);
throw error;

    }
  }
};

const disablePreviousButton = computed(() => {
  if (step.value == 1 || (isGettingSol.value == true && isBusy.value == true)) {
    return true;
  }
  return false;
});

const goToSolForm = () => {
  step.value = 1;
};

const pageTitle = solId.value ? t("editSolicitation") : t("solicitationCreate");

const getSol = async () => {
  isGettingSol.value = true;
  try {
    await get(solId.value).then((res) => {
      isGettingSol.value = false;
      solicitation.value = res;
    });
  } catch (error) {
    isGettingSol.value = false;
    showSnackBar("error", t("generalErrorMessage"));
  }
};

const nextButtonText = computed(() => {
  if (step.value == 2) return t("finish");
  return t("continue");
});

const isBusy = computed(() => {
  if (isSubmitingSolForm.value == true || isSubmitingQForm.value == true)
    return true;
  return false;
});

const questionUrl = computed(() => {
  if (solicitation.value) {
    const questions = solicitation.value.questions || [];
    if (questions.length > 0) return questions[0];
  }
  return null;
});

onMounted(async () => {
  if (solId.value) await getSol();
});
</script>

<style scoped></style>
