export interface ClientTokenPayload {
  userId: string;
}

export interface AdminTokenPayload {
  adminId: string;
  username: string;
}

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
