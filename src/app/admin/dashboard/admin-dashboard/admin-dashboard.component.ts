import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/api-service/api.service';
import { NotificationService } from 'src/app/auth/notification.service';
import { DeleteDevModalComponent } from 'src/app/modal-dialog/delete-dev-modal/delete-dev-modal.component';
import { DeleteModalComponent } from 'src/app/modal-dialog/delete-modal/delete-modal.component';
import { TeamModalDialogComponent } from 'src/app/modal-dialog/team/team-modal-dialog/team-modal-dialog.component';
import { User, ManagerWithDevelopers } from 'src/app/modal/user.model';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  managers: User[] = [];
  juniorDevelopers: User[] = [];
  teams: any[] = [];
  developers: any[] = [];
  assignedTasks: any[] = [];
  managerName = '';
  managerId!: number;
  selectedManagerId: number | null = null;
  unmappedDevelopers: User[] = [];
  displayTask = false;
  jrDevName = '';

  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.fetchManagerData();
    this.fetchJuniorDeveloperData();
    this.fetchunmappedDevelopers();
  }

  fetchunmappedDevelopers() {
    this.apiService.getUnmappedDevelopers().subscribe(
      (data: any) => {
        this.unmappedDevelopers = data;
        console.log('unmappedDevelopers:', this.unmappedDevelopers);
      },
      (error) => {
        console.error('Error fetching managers:', error);
      }
    );
  }

  fetchManagerData() {
    this.apiService.getManagers().subscribe(
      (data: any) => {
        this.managers = data;
        console.log('Manager:', this.managers);
      },
      (error) => {
        console.error('Error fetching managers:', error);
      }
    );
  }

  fetchJuniorDeveloperData() {
    this.apiService.getJuniorDevelopers().subscribe(
      (data: any) => {
        this.juniorDevelopers = data;
        console.log('juniorDevelopers:', this.juniorDevelopers);
      },
      (error) => {
        console.error('Error fetching junior developers:', error);
      }
    );
  }

  getTeam(managerId: number) {
    this.apiService.getDevelopersForManager(managerId).subscribe(
      (data: any) => {
        console.log('Response data:', data);
        this.developers = data;
        console.log('Developers mapped to the manager:', this.developers);
      },
      (error) => {
        console.error('Error fetching developers for the manager:', error);
      }
    );
  }

  getAssignedTasks(developerId: number, jrDevName: string): void {
    this.jrDevName = jrDevName;
    this.displayTask = true;
    this.apiService.getAssignedTasks(developerId).subscribe(
      (data: any) => {
        this.assignedTasks = data;
        console.log('Assigned tasks:', this.assignedTasks);
      },
      (error) => {
        console.error('Error fetching assigned tasks:', error);
      }
    );
  }

  selectedManager(manager: any) {
    this.managerName = manager.name;
    this.managerId = manager.id;
    this.displayTask = false;
    this.jrDevName = '';
  }

  isDeveloperMappedToManager(developer: User): boolean {
    return this.developers.some((jrDev) => jrDev.id === developer.id);
  }

  openTeamDialog() {
    const dialogRefTeam = this.dialog.open(TeamModalDialogComponent, {
      width: '300px',
      data: {
        managers: this.managers,
        unmappedDevelopers: this.unmappedDevelopers,
      },
    });

    dialogRefTeam.afterClosed().subscribe((teamFormData) => {
      if (teamFormData) {
        const managerId = teamFormData.managerId;
        const developerId = teamFormData.developerId;
        console.log('managerId:', managerId, 'developerId:', developerId);
        this.addTeam(managerId, developerId);
      }
    });
  }

  addTeam(managerId: number, developerId: number) {
    this.apiService.createTeam(managerId, developerId).subscribe(
      (response) => {
        console.log('Team created:', response);
        this.notificationService.showNotification(
          'Developer mapped successfully'
        );

        this.fetchunmappedDevelopers();
        this.fetchJuniorDeveloperData();
        this.getTeam(managerId);
      },
      (error) => {
        console.error('Error creating team:', error);
        this.notificationService.showNotification('Error occurred, Try again!');
      }
    );
  }

  openDeleteTeamDialog(manager: any) {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '300px',
      data: { managerId: manager.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.confirmed) {
        const taskId = result.taskId;

        this.deleteTeam();
      }
    });
  }

  deleteTeam() {}

  openDeleteDevDialog() {
    const dialogRef = this.dialog.open(DeleteDevModalComponent, {
      width: '300px',
      data: {
        developers: this.developers,
      },
    });

    dialogRef.afterClosed().subscribe((delDevFormData) => {
      if (delDevFormData) {
        const developerId = delDevFormData.developerId;
        console.log('deletionDevId:', developerId);
        // this.deleteDeveloper();
      }
    });
  }

  deleteDeveloper() {}
}
