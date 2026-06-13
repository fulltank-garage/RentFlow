import axios from "axios";

type ErrorPayload = {
  message?: string;
};

function hasThaiText(value: string) {
  return /[\u0E00-\u0E7F]/.test(value);
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      typeof error.response?.data === "object" && error.response?.data
        ? (error.response.data as ErrorPayload).message
        : undefined;

    if (responseMessage) {
      return responseMessage;
    }

    if (error.code === "ECONNABORTED") {
      return "การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง";
    }

    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      return "เชื่อมต่อระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
    }

    return fallbackMessage;
  }

  if (error instanceof Error) {
    if (hasThaiText(error.message)) {
      return error.message;
    }

    return fallbackMessage;
  }

  return fallbackMessage;
}

export function getErrorStatus(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return undefined;
  }

  return error.response?.status;
}
