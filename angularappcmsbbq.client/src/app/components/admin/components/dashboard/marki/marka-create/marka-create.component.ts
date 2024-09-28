import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarkiService } from '../../../../../../services/marki/marki.service';
import { NavigationLinkNameService } from '../../../../../../services/NavigationLinkNameService';

@Component({
  selector: 'app-marka-create',
  templateUrl: './marka-create.component.html',
  styleUrl: './marka-create.component.css'
})
export class MarkaCreateComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public markiService: MarkiService,
    public navigationLinkNameService: NavigationLinkNameService
  ) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.formGroup.markAllAsTouched();
  }

  formGroup !: FormGroup;


}
