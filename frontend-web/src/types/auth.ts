export type LoginPayload = {
  portal: string;
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: number;
    nome: string;
    email: string;
    cargo: string;
  };
};

export type RefreshPayload = {
  refreshToken: string;
  portal: string;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};
