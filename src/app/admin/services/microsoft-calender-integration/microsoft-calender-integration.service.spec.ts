import { TestBed } from "@angular/core/testing";

import { MicrosoftCalenderIntegrationService } from "./microsoft-calender-integration.service";

describe("MicrosoftCalenderIntegrationService", () => {
    let service: MicrosoftCalenderIntegrationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MicrosoftCalenderIntegrationService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
