---
layout: post
title: Einops, retrospective of 5 years
excerpt: 
date: 2023-07-13 12:00:00
author: Alex Rogozhnikov
tags: 
- einops
- tensor manipulations

---


Einops is soon-to-turn 5 years. Right time to have a look back.

Some intro: einops is widely used &mdash; around 4 million downloads a month (for calibration - pytorch is 10 million) on pypi and is used in thousands of projects on github.

In a number of ways einops is unique:

- bends tensors for a number of very different frameworks. AFAIK all other efforts to make something truly multi-framework either died too soon or avoided touching internals of models 
- never pulled back released features. At the same time einops lived much longer than any major version of tensorflow or pytorch. Some backends it originally supported (mxnet, chainer) are dead by now
- bug tracker was empty for years, compared to usual hundreds in projects of similar scope. Now it reports several hardly fixable inconsistencies that appeared as frameworks introduced more features
- einops adoption happens mostly through the code sharing between teams/projects, and not by hype-waving. Several mentions in twitter brought waves of likes but almost none were converted to users at that point
  Paper appeared only after einops circulated for three years in the wild nature of github, when it was pristine clear that idea "clicks".
- "magical" universal dispatching, so users could write `rearrange(x, 'b c h w -> b h w c')` and not care about `x`'s framework/device/dtype/C-ordering. While this is more of a 'fancy' functionality, it was important during initial adoption. <!-- Magical is not a great description for technology, but einops was many times described as "magic" with a positive vibe in this word. -->
- no dependencies (except Python). Everything else is optional, even numpy
- there is no corporation/university behind einops, it is mostly a single-person effort

## Tough place?

A while ago Stephan H. asked *what is challenging about einops* as a project.

I don't think I've made a great answer back then. 
And probably couldn't anyway, because question assumes there is a specific "tough place", but the assumption is wrong. 

Also "tough place" is very subjective and after working for some time over any project,
if you're successful, there will be no "tough" place, because you focus on those parts that are "tough" 
and get them better either by decomposing their complexity or by just learning to manage with it.

  
## Unique technical challenges

I decided to dedicate some time to write a better answer for this question.
First prototype was built in a couple of hours, but project itself took months, so clearly there were non-trivial parts. 
Einops as a project has a number of (conflicting) technical restrictions that create a significant pressure:


- frameworks. Einops supports a dozen of them, and that's unique. 
  Worse, each framework has its specifics, and this creates significant internal tension within a project, 
  which I'll discuss a lot in the next points

- even worse, frameworks have multiple regimes of work within the same framework (i.e. torch alone has torch.compile, tracing, scripting, 'plain run', torch.fx, cuda graph capturing, and maybe more). They all have different behaviors
  
- landscape is not steady and frameworks appear and gone, even worse, sometimes change their API, and sometimes by breaking existing API (looking at you, keras and TF). Their dependencies may contradict each other (stares at protobuf) 
  
- support for eager computations. 
  
  That's how code usually runs these pytorchy days. In this case, the hot path should be *really* fast, and have absolutely minimal overhead. Einops deals with this with a number of caches that make usual loopy computations super-efficient. Shape checks (usually skipped by lazy everyone) are conducted only once per shape.

- support for symbolic computations and traceability. 

  Two little-known facts first: 1. einops can deal with symbolic tensors (i.e. can operate tensors with unknown size of one or several axes, which may sound slightly impossible at first) and 2. einops "disappears" during tracing and provides models that contain an equivalent set of framework-native operations, and moreover traced operation  correctly work for inputs of different shape. 

  As a result, execution flow has to rely only on traceable operations over shape's elements, and e.g. one can't just compute correct result shape in cpp/rust

