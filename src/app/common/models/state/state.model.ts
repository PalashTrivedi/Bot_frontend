import { SessionUserModel } from "CommonModels/session-user/session-user.model";
import { ProjectModel } from "AdminPages/projects/project.model";

export class StateModel {
    constructor(
        public sessionUser?: SessionUserModel,
        public project?: ProjectModel,
    ) {}
}
