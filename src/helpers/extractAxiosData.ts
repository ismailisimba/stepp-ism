export const extractAxiosData = <T>({ data }: { data: T }) => data;
export const extractAxiosDataData = <T>({ data: { data } }: { data: { data: T }}) => data;
