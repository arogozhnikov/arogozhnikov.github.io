---
layout: post
title:  "Don't write command-line interfaces (generate them)"
excerpt: "The ultimate guide to (not) writing CLIs "
date: 2020-10-01 12:00:00
author: Alex Rogozhnikov
tags: 
- Programming
- Python
- Command-line interfaces
---

<p style="color: #666677">
(a friendly reminder that reading post before commenting is a great idea. 
Some people see this as an argument for GUI, but it's completely misleading)
</p>


A favourite activity of fresh github-bers is writing CLI (command-line interfaces) for anything.

Every programmer uses CLI **(true)**, so writing CLI makes you more professional **(false)**.

CLIs are required in everyday maintenance, env/pipeline/db management, and checking this and that.
It is a glue to keep different subsystems together, but hardly CLI is a reliable programming interface.
Progress in software engineering left bash calls far behind in terms of reliability and flexibility.


### What's wrong with writing CLI as an 'interface'?

- CLI support is an additional logic in your program that makes **no real work**
- While typically being dumb, CLI logic is frequently **filled with [mistakes](https://github.com/search?q=bug+command+line&type=Issues)**;
  thus it requires constant maintenance and an additional testing
- **Error (exception) handling** with CLI is very poor.
  Another layer of (bad faulty) code is required to make it possible
- **Scaling/extending** is not as easy compared to programming language APIs 
  (see example in the end)
- CLIs are detached from essential code, which in most cases is a disadvantage.
  <details markdown="1">
    <summary >more on this</summary>
    Forcing users to use CLI means: stay away from my code, you'd better not work with it.
    Maybe that's ok &mdash; but if users can code a bit (otherwise why do they use CLI?), 
    that's not an optimal way &mdash; if something went wrong, 
    do you want to directly see the code+calls that failed or do you want to add 
    several minutes/hours walking thru command args parsing machinery someone else wrote? 
    <br />
    While being questionable in small projects, a virtual fence becomes more and more obvious when parsing logic
    (validation, transformation, routing)  grows.  
  </details>


### Writing command-line interfaces the right way

- write functions
- leave CLI-fication to a special package

### Which tool to use for writing command-line interfaces in Python?

Here are the options that you should consider ...

- [argparse](https://docs.python.org/3/library/argparse.html) (or ancient optparse)
- [click](https://click.palletsprojects.com/en/7.x/)
- [docopt](http://docopt.org/)
- [python-fire](https://github.com/google/python-fire)

... **deprecated**. Yes, consider them deprecated.

Prefer [hug](https://hugapi.github.io/hug/) and [typer](https://github.com/tiangolo/typer).
Example for the latter: 

```python
import typer
from pathlib import Path

app = typer.Typer()

@app.command()
def find_dragon(name: str, path: Path, min_age_years: int = 200):
    <implementation goes here>

@app.command()
def feed_dragon(dragon_name: str, n_humans: int = 3):
    <implementation goes here>

if __name__ == "__main__":
    app()
```

Now it's ready to be invoked from shell
```
python example.py find_dragon 'Drake' --path /on/my/planet
```
That's it! Types are parsed, checked and converted. 
Defaults and description are picked from function itself. 
Even provides bash completions you can install. 
Best part is you wrote no code for that!


### — I need to invoke my code from bash with complex parameterization

Exact wording of this question may also include job schedulers, calls on remote machines 
and docker run/exec — common reasons that force people to write CLI.

Previous recipe may not work in this case, you have two options:

**Option A.** 

Read documentation for *deprecated* packages, 
write a ton of code for conversion, validation, testing and mocking.
Add documentation, make presentations about CLI logic and neat places of using bash, 
get promoted to Senior CLI architect, give talks and interviews. 
Some junior in your company discovers *option B* and ruins your career.


**Option B**. 

When there is much to configure, 
don't try to build a large parsing machinery to handle all cases, 
just **use code** to parameterize calls:

```bash
python -c "
from mymodule import set_dragon_feeding_schedule, Creatures, Date
set_dragon_feeding_schedule(
    feeding_times=['10:00', '14:00', '18:00'],
    dishes={Creatures.Tiger: 2, Creatures.Human: 1},
    start_day=Date('1020-03-01'),
)
"
```

Instead of 
```bash
python -m mymodule \
    set_dragon_feeding_schedule \
    --feeding-times ['10:00','14:00','18:00'] # hopefully this way it gets recognized \
    # how will you define parsing a dict with enum to integer mapping? 
    --dishes=Creatures.Tiger:2 \
    --dishes=Creatures.Human:1 \
    --start-day=1020-03-21 # BTW bash allows no comments in multiline calls
```

- How many lines of code you need to cover parsing logic in previous example? 
  - Try to be reasonable, not optimistic. Don't forget documentation.
  - Add testing, mocking, ... have you *ever* seen that part done properly for CLIs?
- Is there anything that you win after writing an explicit CLI parsing? Double quote maybe?
- Exception handling — simple to add in one case, very tough in the other


### — Never realized that CLI command can be replaced by python command

You're welcome! This can save you weeks of time and sleepless nights.

Here is definitive guide:

1. Don't write yet-another-parser — python can parse all you need 
2. Don't reinvent representing lists, dicts, enums, objects, etc in text — every programming language has it already solved   
3. Don't create new *types* of interfaces — functions *are* interfaces
4. Don't write parsing logic/validation — check parameters instead 

Focus on writing useful and friendly functional interface, not CLI. 

### — How about an example for dealing with more complex parameterization?

Sure! Here is an example from machine learning.

Common headache is supporting multiple optimization algorithms (each having it's own set of parameters)
and allowing a number of architectures (each also having different parameters).

```bash
python -c "
from yourpackage import ResidualNetwork, AdamOptimizer, train, activations
train(
    optimizer=AdamOptimizer(lr=0.0001, some_param=42, converge=True),
    model=ResidualNetwork(n_layers_in_each_group=[3,4,5,6], act=activations.ReLU, n_classes=1234),
    save_path='/research/my_experiment_number9999',
)
"
```

Compare this piece of clarity and versatility to a parsing nightmare happening in some popular packages.

Why it becomes such a nightmare? That's a great question!
 
- parameters depend on each other in a non-trivial way.
  Different model &rarr; different parameters. Added a model &mdash; update CLI.
- there should be a way to associate parameters with an entity they come from 
  - is this parameter for an architecture? for an optimizer? for a dataset?
  - entities that appear naturally in programming interfaces are not in the style of bash calls
- at some point second model appears (hi GANs!), and possibly a second optimizer, 
  several types of datasets... now you need to support all of that in CLI and avoid flag collisions
  - unlikely you want to frequently drop previous interface, so backward-compatibility will multiply your problems
- validation logic that is capable of handling all these scenarios would be huge, buggy 
  and not helpful at all
  
**CLIs don't scale up well**.  
They work well only when you can decompose things into simpler components 'each doing one job'.
Before writing CLI, it is thus important to know what is the functionality 
your project provides and how it may change in a year or two.
It is very easy to add CLI when the project is in it's initial stage &mdash; 
but as functionality grows, you'll find it exponentially harder to fit all knobs into CLI.   

Other programming interfaces survive growth quite easily.


## Looking forward

In the bright future of programming there will be more natural bridges between different languages.
With growing capabilities for [reflection](https://en.wikipedia.org/wiki/Reflection_(computer_programming)), 
it will be easier to invoke particular functions from other languages without intermediate bash calls.
[Python<>rust](https://pyo3.rs/) is a good example of going in this direction.

By not writing CLI logic and focusing on programming interface you make code future-proof.
[Different](https://fastapi.tiangolo.com/) [utilities](https://fastapi.tiangolo.com/alternatives/) already can convert functions to REST API 
(we may later use some other network APIs like gRCP, and you'll be able to add it with a couple of lines).
More to come, maybe we should expect utilities to auto-wrap your functions for calling from other languages/hosts/universes.

Code should be designed to be used by other code first.
Convenience 'temporary' command-line utilities sooner or later become part of bigger automated pipelines 
if no other API proposed. 

## TL;DR

- simple CLIs should be auto-generated today, don't write it yourself
  - other types of APIs can be auto-generated as well
- complex CLIs are a problem and think twice (better, 5 times) before trying to replace programming API with CLI
  - convenient command-line calls are available without writing a single line of CLI code 


<br />

<br />

<details markdown="1">
<summary>
<span style="font-size: 1.5em;"> Additional comments </span>
</summary>
- I use python as an example because 1) need to show some code 2) it is popular 3) I know it well enough. <br />
  However, the points made should be valid for all modern languages (C++ is not a modern language just in case).
- Itamar Turner-Trauring has an article on a relevant topic in his called 
  [please stop writing shell scripts](https://pythonspeed.com/articles/shell-scripts/). 
  Itamar provides numerous helpful recommendations and tips in his blog, and this is no exception.
</details>



<details markdown="1">
<summary>
<span style="font-size: 1.5em;"> Possible objections </span> 
</summary>
- CLI allows abstracting out from implementation
    - Exposed functions can be detached from an actual implementation
- User may not know programming language I use
    - Unlikely import and a function call can be misleading. By hiding details you leave user clueless in case something doesn't work
    - Actual choice is whether user should learn a bit of your language or yet-another-CLI system. Hard to find argument for the latter
    - If your tool requires detailed configuration, 
      you shouldn't be afraid to say: you need to write several lines of code, here is an example
- My application heavily uses bash/shell features: pipes, process substitutions and filename expansions
    - In this case when you want to keep using and supporting CLI
</details>



<details markdown="1">
<summary>
<span style="font-size: 1.5em;"> Comments on packages </span>
</summary>

**What's wrong with `python-fire`?**

While it builds CLI on the top of exposing functions/methods,
`fire` ignores annotations and tries to guess types based on input.

An example from an official documentation to confirm:
```bash
$ python example.py 10
int
$ python example.py "10"
int
$ python example.py '"10"'
str
```
So 1) no types guaranteed 2) convolved logic 3) to make sure argument is not converted to int,
wrap in both single and double quotes. 
Now wrap it in a bash call (e.g. during building docker).
Have fun with escaping quotes for every string argument.

**`Hug` has a poor support for CLIs (as of now)**

Be warned, it ignores flag names. 
Though it has right direction of thought and directly supports `marshmallow` types.
But in the meantime (Oct 2020) `typer` is a safer choice.

Interface package of a dream is not released yet — it should support both CLI and web APIs and include some elements from python-fire.
However, this should not stop you, as switches between these packages is almost painless as long as you write no custom logic.

</details>

<details markdown="1">
<summary>
<span style="font-size: 1.5em;"> Acknowledgements </span>
</summary>
Thanks to [Tatiana](https://github.com/tlikhomanenko) for proof-reading an initial version of this post.
</details>