// Typed API Requests & Responses for User

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
}

export interface AddUserRequest {
  name: string;
  email: string;
  role: string;
  image?: string;
  password: string;
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  image?: string;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}
