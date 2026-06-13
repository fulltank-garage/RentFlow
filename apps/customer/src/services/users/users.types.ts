export type UpdateProfilePayload = {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  avatarFile?: File;
  clearAvatar?: boolean;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
