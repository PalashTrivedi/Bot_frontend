export class AiProviderModel {
    constructor(
        public id: number,
        public slug: string,
        public name: string
    ) { }
}

export class AgentConfigModel {
    constructor(
        public id: number,
        public nlp_config: any,
        public stt_config: any,
        public tts_config: any,
    ) { }
}

export class AgentModel {
    constructor(
        public id: number,
        public name: string,
        public project: number,
        public ai_provider: AiProviderModel | number,
        public agent_config: AgentConfigModel
    ) { }
}
