import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { JwtService } from '../../services/jwt';

@Component({
  selector: 'app-auth',
  imports: [FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class AuthComponent {
  user: User = {}
  erreur: String | null = null
  constructor(private router: Router, private jwtService: JwtService) { }



  seConnecter() {
    this.user.grantType = 'PASSWORD'
    this.jwtService.getTokens(this.user).subscribe({
      next: res => {
        localStorage.setItem('isConnected', 'true')
        localStorage.setItem('accessToken', res.accessToken ?? '')
        localStorage.setItem('refreshToken', res.refreshToken ?? '')
        localStorage.setItem('user', JSON.stringify(this.user))
        const url = this.router.createUrlTree(['/formations'])
        this.router.navigateByUrl(url)
      },
      error: err => {
        console.log('erreur')
        this.erreur = "Identifiants incorrects"
      }


    })

  }
}
