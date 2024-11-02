export function isNumeric(value: any): boolean {
  return !isNaN(Number(value));
}

export function isArray(value: any): boolean {
  return value.constructor === Array ? true : false;
}

export function isObject(value : any) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function strToSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function objectToFormData(
  obj: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey: string | null = null
): FormData {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;
      const value = obj[key];
      if (value instanceof Date) {
        formData.append(fullKey, value.toISOString().substring(0, 10));
      } else if (value instanceof Array) {
        value.forEach((item, index) => {
          formData.append(fullKey, item);
        });
        // value.forEach((item, index) => {
        //   objectToFormData({ [index]: item }, formData, fullKey);
        // });
      } else if (value instanceof Object && !(value instanceof File)) {
        objectToFormData(value, formData, fullKey);
      } else {
        formData.append(fullKey, value);
      }
    }
  }
  return formData;
}
