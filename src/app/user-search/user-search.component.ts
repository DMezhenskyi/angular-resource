import { Component, signal } from '@angular/core';
import { API_URL } from './config';
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
    <fieldset style="margin-bottom: 15px">
      <legend>Users Search</legend>
      <input (input)="query.set($any($event.target).value)" type="search" placeholder="Search...">
      <label>
        <input type="checkbox" [checked]="disabled()" (change)="disabled.set($any($event.target).checked)" />
        <p>Disable Live Search</p>
      </label>
    </fieldset>
    @if (users.isLoading()) {
      <mat-progress-bar mode="query" />
    }
    @if(users.error()) {
      <div class="error">Couldn't fetch data...</div>
    }
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
  
  /**
   * Use it for debouncing/throttle queries
   * Learn more about it from the tip below  👇
   * @link https://youtube.com/shorts/XvWzhaRO-d4
   */
  debouncedQuery = toSignal(
      toObservable(this.query).pipe(debounceTime(300))
  );

  disabled = signal(true);

  users = httpResource(() => {
      /**
       * Use this if-block to prevent http calls at certain conditions
       * Learn more about it from the tip below  👇
       * @link https://youtube.com/shorts/fzsQ2jXyAcA
       */
      if (this.disabled()) {
        return;
      }
      return `${API_URL}?name_like=^${this.debouncedQuery()}`;
    },
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
