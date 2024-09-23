import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Marka } from '../../../../../../models/marka';
import { MarkiService } from '../../../../../../services/marki/marki.service';

@Component({
  selector: 'app-marka-delete',
  templateUrl: './marka-delete.component.html',
  styleUrl: './marka-delete.component.css'
})
export class MarkaDeleteComponent implements OnInit {

  constructor(
    public markiService: MarkiService,
    @Inject(MAT_DIALOG_DATA) public marka: Marka
  ) { }

  ngOnInit(): void {
  }


}
