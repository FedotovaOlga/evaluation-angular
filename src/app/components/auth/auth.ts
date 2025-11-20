import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { JwtService } from '../../services/jwt';
import { AuthStateService } from '../../services/auth-state';

@Component({
  selector: 'app-auth',
  imports: [FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent {
  user: User = {}
  erreur: String | null = null
  mode: 'login' | 'signup' = "login";
  confirmPassword = '';

  constructor(
    private router: Router,
    private jwtService: JwtService,
    private authState: AuthStateService
  ) { }

  switchMode(to: 'login' | 'signup'){
    this.mode = to
  }

  seConnecter() {
    this.erreur = null;
    this.user.grantType = 'PASSWORD'
    this.jwtService.getTokens(this.user).subscribe({
      next: res => {
        this.authState.setLoggedIn(
          res.accessToken ?? '',
          res.refreshToken ?? '',
          this.user.username ?? ''
        )
        // localStorage.setItem('isConnected', 'true')
        // localStorage.setItem('accessToken', res.accessToken ?? '')
        // localStorage.setItem('refreshToken', res.refreshToken ?? '')
        // localStorage.setItem('user', JSON.stringify(this.user))
        // const url = this.router.createUrlTree(['/formations'])
        // this.router.navigateByUrl(url)
        this.router.navigateByUrl('/formations')
      },
      error: () => {
        console.log('erreur')
        this.erreur = "Identifiants incorrects"
      }
    })
  }

  creerCompte(form: NgForm) {
    this.erreur = null;

    if (!this.user.username || !this.user.password) {
      this.erreur = "Veuillez renseigner identifiant et mot de passe";
      return;
    }
    if (this.user.password !== this.confirmPassword) {
      this.erreur = "Les mots de passe ne correspondent pas";
      return;
    }

    this.jwtService.register(this.user).subscribe({
      next: res => {
        this.authState.setLoggedIn(
          res.accessToken ?? '',
          res.refreshToken ?? '',
          this.user.username ?? ''
        )
        this.router.navigateByUrl('/formations');
      },
      error: e => {
        if (e.status === 409) {
          this.erreur = 'Ce nom d’utilisateur existe déjà.';
        } else {
          this.erreur = 'Impossible de créer le compte.';
        }
      }

    })
  }

}
