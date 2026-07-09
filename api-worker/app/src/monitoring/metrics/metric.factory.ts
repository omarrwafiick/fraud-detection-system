import { Counter, Gauge, Histogram, Summary } from "prom-client";
import { registry } from "./registry";
import { MetricCache } from "./metric.cache";

export class MetricFactory {
    static createCounter(name: string, help: string, labelNames: string[] = []) {
        const existing = MetricCache.getCounter(name);

        if (existing){
            return existing;
        }

        const counter = new Counter({
            name,
            help,
            labelNames,
            registers: [registry],
        });

        MetricCache.saveCounter(name, counter);
        return counter;
    }

    static createHistogram(
        name: string, 
        help: string, 
        labelNames: string[] = [],
        buckets = [
            0.01,
            0.025,
            0.05,
            0.1,
            0.25,
            0.5,
            1,
            2,
            5,
            10,
        ]
    ) {
        const existing = MetricCache.getHistogram(name);

        if (existing){
            return existing;
        }

        const histogram = new Histogram({
            name,
            help,
            labelNames,
            buckets,
            registers: [registry],
        });
        
        MetricCache.saveHistogram(name, histogram);
        return histogram;
    }

    static createGauge(name: string, help: string, labelNames: string[] = []) {
        const existing = MetricCache.getGauge(name);

        if (existing){
            return existing;
        }

        const guage = new Gauge({
            name,
            help,
            labelNames,
            registers: [registry],
        });
        
        
        MetricCache.saveGauge(name, guage);
        return guage;
    }

    static createSummary(name: string, help: string, labelNames: string[] = []) {
        const existing = MetricCache.getSummary(name);

        if (existing){
            return existing;
        }

        const summary = new Summary({
            name,
            help,
            labelNames,
            registers: [registry],
        });
        
        
        MetricCache.saveSummary(name, summary);
        return summary;
    }
}