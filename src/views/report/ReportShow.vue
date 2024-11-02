<template>
  <v-container fluid>
    <Loading v-if="isGettingReport" />
    <div v-else>
      <v-row class="pb-3">
        <v-col xs="12" sm="12" md="6" lg="6">
          <PageHeader :text="t('reportPage')" />
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="6" class="d-flex justify-end" v-if="report">
          <PageHeaderBtn
            v-if="donorCanEdit"
            color="#4f545c"
            @click="router.push({ name: 'reports.edit', params: { reportId: report.id } })"
            icon="mdi-pencil-circle"
            :text="t('edit')"
          />

          <PageHeaderBtn
            v-if="applicantCanEdit"
            color="#4f545c"
            @click="router.push({ name: 'reports.upfate', params: { reportId: report.id } })"
            icon="mdi-pencil-circle"
            :text="t('edit')"
          />

          <PageHeaderBtn
            v-if="isApplicant"
            color="error"
            @click="deleteP()"
            icon="mdi-minus-circle"
            :text="t('delete')"
          />
        </v-col>
      </v-row>

      <v-container v-if="report">
        <v-row>
          <v-col sm="12" md="7" lg="7" class="pr-5">
            <v-row>
              <v-col cols="12" md="6">
                <InfoSheet
                  bg-color="primary"
                  top-icon="mdi-subtitles-outline"
                  :top-title="t('reportName')"
                  :top-subtitle="report?.name"
                  bottom-icon="mdi-list-status"
                  :bottom-title="t('status')"
                  :bottom-subtitle="report.status"
                />
              </v-col>
              <v-col cols="12" md="6">
                <InfoSheet
                  bg-color="grey"
                  top-icon="mdi-account-box-outline"
                  :top-title="t('contactName')"
                  :bottom-title="t('contactEmail')"
                  :top-subtitle="report.contactName"
                  bottom-icon="mdi-email"
                  :bottom-subtitle="report.contactEmail"
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
                  :subtitle="formatAsShortDate(report.startDate)"
                />
              </v-col>
              <v-col cols="6" class="ms-auto">
                <InfoPill
                  bg-color="grey"
                  :title="t('endDate')"
                  :subtitle="formatAsShortDate(report.endDate)"
                />
              </v-col>
              <v-col cols="12">
                <p class="text-uppercase text-subtitle-2">
                  {{ $t("project") }}
                </p>
                <div
                  style="max-height: 150px"
                  class="text-medium-emphasis text-subtitle-2 pt-2"
                >
                  <RouterLink
                    :to="{
                      name: 'projects.show',
                      params: { projectId: report.projectId },
                    }"
                  >
                    {{ report.programName }}
                  </RouterLink>
                </div>
              </v-col>

              <v-col cols="12" v-if="report.description">
                <DescCard :title="t('reportDesc')" :text="report.description" />
              </v-col>

              <v-col cols="12" v-if="documents">
                <p class="text-uppercase text-subtitle-2">
                  {{ $t("documents") }}
                </p>
                <div class="d-flex justify-start align-center ga-2">
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
                    class="my-3"
                    v-for="(document, index) in documents"
                  >
                    <span class="text-truncate" style="max-width: 180px">
                      {{ document.filename }}
                    </span>
                    <v-icon icon="mdi-download" end></v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <br /><br />

        <!-- Activities & Questions -->
        <v-card flat rounded="large">
          <v-tabs v-model="tab" color="white" bg-color="primary">
            <v-tab class="text-none" v-for="tab in tabs" :value="tab">{{
              tab
            }}</v-tab>
          </v-tabs>
          <v-card-text>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item :value="tabs[0]">
                <ActivitiesShow :activities="report.activities" />
              </v-tabs-window-item>
              <v-tabs-window-item :value="tabs[1]">
                <Loading v-if="isGettingQuestions" />
                <ReportShowQuestions :sections="questions" v-else />
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </v-container>
    </div>
  </v-container>

  <delete-dialog
    v-if="report"
    :delete-url="deleteUrl"
    :item-id="report.id"
    :item-name="report.name"
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
import { ref, onMounted, defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";
import Loading from "@/views/components/loaders/default.vue";
import InfoSheet from "../components/cards/InfoSheet.vue";
import InfoPill from "../components/cards/InfoPill.vue";
import { SnackbarColor } from "@/types/types";
import apiEndpoints from "@/constants/endpoints";
import { useI18n } from "vue-i18n";
import router from "@/router";
import PageHeaderBtn from "../components/buttons/PageHeaderBtn.vue";
import PageHeader from "../components/others/PageHeader.vue";
import { downloadFile, getFilesInfo } from "@/services/file_service";
import { FileInfo } from "@/models/FileInfo";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import { Report } from "@/models/Report";
import { getReport, getReportQuestions } from "@/services/report_service";
import { formatAsShortDate } from "@/helpers/dateFormats";
import DescCard from "../components/cards/DescCard.vue";
import ActivitiesShow from "../activity/ActivitiesShow.vue";
import { ReportSectionQuestions } from "@/models/ReportSectionQuestion";
import ReportShowQuestions from "./components/ReportShowQuestions.vue";
import { computed } from "vue";

const DeleteDialog = defineAsyncComponent(
  () => import("@/views/components/DeleteDialog.vue")
);
const Snackbar = defineAsyncComponent(
  () => import("@/views/components/snackbars/Default.vue")
);

const { t } = useI18n();
const route = useRoute();
const report = ref<Report>();
const isGettingReport = ref(true);
const authStore = useAuthStore();
const { isDonor, isApplicant } = storeToRefs(authStore);
const documents = ref<Array<FileInfo>>();
const isLoadingDocumentsInfo = ref<boolean>(false);
const tabs = [t("activities"), t("questions")];
const tab = ref(t("activities"));
const isGettingQuestions = ref(false);
const questions = ref<ReportSectionQuestions>([]);

//SNACKBAR
const snackBarShow = ref(false);
const snackBarColor = ref<SnackbarColor>("success");
const snackBarMessage = ref("");

//DELETE
const showDeleteDialog = ref(false);
const deleteUrl =  computed(() => {
  return `${apiEndpoints.reportDelete} \ ${report.value?.id}`
});

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

const deleteP = () => {
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

const getReportData = async () => {
  isGettingReport.value = true;
  try {
    await getReport(route.params.reportId as string).then((res) => {
      isGettingReport.value = false;
      report.value = res;
    });
  } catch (error) {
    showSnackBar("error", t("generalErrorMessage"));
    isGettingReport.value = false;
    throw error;
  }
};

const getSavedQuestions = async () => {
  isGettingQuestions.value = true;
  try {
    await getReportQuestions(report.value?.reportData as string).then((res) => {
      questions.value = res;
      isGettingQuestions.value = false;
    });
  } catch (error) {
    isGettingQuestions.value = false;
    throw error;
  }
};

//Docs info
const getDocumentsInfo = async () => {
  try {
    isLoadingDocumentsInfo.value = true;
    await getFilesInfo(report.value?.documents || []).then((r) => {
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

const donorCanEdit = computed(() => {
  if (isDonor.value && report.value) {
    if (report.value?.status == "Created") return true;
  }
  return false;
});

const applicantCanEdit = computed(() => {
  if (isApplicant.value && report.value) {
    if (report.value?.status == "Draft") return true;
  }
  return false;
});

onMounted(async () => {
  await getReportData();

  if (report.value?.documents)
    if (report.value?.documents.length || 0 > 0) await getDocumentsInfo();

  if (report.value?.reportData) await getSavedQuestions();
});
</script>

<style scoped></style>
