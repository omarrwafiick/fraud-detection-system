import {
    Counter,
    Gauge,
    Histogram,
    Summary,
} from "prom-client";

export class MetricCache {
    private static readonly counters = new Map<string, Counter<string>>();
    private static readonly histograms = new Map<string, Histogram<string>>();
    private static readonly gauges = new Map<string, Gauge<string>>();
    private static readonly summaries = new Map<string, Summary<string>>();

    static getCounter(name: string) {
        return this.counters.get(name);
    }

    static saveCounter(name: string, metric: Counter<string>) {
        this.counters.set(name, metric);
    }

    static getHistogram(name: string) {
        return this.histograms.get(name);
    }

    static saveHistogram(name: string, metric: Histogram<string>) {
        this.histograms.set(name, metric);
    }

    static getGauge(name: string) {
        return this.gauges.get(name);
    }

    static saveGauge(name: string, metric: Gauge<string>) {
        this.gauges.set(name, metric);
    }

    static getSummary(name: string) {
        return this.summaries.get(name);
    }

    static saveSummary(name: string, metric: Summary<string>) {
        this.summaries.set(name, metric);
    }
}