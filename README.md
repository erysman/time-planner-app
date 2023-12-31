## Maintenance

### Generate new version of Api client from backend openApi definition

1. Generate latest `swagger.json` in backend repo, copy it to main directory in this repo, change it's name to `time-planner-server-openapi.json`
2. Run `npm run generate-api`
3. Commit and push changes

### Build new development build

`eas build -p android --profile development`

## Standards

### Internationalization

https://phrase.com/blog/posts/ruby-lessons-learned-naming-and-managing-rails-i18n-keys/
