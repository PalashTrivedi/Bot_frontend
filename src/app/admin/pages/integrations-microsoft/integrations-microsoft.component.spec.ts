import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { IntegrationsMicrosoftComponent } from "./integrations-microsoft.component";

describe("IntegrationsMicrosoftComponent", () => {
    let component: IntegrationsMicrosoftComponent;
    let fixture: ComponentFixture<IntegrationsMicrosoftComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [IntegrationsMicrosoftComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IntegrationsMicrosoftComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
