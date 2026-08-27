import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IssueCardComponent } from '../../shared/components/issue-card/issue-card.component';

@Component({
  selector: 'app-error-lab',
  standalone: true,
  imports: [CommonModule, IssueCardComponent],
  template: `
    <div class="lab-container">
      <header class="lab-header">
        <h1>Error Lab</h1>
        <p>Trigger common frontend errors and observe the Global Error Handler in the console.</p>
      </header>

      <div class="issues-grid">
        <app-issue-card
          issueName="Null Reference Error"
          description="Accessing a property on a null object."
          expectedError="Cannot read properties of null"
          rootCause="Variable initialized to null but used as an object."
          suggestedFix="Use optional chaining (?.) or check for null before access."
          (trigger)="triggerNullReference()">
        </app-issue-card>

        <app-issue-card
          issueName="Undefined Property Access"
          description="Accessing a nested property on an undefined object."
          expectedError="Cannot read properties of undefined"
          rootCause="Data not loaded yet or explicitly undefined."
          suggestedFix="Ensure data is loaded or use optional chaining."
          (trigger)="triggerUndefinedProperty()">
        </app-issue-card>

        <app-issue-card
          issueName="HTTP 404 Error"
          description="Making an API call to a non-existent endpoint."
          expectedError="404 Not Found"
          rootCause="Incorrect API URL or deleted resource."
          suggestedFix="Verify the endpoint URL and resource ID."
          (trigger)="triggerHttp404()">
        </app-issue-card>

        <app-issue-card
          issueName="Network Error"
          description="Failing to reach the server due to bad domain."
          expectedError="Network Error / Unknown Error"
          rootCause="CORS issues, DNS failure, or offline state."
          suggestedFix="Check network connectivity and CORS configuration."
          (trigger)="triggerNetworkError()">
        </app-issue-card>

        <app-issue-card
          issueName="JSON Parse Error"
          description="Parsing invalid JSON string."
          expectedError="Unexpected token"
          rootCause="Corrupted payload or incorrect format from backend."
          suggestedFix="Validate JSON format and use try-catch around JSON.parse."
          (trigger)="triggerJsonParseError()">
        </app-issue-card>

        <app-issue-card
          issueName="Promise Rejection"
          description="An unhandled Promise rejection."
          expectedError="UnhandledPromiseRejection"
          rootCause="Missing .catch() block on a Promise."
          suggestedFix="Always add a .catch() block or use try-catch with async/await."
          (trigger)="triggerPromiseRejection()">
        </app-issue-card>

        <app-issue-card
          issueName="RxJS Stream Error"
          description="Throwing an error inside an Observable stream."
          expectedError="RxJS stream failed"
          rootCause="Uncaught exception in map/tap or explicit throwError."
          suggestedFix="Use catchError operator within the pipe."
          (trigger)="triggerRxJSError()">
        </app-issue-card>

        <app-issue-card
          issueName="Route Parameter Error"
          description="Navigating to a user profile with an invalid ID."
          expectedError="User not found (simulated in users page)"
          rootCause="User tampered with URL or broken link."
          suggestedFix="Validate IDs in guards or resolvers and redirect gracefully."
          (trigger)="triggerRouteParamError()">
        </app-issue-card>

        <app-issue-card
          issueName="Missing Env Variable"
          description="Attempting to read a missing config value."
          expectedError="Configuration error"
          rootCause="Environment files not properly populated."
          suggestedFix="Add runtime configuration checks during app initialization."
          (trigger)="triggerMissingEnv()">
        </app-issue-card>
      </div>
    </div>
  `,
  styles: [`
    .lab-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .lab-header {
      margin-bottom: 40px;
      text-align: center;
    }
    .lab-header h1 {
      font-size: 2.5rem;
      color: var(--danger-color, #e06c75);
      margin-bottom: 10px;
    }
    .lab-header p {
      color: var(--text-secondary, #abb2bf);
      font-size: 1.1rem;
    }
    .issues-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
  `]
})
export class ErrorLabComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  triggerNullReference() {
    const user: any = null;
    console.log(user.name);
  }

  triggerUndefinedProperty() {
    const profile: any = undefined;
    console.log(profile.address.city);
  }

  triggerHttp404() {
    this.http.get('/api/not-found').subscribe();
  }

  triggerNetworkError() {
    this.http.get('https://invalid-api-domain.nonexistent/users').subscribe();
  }

  triggerJsonParseError() {
    JSON.parse('{bad json}');
  }

  triggerPromiseRejection() {
    Promise.reject(new Error('Unhandled promise rejection'));
  }

  triggerRxJSError() {
    throwError(() => new Error('RxJS stream failed')).subscribe();
  }

  triggerRouteParamError() {
    this.router.navigate(['/users', 'invalid-id']);
  }

  triggerMissingEnv() {
    // Simulate missing env var access by throwing explicit error if a fake one is missing
    const missingVar = (environment as any).missingApiUrl;
    if (!missingVar) {
      throw new Error('Configuration error: environment.missingApiUrl is undefined');
    }
  }
}
