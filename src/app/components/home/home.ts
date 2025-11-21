import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Formation } from '../../models/formation';
import { FormationService } from '../../services/formation';
import { FormationComponent } from "../formation/formation";
import { AuthStateService } from '../../services/auth-state';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormationComponent, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {

  formations: Formation[] = []
  erreur: string | null = null;
  isLoggedIn$!: Observable<boolean>;

  constructor(private fs: FormationService, public authState: AuthStateService) {
    this.isLoggedIn$ = this.authState.isLoggedIn$;
  }

  ngOnInit() {
    this.fs.getFormations().subscribe({
      next: (res) => (this.formations = res),
      error: (err) => {
        this.erreur = "Liste des formations temporairement indisponible"
        console.log(this.erreur);

      }
    })
  }

}
