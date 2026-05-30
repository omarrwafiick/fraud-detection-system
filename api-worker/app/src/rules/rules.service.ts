import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Rule, RuleSeverity } from './entities/rules.entity';
import { GetRuleDto } from './dtos/getRule.dto';
import { CreateRuleDto } from './dtos/createRule.dto';
import { TenantService } from 'src/tenant/tenant.service';

@Injectable()
export class RulesService {
    private constructor(
        private readonly repository: Repository<Rule>,
        private readonly tenantService: TenantService,
    ){}

    async getRules(tenantId: number): Promise<GetRuleDto[]> {
        const rules = await this.repository.find({
            where: {
                tenantId
            }
        });

        return rules.map(role => {
            return {
                id: role.id,
                name: role.name,
                severity: this.getSeverityString(role.severity).value,
                isEnabled: role.isEnabled,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt,
            }
        });
    }

    async createRule(payload: CreateRuleDto): Promise<number>{
        const [ruleExists, tenantExists] = await Promise.all([
            this.repository.existsBy(
                {
                    name: payload.name,
                    tenantId: payload.tenantId,
                }
            ),
            this.tenantService.tenantExistsById(payload.tenantId)
        ]);

        if(ruleExists){
            throw new ConflictException("rule is already exists");
        }

        if(!tenantExists){
            throw new NotFoundException("tenant was not found");
        }

        const severity = this.getSeverityString(payload.severity).key as RuleSeverity;

        const newRule = await this.repository.create({
            name: payload.name,
            severity,
            tenantId: payload.tenantId,
        });

        await this.repository.save(newRule);

        return newRule.id;
    }

    private getSeverityString(severity: RuleSeverity|string): { key: RuleSeverity|string, value: string } {
        switch (severity) {
            case RuleSeverity.MEDIUM || 'MEDIUM':
            return { key: RuleSeverity.MEDIUM, value: 'Medium' };
            case RuleSeverity.HIGH || 'HIGH':
            return { key: RuleSeverity.HIGH, value: 'High' };
            case RuleSeverity.CRITICAL || 'CRITICAL':
            return { key: RuleSeverity.CRITICAL, value: 'Critical' };
            default:
            return { key: 'Unknown', value: 'Unknown' };
        }
    }
}
