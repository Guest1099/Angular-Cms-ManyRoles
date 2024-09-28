import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationLinkNameService {

  private messageSourceLinkName = new BehaviorSubject<string>('');
  private messageSourceSubLinkName = new BehaviorSubject<string>('');

  public linkName = this.messageSourceLinkName.asObservable();
  public subLinkName = this.messageSourceSubLinkName.asObservable();

  constructor() { }

  // nazwa pierwszego linka
  public changeLinkName(message: string): void {
    this.messageSourceLinkName.next(message);
  }

  // nazwa drugiego linka
  public changeSubLinkName(message: string): void {
    this.messageSourceSubLinkName.next(message);
  }

}
