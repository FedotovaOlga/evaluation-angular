import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { inject } from '@angular/core';
import { JwtService } from '../services/jwt';
import { User } from '../models/user';
import { catchError, switchMap, of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService = inject(JwtService);

  const isAuthUrl =
    req.url === `${environment.BACKEND_URL}/authenticate` ||
    req.url === `${environment.BACKEND_URL}/register`;

  // 1) Pour /authenticate et /register : on laisse tout passer sans token ni refresh
  if (isAuthUrl) {
    return next(req);
  }

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken') ?? '';

  // 2) Si pas de accessToken => utilisateur non connecté => requête anonyme
  if (!accessToken) {
    return next(req);
  }

  // 3) Si le token est encore valide => on l'ajoute
  if (jwtService.isValid(accessToken)) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
    return next(cloned);
  }

  // 4) Token expiré MAIS refreshToken présent => on essaie un refresh
  if (refreshToken) {
    const user: User = {
      grantType: 'REFRESH_TOKEN',
      refreshToken: refreshToken,
    };

    // On return l'observable
    return jwtService.getTokens(user).pipe(
      switchMap((res) => {
        // on met à jour les tokens en localStorage
        const newAccess = res.accessToken ?? '';
        const newRefresh = res.refreshToken ?? '';

        localStorage.setItem('accessToken', newAccess);
        localStorage.setItem('refreshToken', newRefresh);

        // on rejoue la requête originale avec le nouveau token
        const newReq = req.clone({
          setHeaders: { Authorization: `Bearer ${newAccess}` },
        });
        return next(newReq);
      }),
      catchError((err) => {
        // si le refresh échoue (refreshToken expiré, etc.) :
        // on vide le storage et on renvoie la requête sans token
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        return next(req);
      })
    );
  }

  // 5) Si pas de refreshToken → on envoie la requête sans Authorization
  return next(req);
};




// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const jwtService = inject(JwtService);

//   if (req.url == `${environment.BACKEND_URL}/authenticate` || req.url == `${environment.BACKEND_URL}/register`) {
//     return next(req);
//   }

//   const accessToken = localStorage.getItem('accessToken');
//   const refreshToken = localStorage.getItem('refreshToken') ?? '';
//   if (!jwtService.isValid(accessToken ?? '')) {
//     const user: User = {
//       grantType: 'REFRESH_TOKEN',
//       refreshToken: refreshToken,
//     };
//     jwtService.getTokens(user).subscribe((res) => {
//       localStorage.setItem('accessToken', res.accessToken ?? '');
//       localStorage.setItem('refreshToken', res.refreshToken ?? '');
//       const cloned = req.clone({
//         setHeaders: { Authorization: `Bearer ${res.accessToken}` },
//       });
//         return next(cloned);
//     });
//   }
//   const cloned = req.clone({
//     setHeaders: { Authorization: `Bearer ${accessToken}` },
//   });
//   return next(cloned);
// };





// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const accessToken = localStorage.getItem('accessToken');

//   const isAuthUrl =
//     req.url === `${environment.BACKEND_URL}/authenticate` ||
//     req.url === `${environment.BACKEND_URL}/register`;

//   // pas de token OU URL d'auth → on ne touche pas à la requête
//   if (!accessToken || isAuthUrl) {
//     return next(req);
//   }

//   // sinon on ajoute Authorization
//   const cloned = req.clone({
//     setHeaders: { Authorization: `Bearer ${accessToken}` },
//   });

//   return next(cloned);
// };
