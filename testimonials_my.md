---
layout: page
title: Testimonials
permalink: /my-testimonials/
---

<div class="testmonial-links" markdown="1">
<a href="/my-testimonials/" class="active">my testimonials</a>
<a href="/testimonials/">testimonials to my projects</a>
</div>

In my work I rely on a large number of high-quality tools (frequently provided at no cost), 
but some of them stand out.



### typer

[Typer](https://github.com/tiangolo/typer) is an open-source generator of CLI.
Consistent usage of python and typer dramatically simplified management of multiple systems (network, db, deploy, etc) 
in the system I currently develop.


### opentrons

[Opentrons](https://opentrons.com/) is a part of lab automation responsible for liquid handling.

Automation interfaces in biotech are terrible to say the least.
Opentrons is a bright spot in this kingdom of darkness. 
"Just use python" is so game-changing and refreshing.

Public API reference, public issue tracker, open implementation, software based on web stack and raspberry pi-based system  ... 
all those luxuries are unseen in lab automation world.  
Their solution is also extremely affordable, making a decision for small labs a no-brainer.


### pythonspeed

[pythonspeed.com](https://pythonspeed.com/) is a collection of recommendations about using python for efficient data processing from Itamar Turner-Trauring.

Website is a collection of well-organized and just-enough-detailed pieces of sane advice that covers
dockerizing python, usage of environments, and - yes - speeding up common data analysis tasks.

While after years I've just learnt most of that from my experience, it could save me a significant amount of time 
if I have read Itamar's recommendations before.

There are however pieces that I've never seen to be explained well anywhere else &mdash; 
[issues with multiprocessing](https://pythonspeed.com/articles/python-multiprocessing/), venv activation process and multi-stage builds.

If you deal with somewhat significant data loads in python, reading pythonspeed should save you a noticeable amount of time.


### ruff

[Ruff](https://github.com/charliermarsh/ruff), 
is a well-written linter that helps in validating codebase with minimal efforts.
A critical piece of infra for big projects that we all needed, but did not realize we did.

It is also a case when speed (quantity) converts to real-time code validation (quality).


### warp

[warp](https://www.warp.dev/) is a terminal, "reimagined from the ground up to work like a modern app".

The ugliest piece of almost any software stack is shell.
Unfortunately, it is used so often that most developers are completely blind towards this ugliness.
Practically any component: selection, representation, interaction, shortcuts, and &mdash; most importantly &mdash; protocols are totally outdated.

Warp devs have a post ["The terminal is on life support. Is it worth saving?"](https://www.warp.dev/blog/the-terminal-is-on-life-support-is-it-worth-saving)

My punchline for the article is: `the terminal architecture makes it really difficult to innovate.`
We are stuck with terminals and programs trying to live with architecture that is already exhausted.
Jumping out of this local minima is very hard, as it requires changing both terminals and software.

No, warp did not solve the problem *yet*, but they work on the right problem.


### polars

[polars](https://www.pola.rs/) is a "lightning-fast DataFrame library for Rust and Python".

Polars (name makes a punch on pandas) is very efficient. 
Remember folks talking about BIG DATA and that everyone needs a spark cluster to analyze data?
Funny, but that's what people did instead of optimizing software.
Polars' author designed polars to be very efficient, built it in rust based on arrow protocol - an excellent starting point.


Two other sweet parts about polars: very pythonic interface and support of out-of-memory data, 
which makes it even more widely applicable.


### unix sockets

Isn't it strange to see testimonial to interprocess communication technology that existed since forever?

Yet, I found it extremely underrated nowadays.
At some point I was so tired managing TCP ports (ok, this process has :4000, those will be assigned :8501 to :8510, api will use that one), 
etcetc. That's ridiculous! 
I had to memorize which ports are exposed from the docker, and make sure that dockers on the same machine do not expose the same ports.
Oh, and ensure ports are not exposed to just anyone on the internet.

Unix sockets have all this solved. Just mount a volume, e.g. `/dockers/webserver/sockets:/sockets` and you're done:
simple access management and no name conflicts.


### sqlalchemy

Shoutout to [sqlalchemy](https://github.com/sqlalchemy/sqlalchemy), and the team that supports and constantly improves the most advanced ORM in python.


### streamlit

[Streamlit](https://github.com/streamlit/streamlit) is a simplistic web-framework for python users who have 
no interest in developing web pages (a significant part of data folks).

Streamlit is very appealing because of its simplicity and almost flat learning curve due to novel execution model and management of component states.
It has a number of gotchas and developing advanced things is ... non-trivial.

But initial prototypes are incredibly fast and simple &mdash; which paves the way to quick iterations and experiments.
