import { Injectable } from '@angular/core';
import  forge from 'node-forge';
import CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  secretKey: string = "H8D9VEHGG7QL85FK";
  iv:string="ABDHD5FGHKL5TURW";
  constructor() { }
  
  encrypt(ciphertextB64: string) {
    
      const cipher = forge.cipher.createCipher('AES-CBC', forge.util.createBuffer(this.secretKey));
      cipher.start({ iv: forge.util.createBuffer(this.iv) });
      cipher.update(forge.util.createBuffer(ciphertextB64, 'utf8'));
      cipher.finish();
      const encrypted = cipher.output.getBytes();
      return forge.util.encode64(encrypted);
    }
   
  decrypt(ciphertextB64: string) {
    const encryptedBytes = forge.util.decode64(ciphertextB64);
    const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.createBuffer(this.secretKey));
    decipher.start({ iv: forge.util.createBuffer(this.iv) });
    decipher.update(forge.util.createBuffer(encryptedBytes));
    decipher.finish();
    return decipher.output.toString();
  }
}
