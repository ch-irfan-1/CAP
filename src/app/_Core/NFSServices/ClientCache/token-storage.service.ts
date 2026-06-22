import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';

const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'refresh-auth-token';

@Injectable({
  providedIn: 'root'
})

export class TokenStorageService {
  constructor(private storage: LocalStorageService) { }

  public saveToken(token: string, refreshToken : string): void {
    this.storage.clear(TOKEN_KEY);
    this.storage.store(TOKEN_KEY, token);
    this.storage.store(REFRESH_TOKEN_KEY, refreshToken);
  }

  public getToken(): string | null {
    return this.storage.retrieve(TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return this.storage.retrieve(REFRESH_TOKEN_KEY);
  }

  public ResetTokenStore(): void {
    this.storage.clear();
  }
}