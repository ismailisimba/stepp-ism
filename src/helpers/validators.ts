import { helpers, sameAs } from "@vuelidate/validators";
import { ComposerTranslation } from "vue-i18n";
import { datePickerFormat } from "./dateFormats";

// Check if a date is between two dates
export const dateBetween = (
  minDate: Date,
  maxDate: Date,
  t: ComposerTranslation
) =>
  helpers.withMessage(
    t("validation.dateBetween", {
      minDate: datePickerFormat(minDate),
      maxDate: datePickerFormat(maxDate),
    }),
    helpers.withParams(
      { type: "dateBetween", minDate, maxDate },
      (value: string) => {
        const date = new Date(value);
        const startDate = new Date(minDate);
        const endDate = new Date(maxDate);

        return date >= startDate && date <= endDate;
      }
    )
  );

export const dateAfter = (date: Date, t: ComposerTranslation) =>
  helpers.withMessage(
    t("validation.dateAfter", { date: datePickerFormat(new Date(date)) }),
    helpers.withParams({ type: "dateAfter", date }, (value: string) => {
      const v = new Date(value);
      const d = new Date(date);
      return d < v;
    })
  );

export const dateBefore = (date: Date, t: ComposerTranslation) =>
  helpers.withMessage(
    t("validation.dateBefore", { date: datePickerFormat(new Date(date)) }),
    helpers.withParams({ type: "dateBefore", date }, (value: string) => {
      const v = new Date(value);
      const d = new Date(date);
      return d > v;
    })
  );

export const containsNumber = (t: ComposerTranslation) =>
  helpers.withMessage(
    t("validation.containsNum"),
    (value) => /\d/.test(value as string) // Regex to check for any digit
  );

// Helper function to check if the string contains at least one special character
export const containsSpecialChar = (t: ComposerTranslation) =>
  helpers.withMessage(
    t("validation.containsSpecialChar"),
    (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value as string) // Regex to check for special characters
  );

// Helper function to check if the string contains at least one lowercase letter
export const containsLowerChar = (t: ComposerTranslation) =>
  helpers.withMessage(
    t("validation.containsLowerChar"),
    (value) => /[a-z]/.test(value as string) // Regex to check for lowercase letters
  );

// Helper function to check if the string contains at least one uppercase letter
export const containsUpperChar = (t: ComposerTranslation) =>
  helpers.withMessage(
    t("validation.containsUpperChar"),
    (value) => /[A-Z]/.test(value as string) // Regex to check for uppercase letters
  );

  export const passwordMatch = (passwordRef : string, t: ComposerTranslation) => helpers.withMessage(
    t("validation.passwordMatch"), helpers.withParams({ type: "passwordMatch", passwordRef }, (value: string) => {
      return value === passwordRef;
    })
  )