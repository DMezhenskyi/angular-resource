import { Component, signal } from '@angular/core';
import { API_URL } from './config';
import { User } from './model';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { httpResource } from '@angular/common/http';
import {z as zod} from 'zod'; 
import {toSignal, toObservable} from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';

const UsersSchema = zod.array(
  zod.object({
    id: zod.number(),
    name: zod.string()
  })
)

@Component({
  selector: 'app-user-search',
  imports: [MatProgressBarModule],
  template: `
    <fieldset>
      <legend>Users Search</legend>
      <input (input)="query.set($any($event.target).value)" type="search" placeholder="Search...">
    </fieldset>
    @if (users.isLoading()) {
      <mat-progress-bar mode="query" />
    }
    @if(users.error()) {
      <div class="error">Couldn't fetch data...</div>
    }
    <section class="actions">
      <button (click)="users.reload()">Reload</button>
      <button (click)="addUser()">Add User</button>
      <button (click)="users.set([])">Clear</button>
    </section>
    <ul>
      @for (user of users.value(); track user.id) {
        <li>{{ user.name }}</li>
      } @empty {
        <li class="no-data">Nothing to show</li>
      }
    </ul>
  `
})
export class UserSearchComponent {
  query = signal('');
  
  // use it for debouncing quearies
  debouncedQuery = toSignal(
      toObservable(this.query).pipe(debounceTime(300))
  );

  users = httpResource(() => ({
      url: `${API_URL}?name_like=^${this.query()}`,
    }),
    {
      defaultValue: [],
      parse: UsersSchema.parse
    }
  );
  
  addUser() {
    const user = { id: 123, name: "Dmytro Mezhenskyi" };
    this.users.update(
      users => users ? [user, ...users] : [user]
    )
  }
}
