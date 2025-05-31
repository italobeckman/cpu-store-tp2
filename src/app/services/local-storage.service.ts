import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getItem(key: string): any {
    const value = localStorage.getItem(key);
    // Só faz JSON.parse se for um objeto (opcional: use um prefixo ou tente/catch)
    try {
      return JSON.parse(value as string);
    } catch {
      return value;
    }
  }

  setItem(key: string, value: string): void { 
    localStorage.setItem(key, value);         
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

}