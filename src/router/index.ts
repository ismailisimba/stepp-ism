import { useAuthStore } from "@/store/authStore";
import Auth from "@/views/auth/Auth.vue";
import GoogleSignIn from "@/views/auth/GoogleSignIn.vue";
import SignIn from "@/views/auth/SignIn.vue";
import Workspace from "@/views/workspace/Workspace.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "/",
  //   redirect: "/solicitations/apply",
  // },

  //Workspace
  {
    path: "/",
    component: Workspace,
    children: [
      //Workspace
      {
        path: "/",
        name: "home",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/home/HomeView.vue"),
        meta: {
          title: "Workspace - Stepp",
          searchTable: "program",
        },
      },

      //Advanced search results
      {
        path: "/advanced-search/:searchable",
        name: "advanced-search",
        component: () =>
          import(
            /* webpackChunkName: "advanced-search" */ "@/views/search/SearchIndex.vue"
          ),
        meta: {
          title: "Advanced search results - Stepp",
          searchTable: "program",
        },
      },

      //Profile
      {
        path: "/profile",
        name: "profile",
        component: () =>
          import(
            /* webpackChunkName: "profile" */ "@/views/profile/ProfileView.vue"
          ),
        meta: {
          title: "Profile - Stepp",
        },
      },
      //End Profile

      //Reports
      {
        path: "/reports",
        name: "reports",
        component: () =>
          import(
            /* webpackChunkName: "reports" */ "@/views/report/ReportIndex.vue"
          ),
        meta: {
          title: "Reports - Stepp",
          searchTable: "reports",
        },
      },

      {
        path: "/reports/show/:reportId",
        name: "reports.show",
        component: () =>
          import(
            /* webpackChunkName: "reports-show" */ "@/views/report/ReportShow.vue"
          ),
        meta: {
          title: "Report info - Stepp",
          searchTable: "reports",
        },
      },

      {
        path: "/reports/edit/:reportId",
        name: "reports.edit",
        component: () =>
          import(
            /* webpackChunkName: "reports-edit" */ "@/views/report/ReportEdit.vue"
          ),
        meta: {
          title: "Report edit - Stepp",
          requiresDonor: true,
          searchTable: "reports",
        },
      },

      {
        path: "/reports/update/:reportId",
        name: "reports.update",
        component: () =>
          import(
            /* webpackChunkName: "reports-update" */ "@/views/report/ReportUpdate.vue"
          ),
        meta: {
          title: "Report edit - Stepp",
          searchTable: "reports",
        },
      },
      //End reports

      //Projects
      {
        path: "/projects",
        name: "projects",
        component: () =>
          import(
            /* webpackChunkName: "projects" */ "@/views/project/ProjectIndex.vue"
          ),
        meta: {
          title: "Projects - Stepp",
          searchTable: "project",
        },
      },

      {
        path: "/projects/show/:projectId",
        name: "projects.show",
        component: () =>
          import(
            /* webpackChunkName: "projects-show" */ "@/views/project/ProjectShow.vue"
          ),
        meta: {
          title: "Project info - Stepp",
          searchTable: "project",
        },
      },

      {
        path: "/projects/create/:appId",
        name: "projects.create",
        component: () =>
          import(
            /* webpackChunkName: "projects-create" */ "@/views/project/ProjectCreate.vue"
          ),
        meta: {
          title: "Project Create - Stepp",
          searchTable: "project",
        },
      },

      {
        path: "/projects/edit/:projectAnswersUrl",
        name: "projects.edit",
        component: () =>
          import(
            /* webpackChunkName: "projects-edit" */ "@/views/project/ProjectCreate.vue"
          ),
        meta: {
          title: "Project Edit - Stepp",
          searchTable: "project",
        },
      },

      {
        path: "/projects/edit/:projectAnswersUrl",
        name: "projects.update",
        component: () =>
          import(
            /* webpackChunkName: "projects-update" */ "@/views/project/ProjectCreate.vue"
          ),
        meta: {
          title: "Project Create - Stepp",
          searchTable: "project",
        },
      },
      //End projects

      //Application
      {
        path: "/applications",
        name: "applications",
        component: () =>
          import(
            /* webpackChunkName: "applications" */ "@/views/application/ApplicationIndex.vue"
          ),
        meta: {
          title: "Applications - Stepp",
          searchTable: "application",
        },
      },

      {
        path: "/applications/show/:appId",
        name: "applications.show",
        component: () =>
          import(
            /* webpackChunkName: "applications-show" */ "@/views/application/ApplicationShow.vue"
          ),
        meta: {
          title: "Application info - Stepp",
          searchTable: "application",
        },
      },

      {
        path: "/applications/review/:solId/:applicantEmail",
        name: "applications.review",
        component: () =>
          import(
            /* webpackChunkName: "applications-review" */ "@/views/application/ApplicationReview.vue"
          ),
        meta: {
          title: "Application Review - Stepp",
          requiresDonor: true,
          searchTable: "application",
        },
      },
      //End application

      //Programs
      {
        path: "/programs",
        name: "programs",
        component: () =>
          import(
            /* webpackChunkName: "programs" */ "@/views/program/ProgramIndex.vue"
          ),
        meta: {
          title: "Programs - Stepp",
          searchTable: "program",
        },
      },

      {
        path: "/programs/create",
        name: "programs.create",
        component: () =>
          import(
            /* webpackChunkName: "create-program" */ "@/views/program/ProgramCreate.vue"
          ),
        meta: {
          title: "Add Program - Stepp",
          requiresDonor: true,
          searchTable: "program",
        },
      },

      {
        path: "/programs/show/:programId",
        name: "programs.show",
        component: () =>
          import(
            /* webpackChunkName: "programs-show" */ "@/views/program/ProgramShow.vue"
          ),
        meta: {
          title: "Program Info - Stepp",
          searchTable: "program",
        },
      },

      //End programs

      //Solicitations
      {
        path: "/solicitations",
        name: "solicitations",
        component: () =>
          import(
            /* webpackChunkName: "solicitations" */ "@/views/solicitation/SolicitationIndex.vue"
          ),
        meta: {
          title: "Solicitations - Stepp",
          searchTable: "solicitation",
        },
      },

      {
        path: "/solicitations/create",
        name: "solicitations.create",
        component: () =>
          import(
            /* webpackChunkName: "solicitations-create" */ "@/views/solicitation/SolicitationCreate.vue"
          ),
        meta: {
          title: "Solicitations Create - Stepp",
          requiresDonor: true,
          searchTable: "solicitation",
        },
      },

      {
        path: "/solicitations/apply/:solId",
        name: "solicitations.apply",
        component: () =>
          import(
            /* webpackChunkName: "solicitations-apply" */ "@/views/solicitation/SolicitationApply.vue"
          ),
        meta: {
          title: "Solicitations Apply - Stepp",
          requiresApplicant: true,
          searchTable: "solicitation",
        },
      },

      {
        path: "/solicitations/edit/:solId",
        name: "solicitations.edit",
        component: () =>
          import(
            /* webpackChunkName: "solicitations-edit" */ "@/views/solicitation/SolicitationCreate.vue"
          ),
        meta: {
          title: "Solicitations Edit - Stepp",
          requiresDonor: true,
          searchTable: "solicitation",
        },
      },

      {
        path: "/solicitations/show/:solId",
        name: "solicitations.show",
        component: () =>
          import(
            /* webpackChunkName: "solicitations-show" */ "@/views/solicitation/SolicitationShow.vue"
          ),
        meta: {
          title: "Solicitations Info - Stepp",
          searchTable: "solicitation",
        },
      },
      //End solicitations
    ],
    meta: {
      requiresAuth: true,
    },
  },

  //End workspace

  // Auth
  {
    path: "/auth",
    component: Auth,
    children: [
      {
        path: "/sign-in/google",
        name: "sign_in.google",
        component: GoogleSignIn,
        // props: (route) => ({ success: route.query.cookie }),
        meta: {
          title: "Sign in - Google",
        },
      },

      {
        path: "/sign-in/:success?",
        name: "sign_in",
        component: SignIn,
        props: (route) => ({ success: route.query.success }),
        meta: {
          title: "Sign in - Stepp",
        },
      },

      {
        path: "/sign-up",
        name: "sign_up",
        component: () =>
          import(
            /* webpackChunkName: "signUp" */ "@/views/auth/sign_up/SignUp.vue"
          ),
        meta: {
          title: "Sign Up - Stepp",
        },
      },

      {
        path: "/reset-password/:id/:secret",
        name: "reset_password",
        component: () =>
          import(
            /* webpackChunkName: "resetPassword" */ "@/views/auth/ResetPassword.vue"
          ),
        meta: {
          title: "Reset Password - Stepp",
        },
      },

      {
        path: "/reset-password/email",
        name: "reset_password_form",
        component: () =>
          import(
            /* webpackChunkName: "resetPasswordForm" */ "@/views/auth/SendResetPasswordEmail.vue"
          ),
        meta: {
          title: "Reset Password - Stepp",
        },
      },
    ],
  },
  //End Auth

  //Error pages
  {
    path: "/page-not-found",
    name: "pageNotFound",
    component: import("@/views/errors/404.vue"),
    meta: {
      title: "Page not found - Stepp",
    },
  },

  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/views/errors/404.vue"),
    meta: {
      title: "Page not found - Stepp",
    },
  },
  //End error pages
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// This callback runs before every route change, including on page load.
// eslint-disable-next-line consistent-return
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isLoggedIn && to.name !== "sign_in") {
      return next({ name: "sign_in" });
    }

    //Requires donor
    if (to.matched.some((record) => record.meta.requiresDonor)) {
      if (authStore.isDonor) {
        return next();
      } else {
        return next({ name: "pageNotFound" });
      }
    }
    //Required applicant
    if (to.matched.some((record) => record.meta.requiresApplicant)) {
      if (authStore.isApplicant) {
        return next();
      } else {
        return next({ name: "pageNotFound" });
      }
    }
  }

  // scroll to the top of the page on each page change
  window.scrollTo(0, 0);

  // eslint-disable-next-line max-len
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  // eslint-disable-next-line max-len
  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    (document as any).title = nearestWithTitle.meta.title;
  } else if (previousNearestWithMeta) {
    (document as any).title = previousNearestWithMeta.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
    (el) => (el as any).parentNode.removeChild(el)
  );

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();
});

export default router;
