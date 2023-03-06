/**
 * TODO: 10. (Done) Asynchronous Programming (RxJS)
 * TODO: 13. (Done) Angular (NX) Architecture
 */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Account } from '@bfi/shared/models';
import { AccountService } from '@bfi/shared/services';
import { combineLatest, map, Observable, of, startWith } from 'rxjs';

const ACCOUNT_FILTER_KEY = 'account-type';

@Component({
  selector: 'sum-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSummaryComponent implements OnInit {
  public accounts$!: Observable<Account[]>;
  public formInstance!: FormGroup;

  public readonly accountFilterKey = ACCOUNT_FILTER_KEY;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initAccountStream();
  }

  public trackByIdentity(index: number, item: Account) {
    return item.id;
  }

  private initAccountStream(): void {
    this.accounts$ = combineLatest([
      this.accountService.getAccounts(),
      this.formInstance.valueChanges.pipe(startWith('')),
    ]).pipe(
      map(([accounts, { [ACCOUNT_FILTER_KEY]: filterValue }]) => {
        return accounts.filter(
          (acc) => acc.currency === filterValue || !filterValue
        );
      })
    );
  }

  private initForm(): void {
    this.formInstance = this.formBuilder.group({
      [ACCOUNT_FILTER_KEY]: this.formBuilder.control(''),
    });
  }
}
