"use client";

import * as React from "react";
import { OTHER_OPTION } from "@/src/constants/booking.constants";

type Params = {
  carExists: boolean;
  carAvailable: boolean;
  merchantBranchesEnabled: boolean;
  fullName: string;
  phone: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  returnTime: string;
  pickupBranch: string;
  pickupOther: string;
  returnBranch: string;
  returnOther: string;
  pickupFreeText: string;
  returnFreeText: string;
  timeInvalid: boolean;
};

export default function useBookingValidation({
  carExists,
  carAvailable,
  merchantBranchesEnabled,
  fullName,
  phone,
  pickupDate,
  returnDate,
  pickupTime,
  returnTime,
  pickupBranch,
  pickupOther,
  returnBranch,
  returnOther,
  pickupFreeText,
  returnFreeText,
  timeInvalid,
}: Params) {
  const locationOk = React.useMemo(() => {
    if (!merchantBranchesEnabled) {
      const pOk = !pickupFreeText.trim() || pickupFreeText.trim().length >= 2;
      const rOk = !returnFreeText.trim() || returnFreeText.trim().length >= 2;
      return pOk && rOk;
    }

    const pOk = pickupBranch !== OTHER_OPTION || pickupOther.trim().length >= 2;
    const rOk = returnBranch !== OTHER_OPTION || returnOther.trim().length >= 2;
    return pOk && rOk;
  }, [
    merchantBranchesEnabled,
    pickupBranch,
    pickupOther,
    returnBranch,
    returnOther,
    pickupFreeText,
    returnFreeText,
  ]);

  const canSubmit =
    carExists &&
    carAvailable &&
    fullName.trim().length >= 2 &&
    phone.trim().length >= 9 &&
    !!pickupDate &&
    !!returnDate &&
    !!pickupTime &&
    !!returnTime &&
    !timeInvalid &&
    locationOk;

  return {
    locationOk,
    canSubmit,
  };
}
