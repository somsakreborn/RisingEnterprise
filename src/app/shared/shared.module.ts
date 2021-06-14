import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToggleFullScreenDirective} from './fullscreen/toggle-fullscreen.directive';
import {HttpClientModule} from '@angular/common/http';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {CardComponent} from './card/card.component';
import {CardToggleDirective} from './card/card-toggle.directive';
import {ModalBasicComponent} from './modal-basic/modal-basic.component';
import {ModalAnimationComponent} from './modal-animation/modal-animation.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {ClickOutsideModule} from 'ng-click-outside';
import {DataFilterPipe} from './elements/data-filter.pipe';
import {AccordionAnchorDirective, AccordionDirective, AccordionLinkDirective} from './accordion';
import {TitleComponent} from '../protected/layouts/title/title.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerModule, CollapseModule} from 'ngx-bootstrap';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {NgxDebounceClickModule} from 'ngx-debounce-click';

import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {SelectModule} from 'ng-select';
import {UiSwitchModule} from 'ng2-ui-switch';
import {DataTableModule} from 'angular2-datatable';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        BsDatepickerModule.forRoot(),
        CollapseModule.forRoot(),
        TimepickerModule.forRoot(),
        HttpClientModule,
        PerfectScrollbarModule,
        ClickOutsideModule,
        FormsModule,
        ReactiveFormsModule,
        NgxDebounceClickModule,
        NgxDatatableModule,
        SelectModule,
        UiSwitchModule,
        DataTableModule
    ],
    exports: [
        NgbModule,
        BsDatepickerModule,
        CollapseModule,
        TimepickerModule,
        ToggleFullScreenDirective,
        AccordionAnchorDirective,
        AccordionLinkDirective,
        AccordionDirective,
        CardToggleDirective,
        HttpClientModule,
        PerfectScrollbarModule,
        TitleComponent,
        CardComponent,
        ModalBasicComponent,
        ModalAnimationComponent,
        SpinnerComponent,
        ClickOutsideModule,
        FormsModule,
        ReactiveFormsModule,
        NgxDebounceClickModule,
        DataFilterPipe,
        NgxDatatableModule,
        SelectModule,
        UiSwitchModule,
        DataTableModule
    ],
    declarations: [
        ToggleFullScreenDirective,
        AccordionAnchorDirective,
        AccordionLinkDirective,
        AccordionDirective,
        CardToggleDirective,
        TitleComponent,
        CardComponent,
        ModalBasicComponent,
        ModalAnimationComponent,
        SpinnerComponent,
        DataFilterPipe

    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {
}
