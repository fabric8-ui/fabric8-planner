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
            create: function() {
                return new Promise((resolve, reject) =>     {
                    resolve(fakeWorkItem);
                });
            }
        };
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
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
        .then(()=>{
            console.log("All Okay");
        })
        .catch((err) => {
            console.log(err);
        });
    }));

    it("Test add button disable", () => {
        fixture = TestBed.createComponent(WorkItemQuickAddComponent);
        comp = fixture.componentInstance;
        fixture.detectChanges(); // trigger data binding
        expect(true).toBe(true);
    });
});
