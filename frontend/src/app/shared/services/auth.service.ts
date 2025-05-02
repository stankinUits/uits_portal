import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginForm } from '@app/shared/types/models/forms';
import { ApiConfig } from '@app/configs/api.config';
import { createAnonymousProfile, Profile } from '@app/shared/types/models/auth';
import { map, tap } from 'rxjs/operators';
import { SnakeObjectToCamelCase } from '@app/shared/utils/SnakeToCamelCase';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';

const Anonymous: Profile = createAnonymousProfile();

type ListUsersParams = {
  is_moderator?: boolean;
  is_teacher?: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  profile$: BehaviorSubject<Profile>;

  constructor(private http: HttpClient) {
    this.profile$ = new BehaviorSubject<Profile>(Anonymous);
    this.retrieveProfile().subscribe((p) => {
      // console.log(p, 'ok');
    });
  }

  login(data: LoginForm) {
    return this.http.post(ApiConfig.auth.login, data).pipe(
      map((key) => {
        this.retrieveProfile().subscribe();
        return key;
      })
    );
  }

  logout() {
    return this.http.post(ApiConfig.auth.logout, null);
  }

  retrieveProfile(): Observable<Profile> {
    return this.http.get<Profile>(ApiConfig.auth.user).pipe(
      map((profile) => SnakeObjectToCamelCase(profile) as Profile),
      map((profile) => {
        this.profile$.next(profile);
        return profile;
      }),
      catchError((err, caught) => {
        this.profile$.next(Anonymous);
        return throwError(err);
      })
    );
  }

  listUsers(params: ListUsersParams): Observable<Profile[]> {
    return this.http
      .get<Profile[]>(ApiConfig.auth.users, {
        params,
      })
      .pipe(map((users) => users.map(SnakeObjectToCamelCase)));
  }

  canEdit(): Observable<boolean> {
    return this.profile$.pipe(
      map(
        (profile) =>
          // console.log('This user can edit - ', profile.isModerator || profile.isSuperuser)
          (profile.isModerator || profile.isSuperuser) && !profile.isAnonymous
      )
    );
  }

  isAdmin(): Observable<boolean> {
    return this.profile$.pipe(map((profile) => profile.isSuperuser));
  }

  isTeacher(): Observable<boolean> {
    return this.profile$.pipe(
      map(
        (profile) =>
          // console.log('This user is teacher - ', profile.isTeacher || profile.isSuperuser)
          (profile.isTeacher || profile.isSuperuser) && !profile.isAnonymous
      )
    );
  }

  updateProfile(profileData: any): Observable<any> {
    return this.http
      .post<Profile>(ApiConfig.user.update_info, profileData)
      .pipe(
        map((updatedProfile) => {
          const camelCaseProfile = SnakeObjectToCamelCase(
            updatedProfile
          ) as Profile;
          this.profile$.next(camelCaseProfile);
          return camelCaseProfile;
        }),
        catchError((err) => {
          console.error('Ошибка при обновлении профиля:', err);
          return throwError(err);
        })
      );
  }
}
