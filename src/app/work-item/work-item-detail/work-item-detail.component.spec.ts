import {
    inject,
    async,
    TestBed,
    ComponentFixture
} from "@angular/core/testing";

import {
    DebugElement
} from "@angular/core";

import {
    By
} from "@angular/platform-browser";

import { FormsModule }   from '@angular/forms';

import { WorkItem } from "./../work-item";
import { WorkItemDetailComponent } from "./work-item-detail.component";
import { Logger } from "./../../shared/logger.service";
import { WorkItemService } from "./../work-item.service";

import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';


describe("Add work item component - ", () => {
    let comp: WorkItemDetailComponent;
    let fixture: ComponentFixture<WorkItemDetailComponent>;
    let el: DebugElement;
    let fakeWorkItem: WorkItem[];
    let fakeService: any;

    beforeEach(() => {
        fakeWorkItem = [
          {
              "fields": {
                    "system.assignee": null,
                    "system.creator": "me",
                    "system.description": null,
                    "system.state": "new",
                    "system.title": "test1"
                  },
              "id": "1",
              "type": "system.userstory",
              "version": 0
            },
        ] as WorkItem[];

        fakeService = {
            create: function() {
                return new Promise((resolve, reject) =>     {
                    resolve(fakeWorkItem);
                });
            }
        };
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],

            declarations: [
                WorkItemDetailComponent,
                HeaderComponent,
                FooterComponent
            ],
            providers: [
                Logger,
                HeaderComponent,
                FooterComponent,
                {
                    provide: WorkItemService,
                    useValue: fakeService
                }
            ]
        }).compileComponents();
    }));

    it("Page should have a title", () => {
        /*fixture = TestBed.createComponent(WorkItemDetailComponent);
        comp = fixture.componentInstance;
        el = fixture.debugElement.query(By.css("h1"));

        //fixture.detectChanges(); // trigger data binding
        //el = fixture.debugElement.query(By.css('h1'));*/
    });
});
