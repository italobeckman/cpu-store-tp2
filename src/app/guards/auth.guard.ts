import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {
    console.log('AuthGuard initialized');
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.authService.getToken();
    if (!token || this.authService.isTokenExpired()) {
      this.router.navigate(['/login']);
      return false;
    }

    const roles = route.data['roles'] as Array<string>;
    if (roles && roles.length > 0) {
      const hasRole = roles.some((role) => this.authService.hasRole(role));
      if (!hasRole) {
        this.router.navigate(['/']);
        return false;
      }
    }

    return true;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(childRoute, state);
  }
}
