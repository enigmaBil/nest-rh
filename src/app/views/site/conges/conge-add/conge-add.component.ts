import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';
import { Conger } from '../../../../core/models/conge.model';
import { CongerService } from '../../../../core/services/conge/conger.service';
import { AuthService } from '../../../../core/services/auth/auth.service'; // ← ici

@Component({
  selector: 'app-conge-add',
  templateUrl: './conge-add.component.html',
  styleUrls: ['./conge-add.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BreadcrumbComponent],
})
export class CongeAddComponent {
  congeForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private congerService: CongerService,
    private authService: AuthService // ← ici
  ) {
    const userEmail = localStorage.getItem('userEmail') || ''; // ← récupère l'email

    this.congeForm = this.fb.group({
      nom: [{ value: userEmail, disabled: true }, Validators.required], // ← champ désactivé
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  handleSubmit() {
    if (this.congeForm.valid) {
      this.loading = true;
      const congerData: Conger = this.congeForm.getRawValue(); // ← récupère tous les champs, même désactivés

      this.congerService.addConger(congerData).subscribe({
        next: (data: Conger) => {
          this.loading = false;
          alert('Congé ajouté avec succès');
          this.congeForm.reset();
        },
        error: () => {
          this.loading = false;
          this.errorMessage = "Erreur lors de l'ajout du congé";
        },
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs';
    }
  }
}
