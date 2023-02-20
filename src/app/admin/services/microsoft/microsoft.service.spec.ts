import { TestBed } from "@angular/core/testing";

import { MicrosoftService } from "./microsoft.service";

describe("MicrosoftService", () => {
    let service: MicrosoftService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MicrosoftService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
