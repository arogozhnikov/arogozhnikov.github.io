docker build -t jekyll-local:latest .

# use docker backend for this, DO NOT USE colima, it can't do incrementals
docker run -it --rm --label=jekyll --volume=`pwd`:/srv/jekyll --mount type=tmpfs,destination=/srv/jekyll/_site -it -p 4000:4000 jekyll-local:latest \
 bash -c 'cd /srv/jekyll && bundle install && bundle exec jekyll serve --incremental --host 0.0.0.0'

## Another way is using nix-shell
# nix-shell -p jekyll
# jekyll serve