- shape checks for symbolic tensors. 
  
  For example `rearrange(x, '(h h2) (w w2) -> (h w) h2 w2', h2=4, w2=w2)` demands that first axis is divisible by 4, and the second axis is divisible by `w2`, while dimensions of tensors are unknown.
  An additional restriction: einops can't use built-in graph asserts like tf.Asserts because of their framework-specificity.
  Clever organization of computations in ops ensures that code fails for wrong inputs without introducing additional elements of static graph


- support for scripting: this requirement dramatically narrows a subset of Python that can be used, and in some cases demands specifying wrong type hints for internal functions because correct types like `tuple[str, ...]` are not supported by `torchscript`
  
- support for tensor-rank polymorphism, that is, the same operation with ellipsis can handle inputs of different dimensions. Initially this was done by a clever trick that pre-packed 'ellipsis axes' into one, but recent changes in frameworks (see next point) required developing some new approach 
  
- special axes. Frameworks try to extend a concept of tensor = ndarray which worked so well. 
  Examples are sharding axes in distributed tensors and jagged arrays. 
  This clearly was out of initial design and, as I mentioned, required significant redesign of einops.

- frameworks divergences: differences in the names/interfaces of operations, missing operations like logsumexp, inconsistencies in support of einsum. 

- layers definition is quite different across frameworks, and specially `flax` required some personal approach.

- view semantics. Einops tries to provide a view to the input if possible, 
  making operation itself very cheap, as no real computation happens.

- additional pressure is my perfectionism, and trying to keep the bar very high.
  These days I don't think extreme reliability should be assumed from side/personal projects.

<!-- - python's typing does not know how to exclude lists -->



Appearing problems with new features like `torch.fx` may be interpreted as *einops gives cracks*, reality is - einops as a notation and approach are just fine.
It is enjoyed by many, and community wants to use notation with new framework features. 
And notation fits that.
But the terrible basement that tensor manipulation is built upon (i.e. reshape/view/transpose and similar) gives cracks - more and more visible, and building a layer of cement upon is ... not wise.
As I discussed several times, einops' core operation should be available at the lowest level of graph representation
&mdash; but I don't expect this advice to be heard.


Support for a large zoo of frameworks is (retrospectively) a questionable investment.
Examples: cupy and chainer were almost never used but also were trivial to maintain and develop. 
While mxnet/gluon required very special attitude.
Supporting multiple frameworks to me was an insurance that frameworks did not try to create "their very own version of einops", and did not create non-compatible extensions (as they did for numpy). 

These days projects that don't use einops still use its core ideas
by writing parts of einops patterns: `(b h) t c`, `b*h  t  c` and similar.
Because that's the best way to communicate internal structure of tensor 
(... when you agree on C-ordering of course, construct relies on it significantly).


## Unique conceptual challenges

<!-- It is easy to think about einops as a python package, but it is more of **approach** to write a readable, reliable and efficient code, that was conveniently provided to python users. -->

Einops is more of approach to writing code than a package, but package is a necessary tool to bring those ideas into practice. On approach level there are a number of hurdles too.

Turns out design of operations is very challenging: einops received a long list of suggestions and ideas, and very few were accepted. Folks just introduced to einops think "einops are helpful, so let's invent something similar", but *similar* does not imply *helpful*.


Let's take a story of `einops.pack` and `einops.unpack` for a demonstration of this point: 
concatenation of different-shape tensors was of interest (for me) even before the first public release.
My design at that time was universal enough, similar to the rest of einops, but too verbose and inconvenient:

```python
[r, g, b] = rechunk([rgb], 'b h w [r+g+b] -> b h w [r, g, b]', r=1, g=1, b=1)
```
... thus it was not included. Later it was minimized by restricting transpositions:
```python
# this one poorly works with type hinting
[r, g, b] = rechunk(rgb, 'b h w *', 'r+g+b -> [r, g, b]', r=1, g=1, b=1) 
```
until I finally realized that this operation better to be totally different from `rearrange` and should not have any names for the concatenated/split axes:
```python
[r, g, b] = unpack(rgb, 'b h w *', [1, 1, 1])
```
which was soon generalized into unpacking with arbitrary shapes. 
```python
[r, g, b] = unpack(rgb, 'b h w *', [[1], [1], [1]])
```

