import { Component } from '@angular/core';
import { Formation } from '../../models/formation';
import { FormsModule } from '@angular/forms';
import { FormationComponent } from "../formation/formation";
import { FormationService } from '../../services/formation';

@Component({
  selector: 'app-formations',
  imports: [FormsModule, FormationComponent],
  templateUrl: './formations.html',
  styleUrl: './formations.css',
})
export class FormationsComponent {
  formations: Formation[] = []
  formation: Formation = {
    titre: '',
    dateDebut: '',
    duree: 0
  }
  erreur: string | null = null;

  constructor(private fs: FormationService) {}

  ngOnInit() {
    this.fs.getFormations().subscribe({
      next: (res) => (this.formations = res),
      error: (err) => {
        this.erreur = "Liste des formations temporairement indisponible"
        console.log(this.erreur);

      }
    })
  }

  ajouter() {
    this.fs.save(this.formation).subscribe(res => {
      this.formations.push(res);
      this.formation = { titre: '', dateDebut: '', duree: 0 };
    })
  }

  supprimer(ind: number, id?: string){
    this.fs.remove(id).subscribe((res) => {
      this.formations.splice(ind, 1)
    })

  }


}
