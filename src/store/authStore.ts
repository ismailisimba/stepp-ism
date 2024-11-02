import { permsNameHelper } from "@/helpers/stringHelper";
import { AuthUser } from "@/models/AuthUser";
import router from "@/router";
import { signOut } from "@/services/auth_service";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authUser: <AuthUser | null>null,
  }),

  getters: {
    isLoggedIn(state): boolean {
      return state.authUser ? true : false;
    },

    email(state): string {
      return state.authUser?.email || "";
    },

    type(state): string {
      if (this.isLoggedIn) return state.authUser?.accountType || "";
      return "";
    },

    isApplicant(): boolean {
      return this.type == "applicant" ? true : false;
    },

    isDonor(): boolean {
      return this.type == "donor" ? true : false;
    },

    //Permissions
    perms(): any {
      if (this.authUser?.permissions) return this.authUser.permissions;
      return [];
    },
    //App
    appPerms(): Array<string> {
      if (this.perms) {
        if (this.perms.application)
          return [
            ...this.perms.application.menuActions,
            ...this.perms.application.tableActions,
          ];
      }
      return [];
    },
    appCan() {
      let perms: { [key: string]: boolean } = {};
      this.appPerms.forEach((element) => {
        const s = element.split("_");
        if (s.length === 2) {
          perms[permsNameHelper(s[0])] = s[1] === "on" ? true : false;
        }
      });
      return perms;
    },
    //EndApp

    //Program
    programPerms(): Array<string> {
      if (this.perms) {
        if (this.perms.program)
          return [
            ...this.perms.program.menuActions,
            ...this.perms.program.tableActions,
          ];
      }
      return [];
    },
    programCan() {
      let perms: { [key: string]: boolean } = {};
      this.programPerms.forEach((element) => {
        const s = element.split("_");
        if (s.length === 2) {
          perms[permsNameHelper(s[0])] = s[1] === "on" ? true : false;
        }
      });
      return perms;
    },
    //End program

    //Project
    projectPerms(): Array<string> {
      if (this.perms) {
        if (this.perms.project)
          return [
            ...this.perms.project.menuActions,
            ...this.perms.project.tableActions,
          ];
      }
      return [];
    },
    projectCan() {
      let perms: { [key: string]: boolean } = {};
      this.projectPerms.forEach((element) => {
        const s = element.split("_");
        if (s.length === 2) {
          perms[permsNameHelper(s[0])] = s[1] === "on" ? true : false;
        }
      });
      return perms;
    },
    //End project

    //Reports
    reportsPerms(): Array<string> {
      if (this.perms) {
        if (this.perms.reports)
          return [
            ...this.perms.reports.menuActions,
            ...this.perms.reports.tableActions,
          ];
      }
      return [];
    },
    reportsCan() {
      let perms: { [key: string]: boolean } = {};
      this.reportsPerms.forEach((element) => {
        const s = element.split("_");
        if (s.length === 2) {
          perms[permsNameHelper(s[0])] = s[1] === "on" ? true : false;
        }
      });
      return perms;
    },
    //End reports

    //Solicitation
    solPerms(): Array<string> {
      if (this.perms) {
        if (this.perms.solicitation)
          return [
            ...this.perms.solicitation.menuActions,
            ...this.perms.solicitation.tableActions,
          ];
      }
      return [];
    },
    solCan() {
      let perms: { [key: string]: boolean } = {};
      this.solPerms.forEach((element) => {
        const s = element.split("_");
        if (s.length === 2) {
          perms[permsNameHelper(s[0])] = s[1] === "on" ? true : false;
        }
      });
      return perms;
    },
    //End solicitation

    //End Permissions
  },

  actions: {
    async setUser(user: AuthUser) {
      this.authUser = user;
    },

    async updateAuthUser(firstName: string, lastName: string, email: string) {
      if (this.authUser?.firstName) this.authUser.firstName = firstName;
      if (this.authUser?.lastName) this.authUser.lastName = lastName;
      if (this.authUser?.email) this.authUser.email = email;
    },

    async signOut() {
      this.authUser = null;
      router.push({ name: "sign_in" });
      await signOut();
    },
  },
  persist: {
    key: "user",
    storage: localStorage,
  },
});
