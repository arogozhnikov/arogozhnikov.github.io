---
layout: post
title: Numbers and Naturalness, part 2.
date: '2013-07-22T11:58:00.000-07:00'
author: Alex Rogozhnikov
tags:
- Inverse limit
- P-adic numbers
modified_time: '2013-08-09T14:13:49.309-07:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-1608624911970133364
blogger_orig_url: http://brilliantlywrong.blogspot.com/2013/07/numbers-and-naturalness-part-2.html
---

The last time I wrote about [p-adic and real numbers]({% post_url 2013-07-21-real-numbers-and-naturalness-part-1 %}). As I mentioned there, p-adic numbers are simpler in the sense that you can easily compute last $n$ digits of the result having only the last digits of summands or multipliers.

And this is great advantage of their definition. To define the multiplication and summation of real numbers, you should have these operations defined on rational numbers (and some properties of these operations proved). Then, having defined the metric on $\Bbb{Q}$, one [completes](http://en.wikipedia.org/wiki/Complete_metric_space) this set and redefines the operations by continuity. Yes, this is not the simple thing, but I hope you remember it from university mathematics courses.

Just the opposite thing with p-adic numbers. The definition of addition and multiplication is quite straightforward. But what is more interesting, there is an abstract construction, which can be used to define p-adic numbers. The construction is called the [inverse limit](http://en.wikipedia.org/wiki/Inverse_limit)

Remember I was talking about understanding a p-adic number as some limit? Let us consider now only p-adic integers, these are not usual integers. They may have infinitely many nonzero digits, but all the digits after the dot should be zero. Hereinafter in all the examples *p*=7.

```
  ...4123490       integer
  ...3459902.0     integer
  ...3459902       integer (the same as previous one)
      ...234       integer
  ...2314123.456   non-integer
      ...000.001   non-integer
```

Let us now consider only integer numbers. This set is closed under the operations of addition and multiplication. Moreover, the last $n$ digits of the result is fully defined by the last $n$ digits of operands.

```
    ...35143  +  ...01251  =  ...36424

           3  +         1  =         4
          43  +        51  =        24
         143  +       251  =       424
        5143  +      1251  =      6424
       35143  +     01251  =     36424
         ...  +       ...  =       ...
```

Easy to see (and easy to prove using series representation) that truncations in $n$th line behave as residues modulo $7^n$. And the same is correct for multiplication.

Why *like* residues? They *are* residues! Every p-adic integer can be considered as a sequence of residuals modulo $p^n, \; n=1,2, ...$. For instance,

&nbsp;&nbsp;3 mod $7$  
&nbsp;&nbsp;43 mod $7^2$  
&nbsp;143 mod $7^3$  
&nbsp;5143 mod $7^4$  
35143 mod $7^5$  
result: ...35143

Note that you cannot just take a sequence of arbitrary residues like

$x_1$&nbsp;&nbsp;3 mod $7$  
$x_2$&nbsp;&nbsp;52 mod $7^2$  
$x_3$&nbsp;413 mod $7^3$  
$x_4$&nbsp;6556 mod $7^4$  
result: ...???

The residues should be consistent one with the others, namely, $x_n = x_{n+1} \;  \text{mod} \; p^n$, and that is what [inverse limit](http://en.wikipedia.org/wiki/Inverse_limit) is. To put is simply, there is a sequence of sets $X_1, X_2, ...$. And some *morphisms* $f_{n+1,n}$ from $X_{n+1}$ to $X_n$. The inverse limit (denoted by $ \lim\limits_{\longleftarrow} X_i$) is a set of all sequences $\{x_i\}: x_i \in X_i$, such that the following consistency properties are satisfied:

$$ f_{n+1,n}(x_{n+1}) = x_n $$

In the case under consideration $X_n = \Bbb{Z} / {p^n}\Bbb{Z}$, $f_{n+1,n} (x) = x \; \text{mod} \; p^n$. The most important moment: we have addition and multiplication defined on each $X_n$, and $f_{n+1,n}$ preserve these operations (they are *homomorphisms*). That's how we obtain multiplication and addition in the ring p-adic integers: the result would satisfy consistency properties.

This is the simplest and the most vivid example of inverse limit, [wikipedia article](http://en.wikipedia.org/wiki/Inverse_limit) contains the general case with posets. Well, as you can see, this is *purely algebraic* construction, and mathematically it is more *natural*.

**Exercise#1** (very easy): find cardinality of the set of p-adic numbers.  
**Exercise#2**: recall that the distance between two p-adic numbers was defined as $p^{-n}$, where $n$ is the number of rightest digit in which two numbers do not coincide. Can we take $2^{-n}$ as the distance?  
**Exercise#3**: prove that one can subtract two p-adic integer numbers.

### Mapping Rational Numbers

The thing that is maybe not so obvious is that all nonzero p-adic numbers are invertible (thus we have division operation). It is small but very helpful exercise. The second fact is p-adic numbers contain natural ones

Let us take some natural number in radix-7: 41524, for instance. The corresponding p-adic is ...000041524 = (0)41524, that is just has infinite number of zeros added to the left.

Now try to **guess** what is this number equal to: .....666666?

The answer is -1. You may be wondering why. Try to add 1 and you will obtain zero. Or subtract one from zero.  
The second way to see this is to compute -1 modulo $7^n$. Each time you will get $66...6$ ($n$ times 6).

If you have ever learned something about C programming language or assembler, this should remind you something...

If it doesn't, let me help you

```
00000001 = 1
00000000 = 0
11111111 = -1
11111110 = -2
```

Right, it is the [two-complement](http://en.wikipedia.org/wiki/Two%27s_complement) number representation. The ...666666 is the 7-complement notion of -1. It arises naturally in the p-adic numbers though in CS courses may look a bit strange.

Let's now think of rational numbers. Once we have division, our field of p-adic numbers should contain $1/2, 1/3, 1/5$ and so on.

What we can say immediately is that 7-adic form of $1/7$ is  
...00000.1  
and the form of $1/49$ is  
...00000.01  
and so on. But what about $1/4$? Let us compute it from the equation (remember all the numbers are in radix-7!)

$$...0004 \times x = ...0001 = (-1)\times(-1) = (-1) \times ...66666$$

$$x = (-1) \times ...66666 / 4 = (-1) \times ...010101 \times 66_7 / 4_7 $$

Some simple computations now:

$$ 66_7 / 4_7 = 48_{10} / 4_{10} = 12_{10} = 15_7 $$

And the last step:

$$ x = (-1) \times ...010101 \times 15_7 = ...151515 = ...515152 $$

**Exercise#4:** Make sure that $4 \times ...515152 = ...000001$  
**Exercise#5:** Compute $1/5$ in the same way. Hint: $6666_7 = 2400_{10} = 5 \times 480_{10} = 1251_7$

This is not the only way to divide p-adic numbers, you may try to invent the other procedure (long division in p-adic numbers). As one can notice, the rational numbers in p-adic notion look very similar to their notion in real numbers, namely, their notion is periodic to the left starting from some point.
