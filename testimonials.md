---
layout: page
title: Reactions to my projects
linktitle: Testimonials
permalink: /testimonials/
---


<div class="testmonial-links" markdown="1">
<a href="/my-testimonials/">my testimonials</a>
<a href="/testimonials/" class="active">testimonials to my projects</a>
</div>


I like reading different reviews of my works. Not all of them, but most :)

After over a decade of 'doing stuff' I've started noticing 
that more and more of these pieces of opinions/thoughts started disappearing from the internet 
or can't be found anymore.

Some communities/websites go down, other require registration to search or even view messages.
Regress is more and more noticeable. So I started collecting most valuable pieces before internet forgets about them. 
Some are just dear memories, and some are interesting remarks. 



## einops

einops has collected lots of positive feedback, and has own [testimonials page](https://einops.rocks/pages/testimonials/).

Later I will post the funniest here.



## Delimiter-first code

Post spiked significant interest. E.g. a number of interesting comments from [hackernews](https://news.ycombinator.com/item?id=33918430)

> Rational in sense that syntactically most significant characters are swept to one side: - left. 
> So they can be observed (checked) in a single glance.
> In contrast of the conventional ("irrational") zig-zag pattern where: 
> - starting delimiter is somewhere in the middle of the line (if not in Allman and similar style); 
> - separators are mostly at the right end of the line, sometimes pretty far, depending on line length; 
> - closing delimiter is mostly on the left. 
> - Plus separators and delimiters can be scattered among single line, if they "fit" there.

> This delimiter first pattern is used a lot in Ocaml code as well (multiple examples)

> Elm typically leans into this exact style (though without semicolons)! It's refreshing seeing support for this delimiter-first, dangling closing delimiter style in a more imperative and mainstream language.

And turns out Leslie Lampert suggested somewhat similar for multi-line formulas.

> cf <https://www.hpl.hp.com/techreports/Compaq-DEC/SRC-RR-119.pdf> 



Intersting [group of tweets](https://twitter.com/jonathoda/status/1601287131061571584), in particular:

> The tension between how we read code and how machines read it.
>
> Delimiter first meets in the middle and asks humans to consider what's being represented on a line instead of using old conventions with implicit gotchas.

Discussion in lobste.rs is [interesting](https://lobste.rs/s/9q8rx2) too, and taught me this: 

> The article’s suggested multiline string syntax is similar to what Zig has: <example here>
> This is really nice because you can align it properly with surrounding code. I hope other languages adopt this.


And I want to bring up an element of culture that I see in japanese twitter: 
they make a very concise summary of post, 
I'd be happy to see my feed look like this, not "oh wow, I like this" and "look what we've done" ... should I learn Japanese? 

> 「区切り記号 (delimiter) ファースト」の言語という考え。プログラミング言語はリストを [1, 2, 3] ではなく「・1 ・2 ・3 」のように書かせるべきである。こうすると区切り記号の数はつねに要素数と一致し、一貫性が増す。このような書式は YAMLなどで見られている。
> [(link)](https://twitter.com/mootastic/status/1601225683727851521?s=20)


[//]: # (I'm climbing up this hill and getting ready to die on it: Delimiter first code)
[//]: # (https://twitter.com/rickasaurus/status/1601233159357538304?s=20)



## Don’t write CLI

When I introduced typer (mentioned in article) to practice in my team, 
my colleagues were impressed with simplicity of code, and it saved us significant time.

At parallel (my next company), I use this approach for managing db, cloud configuration, network configurations, proxy, deployment, requirements, dockers, etc.
And it saved a ton of time.

At the same time comments to the post were mostly negative, but none of them really get the problem and solution.
I'm not sure that rewriting the post fixed this.

There is however one very educative [comment](https://www.reddit.com/r/programming/comments/k8jal6/comment/gezvg5w/?utm_source=share&utm_medium=web2x&context=3
) from u/panorambo:

> There is also "Don't write command-line interfaces", which I found a very refreshing read. ...
<details markdown="1">
<summary>
click here for full text
</summary>

> There is also "Don't write command-line interfaces", which I found a very refreshing read.
>
> We have four people at my place of work busy all day every day lately writing each their own CLI that we are going to put into production for ourselves to orchestrate the distributed system we're running. Each time a pull request is announced (all while our users have real problems they complain aren't being solved adequately) about some new CLI switch or aspect, there is cheer from the team as if writing more CLI code is helping us get out of our technical debt -- especially considering the CLIs are for us, not for people who aren't comfortable enough with Python to import a module and make it do useful work. By us I mean the developers who wield Python most of the working day. And who now spend a lot of precious development time figuring out solutions to problems that stem from the decision to write CLIs in the first place. I weep silently at my desk.
> 
> Please, if your intended user is already a "developer", consider just writing a usable module comprising the functions you need, in some scripting language -- you'll get parsing for free, documentation too (Python's built-in help will fetch your docstrings, in the very least), meaningful transparent error messages including stack traces (or you can be terse if you prefer or need to be so) and much more "fine-grained" programmability (since it's a scripting environment) compared to starting a process with arguments from the shell and being forced to parse its output. Cases where CLI is able to beat all those benefits, are far fewer in between than most are aware of, if you ask me, but noone is too concerned, churning out CLI code.
> 
> It'd be far more passable of course if we were only talking about CLI in compiled software where no runtime environment or REPL normally exist, but these days I see Python (or JavaScript!) modules being "CLIed" -- a bad idea most of the time, I think. I mean you've already got a programmable environment with a bunch of reusable procedures that benefit from typed data and other goodness I mentioned -- why are you closing it all behind a gutted ./foobar --baz --bar --only-here --only-now --dry-run --bla --bla 1 2 3 4 interface? And then spend a shameful number of man hours trying to accommodate a growing number of increasingly fringe and exotic use cases with more switches, increasingly complex command line parsing etc, just to keep solving the problem you yourself created?
</details>

[//]: # (original comment from the same person)
[//]: # (https://www.reddit.com/r/programming/comments/j88gtg/comment/g8ax8q2/?utm_source=share&utm_medium=web2x&context=3)

&nbsp;

This situation illustrates well possible consequences of introducing CLIs when those are not needed.

On the contrast, my current (large) codebase has no bash scripts, even cli-exposed functions are reusable,
and I'm happy about that. 



## Hamiltonian Monte Carlo explained

Post was a feat. Visualizations were done 'from scratch' in webgl. 
Years later, it is still popular, and even cited in several papers as a reference for HMC. 

[//]: # (Explanatory, visual work, and even examples themselves required careful analysis: true distributions)


> Stunning 3D animations of #MCMC algorithms
> [(Thomas Wiecki)](https://twitter.com/twiecki/status/813502043411415045)


> very cool interactive page with an intro Hamiltonian MC, using animations. Notice that some sections are "collapsed", so click on the larger text to expand the content
> [(link)](https://twitter.com/uPicchini/status/1040492383425753088?s=20)


> And this post has *awesome* visualizations for MCMC and HMC to help internalize the concepts
> [(link)](https://twitter.com/HrSaghir/status/866880713110560768?s=20)

> Here's a nice summary of how some bayesian samplers work with really nice figs.
> [(link)](https://twitter.com/brols/status/813516609088266240?s=20)

> really neat interactive animations of how Hamiltonian Monte Carlo (like in @mcmc_stan) works http://arogozhnikov.github.io/2016/12/19/)
> [(link)](https://twitter.com/kleinschmidt/status/873167140282650624?s=20)

> Hi, I also liked this demonstration since it explains what's going on in its visuals
> [(link)](https://twitter.com/sir_deenicus/status/1104264813419683840?s=20)

> Easy to understand explanation of Hamiltonian Monte Carlo with great interactive HMC visualization tools!
> [(link)](https://twitter.com/timrudner/status/1040665020219187201?s=20)

> Nice explanation of Metropolis-Hasting and Hamiltonian Markov chain Monte Carlo (MCMC) with some cool interactive graphics
> [(link)](https://twitter.com/LBarquist/status/931512689385529345?s=20)

... and many more


## Migrating to python 3 with pleasure

Oh, believe or not, there were times when python 3 was ... rare. 
After original failure to transition from Python 2, both versions were co-developed for 10 years! 
Instead of convincing a couple of my colleagues to migrate, I wrote a compilation of different cool elements that would appeal to most data folks.
I was compiling this for around two weeks, including new year visit to my in-laws.

Post was very popular, to say the least. 
And discussions were (I believe for the first time) revolving around different benefits of python 3, not complains on the hardness of this process. 

I carried away much knowledge from [comments](https://github.com/arogozhnikov/python3_with_pleasure/issues?q=is%3Aissue) on github.

Reddit has a large number of interesting comments, but seems the thread was deleted.


> Good guide to Python 3 features to persuade data scientist to switch. Tuple unpacking is my favourite. `*prev, next_to_last, last = very_long_sequence` or `first, second, *rest = very_long_sequence`
> [(link)](https://twitter.com/betatim/status/960522400411594752?s=20)

> "A short guide on features of Python 3 for data scientists" is a beautifully short primer on pathlib, type hinting, function annotations, f-strings and more.
> [(link)](https://twitter.com/John_Sandall/status/966651806469279744?s=20)

> If you’re worried about breaking code by switching to Python 3, check out this short guide on GitHub. It has a nice list of the main differences between Python 2/3, which makes switching *much* easier.
> [(link)](https://twitter.com/berkustun/status/985228606279471104?s=20)

> Moving is the worst, but this guide on moving to #python 3 made it a LITTLE easier to convince us! 
> [(link)](https://twitter.com/redoakstrategic/status/961255083618066434?s=20)

> A bunch of Python 3 features that you may find useful and make the transition less frustrating. For example, pathlib is a default module in python3 - very useful (who knew?)
> [(link)](https://twitter.com/AV_SP/status/960292057725075456?s=20)

> A fantastic little guide on the good new stuff in Python 3 with data science in mind
> [(link)](https://twitter.com/IndecisiveMatt/status/960447938999738369?s=20)

> A short guide on features of Python 3 for data scientists Alex Rogozhnikov <- This is the most useful 2.7 -> 3.X list I've come across for my work.
> [(link)](https://twitter.com/tmllr/status/956236415230251009?s=20)

And many others. Also TIL: Jeremy Howard posted links to my stuff in 2018.


## Gradient Boosting Explained in 3d

I worked on applying/improving gradient boosting for a couple of years.
It was a significant effort to create visualization that will explain the process, gives a *feeling* of this process, 
while providing mathematical formulas, all without asking for previous exposure to ML.

I am convinced this is still the best visualization of GB for this purpose.

> Radical gradient boosting explanation with really good interactive visualization toys.
> [(link)](https://twitter.com/torbenator5/status/804813496030527496?s=20)

> Never seen a better explanation of Gradient Boosting
> [(link)](https://twitter.com/JaswalAkash/status/760949869808758784?s=20)

> A great interactive visualization to conceptually understand gradient tree boosting
> [(link)](https://twitter.com/oscargfez/status/951381341442068480?s=20)

> I’d suggest this visual demonstration http://arogozhnikov.github.io/2016/06/24/gradient_boosting_explained.html…, and of course the great talk from Dr Hastie
> [(link)](https://twitter.com/jroberayalas/status/1086299950126956544?s=20)

> Gradient Boosting explained with fantastic interactive visualizations
> [(link)](https://twitter.com/_aylien/status/759058443865055232?s=20)

> Pretty cool visualization of gradient boosting (don't worry - also includes [basic] #formulas)
> [(link)](https://twitter.com/DSJ_stats/status/789893069156081664?s=20)

> a nice and intuitive explanation of Gradient Boosting for regression problems
> [(link)](https://twitter.com/F_Samu/status/836908886384861184?s=20)

> Pretty visualizations to uncover the hidden layers of Gradient Boosting!
> [(link)](https://twitter.com/mickaeltemporao/status/759750305974251520?s=20)

> This is an AMAZING demo of gradient boosting:
> [(link)](https://twitter.com/alex_gude/status/891849554374434816?s=20)


... and many more.


## Gradient boosting playground

Playground was a mirror of tensorflow playground, with significant adaptation to show pros and cons of GB.
Visualization nicely reflect the fact that GB is decomposable to trees, or "truncatable" at any moment - useful properties not available in NNs.

> Try gradient boosting w/ this playground from Alex Rogozhnikov
> [(Daniel Whitenack)](https://twitter.com/dwhitena/status/756248709977997313?s=20)

> Gradient Boost を可視化してパラメータいじって遊べるサイトhttp://arogozhnikov.github.io/2016/07/05/gradient_boosting_playground.html 
> Neural Network を可視化してパラメータいじって遊べるサイト
> ぽちぽち遊んでるだけで時間飛んで危険が危ない。
> https://twitter.com/kumagi/status/790144872506232832?s=20

Did I say I like comments in Japanese? I do.

> GB playground:
> Just found an amazing resource to visualise how Gradient Boosting works. Its pretty much like the @TensorFlow playground for NNs. Use can tinker with tree depth, different datasets & learning rate. 
> [(link)](https://twitter.com/Verma_Shikha19/status/1397155721079234560?s=20)


> An Interactive Demo of the Gradient Boosting Algorithm
> [(link)](https://twitter.com/ds_ldn/status/755435447858368512?s=20)


## Drawing images with ML

Post was created for fun, who knew that becomes even a research direction 10 years later...

> This is very nice - especially good for learning since they give you a notebook. (...)
> [(link)](https://lobste.rs/s/1q1wiz/reconstructing_pictures_with_machine)

> A simple neat visualization of common machine learning methods
> [(link)](https://twitter.com/jasonwatkinspdx/status/700363135950000128?s=20)


> I think it illustrates the "hardness" of Random Decisions Forests and "smoothness" of neural networks quite well.
> [(link)](https://news.ycombinator.com/item?id=11126159)



## Jupyter (IPython) notebooks features

I was a big fan of Jupyter project since I've started using it in ~2012 (spoiler: not anymore).

Goal was to make more folks jump into this, and see the potential beyond run-execute-plot.

> Great introduction to Jupyter notebook features 
> [(link)](https://twitter.com/pythonforbiolog/status/778506300237946880?s=20)

> WOW. I thought knew #jupyter nbs, but I learned a TON from this #blog post. Author is a neutrino physicist!
> [(link)](https://twitter.com/davidkaleko/status/917766624635219968?s=20)

(I worked with neutrino data, but that did not turn me into a neutrino physicist)

Quite soon folks form dataquest asked to post it on their platform.
They improved that post significantly after that, but still keep the original attribution (an example to follow!):

> This post is based on a post that originally appeared on Alex Rogozhnikov’s blog, ‘Brilliantly Wrong’. We have expanded the post and will continue to do so over time — if you have a suggestion please let us know. Thanks to Alex for graciously letting us republish his work here.
> 
> <https://www.dataquest.io/blog/jupyter-notebook-tips-tricks-shortcuts/>

