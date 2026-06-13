export type Customer = {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type ForgotPasswordPayload = {
  username: string;
  phone: string;
  newPassword: string;
};

export type AuthResult = {
  user: Customer;
  sessionToken?: string;
  token?: string;
};

export type AuthResponse = {
  success?: boolean;
  message?: string;
  data?: AuthResult;
};
