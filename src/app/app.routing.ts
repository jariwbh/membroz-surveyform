import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

const AppRoutes: Routes = [
    {
        path: 'feedback',
        loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackModule)
    },
    {
        path: 'success',
        loadChildren: () => import('./success/success.module').then(m => m.SuccessModule)
    },
    {
        path: 'dynamic-forms',
        loadChildren: () => import('./dynamic-forms/dynamic-forms.module').then(m => m.DynamicFormsModule)
    },
    {
        path: 'dynamic-survey-forms',
        loadChildren: () => import('./dynamic-survey-forms/dynamic-survey-forms.module').then(m => m.DynamicSurveyFormsModule)
    },
    {
        path: '',
        redirectTo: 'feedback',
        pathMatch: 'full'
    }
];

// export const AppRoutes: Routes = [
//     { path: '', redirectTo: 'feedback', pathMatch: 'full' },
//     { path: 'feedback', component: FeedbackComponent },
//     { path: 'feedback-success', component: SuccessComponent },
//     { path: 'feedback-success/:id', component: SuccessComponent },
// ];
export const routing: ModuleWithProviders = RouterModule.forRoot(AppRoutes, { useHash: true });

// feedback
//http://localhost:4220/#/feedback?formid=5c5a6531a6ae2f27880282b6&contextid=59e4a4c5bd4e4bb2fb59fd7e&objectid=5c52cb6d17eea16f9c31640d&https=false&domain=localhost:3001
//http://localhost:4220/#/feedback?formid=5c5a6531a6ae2f27880282b6&contextid=59e4a4c5bd4e4bb2fb59fd7e&objectid=5c52cb6d17eea16f9c31640d&https=false&domain=app.clubhozo.com
//http://app.clubhozo.com/#/feedback/5c5a6531a6ae2f27880282b6/59e4a4c5bd4e4bb2fb59fd7e/5c52cb6d17eea16f9c31640d


//http://localhost:4220/#/dynamic-forms?formid=599673a925f548d7dbbd7c86&https=false&domain=app.clubhozo.com


//http://localhost:4220/#/dynamic-survey-forms?formid=5bbb42a5144d6dc8b923fd24&https=false&domain=app.clubhozo.com