import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { SharedComponentsModule } from '@bfi/shared/components';
import { AboutComponent } from './about/about.component';
import { AppRoutingModule } from './app-routing.module';
import { FeatureAccountSummaryModule } from '@bfi/feature/account-summary';
import { SharedStoreModule } from '@bfi/shared/store';
import { StoreModule } from '@ngrx/store';
import { TransfersComponent } from './transfers/transfers.component';
import { AccountDetailsComponent } from './account-details/account-details.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    TransfersComponent,
    AccountDetailsComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    SharedComponentsModule,
    FeatureAccountSummaryModule,
    SharedStoreModule,
    StoreModule.forRoot({}),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
