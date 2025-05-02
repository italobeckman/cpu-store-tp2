import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private querySource = new BehaviorSubject<string>('');
  query$ = this.querySource.asObservable();

  updateQuery(query: string) {
    this.querySource.next(query);
  }
}
