<template>
  <v-container fluid>
    <Loading v-if="isLoading" />
    <div v-else>
      <v-row class="pb-3">
        <v-col xs="12" sm="12" md="6" lg="6">
          <PageHeader :text="t('applicationPage')" />
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="6" class="d-flex justify-end">
          <!-- Applicant -->
          <PageHeaderBtn
            v-if="isApplicant"
            color="primary"
            icon="mdi-plus-circle"
            :text="t('edit')"
            @click="
              router.push({
                name: 'solicitations.apply',
                params: { solId: application?.solicitationId },
              })
            "
          />

          <!-- DONOR -->

          <!-- Review -->
          <PageHeaderBtn
            v-if="canReview && application"
            color="primary"
            icon="mdi-star-circle"
            :text="t('review')"
            @click="
              router.push({
                name: 'applications.review',
                params: {
                  solId: application?.solicitationId,
                  applicantEmail: application?.contactEmail,
                },
              })
            "
          />

          <!-- Create project -->
          <PageHeaderBtn
            v-if="canCreateProject && application"
            color="primary"
            icon="mdi-plus-circle"
            :text="t('createProject')"
            @click="
              router.push({
                name: 'projects.create',
                params: {
                  appId: application?.id,
                },
              })
            "
          />

          <PageHeaderBtn
            v-if="canDelete"
            color="error"
            @click="deleteItem()"
            icon="mdi-minus-circle"
            :text="t('delete')"
          />
        </v-col>
      </v-row>

      <v-row v-if="application">
        <v-col sm="12" md="7" lg="7" class="pr-5">
          <v-row>
            <v-col cols="12" md="6">
              <InfoSheet
                bg-color="primary"
                top-icon="mdi-counter"
                :top-title="t('marks')"
                :top-subtitle="application.marks || 'N/A'"
                bottom-icon="mdi-format-list-numbered"
                :bottom-title="t('averageMarks')"
                :bottom-subtitle="application.avgMarks || 'N/A'"
              />
            </v-col>
            <v-col cols="12" md="6">
              <InfoSheet
                bg-color="grey"
                top-icon="mdi-numeric"
                :top-title="t('rank')"
                :bottom-title="t('status')"
                :top-subtitle="application.rank || 'N/A'"
                bottom-icon="mdi-list-status"
                :bottom-subtitle="application.status"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col sm="12" md="5" lg="5" class="pl-5">
          <v-row justify="start" no-gutters class="pt-3">
            <v-col cols="12" class="text-uppercase text-subtitle-2">
              {{ t("applicationName") }}
            </v-col>
            <v-col cols="12" class="text-subtitle-1">
              {{ application.name }}
            </v-col>
          </v-row>
          <v-row justify="start" no-gutters class="pt-3">
            <v-col cols="12" class="text-uppercase text-subtitle-2">
              {{ t("solicitationName") }}
            </v-col>
            <v-col cols="12" class="text-uppercase text-subtitle-1">
              <RouterLink
                :to="{
                  name: 'solicitations.show',
                  params: { solId: application.solicitationId },
                }"
              >
                <span class="text-capitalize">{{
                  application.solicitationName.trim()
                }}</span>
              </RouterLink>
            </v-col>
          </v-row>
          <v-row justify="start" no-gutters class="pt-3">
            <v-col cols="12" class="text-uppercase text-subtitle-2">
              {{ t("programName") }}
            </v-col>
            <v-col cols="12" class="text-uppercase text-subtitle-1">
              <RouterLink
                :to="{
                  name: 'programs.show',
                  params: { programId: application.programId },
                }"
              >
                <span class="text-capitalize">{{
                  application.programName.trim()
                }}</span>
              </RouterLink>
            </v-col>
          </v-row>

          <v-row justify="start" no-gutters class="pt-3">
            <v-col cols="12" class="text-uppercase text-subtitle-2">
              {{ t("contactEmail") }}
            </v-col>
            <v-col cols="12" class="text-subtitle-1">
              {{ application.applicantName }}
            </v-col>
          </v-row>

          <v-row justify="start" no-gutters class="pt-3">
            <v-col cols="12" class="text-uppercase text-subtitle-2">
              {{ t("applicantName") }}
            </v-col>
            <v-col cols="12" class="text-subtitle-1">
              {{ application.contactEmail }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <br><br>

      <v-row class="pb-0">
        <v-col xs="12" sm="12" md="6" lg="6">
          <PageHeader :text="t('applicationAnswers')" />
        </v-col>
      </v-row>
      <v-card
        v-if="answers"
        rounded="lg"
        variant="tonal"
        v-for="(section, index) in answers?.sections"
        class="my-5"
      >
        <v-card-title>
          {{ section.title ? section.title : `${$t("section")} ${index + 1}` }}
        </v-card-title>

        <v-card-text>
          <v-row no-gutters>
            <v-col
              cols="12 pb-3"
              v-for="(question, index) in section.questions"
            >
              <p class="pb-1">{{ index + 1 }}. {{ question.text }}</p>

              <div v-if="question.userInput">
                <span class="font-italic font-weight-regular">{{
                  $t("answer")
                }}</span>
                <br />
                <p>
                  {{ question.userInput }}
                </p>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </v-container>

  <delete-dialog
    v-if="application"
    :delete-url="deleteUrl"
    :item-id="application.id"
    :item-name="application.name"
    :show="showDeleteDialog"
    @close="showDeleteDialog = false"
    @deleted="deleteSuccess"
    @failed="deleteFail"
  />

  <Snackbar
    :show="snackBarShow"
    :color="snackBarColor"
    :message="snackBarMessage"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, computed } from "vue";
