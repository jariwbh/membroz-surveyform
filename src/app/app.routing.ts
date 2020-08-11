import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { FeedbackComponent } from './feedback/feedback.component';
import { SuccessComponent } from './success/success.component';

export const AppRoutes: Routes = [
    { path: '', redirectTo: 'feedback', pathMatch: 'full' },
    { path: 'feedback', component: FeedbackComponent },
    { path: 'feedback-success', component: SuccessComponent },
    { path: 'feedback-success/:id', component: SuccessComponent },
];
export const routing: ModuleWithProviders = RouterModule.forRoot(AppRoutes, { useHash: true });

// feedback
//http://localhost:4220/#/feedback?formid=5c5a6531a6ae2f27880282b6&contextid=59e4a4c5bd4e4bb2fb59fd7e&objectid=5c52cb6d17eea16f9c31640d&https=false&domain=localhost:3001
