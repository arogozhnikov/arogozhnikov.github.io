---
layout: post
title: 'So many names '
date: '2014-12-26T02:20:00.000-08:00'
author: Alex
tags:
- Machine Learning
- Terminology
permalink: /2014/12/26/so-many-names.html
---

It is often the case that a simple term can have many different names. But terms used in Machine Learning are especially unique.

**ROC curve**: Receiver Operating Characteristic — sounds like something entirely new.
But it’s essentially the same as the **P-P plot** in statistics.
(HEP people often draw it mirrored.)

**TPR (True Positive Rate)**: In machine learning, this is known as "signal efficiency" or just "s" in HEP terminology.
In statistics, the **survival function** often conveys the same idea, though it’s rarely applied to distribution comparisons.

**Log-likelihood**: In statistics, it’s called **logloss** in machine learning. Neural network practitioners often refer to it as **cross-entropy loss**, while scikit-learn developers use the term **binomial deviance**. And there might still be other names I’m unaware of!

At first, these naming differences can drive you crazy. Over time, they blur into insignificance.
But eventually, it becomes a real issue when the same concepts are discussed using different terms, leaving you unsure which one to use when searching online.