import { useRoute } from "vue-router";
import Loading from "@/views/components/loaders/default.vue";
import { SnackbarColor } from "@/types/types";
import apiEndpoints from "@/constants/endpoints";
import { useI18n } from "vue-i18n";
import router from "@/router";
import PageHeaderBtn from "../components/buttons/PageHeaderBtn.vue";
import PageHeader from "../components/others/PageHeader.vue";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import { getApplication } from "@/services/application_service";
import { Application } from "@/models/Application";
import InfoSheet from "../components/cards/InfoSheet.vue";
import DeleteDialog from "../components/DeleteDialog.vue";
import { questions } from "@/services/solicitation_question_service";
import { ApplicationInfo } from "@/models/ApplicationInfo";

const Snackbar = defineAsyncComponent(
  () => import("@/views/components/snackbars/Default.vue")
);

const { t } = useI18n();
const route = useRoute();

const authStore = useAuthStore();
const { isDonor, isApplicant } = storeToRefs(authStore);
const application = ref<Application>();
const isLoading = ref(true);
const isLoadingAnswers = ref(false);
const answers = ref<ApplicationInfo>();

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

//DELETE
const showDeleteDialog = ref(false);
const deleteUrl = ref("");

const deleteItem = () => {
  deleteUrl.value = apiEndpoints.applicationDelete;
  showDeleteDialog.value = true;
};

const deleteFail = () => {
  showSnackBar("error", t("generalErrorMessage"));
  showDeleteDialog.value = false;
};

const deleteSuccess = (res: any) => {
  router.push({ name: "application" });
};
//END DELETE

const getApp = async () => {
  isLoading.value = true;
  try {
    await getApplication(route.params.appId as string).then((res) => {
      isLoading.value = false;
      application.value = res;
    });
  } catch (error) {
    isLoading.value = false;
    showSnackBar("error", t("generalErrorMessage"));
  }
};

const getAnswers = async () => {
  isLoadingAnswers.value = true;
  try {
    await questions(application.value?.solicitationAnswers as string).then(
      (res) => {
        isLoadingAnswers.value = false;
        answers.value = res;
      }
    );
  } catch (error) {
    isLoadingAnswers.value = false;
    showSnackBar("error", t("generalErrorMessage"));
  }
};

const canReview = computed(() => {
  if (isDonor.value)
    if ((application.value?.status as string) == "submitted") return true;
  return false;
});

const canCreateProject = computed(() => {
  if (isDonor.value)
    if ((application.value?.status as string) == "awarded") return true;
  return false;
});

const canDelete = computed(() => {
  if (application.value && isApplicant.value) return true;
  return false;
});

onMounted(async () => {
  await getApp();
  if (application.value?.solicitationAnswers != null) await getAnswers();
});
</script>

<style scoped></style>
