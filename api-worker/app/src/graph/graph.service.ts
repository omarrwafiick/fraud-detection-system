import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { NEO4J_DRIVER } from './graph.module';
import neo4j, { Driver } from 'neo4j-driver';
import { SyncTransactionDto } from './dtos/syncTransaction.dto';

@Injectable()
export class GraphService implements OnModuleInit {
    constructor(
        @Inject(NEO4J_DRIVER) 
        private readonly neo4jDriver: Driver,
    ) {}

    async onModuleInit() {
        const session = this.neo4jDriver.session();
        try {
            /**
             * Constraint is to prevent data leaks by make each account live in
             * a separate sub graph + create an index for fast lookups
             */
            await session.run(`
                CREATE CONSTRAINT unique_account_per_tenant IF NOT EXISTS
                FOR (a:Account) REQUIRE (a.id, a.tenantId) IS UNIQUE
            `);
        } finally {
            await session.close();
        }
    }

    async syncTransactionEdge(payload: SyncTransactionDto): Promise<void> {
        const session = this.neo4jDriver.session();
        
        const cypher = `
            MERGE (s:Account { id: $senderAccountId, tenantId: $tenantId })
            MERGE (r:Account { id: $receiverAccountId, tenantId: $tenantId })
            CREATE (s)-[t:TRANSACTED_WITH {
                id: $transactionId,
                amount: $amount,
                status: $status,
                sender_device_id: $deviceId,
                timestamp: datetime()
            }]->(r)
        `;

        try {
        await session.run(cypher, {
            tenantId: neo4j.int(payload.tenantId),
            senderAccountId: payload.senderAccountId,
            receiverAccountId: payload.receiverAccountId,
            transactionId: payload.transactionId,
            amount: payload.amount,
            status: payload.status,
            deviceId: payload.sender_device_id,
        });
        } finally {
            await session.close();
        }
    }

    async getAccountNetwork(tenantId: number, accountId: string): Promise<any[]> {
        const session = this.neo4jDriver.session();
        const cypher = `
            MATCH (target:Account {id: $accountId, tenantId: $tenantId})-[r:TRANSACTED_WITH]-(neighbor:Account)
            RETURN neighbor.id AS connectedAccount, 
                type(r) AS relationType,
                r.amount AS amount, 
                r.status AS status,
                r.id AS transactionId
            ORDER BY r.timestamp DESC 
            LIMIT 50
        `;

        try {
            const result = await session.run(cypher, { 
            tenantId: neo4j.int(tenantId), 
            accountId 
            });
            return result.records.map(record => ({
            connectedAccount: record.get('connectedAccount'),
            amount: record.get('amount'),
            status: record.get('status'),
            transactionId: record.get('transactionId')
            }));
        } finally {
            await session.close();
        }
    }

    async getDegreesOfSeparationFromFraud(tenantId: number, accountId: string)
        : Promise<{ hasRiskPath: boolean; degrees: number }> {
        const session = this.neo4jDriver.session();
        // 3 hops with a rejected transactoion has serious issues
        const cypher = `
            MATCH p = shortestPath(
            (src:Account {id: $accountId, tenantId: $tenantId})-[:TRANSACTED_WITH*1..3]-(bad:Account)
            )
            WHERE ANY(r IN relationships(p) WHERE r.status = 'REJECTED')
            RETURN length(p) AS degrees
            LIMIT 1
        `;

        try {
            const result = await session.run(cypher, { 
                tenantId: neo4j.int(tenantId), 
                accountId 
            });
            
            if (result.records.length === 0) {
                return { hasRiskPath: false, degrees: 0 };
            }

            return { 
                hasRiskPath: true, 
                degrees: result.records[0].get('degrees').toNumber() 
            };
        } finally {
            await session.close();
        }
    }

    async detectTransactionCycles(tenantId: number, accountId: string): Promise<boolean> {
        const session = this.neo4jDriver.session();
        
        const cypher = `
            MATCH p = (start:Account {id: $accountId, tenantId: $tenantId})-[:TRANSACTED_WITH*2..4]->(start)
            RETURN count(p) > 0 AS isInLoop
        `;

        try {
            const result = await session.run(cypher, { 
                tenantId: neo4j.int(tenantId), 
                accountId 
            });
            return result.records[0].get('isInLoop');
        } finally {
            await session.close();
        }
    }

    async getSharedFingerprintAccounts(tenantId: number, deviceId: string): Promise<string[]> {
        const session = this.neo4jDriver.session();
        
        const cypher = `
            MATCH (target:Account {tenantId: $tenantId})-[:TRANSACTED_WITH {sender_device_id: $deviceId}]->(anyOther)
            MATCH (other:Account {tenantId: $tenantId})-[:TRANSACTED_WITH {sender_device_id: $deviceId}]->(anyOther)
            WHERE target.id <> other.id
            RETURN DISTINCT other.id AS linkedAccount
        `;

        try {
            const result = await session.run(cypher, { 
            tenantId: neo4j.int(tenantId), 
            deviceId 
            });
            return result.records.map(record => record.get('linkedAccount'));
        } finally {
            await session.close();
        }
    }
}
