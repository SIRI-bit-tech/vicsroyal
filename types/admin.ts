export interface AdminUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  iat: number;
  exp: number;
}
