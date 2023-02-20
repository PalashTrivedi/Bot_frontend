export class SessionUserModel {
    constructor(
        public id: number,
        public email: string,
        public first_name: string,
        public last_name: string,
        public token: string,
        public permissions: Array<string>,
    ) {}
}
