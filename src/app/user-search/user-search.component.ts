import { Component, signal } from '@angular/core';
import { API_URL } from './config';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { httpResource } from '@angular/common/http';
import { User } from './model';

@Component({
  selector: 'app-user-search',
  imports: [MatProgressBarModule],
  template: `
    <fieldset style="margin-bottom: 15px">
      <legend>Users Search</legend>
      <input (input)="query.set($event.target.value)" type="search" placeholder="Search...">
    </fieldset>
    @if (userResource.isLoading()) {
      <mat-progress-bar mode="query" />
    }
    @if(userResource.error()) {
      <div class="error">Couldn't fetch data...</div>
    }
    <ul>
      @for (user of userResource.value(); track user.id) {
        <li>{{ user.name }}</li>
      } @empty {
        <li class="no-data">Nothing to show</li>
      }
    </ul>
  `
})
export class UserSearchComponent {
  protected readonly query = signal('');

  protected readonly userResource = httpResource<User[]>(
    () => `${API_URL}${this.query()}`
  );
  
  addUser() {
    const user = { id: 123, name: "Dmytro Mezhenskyi" };
    this.userResource.update(
      users => users ? [user, ...users] : [user]
    )
  }
}
