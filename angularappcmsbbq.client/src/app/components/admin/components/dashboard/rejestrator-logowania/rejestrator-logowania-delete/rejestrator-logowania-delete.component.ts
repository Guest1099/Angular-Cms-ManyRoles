import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RejestratorLogowania } from '../../../../../../models/rejestratorLogowania';
import { RejestratorLogowaniaService } from '../../../../../../services/rejestratorLogowania/rejestrator-logowania.service';

@Component({
  selector: 'app-rejestrator-logowania-delete',
  templateUrl: './rejestrator-logowania-delete.component.html',
  styleUrl: './rejestrator-logowania-delete.component.css'
})
export class RejestratorLogowaniaDeleteComponent implements OnInit {

  constructor(
    public rejestratorLogowaniaService: RejestratorLogowaniaService,
    @Inject(MAT_DIALOG_DATA) public rejestratorLogowania: RejestratorLogowania
  ) { }

  ngOnInit(): void {
  }


}
