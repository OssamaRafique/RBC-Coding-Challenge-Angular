import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from '@bfi/shared/models';
import { AccountService } from '@bfi/shared/services';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'bfi-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailsComponent implements OnInit {
  public account$!: Observable<Account | undefined>;

  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.account$ = this.activatedRoute.params.pipe(
      switchMap((params) => this.accountService.getAccountById(params['id']))
    );
  }
}
