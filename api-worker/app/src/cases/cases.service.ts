import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Case, CaseSeverity, CaseStatus, TriggerType } from './entities/case.entity';
import { GetCaseDto } from './dto/getCases.dto';
import { UpdateCaseDto } from './dto/updateCase.dto';
import { TenantService } from 'src/tenant/tenant.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CasesService {
    constructor(
        @InjectRepository(Case)
        private readonly repository: Repository<Case>,
        private readonly tenantService: TenantService,
    ){}

    async getCases(tenantId: number): Promise<GetCaseDto[]>{
        const isTenantExists = await this.tenantService.tenantExistsById(tenantId);

        if(!isTenantExists){
            throw new NotFoundException("tenant was not found");
        }

        const cases = await this.repository.find({
            where: {
                tenantId
            }
        });

        return cases.map(caseEntity => {
            return {
                id: caseEntity.id,
                status: this.getCaseStatus(caseEntity.status).value,
                severity: this.getCaseSeverity(caseEntity.severity).value,
                triggerType: this.getTriggerType(caseEntity.triggerType).value,
                suspectEntityId: caseEntity.suspectEntityId,
                metadata: caseEntity.metadata,
                resolutionNotes: caseEntity.resolutionNotes,
                createdAt: caseEntity.createdAt,
                updatedAt: caseEntity.updatedAt,
            }
        });
    }

    async updateCase(id: number, payload: UpdateCaseDto): Promise<boolean>{
        try {
            const caseEntity = await this.repository.findOne({
                where: {
                    id
                }
            });

            if(!caseEntity){
                throw new NotFoundException("Case was not found");
            }

            caseEntity.status = this.getCaseStatus(payload.status).key as CaseStatus;
            caseEntity.resolutionNotes = payload.resolutionNotes;

            await this.repository.save(caseEntity);

            return true;
        } catch (_error) {
            return false;
        }
    }

    private getCaseStatus(
        status: CaseStatus | string,
    ): { key: string; value: string } {
        switch (status) {
            case CaseStatus.OPEN:
            case 'OPEN':
            return { key: CaseStatus.OPEN, value: 'Open' };

            case CaseStatus.INVESTIGATING:
            case 'INVESTIGATING':
            return { key: CaseStatus.INVESTIGATING, value: 'Investigating' };

            case CaseStatus.RESOLVED:
            case 'RESOLVED':
            return { key: CaseStatus.RESOLVED, value: 'Resolved' };

            case CaseStatus.DISMISSED:
            case 'DISMISSED':
            return { key: CaseStatus.DISMISSED, value: 'Dismissed' };

            default:
            return { key: 'UNKNOWN', value: 'Unknown' };
        }
    }

    private getCaseSeverity(
        severity: CaseSeverity | string,
    ): { key: string; value: string } {
        switch (severity) {
            case CaseSeverity.MEDIUM:
            case 'MEDIUM':
            return { key: CaseSeverity.MEDIUM, value: 'Medium' };

            case CaseSeverity.HIGH:
            case 'HIGH':
            return { key: CaseSeverity.HIGH, value: 'High' };

            case CaseSeverity.CRITICAL:
            case 'CRITICAL':
            return { key: CaseSeverity.CRITICAL, value: 'Critical' };

            default:
            return { key: 'UNKNOWN', value: 'Unknown' };
        }
    }

    private getTriggerType(
        triggerType: TriggerType | string,
    ): { key: string; value: string } {
        switch (triggerType) {
            case TriggerType.CYCLIC_TRANSFER_DETECTION:
            case 'CYCLIC_TRANSFER_DETECTION':
            return {
                key: TriggerType.CYCLIC_TRANSFER_DETECTION,
                value: 'Cyclic Transfer Detection',
            };

            case TriggerType.CUSTOM_RULE_VIOLATION:
            case 'CUSTOM_RULE_VIOLATION':
            return {
                key: TriggerType.CUSTOM_RULE_VIOLATION,
                value: 'Custom Rule Violation',
            };

            default:
            return { key: 'UNKNOWN', value: 'Unknown' };
        }
    }
}
