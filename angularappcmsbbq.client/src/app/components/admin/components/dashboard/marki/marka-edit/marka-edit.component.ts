import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarkiService } from '../../../../../../services/marki/marki.service';
import { ActivatedRoute } from '@angular/router';
import { TaskResult } from '../../../../../../models/taskResult';
import { Marka } from '../../../../../../models/marka';
import { SnackBarService } from '../../../../../../services/snack-bar.service';
import { InfoService } from '../../../../../../services/InfoService';

@Component({
  selector: 'app-marka-edit',
  templateUrl: './marka-edit.component.html',
  styleUrl: './marka-edit.component.css'
})
export class MarkaEditComponent implements OnInit {

  formGroup!: FormGroup;
  marka !: Marka;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService,
    public markiService: MarkiService,
  ) { }


  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      if (id) {
        
        this.marka = this.markiService.get(id);
        
        if (this.marka) {
          this.formGroup = this.fb.group({
            name: [this.marka.name, [Validators.required, Validators.minLength(2)]]
          });
        }
        
      }
    });
  }


}
