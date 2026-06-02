import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import neo4j, { Driver } from 'neo4j-driver';
import { SyncTransactionDto } from './dtos/syncTransaction.dto';
import { NEO4J_DRIVER } from './constants/graph.constants';

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

    async getAccountNetwork(tenantId: number, accountId: string, limit: number = 50): Promise<any[]> {
        const session = this.neo4jDriver.session();
        const cypher = `
            MATCH (target:Account {id: $accountId, tenantId: $tenantId})-[r:TRANSACTED_WITH]-(neighbor:Account)
            RETURN neighbor.id AS connectedAccount, 
                type(r) AS relationType,
                r.amount AS amount, 
                r.status AS status,
                r.id AS transactionId
            ORDER BY r.timestamp DESC 
            LIMIT $limit
        `;

        try {
            const result = await session.run(cypher, { 
            tenantId: neo4j.int(tenantId), 
            accountId, 
            limit: neo4j.int(limit)
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

    async getDegreesOfSeparationFromFraud(tenantId: number, accountId: string, hops: number = 3)
        : Promise<{ hasRiskPath: boolean; degrees: number }> {
        const session = this.neo4jDriver.session();
        const cypher = `
            MATCH p = shortestPath(
            (src:Account {id: $accountId, tenantId: $tenantId})-[:TRANSACTED_WITH*1..$hops]-(bad:Account)
            )
            WHERE ANY(r IN relationships(p) WHERE r.status = 'REJECTED')
            RETURN length(p) AS degrees
            LIMIT 1
        `;

        try {
            const result = await session.run(cypher, { 
                tenantId: neo4j.int(tenantId), 
                accountId, 
                hops: neo4j.int(hops)
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

    async detectTransactionCycles(tenantId: number, accountId: string, maxHops: number = 4): Promise<boolean> {
        const session = this.neo4jDriver.session();
        
        const cypher = `
            MATCH p = (start:Account {id: $accountId, tenantId: $tenantId})-[:TRANSACTED_WITH*2..$maxHops]->(start)
            RETURN count(p) > 0 AS isInLoop
        `;

        try {
            const result = await session.run(cypher, { 
                tenantId: neo4j.int(tenantId), 
                accountId, 
                maxHops: neo4j.int(maxHops)
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

    async updateTransactionStatus(transactionId: string, tenantId: number, newStatus: string): Promise<void> {
        const session = this.neo4jDriver.session();
        
        const cypher = `
            MATCH ()-[t:TRANSACTED_WITH]->()
            WHERE t.id = $transactionId AND t.tenantId = $tenantId
            SET t.status = $newStatus, t.updatedAt = datetime()
        `;

        try {
            await session.run(cypher, {
            transactionId,
            tenantId: neo4j.int(tenantId),
            newStatus,
            });
        } finally {
            await session.close();
        }
    }

    async hasHighValueTransactions(tenantId: number, accountId: string, threshold: number): Promise<boolean> {
        const session = this.neo4jDriver.session();
        
        const cypher = `
            MATCH (a:Account {id: $accountId, tenantId: $tenantId})-[r:TRANSACTED_WITH]->()
            WHERE r.amount >= $threshold
            RETURN r LIMIT 1
        `;

        try {
            const result = await session.run(cypher, { 
            tenantId: neo4j.int(tenantId), 
            accountId, 
            threshold 
            });
            return result.records.length > 0;
        } finally {
            await session.close();
        }
    }
}
