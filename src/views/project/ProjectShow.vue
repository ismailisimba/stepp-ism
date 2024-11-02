<template>
  <v-container fluid>
    <Loading v-if="isGettingProject" />
    <div v-else>
      <v-row class="pb-3">
        <v-col xs="12" sm="12" md="6" lg="6">
          <PageHeader :text="t('projectPage')" />
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="6" class="d-flex justify-end">
          <!-- Edit -->
          <PageHeaderBtn
            v-if="canEdit"
            color="#4f545c"
            @click="
              router.push({
                name: 'projects.edit',
                params: {
                  projectAnswersUrl: project?.projectAnswersUrl as string,
                },
              })
            "
            icon="mdi-pencil-circle"
            :text="t('edit')"
          />

          <!-- Publish -->
          <ConfirmationDialog
            v-if="canPublish && project && project.id"
            :launch-btn-text="t('publish')"
            :title="t('publishItem')"
            :subtitle="t('confirmationText')"
            :show="true"
            :icon="'mdi-alpha-p-circle'"
            :url="`${apiEndpoints.projectUpdateStatus}/${encodeURIComponent(
              project.id
            )}/publish`"
            @success="updateStatus"
            @fail="failedToUpdateStatus"
          />

          <!-- Submit for review -->
          <ConfirmationDialog
            v-if="canSubmitForReview && project && project.id"
            :launch-btn-text="t('submitForReview')"
            :title="t('submitForReview')"
            :subtitle="t('confirmationText')"
            :show="true"
            :icon="'mdi-alpha-s-circle'"
            :url="`${apiEndpoints.projectUpdateStatus}/${encodeURIComponent(
              project.id
            )}/${encodeURIComponent('submit for review')}`"
            @success="updateStatus"
            @fail="failedToUpdateStatus"
          />

          <!-- Revert to draft -->
          <ConfirmationDialog
            v-if="canRevertToDraft && project && project.id"
            :launch-btn-text="t('revertToDraft')"
            :title="t('revertToDraft')"
            :subtitle="t('confirmationText')"
            :show="true"
            :icon="'mdi-alpha-r-circle'"
            :url="`${apiEndpoints.projectUpdateStatus}/${encodeURIComponent(
              project.id
            )}/${encodeURIComponent('revert to draft')}`"
            @success="updateStatus"
            @fail="failedToUpdateStatus"
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

      <v-container v-if="project">
        <v-row>
          <v-col sm="12" md="7" lg="7" class="pr-5">
            <v-row>
              <v-col cols="12" md="6">
                <InfoSheet
                  bg-color="primary"
                  top-icon="mdi-format-list-text"
                  :top-title="t('projectName')"
                  :top-subtitle="project?.name"
                  bottom-icon="mdi-currency-usd"
                  :bottom-title="t('budget')"
                  :bottom-subtitle="formatCurrency(project.budgetUSD)"
                />
              </v-col>
              <v-col cols="12" md="6">
                <InfoSheet
                  bg-color="grey"
                  top-icon="mdi-calendar-clock"
                  :top-title="t('reportingSchedule')"
                  :bottom-title="t('status')"
                  :top-subtitle="project.reportSchedule || ''"
                  bottom-icon="mdi-list-status"
                  :bottom-subtitle="project.status.trim()"
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
                  :subtitle="formatAsShortDate(project.startDate)"
                />
              </v-col>
              <v-col cols="6" class="ms-auto">
                <InfoPill
                  bg-color="grey"
                  :title="t('endDate')"
                  :subtitle="formatAsShortDate(project.endDate)"
                />
              </v-col>

              <v-col cols="6">
                <p class="text-uppercase text-subtitle-2">
                  {{ $t("contactName") }}
                </p>
                <div
                  style="max-height: 150px"
                  class="text-medium-emphasis text-subtitle-2 pt-2"
                >
                  {{ project.contactName }}
                </div>
              </v-col>
              <v-col cols="6">
                <p class="text-uppercase text-subtitle-2">
                  {{ $t("contactEmail") }}
                </p>
                <div
                  style="max-height: 150px"
                  class="text-medium-emphasis text-subtitle-2 pt-2"
                >
                  {{ project.contactEmail }}
                </div>
              </v-col>
              <v-col cols="12">
                <p class="text-uppercase text-subtitle-2">
                  {{ $t("solicitation") }}
                </p>
                <div
                  style="max-height: 150px"
                  class="text-medium-emphasis text-subtitle-2 pt-2"
                >
                  <RouterLink
                    :to="{
                      name: 'solicitations.show',
                      params: { solId: project.solicitationId },
                    }"
                  >
                    {{ project.solicitationName }}
                  </RouterLink>
                </div>
              </v-col>

              <v-col cols="12">
                <DescCard
                  :title="t('projectDescription')"
                  :text="project.description"
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="pb-3">
          <v-col xs="12" sm="12" md="6" lg="6">
            <PageHeader :text="t('reports')" />
          </v-col>
        </v-row>

        <!-- Report list -->
        <DonorReportList
          v-if="isDonor"
          :page="1"
          :items-per-page="reports?.length ?? 0"
          :page-count="1"
          :items-count="reports?.length ?? 0"
          :is-loading-data="isGettingReports"
          :reports="reports"
          :disable-delete="true"
          :disable-edit="false"
          :hide-footer="true"
        />

        <ApplicantReportList
          v-if="isApplicant"
          :page="1"
          :items-per-page="reports?.length ?? 0"
          :page-count="1"
          :items-count="reports?.length ?? 0"
          :is-loading-data="isGettingReports"
          :reports="reports"
          :disable-delete="false"
          :hide-footer="true"
        />
        <!-- End reports list -->
      </v-container>
    </div>
  </v-container>

  <delete-dialog
    v-if="project && project.id"
    :delete-url="deleteUrl"
    :item-id="project.id"
    :item-name="project.name"
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
import { formatCurrency } from "@/helpers/numberFormats";
import { SearchFieldData, SnackbarColor } from "@/types/types";
import apiEndpoints from "@/constants/endpoints";
import { useI18n } from "vue-i18n";
import router from "@/router";
import PageHeaderBtn from "../components/buttons/PageHeaderBtn.vue";
import PageHeader from "../components/others/PageHeader.vue";
import { useAuthStore } from "@/store/authStore";
import { storeToRefs } from "pinia";
import { getProject } from "@/services/project_service";
import { Project } from "@/models/Project";
import { formatAsShortDate } from "@/helpers/dateFormats";
import InfoPill from "../components/cards/InfoPill.vue";
import InfoSheet from "../components/cards/InfoSheet.vue";
import DescCard from "../components/cards/DescCard.vue";
import { computed } from "vue";
import { parseStatusFromString } from "@/models/Status";
import { search } from "@/services/search_service";
import { Reports } from "@/models/Report";

const ConfirmationDialog = defineAsyncComponent(
  () => import("@/views/components/ConfirmationDialog.vue")
);

const DeleteDialog = defineAsyncComponent(
  () => import("@/views/components/DeleteDialog.vue")
);
const Snackbar = defineAsyncComponent(
  () => import("@/views/components/snackbars/Default.vue")
);
const DonorReportList = defineAsyncComponent(
  () => import("@/views/report/components/DonorReportList.vue")
);
const ApplicantReportList = defineAsyncComponent(
  () => import("@/views/report/components/ApplicantReportList.vue")
);

const { t } = useI18n();
const route = useRoute();
const authStore = useAuthStore();
const { isDonor, isApplicant } = storeToRefs(authStore);
const isGettingProject = ref<boolean>(false);
const isGettingProjectAns = ref<boolean>(false);
const isGettingReports = ref<boolean>(false);
const project = ref<Project>();
const showDeleteDialog = ref(false);
const reports = ref<Reports>();

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

const updateStatus = (r: any) => {
  if (project.value)
    project.value.status = parseStatusFromString(r.res[0]["id"].status);
  showSnackBar("success", t("statusChangedSuccessMessage"));
};

const failedToUpdateStatus = () => {
  showSnackBar("error", t("generalErrorMessage"));
};

const deleteUrl = computed(() => {
  return `${apiEndpoints.projectDelete}/${encodeURIComponent(
    project.value?.id as string
  )}`;
});

//DELETE
const deleteP = () => {
  showDeleteDialog.value = true;
};

const deleteFail = () => {
  showSnackBar("error", t("generalErrorMessage"));
  showDeleteDialog.value = false;
};

const deleteSuccess = () => {
  router.push({ name: "projects" });
};
//END DELETE

const getProjectData = async () => {
  isGettingProject.value = true;
  try {
    await getProject(route.params.projectId as string).then((res) => {
      isGettingProject.value = false;
      project.value = res;
    });
  } catch (error) {
    isGettingProject.value = false;
  }
};

const getReports = async () => {
  isGettingReports.value = true;
  try {
    let p: SearchFieldData;
    p = {
      basicSearch: "",
      tableId: "reports",
      orderType: "ascending",
      advanceSearchValues: [
        {
          name: "project_id",
          value: project.value?.id,
          checked: true,
        },
      ],
    };
    await search(p).then((res) => {
      isGettingReports.value = false;
      reports.value = res;
    });
  } catch (error) {
    isGettingReports.value = false;
  }
};

const canPublish = computed(() => {
  if (isDonor.value) {
    if (project.value) if (project.value.status == "In Review") return true;
  }
  return false;
});

const canSubmitForReview = computed(() => {
  if (isApplicant.value == true)
    if (project.value) if (project.value.status === "Draft") return true;
  return false;
});

const canRevertToDraft = computed(() => {
  if (isDonor.value)
    if (project.value)
      if (
        project.value.status === "Published" ||
        project.value.status === "In Review"
      )
        return true;
  return false;
});

const canEdit = computed(() => {
  if (isDonor.value == true)
    if (project.value) if (project.value.status === "Created") return true;
  return false;
});

const canDelete = computed(() => {
  if (isDonor.value == true) if (project.value) return true;
  return false;
});

onMounted(async () => {
  await getProjectData();
  if (project.value) await getReports();
});
</script>

<style scoped></style>
