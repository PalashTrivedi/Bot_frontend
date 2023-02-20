export class ProjectModel {

    constructor(
        public id: number,
        public name: string,
        public permissions?: Array<string>,
    ) { }

}
