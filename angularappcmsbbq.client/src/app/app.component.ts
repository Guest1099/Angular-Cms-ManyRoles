import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor( 
  ) {
  }

  ngOnInit() {

    //this.clearSessionModel();

  }

  // Czyszczenie sesji jeśli użytkownik zamknie program lub przeglądarkę a token wygaśnie
  private clearSessionModel() {
    let sessionModel = localStorage.getItem('sessionModel');
    if (sessionModel) {
      let sm = JSON.parse(sessionModel);
      if (sm) {

        // zamiana daty na format 2024-12-12T12:12:00
        let d = new Date();
        let date = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}T${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;

        let checkDate = date > sm.expirationTimeToken;


        if (checkDate) {
          localStorage.removeItem('sessionModel');
        }
      }
    }
  }



}
