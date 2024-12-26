---
layout: post
title: A Programming Language
date: '2015-06-25T02:31:00.003-07:00'
author: Alex
tags:
- vectorization
- numpy
- Optimization
modified_time: '2015-06-25T02:33:02.587-07:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-4575249620426069058
blogger_orig_url: http://brilliantlywrong.blogspot.com/2015/06/a-programming-language.html
---

Since I'm very interested in
<a href="{% post_url 2015-01-07-benchmarks-of-speed-numpy-vs-all %}">numpy and
vectorization</a>, I became curious about when how this approach appeared.
I find this notion very convenient and very productive,
while it leaves the space for optimizations inside.

Obviously, a predecessor of numpy is <a href="https://en.wikipedia.org/wiki/MATLAB">MATLAB</a>,
which appeared a long time ago - in the late 70's, while the first release happened more than 30 years ago - in 1984!
Many things were inherited from this language (not the multiCPU/GPU backend, unfortunately,
but I hope that things will change once).

But more interesting point that vector-based syntax was not brought by fortran, as I thought earlier.
The latter got it's operations over vectors <a href="https://en.wikipedia.org/wiki/Fortran">only in Fortran'90</a>
(which was much later).

The real predecessor of MATLAB was APL (<a href="https://en.wikipedia.org/wiki/APL_%28programming_language%29">A
Programming Language</a>, not named after Apple company), this language was quite complicated and short, and
mostly this was looking not like a code, but as numerous formulas. Apart from this, APL used many specific
symbols and combined operators. For instance, <code>+\ seq</code> is sum of elements in a sequence.

Wikipedia claims that this returns list of prime numbers in $1, 2, ..R$.

`(~R∊R∘.×R)/R←1↓ιR`

Now you understand why this language isn't popular today :)

Since that we learnt that many things like map, where, sum can be written using words, and this will be much
more clear and reliable.

Thing I also find interesting is that APL interpretation process was much more complicated then one of numpy or matlab,
and in particular supported lazy evaluation (thus, construction of expressions was available). This also means that
different optimization were possible, like usage of multiple different vector operations at once (like a + b*c), if
processor supports this. In russian this is called векторное зацепление, but I haven't found
<a href="https://en.wikipedia.org/wiki/Vector_processor#Description">appropriate translation in wiki</a>.