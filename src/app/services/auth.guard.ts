import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    let isAuthenticated = authService.isAuthenticatedSubject.getValue();

    if (!isAuthenticated) {
        router.navigate(['/signin']);
        return false;
    }
    
    return true;
}