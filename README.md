# 

# Maintenance

## Generate new version of Api client from backend openApi definition

1. Generate latest `time-planner-server-openapi.json` in backend repo, copy it to `config` directory in this repo
2. Run `npm run generate-api`
3. Commit and push changes

## Build new development build

`eas build -p android --profile development`

## Internationalization

<https://phrase.com/blog/posts/ruby-lessons-learned-naming-and-managing-rails-i18n-keys/>
