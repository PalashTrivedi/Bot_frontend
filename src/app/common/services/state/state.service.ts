import { Injectable } from "@angular/core";
import { StateModel } from "CommonModels/state/state.model";
import { StorageService } from "CommonServices/storage/storage.service";

@Injectable({
    providedIn: "root",
})
export class StateService {
    public state: StateModel;

    constructor(private storageService: StorageService) {
        this.state = this.storageService.get() || this.get_default_state();
    }

    get_default_state(): StateModel {
        return new StateModel(null);
    }

    save_to_localStorage(): void {
        this.storageService.set(this.state);
    }

    clear(): void {
        this.storageService.clear();
        this.state = this.get_default_state();
    }

    setItem(state: StateModel): void {
        console.log("Current State : ", this.state);
        console.log("Params State  : ", state);
        if (state.project || state.project === null) {
            this.state.project = state.project;
        }
        if (state.sessionUser || state.sessionUser === null) {
            this.state.sessionUser = state.sessionUser;
        }
        // this.state = { ...this.state, ...state };
        this.save_to_localStorage();
        console.log("Merged State  : ", this.state);
    }

    removeItem(keyName: string): void {
        this.state[keyName] = null;
        this.save_to_localStorage();
    }

    has_permission(perm: string): boolean {
        return this.state.sessionUser.permissions.includes(perm) || (this.state.project && this.state.project.permissions.includes(perm));
    }
}
