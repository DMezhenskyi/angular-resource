import { Component, computed, linkedSignal, Resource, resourceFromSnapshots, ResourceSnapshot, signal } from '@angular/core';
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
  protected readonly query = signal('');

  private readonly userResource = httpResource<User[]>(
    () => `${API_URL}${this.query()}`,
    { defaultValue: [] }
  );

  protected readonly users = withPreviousValue(
    withSorting(
      this.userResource,
      (a, b) => a.id - b.id
    )
  )

  constructor() {}
  
  addUser() {
    const user = { id: 123, name: "Dmytro Mezhenskyi" };
    this.userResource.update(
      users => users ? [user, ...users] : [user]
    )
  }
}
function withPreviousValue<T>(resource: Resource<T>): Resource<T> {
  const derivedResource = linkedSignal({
    source: resource.snapshot,
    computation: (snap, prev): ResourceSnapshot<T> => {
      if (snap.status === 'loading' && prev && prev.value.status !== 'error') {
        return { ...snap, value: prev.value.value };
      }

      return snap;
    }
  });
  return resourceFromSnapshots(derivedResource);
}

function withSorting<T>(
  resource: Resource<T[]>,
  sortFn: (a: T, b: T) => number
): Resource<T[]> {
  const derivedResource = computed((): ResourceSnapshot<T[]> => {
    const snap = resource.snapshot();
    
    if (snap.status != 'error' && snap.value) {
      return { ...snap, value: [...snap.value].sort(sortFn) };
    }
    
    return snap;
  });
  
  return resourceFromSnapshots(derivedResource);
}