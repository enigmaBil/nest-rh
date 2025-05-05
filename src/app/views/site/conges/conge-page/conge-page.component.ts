import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { CongerService } from '../../../../core/services/conge/conger.service';
import { StatutConger } from '../../../../core/models/conge.model';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-conge-page',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe, NgIf, NgFor, BreadcrumbComponent],
  templateUrl: './conge-page.component.html',
  styleUrls: ['./conge-page.component.css']
})
export class CongePageComponent {
  private congeService = inject(CongerService);

  demandes$ = this.congeService.getAllCongers();

  getStatutLibelle(statut: StatutConger | undefined): string {
    if (!statut) return 'Non défini';
    switch (statut) {
      case StatutConger.ACCEPTE: return 'Accepté';
      case StatutConger.REFUSE: return 'Refusé';
      case StatutConger.EN_ATTENTE: return 'En attente';
      default: return '';
    }
  }

  getStatutStyle(statut: StatutConger | undefined): string {
    if (!statut) return 'text-gray-500';
    switch (statut) {
      case StatutConger.ACCEPTE: return 'text-green-600 font-semibold';
      case StatutConger.REFUSE: return 'text-red-600 font-semibold';
      case StatutConger.EN_ATTENTE: return 'text-yellow-600 font-semibold';
      default: return '';
    }
  }
}
