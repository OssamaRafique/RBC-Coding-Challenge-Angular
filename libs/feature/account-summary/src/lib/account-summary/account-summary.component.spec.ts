import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Account } from '@bfi/shared/models';
import { AccountService } from '@bfi/shared/services';
import { of } from 'rxjs';
import { AccountSummaryComponent } from './account-summary.component';

// TODO: 9. (Done) Topics in this file: Angular Unit Testing w/ Jest

const MOCK_ACCOUNTS: Account[] = [
  { id: '1234', balance: 7500, currency: 'cad' },
  { id: '1235', balance: 4500, currency: 'cad' },
  { id: '1236', balance: 2102, currency: 'usd' },
];

describe('AccountSummaryComponent', () => {
  let component: AccountSummaryComponent;
  let fixture: ComponentFixture<AccountSummaryComponent>;
  let accountService: AccountService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountSummaryComponent],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSummaryComponent);
    component = fixture.componentInstance;
    accountService = TestBed.inject(AccountService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve accounts', () => {
    expect.assertions(2);
    expect(component.accounts$).toBeTruthy();
    component.accounts$.subscribe((acc) => {
      expect(acc.length).toBe(4);
    });
  });

  it('should initialize the form correctly', () => {
    expect(component.formInstance instanceof FormGroup).toBe(true);
    expect(
      component.formInstance.controls[component.accountFilterKey].value
    ).toBe('');
  });

  it('should initialize the accounts$ stream correctly', () => {
    jest
      .spyOn(accountService, 'getAccounts')
      .mockReturnValue(of(MOCK_ACCOUNTS));

    component.ngOnInit();
    expect(component.accounts$).toBeDefined();
    component.accounts$.subscribe((result) => {
      expect(result).toEqual(MOCK_ACCOUNTS);
    });
  });

  it('should filter accounts based on the selected filter value', () => {
    jest
      .spyOn(accountService, 'getAccounts')
      .mockReturnValue(of(MOCK_ACCOUNTS));
    component.ngOnInit();

    const selectElement =
      fixture.nativeElement.querySelector('#accounts-filter');
    selectElement.value = 'usd';
    selectElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    component.accounts$.subscribe((result) => {
      expect(result.length).toBe(1);
      expect(result[0].currency).toBe('usd');
    });
  });

  it('should generate the correct URL when an account ID is clicked', () => {
    jest
      .spyOn(accountService, 'getAccounts')
      .mockReturnValue(of(MOCK_ACCOUNTS));
    component.ngOnInit();

    const accountLink = fixture.nativeElement.querySelector('a');
    const url = accountLink.getAttribute('ng-reflect-router-link');
    expect(url).toContain(MOCK_ACCOUNTS[0].id);
  });

  it('should not filter accounts if no filter value is selected', () => {
    component.formInstance.get('account-type')?.setValue('');
    fixture.detectChanges();

    const accountRows = fixture.nativeElement.querySelectorAll(
      '.accounts-table tbody tr'
    );
    expect(accountRows.length).toEqual(MOCK_ACCOUNTS.length);
  });

  it('should display the accounts table', () => {
    const tableElement = fixture.nativeElement.querySelector('.accounts-table');
    expect(tableElement).toBeTruthy();
  });

  it('should display the correct account details', () => {
    const accountRows = fixture.nativeElement.querySelectorAll(
      '.accounts-table tbody tr'
    );
    expect(accountRows.length).toEqual(MOCK_ACCOUNTS.length);

    accountRows.forEach((row: any, index: number) => {
      const account = MOCK_ACCOUNTS[index];
      const accountId = row.querySelector('th a').textContent;
      const balance = row.querySelector('td:nth-child(2)').textContent;
      const currency = row.querySelector('td:nth-child(3)').textContent;

      expect(accountId).toContain(account.id);
      expect(balance).toEqual(String(account.balance));
      expect(currency).toBe(account.currency.toUpperCase());
    });
  });
});
