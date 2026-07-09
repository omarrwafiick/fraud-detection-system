import { Injectable } from "@nestjs/common";
import { Counter, Gauge, Histogram, Summary } from "prom-client";

@Injectable()
export class MetricsService {
    incrementCounter(counter: Counter<string>, labels?: Record<string, string>, value = 1) {
        if (labels){
            counter.inc(labels, value);
        }
        else{
            counter.inc(value);
        }
    }

    decrementGauge(gauge: Gauge<string>, labels?: Record<string, string>, value = 1) {
        if (labels){
            gauge.dec(labels, value);
        }
        else{
            gauge.dec(value);
        }
    }

    incrementGauge(gauge: Gauge<string>, labels?: Record<string, string>, value = 1) {
        if (labels){
            gauge.inc(labels, value);
        }
        else{
            gauge.inc(value);
        }
    }

    setGauge(gauge: Gauge<string>, value: number, labels?: Record<string, string>) {
        if (labels){
            gauge.set(labels, value);
        }
        else{
            gauge.set(value);
        }
    }

    observe(histogram: Histogram<string>, value: number, labels?: Record<string, string>) {
        if (labels){
            histogram.observe(labels, value);
        }
        else{
            histogram.observe(value);
        }
    }

    startTimer(histogram: Histogram<string>, labels?: Record<string, string>) {
        if (labels){
            return histogram.startTimer(labels);
        }
        else{
            return histogram.startTimer();
        }
    }

    observeSummary(summary: Summary<string>, value: number, labels?: Record<string, string>) {
        if (labels){
            summary.observe(labels, value);
        }
        else{
            summary.observe(value);
        }
    }
}