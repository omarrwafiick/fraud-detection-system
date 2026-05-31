import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Rule, RuleSeverity } from './entities/rules.entity';
import { GetRuleDto } from './dtos/getRule.dto';
import { CreateRuleDto } from './dtos/createRule.dto';
import { TenantService } from 'src/tenant/tenant.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RulesService {
    constructor(
        @InjectRepository(Rule)
        private readonly repository: Repository<Rule>,
        private readonly tenantService: TenantService,
    ){}

    async getRules(tenantId: number): Promise<GetRuleDto[]> {
        const rules = await this.repository.find({
            where: {
                tenantId
            }
        });

        return rules.map(rule => {
            return {
                id: rule.id,
                name: rule.name,
                severity: this.getSeverityString(rule.severity).value,
                isEnabled: rule.isEnabled,
                createdAt: rule.createdAt,
                updatedAt: rule.updatedAt,
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

    private getSeverityString(
        severity: RuleSeverity | string,
    ): { key: RuleSeverity | string; value: string } {
        switch (String(severity).toUpperCase()) {
            case 'MEDIUM':
            return { key: RuleSeverity.MEDIUM, value: 'Medium' };

            case 'HIGH':
            return { key: RuleSeverity.HIGH, value: 'High' };

            case 'CRITICAL':
            return { key: RuleSeverity.CRITICAL, value: 'Critical' };

            default:
            return { key: 'Unknown', value: 'Unknown' };
        }
    }
}
