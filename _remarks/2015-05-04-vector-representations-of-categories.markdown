---
layout: post
title: Vector representations of categories
date: '2015-05-04T13:32:00.001-07:00'
author: Alex Rogozhnikov
tags:
- Machine Learning
- Python
- Graphical Models
- Optimization
modified_time: '2015-05-10T03:27:56.652-07:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-4262878322177076411
blogger_orig_url: http://brilliantlywrong.blogspot.com/2015/05/vector-representations-of-categories.html
---

After thinking a while over the last point in my list of topics in ML to explore...

I finally came to the thought that I’d better use some **graphical model**,
since there is a great majority of possible algorithms without any warranty of their workability.

So, first thing — probably one can use LDA (Latent Dirichlet allocation,
[wiki](http://en.wikipedia.org/wiki/Latent_Dirichlet_allocation)) to find good representation for categories.
In this case, we should use the bag-of-words model, and `categories` will stand for words.
Yes, the model of LDA doesn’t seem to be appropriate, though I’m sure it will give reasonable representations.

Another graphical model I came up with is much simpler (and probably was developed a long time ago, but I don’t know).
Its generative model looks like this:

1. First, a `topic` of the event is generated. That’s an n-dimensional vector $t_{event} \in \mathbb{R}^n$ drawn from a Gaussian distribution.
2. For each category, say, `site_id`, each value of `site_id` has its own topic $t_{cat\_value}$ of the same dimension $n$. The greater the dot product $(t_{cat\_value}, t_{event})$, the higher the probability that this value of the category will be chosen.
   I shall stress here that I’m not thinking over an arbitrary number of categories; I’m currently interested in the case where the number and types of categories are fixed.
3. To be more precise, the probability of each value within a category to be drawn for the event with $t_{event}$ vector is proportional to:

   $$p(\text{cat\_value} | \text{event}) \sim p(\text{cat\_value}) \times e^{(t_{cat\_value}, t_{event})}$$

   So, to compute the final probability, one shall use the [softmax function](http://en.wikipedia.org/wiki/Softmax_function).

That said, currently the problem I expect to meet is the extremely low speed of training when the number of values for some category is very large (say, there are cases when the number of categories one shall process is greater than 10,000).

---

**PS**: After writing this, I understood that the usage of decision trees to generate IDs of leaves — new `categories` —
combined with the usage of LibFM over these new features, was a very interesting and good idea 
(this idea appeared recently in one of the Kaggle challenges).
