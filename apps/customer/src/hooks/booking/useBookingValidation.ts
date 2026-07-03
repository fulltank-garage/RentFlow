"use client";

import * as React from "react";

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
  returnBranch: string;
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
  returnBranch,
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

    return Boolean(pickupBranch.trim() && returnBranch.trim());
  }, [
    merchantBranchesEnabled,
    pickupBranch,
    returnBranch,
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
