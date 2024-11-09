<template>
  <v-container>
    <Loading v-if="isLoading" />
    <div v-else>
      <v-row class="pb-3">
        <v-col xs="12" sm="6" md="6" lg="6">
          <PageHeader :text="t('solicitationPage')" />
        </v-col>
        <v-col xs="12" sm="6" md="6" lg="6" class="d-flex justify-end">
          <!-- Donor action -->
          <ConfirmationDialog
            v-if="canSubmitForReview && item"
            :launch-btn-text="t('submitForReview')"
            :title="t('submitForReview')"
            :subtitle="t('confirmationText')"
            :show="true"
            :icon="'mdi-alpha-s-circle'"
            :url="`${
              apiEndpoints.solicitationUpdateStatus
            }/${encodeURIComponent(item.id)}/${encodeURIComponent(
              'submit for review'
            )}`"
            @success="updateStatus"
            @fail="failedToUpdateStatus"
          />

          <!-- Revert to draft -->
          <ConfirmationDialog
            v-if="canRevertToDraft && item && item.id"
            :launch-btn-text="t('revertToDraft')"
            :title="t('revertToDraft')"
            :subtitle="t('confirmationText')"
            :show="true"
            :icon="'mdi-alpha-r-circle'"
            :url="`${apiEndpoints.solicitationUpdateStatus}/${encodeURIComponent(
              item.id
            )}/${encodeURIComponent('revert to draft')}`"
            @success="updateStatus"
            @fail="failedToUpdateStatus"
          />

          <ConfirmationDialog
            v-if="canPublish && item"
            :launch-btn-text="t('publish')"
            :title="t('publishItem')"
            :subtitle="t('confirmationText')"
            :show="true"
            :icon="'mdi-alpha-p-circle'"
            :url="`${
              apiEndpoints.solicitationUpdateStatus
            }/${encodeURIComponent(item.id)}/publish`"
            @success="updateStatus"
            @fail="failedToUpdateStatus"
          />
          <PageHeaderBtn
            v-if="canRank"
            :loading="isRanking"
            color="primary"
            @click="rank"
            icon="mdi-alpha-r-circle"
            :text="t('rank')"
          />

          <PageHeaderBtn
            v-if="canShortList"
            color="primary"
            @click="showShortlistModal = true"
            icon="mdi-alpha-s-circle"
            :text="t('shortlist')"
          />

          <PageHeaderBtn
            v-if="canAward"
            color="primary"
            @click="showAwardModal = true"
            icon="mdi-star-circle"
            :text="t('award')"
          />

          <!-- Applicant action -->
          <PageHeaderBtn
            v-if="canApply && item"
            color="primary"
            @click="
              router.push({
                name: 'solicitations.apply',
                params: { solId: item.id },
              })
            "
            icon="mdi-check-circle"
            :text="t('apply')"
          />

          <PageHeaderBtn
            v-if="canEdit"
            color="secondary"
            @click="updateItem()"
            icon="mdi-pencil-circle"
            :text="t('edit')"
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

      <v-container v-if="item">
        <v-row>
          <v-col sm="12" md="7" lg="7" class="pr-5">
            <v-row>
              <v-col cols="12" md="6">
                <InfoSheet
                  bg-color="primary"
                  top-icon="mdi-format-list-text"
                  :top-title="t('solicitationName')"
                  :top-subtitle="item.name"
                  bottom-icon="mdi-currency-usd"
                  :bottom-title="t('fundingPerProjectUSD')"
                  :bottom-subtitle="formatCurrency(item.fundingPerProjectUSD)"
                />
              </v-col>
              <v-col cols="12" md="6">
                <InfoSheet
                  bg-color="grey"
                  top-icon="mdi-map-marker-radius-outline"
                  :top-title="t('location')"
                  :top-subtitle="item.locations.toString()"
                  bottom-icon="mdi-list-status"
                  :bottom-title="t('status')"
                  :bottom-subtitle="item.status.trim()"
                />
              </v-col>
            </v-row>
          </v-col>

          <v-col sm="12" md="5" lg="5" class="pl-5">
            <v-row align="start">
              <v-col cols="6">
                <InfoPill
                  bg-color="primary"
                  :title="t('startDate')"
                  :subtitle="formatAsShortDate(item.startDate)"
                />
              </v-col>
              <v-col cols="6">
                <InfoPill
                  bg-color="grey"
                  :title="t('endDate')"
                  :subtitle="formatAsShortDate(item.endDate)"
                />
              </v-col>
            </v-row>

            <v-row no-gutters class="pt-5">
              <v-col cols="12" class="text-uppercase text-subtitle-2">
                {{ t("program") }}
              </v-col>
              <v-col cols="12">
                <RouterLink
                  :to="{
                    name: 'programs.show',
                    params: { programId: item.programId },
                  }"
                >
                  {{ item.programName }}
                </RouterLink>
              </v-col>

              <v-col cols="12" class="pt-2">
                <DescCard :title="t('description')" :text="item.description" />
              </v-col>

              <v-col cols="12" v-if="documents" class="text-uppercase pt-5 text-subtitle-1 text-grey">
                {{ t("documents") }}
              </v-col>
              <v-col cols="auto" class="py-0">
                  <v-btn
                    rounded="pill"
                    :loading="document.isDownloading"
                    variant="tonal"
                    @click="
                      downloadDoc(
                        index,
                        document.id || '',
                        document.filename || ''
                      )
                    "
                    color="secondary"
                    class="my-1"
                    v-for="(document, index) in documents"
                  >
                    <span class="text-truncate" style="max-width: 180px">
                      {{ document.filename }}
                    </span>
                    <v-icon icon="mdi-download" end></v-icon>
                  </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <v-card
        variant="tonal"
        color="grey"
        rounded="xl"
        class="pa-5 mt-10"
        :loading="isLoadingQuestions"
        v-if="item"
      >
        <v-card-title>
          <v-row>
            <v-col cols="6">
              <PageHeader :text="t('questions')" />
            </v-col>
            <v-col cols="6" class="d-flex justify-end"> </v-col>
          </v-row>
        </v-card-title>
        <v-card-text v-if="sections">
          <QuestionsList :sections="sections" />
        </v-card-text>
      </v-card>
    </div>
  </v-container>

  <delete-dialog
    v-if="item"
    :delete-url="deleteUrl"
    :item-id="item.id"
    :item-name="item.name"
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

  <SolicitationShortlistModal
    v-if="item && canShortList"
    @success="appsShortlisted"
    @failed="failedToShortlist"
    @close="showShortlistModal = false"
    :sol-id="item?.id"
    :show="showShortlistModal"
  />

  <SolicitationAwardModal
    v-if="item && canAward"
    @success="appsAwarded"
    @failed="failedToAward"
    @close="showAwardModal = false"
    :sol-id="item?.id"
    :show="showAwardModal"
  />
</template>

<script setup lang="ts">
import { get, rankSol } from "@/services/solicitation_service";
import { ref, onMounted, computed, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import Loading from "@/views/components/loaders/default.vue";
import { formatCurrency } from "@/helpers/numberFormats";
import DeleteDialog from "@/views/components/DeleteDialog.vue";
import Snackbar from "@/views/components/snackbars/Default.vue";
import { SnackbarColor } from "@/types/types";
import apiEndpoints from "@/constants/endpoints";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { Solicitation } from "@/models/Solicitation";
import PageHeaderBtn from "../components/buttons/PageHeaderBtn.vue";
import PageHeader from "../components/others/PageHeader.vue";
import { SolicitationQuestionSections } from "@/models/SolicitationQuestionSection";
import { downloadFile, getFilesInfo } from "@/services/file_service";
import QuestionsList from "./components/QuestionsList.vue";
import { FileInfo } from "@/models/FileInfo";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import { getQuestions } from "@/services/solicitation_question_service";
import ConfirmationDialog from "../components/ConfirmationDialog.vue";
import { parseStatusFromString } from "@/models/Status";
import InfoSheet from "../components/cards/InfoSheet.vue";
import InfoPill from "../components/cards/InfoPill.vue";
import DescCard from "../components/cards/DescCard.vue";
import { formatAsShortDate } from "@/helpers/dateFormats";

const SolicitationShortlistModal = defineAsyncComponent(
  () => import("./components/SolicitationShortlistModal.vue")
);

const SolicitationAwardModal = defineAsyncComponent(
  () => import("./components/SolicitationAwardModal.vue")
);

const { t } = useI18n();
const route = useRoute();

const showShortlistModal = ref(false);
const showAwardModal = ref(false);
const item = ref<Solicitation>();
const isLoading = ref(true);
const isRanking = ref(false);
const authStore = useAuthStore();
const { isDonor, isApplicant } = storeToRefs(authStore);

const updateItem = () => {
  router.push({
    name: "solicitations.edit",
    params: {
      solId: item.value?.id,
    },
  });
};

//END UPDATE

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


const appsAwarded = () => {
  showAwardModal.value = false;
  showSnackBar("error", t("appsAwardedMgs"));
};

const appsShortlisted = () => {
  showShortlistModal.value = false;
  showSnackBar("error", t("appsShortlistedMgs"));
};

const failedToAward = () => {
  showAwardModal.value = false;
  showSnackBar("error", t("generalErrorMessage"));
};

const failedToShortlist = () => {
  showShortlistModal.value = false;
  showSnackBar("error", t("generalErrorMessage"));
};

const updateStatus = (r: any) => {
  if (item.value)
    item.value.status = parseStatusFromString(r.res[0]["id"].status);
  showSnackBar("success", t("statusChangedSuccessMessage"));
};

const failedToUpdateStatus = () => {
  showSnackBar("error", t("generalErrorMessage"));
};

const deleteItem = () => {
  deleteUrl.value = apiEndpoints.solicitationsDelete;
  showDeleteDialog.value = true;
};

const deleteFail = () => {
  showSnackBar("error", t("generalErrorMessage"));
  showDeleteDialog.value = false;
};

const deleteSuccess = (res: any) => {
  router.push({ name: "solicitations" });
};
//END DELETE

const getItem = async () => {
  isLoading.value = true;
  try {
    await get(route.params.solId as string).then((res) => {
      isLoading.value = false;
       console.log(res,"reeees")
      item.value = res;
    });
  } catch (error) {
    isLoading.value = false;
    showSnackBar("error", t("generalErrorMessage"));
  }
};

//Question
const sections = ref<SolicitationQuestionSections>();
const isLoadingQuestions = ref<boolean>(false);
const getSections = async () => {
  const questions: Array<string> = item.value?.questions || [];
  if (questions.length > 0) {
    isLoadingQuestions.value = true;
    try {
      await getQuestions(questions[0]).then((r) => {
        sections.value = r;
        isLoadingQuestions.value = false;
      });
    } catch (error) {
      isLoadingQuestions.value = false;
      //showSnackBar("error", t("generalErrorMessage"))
    }
  }
};
//End question

//Docs info
const documents = ref<Array<FileInfo>>();
const isLoadingDocumentsInfo = ref<boolean>(false);
const getDocumentsInfo = async () => {
  try {
    isLoadingDocumentsInfo.value = true;
    await getFilesInfo(item.value?.documents || []).then((r) => {
      isLoadingDocumentsInfo.value = false;
      if (r.length > 0) documents.value = r;
    });
  } catch (error) {
    isLoadingDocumentsInfo.value = false;
    throw error;
  }
};

const downloadDoc = async (index: number, fileId: string, filename: string) => {
  try {
    if (documents.value) documents.value[index].isDownloading = true;
    await downloadFile(fileId, filename).then((r) => {
      if (documents.value) documents.value[index].isDownloading = false;
    });
  } catch (error) {
    if (documents.value) documents.value[index].isDownloading = false;
    showSnackBar("error", t("errorDownloadingDocument"));
  }
};

//Ranking
const rank = async () => {
  try {
    isRanking.value = true;
    await rankSol(item.value?.id as string).then((r) => {
      isRanking.value = false;
    });
  } catch (error) {
    isRanking.value = false;
    showSnackBar("error", t("solRankError"));
  }
};
//End Ranking

//Applicant
const canApply = computed(() => {
  if (isApplicant.value && item.value) return true;
  return false;
});

//Donor

const canEdit = computed(() => {
  if (isDonor.value) {
    if (item.value) if (item.value.status == "Draft") return true;
  }
  return false;
});

const canDelete = computed(() => {
  if (isDonor.value) {
    if (item.value)
      if (item.value.status == "Draft" || item.value.status == "In Review"|| item.value.status == "Published")
        return true;
  }
  return false;
});

const canSubmitForReview = computed(() => {
  if (isDonor.value) {
    if (item.value) if (item.value.status == "Draft") return true;
  }
  return false;
});

const canPublish = computed(() => {
  if (isDonor.value) {
    if (item.value) if (item.value.status == "In Review") return true;
  }
  return false;
});

const canRank = computed(() => {
  if (isDonor.value) {
    if (item.value)
      if (item.value.status == "Published" && item.value.appReviewStatus === "complete")
        return true;
  }
  return false;
});

const canShortList = computed(() => {
  if (isDonor.value) {
    if (item.value) if (item.value.status == "Published" && item.value.appReviewStatus === "in_ranking") return true;
  }
  return false;
});

const canAward = computed(() => {
  if (isDonor.value) {
    if (item.value) if (item.value.status == "Published" && item.value.appReviewStatus === "in_shortlist") return true;
  }
  return false;
});

const canRevertToDraft = computed(() => {
  if (isDonor.value)
    if (item.value)
      if (
        item.value.status === "Published" ||
        item.value.status === "In Review"
      )
        return true;
  return false;
});

onMounted(async () => {
  await getItem();
  if (item.value?.questions.length || 0 > 0) await getSections();
  if (item.value?.documents.length || 0 > 0) await getDocumentsInfo();
});
</script>