Original design of operation could not support arbitrary shapes.
Ok, technically it could, but that would be ugly and miserable.
New design solved another issue &mdash; memorizing axes that were composed, another common request for einops.

I've come up with a final design (which I still find optimal) only *two years later*. 
A number of suggestions popped around that were similar to the original version.

To see that operation 'clicks', **a whole research is needed**:

- collect use-cases (and this requires a broad view of SOTA and how it may change over the next years)
- convert use-cases to code examples, and prepare baseline implementations without new operation
- implement with your suggestion, and in most cases, conclude that doesn't look good enough

There are more complicated parts, like "is it easy to read?", "is this code confusing?" and finally "how to make this all efficient given all restrictions above?".

Allocating time for these (mostly unsuccessful) attempts is tough.


<!-- Python. Python stands in a way sometimes. Julia's line-level macros maybe would be a more convenient syntax, and e.g. writing something like
```python
x_out['b h w c'] = x['b c h w']
``` -->

Additional challenge: "fewer, but more universal operations".

There is a gap between "I find this helpful" and "this will be actively used".
It is easy to come up with a long list of operations that will be helpful in *some* cases, but how users would figure this out? I don't think anyone checks einops' docs regularly, so operation will never pop up in mind. 
See, *usefulness of operation strongly depends on its universality*, i.e. ability to cover many cases, and einops are good at this because it was one of requirements.


## Adoption challenges, management challenges

Einops adoption was very slow. If it was a commercial project, it is likely to run out of money before getting sufficient traction. 

But the project was designed to be resilient. Somewhat an internal requirement: should be usable for at least a couple of years even in the worst scenario: no maintenance at all, and deep learning landscape changes even faster than before.

From the very beginning maintenance debt was minimized —  that means, very restricted design, fewer features. 
I assessed very carefully which things can be broken.
Once I was asked during an interview: why may it stop working? I said —  only if API of core operations will change. Time shown this was the correct answer.

Another issue is *extremely low adoption of layers*. I have no good explanation to it, they are very useful.



## Reasons for slow adoption?

**No hyping**. In part, because I am bad at it, and in part, because I am not that interested in answering 
basic questions from folks attracted by new shiny things. 
As a byproduct, early adopters of einops are mostly very advanced folks who knew what to expect from the tool
and cared more about quality of their code than the rest of ML community.

Consequently, einops has *no dedicated community* (discord server or so). 
In the long run I think no community is better than abandoned community (which happens in many projects).
There are a number of ein-tools around the github addressing specific cases, 
maybe somewhat centralized community could help with initial adoption.

Another important factor is **a significant prejudice against string-templated operations**, which is for 
three reasons: 1. einsum was historically slow 2. einsum is the only operation of this kind in the frameworks. 3. everyone knows parsing is slow, and idea of 'parse once' rarely crosses the mind.

Einops *caches results of pattern parsing*. 
But even repeating this many times in paper/documentation will not overcome prejudice —  because if you're already convinced it is slow, why would you read paper?

A couple of speed issues were reported to einops repo, while those were not even related to einops —  a vivid demonstration of this bias.

**No critical case**. Tool becomes an immediate hit only if it addresses an existing case that is very 
poorly covered by previous tools. Or rarely because of hype.

Not that you can't bend tensors without einops. And not that adding single `rearrange` magically makes your code better.
Einops is an approach —  and approach still requires investment to get a habit of writing and reading new kind of code. Real conversion happens only after one needs to read someone's else code and finds out that reading einopsy code is significantly easier.



# Concluding thought

Einops, as said, is one of a kind, and its development trajectory deviates significantly from the 'normal' development.

How would you call a system that is shaped by hard constraints? 
I'd call this "engineering art".


