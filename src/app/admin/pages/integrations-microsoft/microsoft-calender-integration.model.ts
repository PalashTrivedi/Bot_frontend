export class MicrosoftCalenderIntegrationModel {
    constructor(
        public id: number,
        public bot: any,
        public microsoft_user: any,
        public time_slot_duration: number,
        public users: any,
        public availability: any,
    ) {}
}
