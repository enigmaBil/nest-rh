import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conger, StatutConger } from '../../../../core/models/conge.model';
import { CongerService } from '../../../../core/services/conge/conger.service';
import { BreadcrumbComponent } from '../../../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-conge-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent
  ],
  templateUrl: './conge-page.component.html',
  styleUrls: ['./conge-page.component.css']
})
export class CongePageComponent implements OnInit {
  congers: Conger[] = [];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  searchText: string = '';

  StatutConger = StatutConger;

  constructor(private congerService: CongerService) {}

  ngOnInit(): void {
    this.getCongers();
  }

  getCongers(): void {
    this.congerService.getAllCongers().subscribe(
      (data) => {
        this.congers = data.filter(conger => conger.statut === StatutConger.EN_ATTENTE);
      },
      (error) => {
        console.error('Erreur lors de la récupération des congés', error);
      }
    );
  }

  updateStatut(id: number, statut: StatutConger): void {
    if (id !== undefined) {
      this.congerService.updateStatut(id, statut).subscribe(
        (updatedConger) => {
          const index = this.congers.findIndex(c => c.id === id);
          if (index !== -1) {
            this.congers[index].statut = updatedConger.statut;
            if (updatedConger.statut !== StatutConger.EN_ATTENTE) {
              this.congers.splice(index, 1); // Supprime de la liste si plus en attente
            }
          }
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du statut', error);
        }
      );
    }
  }

  onAccept(congerId: number): void {
    this.updateStatut(congerId, StatutConger.ACCEPTE);
  }

  onReject(congerId: number): void {
    this.updateStatut(congerId, StatutConger.REFUSE);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  search(): void {
    this.applySearch();
  }

  private applySearch(): void {
    if (this.searchText) {
      this.congers = this.congers.filter(conger =>
        conger.nom.toLowerCase().includes(this.searchText.toLowerCase())
      );
    } else {
      this.getCongers();
    }
  }
}
