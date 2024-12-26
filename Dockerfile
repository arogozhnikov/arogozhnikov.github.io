FROM ruby:3.2
WORKDIR /app
CMD bundle install && bundle exec jekyll serve --force_polling --host=0.0.0.0