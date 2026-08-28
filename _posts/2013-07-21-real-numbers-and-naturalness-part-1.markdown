---
layout: post
title: Numbers and Naturalness, part 1.
date: '2013-07-21T05:20:00.001-07:00'
author: Alex Rogozhnikov
tags:
- P-adic numbers
modified_time: '2013-08-09T14:15:49.996-07:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-1735162923094884596
blogger_orig_url: http://brilliantlywrong.blogspot.com/2013/07/real-numbers-and-naturalness-part-1.html
---

Real numbers is the object that everyone deals with and knows well. They seem to be so natural (not in the mathematical sense) that nearly no one can think that our world is not "made" of real numbers.

The history remembers the time when people had no idea about real numbers. In the ancient Greece only rational ones were known and that were Pythagoreans who established, that the length of unit square diagonal is not rational.

Quantum physics (as the majority of today's physics theories) is based on real numbers (and complex one of course), for instance the space-time is considered to be $\mathbb{R}^4$.

It is a very common and strong belief that correct theory in theoretical physics should be "beautiful". Mathematically both *simple* and *beautiful*. But are real numbers so *simple*? This question raised up after I heard of [p-adic quantum mechanics](http://en.wikipedia.org/wiki/P-adic_quantum_mechanics).

Let us compare these two objects. Start from real numbers. What is real number? That is something like

```
3.14159265358979323846264...
1.00000000000000000000000...
0.99999999999999999999999...
```

That is some natural number and an infinite sequence of digits. The first moment is some rational numbers have more than one representation in such a notion.

Ok, let's add the two numbers

```
1.00000...
0.99999...
```

Hmm... Guess the first symbol! One? Wrong!

```
 1.000002...
+0.999999...
------------
 2,00000....
```

Two then? Wrong again:

```
 1.000000...
+0.999998...
------------
 1,99999....
```

The confusing moment is you can never guarantee that given $n$ first digits of summands you would be able to compute at least first digit of the result. Before we proceed to p-adic numbers let's look at the real number in the following way, first we write it in an exponential form:

$3.14159265358979... = 10^1 \times 0.314159265358979...$

And omit $10^1$ for a while. The essential information kept in 0.314159265358979... is simply the sequence of digits: 314159265358979... (note: no natural number here, only the sequence now!). The sequence starts from some nonzero digit due to the exponential form.

```
 3
 31
 314
 3141
 31415
 314159
 3141592
 31415926
 314159265
 ...
```

Everything is finite now. We may think of it like we have some sequence of decimal rational numbers, which converge to initial real one.

Ok. How does it relates to p-adic number? First we choose some prime *p*, I will consider p=7 for example. This *p* is something like base of numeral system.

[P-adic numbers](http://en.wikipedia.org/wiki/P-adic_number) look so (note the digits are 0,1,..,6, because *p*=7):

```
...341564461.54265
...6342360000.0
...360340.6
```

This looks very similar to real number with the only difference that the sequence is infinite to the left. Let's add some numbers. Just like in the school

```
...4461.42
+...1060.1
------------
...5551.52
```

What is more important, if you have last $n$ digits of summands, you can compute the last $n$ digits of their sum (which is really different from real numbers). The same story with multiplication. Moreover, each number has the only representation. Sounds much *simpler*, right?

And the p-adic number is also a limit of it's truncations

```
       ...1.42
      ...51.42
     ...151.42
    ...3151.42
   ...23151.42
  ...423151.42
```

One may think so: latter digits are more important (unlike those in real number).

### Series representation

As was said, the real number may be written in the following form

$$ 10^k \times 0.x_1 x_2 x_3 x_4 ... $$

Which means that the number can be also written in the following way

$$ \sum_{n=1}^{+\infty} 10^{k-n} x_n $$

And the same for p-adic numbers

$$ 10^{-k} \times ... x_4 x_3 x_2 x_1.0 \; = \sum_{n=1}^{+\infty} \; 10^{n-k} x_n $$

"WAIT!" — you say, — "the series diverges!". Well, the convergence depends on the [metric](https://en.wikipedia.org/wiki/Metric_(mathematics)) you use. And that is the part of the trick. P-adic numbers use their own metrics. In a nutshell, the distance between two p-adic numbers can be defined as $p^{-k}$, where k is the number of the rightest digit that is different in numbers, for instance

```
 ...1343.3
 ...1643.3      k=2, d = 1/49

 ...4461.4531
 ...1060.6231   k=-1, d = 7

 ...3451.52
 ...5350.0      k=-2, d = 49
```

Well. The post is already big enough, inverse limits and *simplicity* will be discussed in the next post.
