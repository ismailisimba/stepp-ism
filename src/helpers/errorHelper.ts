const CustomException = (message: string, code: string | number) => {
  const error: any = new Error(message);
  error.code = code;
  return error;
};

export { CustomException };
