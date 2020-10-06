---
layout: post
title:  "Don't write command-line interfaces (and how to write if you have to)"
excerpt: "The ultimate guide to (not) writing CLIs "
date: 2020-10-01 12:00:00
author: Alex Rogozhnikov
tags: 
- Programming
- Python
- Command-line interfaces
---

A favourite activity of fresh github-bers is writing CLI (command-line interfaces) for anything.

Every programmer uses CLI **(true)**, so writing CLI makes you more professional **(false)**.

CLIs are inevitable evil, required in everyday maintenance, env/pipeline/db management, and checking this and that.
It is a glue to keep different subsystems together, but hardly CLI is a reliable programming interface.
Progress in software engineering left bash calls far behind in terms of reliability and flexibility.


## What's wrong with writing CLI as 'interface'?

- CLI support is an additional logic in your program that makes **no real work**
- While typically being dumb, CLI logic is frequently **filled with mistakes**;
  thus it requires constant maintenance and an additional testing.
  How do you test CLI?
- **Error handling**, introspection, etc. when using CLI are practically absent.
  Another layer of (bad faulty) code is required to make it possible
- CLIs are detached from essential code, which in most cases is disadvantage.
  Forcing users to use CLI means: stay away from my code, you'd better not see it.
  If your target audience can code a bit (otherwise why do they use CLI?), that's not an optimal way


## What is 'command' in CLI?

Command is semantically equivalent to a function call. 

Imagine commands you use in everyday life `cp`, `ls`, `mv`, `docker run` being just functions 
(with many optional parameters). 


## Writing command-line interfaces the right way

- write functions
- leave CLI-fication to a special package

### Which tool to use for writing command-line interfaces in python?

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
    <actual implementation goes here>

@app.command()
def feed_dragon(dragon_name: str, n_humans: int = 3):
    <actual implementation goes here>

if __name__ == "__main__":
    app()
```

Now it's ready to be called from shell
```
python example.py find_dragon 'Drake' --path /on/my/planet
```

### — I need more complex parametrization of my code. How do I handle it?

**Option A.** Read documentation for deprecated packages, 
write a ton of code for conversion, validation, testing and wiring.
Add documentation, make presentations about CLI logic and neat places of using CLI, 
get promoted to Senior CLI architect, give talks and interviews. 
Some junior in your company discovers *option B* and ruins your career.


**Option B**. 

Don't try to build large parsing machinery to handle all cases, and just **use code** to parameterize calls:

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
    # how will you define parsing a dict with string to integer mapping? 
    --dishes=Creatures.Tiger:2 \
    --dishes=Creatures.Human:1 \
    --start-day=1020-03-21 # BTW bash allows no comments in multiline calls
```

### — Never realized that CLI command can be replaced by python command

You're welcome! This can save you weeks of time and sleepless nights.

Here is definitive guide:

1. Don't write yet-another-parser — python can parse all you need 
2. Don't create new *types* of interfaces — functions *are* interfaces
3. Don't reinvent representing lists, dicts, enums, objects, etc in text — each language has it already solved   
4. Don't write parsing logic — check parameters instead 

Focus on writing useful and friendly functional interface, not CLI.

### — How about an example for dealing with more complex parametrization?

Sure! Here is an example from machine learning.

Common headache is supporting multiple optimization algorithms (each having it's own set of parameters)
and allowing a number of architectures (each also having different parameters).

```bash
python -c "
from yourpackage import ResidualNetwork, AdamOptimizer, train
train(
    optimizer=AdamOptimizer(lr=0.0001, some_param=42, converge=True),
    model=ResidualNetwork(n_layers_in_each_group=[3,4,5,6], n_classes=1234),
    save_path='/research/my_experiment_number9999',
)
"
```

Compare this piece of clarity and versatility to a parsing nightmare happening in some popular packages.



## Looking forward

In the bright future of programming there will be more natural bridges between different languages.
With growing capabilities for [reflection](https://en.wikipedia.org/wiki/Reflection_(computer_programming)), 
it will be easier to invoke particular functions from other languages without going to CLI.

By not writing CLI logic you make code future-proof.
Different utilities already can convert functions to REST api (in future we may use some other network APIs like gRCP).
More to come, maybe we should expect utilities to auto-wrap your functions for calling from other languages/hosts/universes.

Code should be designed to be used by other code first.
Convenience 'temporary' command-line utilities sooner or later become part of bigger automated pipelines 
if no other API proposed. 




<br />

<br />

<details markdown="1">
<summary>
<span style="font-size: 1.5em;"> Additional comments </span>
</summary>
- I use python as an example because 1) need to show some code 2) it is popular 3) I know it well enough. <br />
  However, the points made should be valid for all modern languages (C++ is not a modern language just in case).    
</details>



<details markdown="1">
<summary>
<span style="font-size: 1.5em;"> Possible objections </span> 
</summary>
- CLI allows to abstract out from implementation
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

An example from official documentation to confirm:
```bash
$ python example.py 10
int
$ python example.py "10"
int
$ python example.py '"10"'
str
```
So 1) no types guaranteed 2) convolved logic 3) to make sure argument is not converted to int,
wrap in both single and double quotes. Now wrap it in a bash call (e.g. during building docker).
Have fun with escaping quotes for every string argument.

**`Hug` has a poor support for CLIs (as of now)**

Be warned, it ignores flag names. 
Though it has right direction of thought and directly supports `marshmallow` types.
But in the meantime (Oct 2020) `typer` is safer choice.

Interface package of a dream is not released yet - it should support both CLI and web APIs and include some elements from python-fire.
However, this should not stop you, as switches between these packages is almost painless as long as you write no custom logic.  

</details>

<details markdown="1">
<summary>
<span style="font-size: 1.5em;"> Acknowledgements </span>
</summary>
Thanks to [Tatiana](https://github.com/tlikhomanenko) for proof-reading this post.
</details>