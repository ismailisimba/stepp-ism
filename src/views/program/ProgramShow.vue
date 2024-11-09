<template>
  <v-container fluid>
    <Loading v-if="isLoading" />
    <div v-else>
      <v-row class="pb-3">
        <v-col xs="12" sm="12" md="6" lg="6">
          <PageHeader :text="t('programPage')" />
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="6" class="d-flex justify-end">
          <PageHeaderBtn
            v-if="canEdit"
            color="#4f545c"
            @click="updateP()"
            icon="mdi-pencil-circle"
            :text="t('edit')"
          />

          <!-- Revert to draft -->
          <ConfirmationDialog
            v-if="canRevertToDraft && program && program.id"
            :launch-btn-text="t('revertToDraft')"
            :title="t('revertToDraft')"
            :subtitle="t('confirmationText')"
            :show="true"
            :icon="'mdi-alpha-r-circle'"
            :url="`${apiEndpoints.programUpdateStatus}/${encodeURIComponent(
              program.id
            )}/${encodeURIComponent('revert to draft')}`"
            @success="updateStatus"
            @fail="failedToUpdateStatus"
          />

          <!-- Publish -->
          <ConfirmationDialog
            v-if="canPublish && program && program.id"
            :launch-btn-text="t('publish')"
            :title="t('publishItem')"
            :subtitle="t('confirmationText')"
            :show="true"
            :icon="'mdi-alpha-p-circle'"
            :url="`${apiEndpoints.programUpdateStatus}/${encodeURIComponent(
              program.id
            )}/publish`"
            @success="updateStatus"
            @fail="failedToUpdateStatus"
          />

          <!-- Submit for review -->
          <ConfirmationDialog
            v-if="canSubmitForReview && program && program.id"
            :launch-btn-text="t('submitForReview')"
            :title="t('submitForReview')"
            :subtitle="t('confirmationText')"
            :show="true"
            :icon="'mdi-alpha-s-circle'"
            :url="`${apiEndpoints.programUpdateStatus}/${encodeURIComponent(
              program.id
            )}/${encodeURIComponent('submit for review')}`"
            @success="updateStatus"
            @fail="failedToUpdateStatus"
          />

          <PageHeaderBtn
            v-if="canAddSol"
            color="primary"
            icon="mdi-plus-circle"
            :text="t('addSolicitation')"
          />

          <PageHeaderBtn
            v-if="canDelete"
            color="error"
            @click="deleteP()"
            icon="mdi-minus-circle"
            :text="t('delete')"
          />
        </v-col>
      </v-row>

      <v-container v-if="program">
        <v-row>
          <v-col sm="12" md="7" lg="7" class="pr-5">
            <v-row>
              <v-col cols="12" md="6">
                <InfoSheet
                  bg-color="primary"
                  top-icon="mdi-format-list-text"
                  :top-title="t('programName')"
                  :top-subtitle="program?.name"
                  bottom-icon="mdi-currency-usd"
                  :bottom-title="t('fundingUSD')"
                  :bottom-subtitle="program.fundingUSD"
                />
              </v-col>
              <v-col cols="12" md="6">
                <InfoSheet
                  bg-color="grey"
                  top-icon="mdi-map-marker-radius-outline"
                  :top-title="t('location')"
                  :bottom-title="t('status')"
                  :top-subtitle="program.locations.toString()"
                  bottom-icon="mdi-list-status"
                  :bottom-subtitle="program.status.trim()"
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
                  :subtitle="formatAsShortDate(program.startDate)"
                />
              </v-col>
              <v-col cols="6">
                <InfoPill
                  bg-color="grey"
                  :title="t('endDate')"
                  :subtitle="formatAsShortDate(program.endDate)"
                />
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="12" v-if="program.description">
                <DescCard
                  :title="t('programDesc')"
                  :text="program.description"
                />
              </v-col>
              <v-col
                cols="12"
                v-if="documents"
                class="text-uppercase pt-5 text-subtitle-1 text-grey"
              >
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

      <v-card flat class="pa-3" v-if="program">
        <v-card-text>
          <v-row class="pb-3">
            <v-col cols="6">
              <p class="text-h5 text-pageHeading">
                {{ $t("solicitations") }}
              </p>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="6" class="d-flex justify-end">
              <PageHeaderBtn
                v-if="canAddSol"
                color="primary"
                icon="mdi-plus-circle"
                :text="t('addSolicitation')"
              />
            </v-col>
          </v-row>

          <!-- List -->
          <DonorSolicitationList
            v-if="isDonor"
            :page="1"
            :items-per-page="1000"
            :page-count="1"
            :items-count="1000"
            :is-loading-data="isLoadingSolicitations"
            :solicitations="solicitations"
          />

          <ApplicantSolicitationList
            v-if="isApplicant"
            :page="1"
            :items-per-page="1000"
            :page-count="1"
            :items-count="1000"
            :is-loading-data="isLoadingSolicitations"
            :solicitations="solicitations"
          />
          <!-- End List -->
        </v-card-text>
      </v-card>
    </div>
  </v-container>

  <delete-dialog
    v-if="program"
    :delete-url="deleteUrl"
    :item-id="program.id"
    :item-name="program.name"
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

  <PopUpForm
    v-if="program"
    :program="program"
    :documents="documents"
    :show="showUpdateDialog"
    @succeed="onSuccessUpdate"
    @fail="onFailUpdate"
    @close="showUpdateDialog = false"
  />
</template>

<script setup lang="ts">
import {
  show,
  solicitations as getSolicitations,
} from "@/services/program_service";
import { Program } from "@/models/Program";
import { ref, onMounted, defineAsyncComponent, computed } from "vue";
import { useRoute } from "vue-router";
import Loading from "@/views/components/loaders/default.vue";
import { SnackbarColor } from "@/types/types";
import apiEndpoints from "@/constants/endpoints";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { Solicitations } from "@/models/Solicitation";
import PageHeaderBtn from "../components/buttons/PageHeaderBtn.vue";
import PageHeader from "../components/others/PageHeader.vue";
import { downloadFile, getFilesInfo } from "@/services/file_service";
import { FileInfo } from "@/models/FileInfo";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import InfoSheet from "../components/cards/InfoSheet.vue";
import InfoPill from "../components/cards/InfoPill.vue";
import { formatAsShortDate } from "@/helpers/dateFormats";
import DescCard from "../components/cards/DescCard.vue";
import { parseStatusFromString } from "@/models/Status";
import ConfirmationDialog from "../components/ConfirmationDialog.vue";

const DonorSolicitationList = defineAsyncComponent(
  () => import("@/views/solicitation/components/DonorSolicitationList.vue")
);

const ApplicantSolicitationList = defineAsyncComponent(
  () => import("@/views/solicitation/components/ApplicantSolicitationList.vue")
);

const DeleteDialog = defineAsyncComponent(
  () => import("@/views/components/DeleteDialog.vue")
);
const Snackbar = defineAsyncComponent(
  () => import("@/views/components/snackbars/Default.vue")
);
const PopUpForm = defineAsyncComponent(
  () => import("@/views/program/PopUpForm.vue")
);

const { t } = useI18n();
const route = useRoute();

const authStore = useAuthStore();
const { isDonor, isApplicant } = storeToRefs(authStore);

//UPDATE
const showUpdateDialog = ref(false);

const onSuccessUpdate = (programU: Program) => {
  program.value = programU;
  showUpdateDialog.value = false;
  snackBarColor.value = "success";
  snackBarMessage.value = t("programUpdatedMessage");
  snackBarShow.value = true;
  documents.value = [];
  getDocumentsInfo();
};

const onFailUpdate = () => {
  snackBarColor.value = "error";
  snackBarMessage.value = t("generalErrorMessage");
  snackBarShow.value = true;
};

const updateP = async () => {
  if (!documents.value || documents.value.length === 0) {
    await getDocumentsInfo(); // Wait for documents to be fetched
  }
  showUpdateDialog.value = true;
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

const deleteP = () => {
  deleteUrl.value = apiEndpoints.programDelete;
  showDeleteDialog.value = true;
};

const deleteFail = () => {
  snackBarShow.value = true;
  snackBarColor.value = "error";
  snackBarMessage.value = t("generalErrorMessage");
  showDeleteDialog.value = false;
};

const deleteSuccess = (res: any) => {
  router.push({ name: "programs" });
};
//END DELETE

const program = ref<Program>();
const isLoading = ref(true);


const updateStatus = (r: any) => {
  if (program.value)
    program.value.status = parseStatusFromString(r.res[0]["id"].status);
  showSnackBar("success", t("statusChangedSuccessMessage"));
};

const failedToUpdateStatus = () => {
  showSnackBar("error", t("generalErrorMessage"));
};

const getProgram = async () => {
  isLoading.value = true;
  try {
    await show(route.params.programId as string).then((res: Program) => {
      isLoading.value = false;
      program.value = res;
    });
  } catch (error) {
    isLoading.value = false;
  }
};

const isLoadingSolicitations = ref<boolean>(false);
const solicitations = ref<Solicitations>([]);
const getSol = async () => {
  const ids = program.value?.solicitations || null;

  if (ids) {
    isLoadingSolicitations.value = true;
    try {
      await getSolicitations(ids).then((res) => {
        isLoadingSolicitations.value = false;
        solicitations.value = res as Solicitations;
      });
    } catch (error) {
      isLoadingSolicitations.value = false;
    }
  }
};

//Docs info
const documents = ref<Array<FileInfo>>();
const isLoadingDocumentsInfo = ref<boolean>(false);
const getDocumentsInfo = async () => {
  try {
    isLoadingDocumentsInfo.value = true;
    await getFilesInfo(program.value?.documents || []).then((r) => {
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

const canRevertToDraft = computed(() => {
  if (isDonor.value)
    if (program.value)
      if (
        program.value.status === "Published" ||
        program.value.status === "In Review"
      )
        return true;
  return false;
});

const canSubmitForReview = computed(() => {
  if (isApplicant.value == true || isDonor.value == true)
    if (program.value) if (program.value.status === "Draft") return true;
  return false;
});

const canPublish = computed(() => {
  if (isDonor.value) {
    if (program.value) if (program.value.status == "In Review") return true;
  }
  return false;
});

const canEdit = computed(() => {
  if (isDonor.value == true)
    if (program.value) if (program.value.status === "Draft" || program.value.status === "In Review") return true;
  return false;
});

const canAddSol = computed(() => {
  return false;
  // if (isDonor.value == true)
  //   if (program.value)
  //     if (
  //       program.value.status === "Created" ||
  //       program.value.status === "Draft"
  //     )
  //       return true;
  // return false;
});

const canDelete = computed(() => {
  if (isDonor.value == true) if (program.value) return true;
  return false;
});

onMounted(async () => {
  await getProgram();

  if (program.value?.solicitations.length || 0 > 0) await getSol();

  if (program.value?.documents)
    if (program.value?.documents.length > 0) await getDocumentsInfo();
});
</script>

<style scoped></style>
