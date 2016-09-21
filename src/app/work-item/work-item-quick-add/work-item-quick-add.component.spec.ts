import {
    inject,
    async,
    TestBed,
    fakeAsync,
    tick,
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
import { WorkItemQuickAddComponent } from "./work-item-quick-add.component";
import { Logger } from "./../../shared/logger.service";
import { WorkItemService } from "./../work-item.service";


describe("Add work item component - ", () => {
    let comp: WorkItemQuickAddComponent;
    let fixture: ComponentFixture<WorkItemQuickAddComponent>;
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
            create: function(workItem: WorkItem) {
                return new Promise((resolve, reject) => {
                    resolve(workItem);
                    // reject("Title is empty");
                });
            }
        };
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [
                WorkItemQuickAddComponent
            ],
            providers: [
                Logger,
                {
                    provide: WorkItemService,
                    useValue: fakeService
                }
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(WorkItemQuickAddComponent);
            comp = fixture.componentInstance;
        });
    }));

    it("Title string with only whitespaces should not enable the Add button", () => {
        el = fixture.debugElement.query(By.css(".pficon-add-circle-o"));
        fixture.detectChanges();
        comp.workItem.fields["system.title"] = "  ";
        fixture.detectChanges();
        expect(el.classes["icon-btn-disabled"]).toBeTruthy();
    });

    it("Add button should remain disabled for a title with empty string", () => {
        el = fixture.debugElement.query(By.css(".pficon-add-circle-o"));
        fixture.detectChanges();
        comp.workItem.fields["system.title"] = "";
        fixture.detectChanges();
        expect(el.classes["icon-btn-disabled"]).toBeTruthy();

    });

    it("Save with empty title should raise an error", fakeAsync(() => {
        el = fixture.debugElement.query(By.css(".pficon-add-circle-o"));
        fixture.detectChanges();
        comp.workItem.fields["system.title"] = "  ";
        fixture.detectChanges();
        comp.save();
        tick();
        fixture.detectChanges();
        expect(comp.error).not.toBeNull();
    }));
});
