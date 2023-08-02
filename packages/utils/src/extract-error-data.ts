export function extractErrorData(error: any) {
  let extractedErrorMessage: string;
  let extractedError: Error | null = null;
  if (error instanceof Error) {
    extractedErrorMessage = error.message;
    extractedError = error;
  } else if (typeof error === 'string') {
    extractedErrorMessage = error;
  } else {
    extractedErrorMessage = JSON.stringify(error);
  }
  return { error: extractedError, message: extractedErrorMessage };
}
