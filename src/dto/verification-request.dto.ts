export interface LarkVerificationRequestDto {
  challenge: string;
  token: string;
  type: string;
}

export interface LarkEncryptVerificationRequestDto {
  encrypt: string;
}
