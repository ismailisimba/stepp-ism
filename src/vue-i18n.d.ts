import 'vue-i18n';

declare module 'vue-i18n' {
  export interface DefineLocaleMessage {
    // Define your message schema here
  }
  export interface DefineDateTimeFormat {
    // Define your date-time format schema here
  }
  export interface DefineNumberFormat {
    // Define your number format schema here
  }
}