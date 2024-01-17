import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/modal/user.model';

@Component({
  selector: 'app-team-modal-dialog',
  templateUrl: './team-modal-dialog.component.html',
  styleUrls: ['./team-modal-dialog.component.css'],
})
export class TeamModalDialogComponent {
  teamForm: FormGroup;

  managers: User[] = [];
  unmappedDevelopers: User[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TeamModalDialogComponent>,
  ) {
    this.managers = this.data.managers;
    this.unmappedDevelopers = this.data.unmappedDevelopers;
    this.teamForm = this.formBuilder.group({
      manager: ['', Validators.required],
      developer: ['', Validators.required],
    });
  }

  ngOnInit(): void {}


  addTeam() {
    if (this.teamForm.valid) {
      const managerId = this.teamForm.value.manager;
      const developerId = this.teamForm.value.developer;
      this.dialogRef.close({ managerId, developerId });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
