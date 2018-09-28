---
layout: post
title:  "Batch Processing is the Most Efficient Way."
date:   2018-09-28 12:35:00 -0600
categories: code
tags:
- best-practices
- batch-processing
- modernization
---
This is an argument I heard in a discussion the other day, and I hadn't thought about it before. Is it true? Should I be moving everything into a batch job for efficiency reasons? For the particular problem we were discussing, it *may* be the most efficient way (from a time per record processed standpoint, at least). But is this always the case? I don't think it's so black and white, and I'll explain below.


## A Rundown on Old vs. New
**The current batch process works something like this...**
1. Aggregation + Processing - A batch job runs, and records that have been collected in a database throughout the day are processed. It does some some calculations, and (a lot of) network bound work that creates some files to be consumed by other systems.
2. Distribution - This is where a lot of time is spent, in the same batch job. Multiple versions of these large files are created, and need to be distributed to the appropriate places over the network. Some of these items are time critical, and need to be delivered as quickly as possible.

**The proposal for the new approach would work like this...**
1. Data Collection - Records would be written to a queuing mechanism instead of the database as they're received.
2. Processing + Distribution - An application will be subscribed to the queue, pick up records as they're received, and do some of the work throughout the day as the records are received.
3. Aggregation - A batch job that does the aggregating of information, and calculations from all of the records that have been processed throughout the day.

## So what's the argument?
The argument against the new approach, is that processing would be far less efficient when done this way. After all, the time to process 1000 records would be about 50% longer than it was in batch processing. The crazy part, is that this is actually true. There's a cost to processing things this way, especially with the process we're working with. But is this argument using a fair comparison?

Let's break it down and find out!
Let's say that in batch processing, 1000 records takes 4 minutes (240ms per record). When the job runs at 12 PM, it can't complete until 12:04 PM. It has to go through and do all of the work for the records that have been building up throughout the day.

In the new approach, each record is 50% slower - 360ms. For 1000 records, this would take 6 minutes. If you compare apples to oranges, this sounds worse. The difference is that now the batch job is doing a fraction of what it had been doing before. The processing of these 1000 records can be taken care of ahead of time, as they're received throughout the day. But this isn't even the only benefit we would realize, this would also allow these files to be available to other consumers far sooner than they would have bene before. The end result of the new process ends up with usable output sooner, even though each record takes longer by itself.

## So what are you saying Nick?
* Batch processing is procrastination for computers. This is a generalization - there is definitely a place for batch processing. But sometimes doing a little work throughout the day, rather than hammering it all out at the last minute can be a huge help.
* For some problems, I don't think computing efficiency is what matters most. Remember that there's more than just runtime to think about. Sometimes being able to deliver results to customers earlier has huge value.
* Remember there is usually a tradeoff between batch and "realtime" processing. Maybe you need a batch job, but think a lot about it.
* Test, test, test. Don't let anybody tell you anything without data to prove it. If you don't know if it will work, give it a try and find out!