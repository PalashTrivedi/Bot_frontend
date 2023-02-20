import { Injectable } from "@angular/core";
import { StateModel } from "CommonModels/state/state.model";
import { SessionService } from "CommonServices/session/session.service";

@Injectable({
    providedIn: "root",
})
export class StorageService {
    constructor() {}

    set(state: StateModel): void {
        localStorage.setItem("state", JSON.stringify(state));
    }

    get(): StateModel {
        try {
            return JSON.parse(localStorage.getItem("state"));
        } catch (error) {
            console.log("Invalid JSON found in localStorage, clearing.....");
            this.clear();
        }
        return null;
    }

    clear(): void {
        localStorage.removeItem("state");
        // localStorage.clear();
    }
}
