import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { LoginStateEnum, LoginStore } from './login.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoginStore],
})
export class LoginComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @ViewChild('unknownError') unknownErrorTemplate?: TemplateRef<any>;

  private loginStateSubscription?: Subscription;
  private formChangesSubscription?: Subscription;

  constructor(
    public readonly store: LoginStore,
    private readonly formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      email: ['', Validators.compose([Validators.required, Validators.email])],
      // eslint-disable-next-line @typescript-eslint/unbound-method
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loginStateSubscription = this.store.loginState$.subscribe((state) => {
      if (state === LoginStateEnum.WAITING_RESPONSE) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }

      if (state === LoginStateEnum.SUCCESS) {
        void this.router.navigate(['']);
      }

      if (
        state === LoginStateEnum.UNKNOWN_ERROR &&
        this.unknownErrorTemplate !== undefined
      ) {
        this.snackBar.openFromTemplate(this.unknownErrorTemplate, {
          duration: 6000,
        });
      }
    });
    this.formChangesSubscription = this.form.valueChanges.subscribe(() =>
      this.store.reset(),
    );
  }

  ngOnDestroy(): void {
    this.loginStateSubscription?.unsubscribe();
    this.formChangesSubscription?.unsubscribe();
  }

  public submitLoginForm(): void {
    this.store.login({
      email: String(this.form.get('email')?.value),
      password: String(this.form.get('password')?.value),
    });
  }
}
