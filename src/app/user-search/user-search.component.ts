import { Component, signal } from '@angular/core';
import { API_URL } from './config';
import { User } from './model';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@Component({
  selector: 'app-user-search',
  imports: [MatProgressBarModule],
  template: `
    <fieldset>
      <legend>Users Search</legend>
      <input (input)="query.set($any($event.target).value)" type="search" placeholder="Search...">
    </fieldset>
    <section class="actions">
      <button>Reload</button>
      <button>Add User</button>
      <button>Clear</button>
    </section>
    <ul>
      @for (user of users(); track user.id) {
        <li>{{ user.name }}</li>
      } @empty {
        <li class="no-data">Nothing to show</li>
      }
    </ul>
  `
})
export class UserSearchComponent {
  query = signal('');

  users = signal<User[]>([]);
  
  addUser() {
    const user = { id: 123, name: "Dmytro Mezhenskyi" };
    // this.users.update(
    //   users => users ? [user, ...users] : [user]
    // )
  }
}
