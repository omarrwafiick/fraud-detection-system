export class GetCaseDto{
    id: number;

    status: string;

    triggerType: string; 

    suspectEntityId: string;

    metadata: any;

    resolutionNotes: string;

    createdAt: Date;

    updatedAt: Date;
}