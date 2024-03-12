# Time-planner app

## Showcase

<table>
    <tr>
        <td>Daily planner</td>
        <td>Daily planner navigation</td>
    </tr>
    <tr>
        <td><img src="docs/login.gif" alt="log-in" width="350"></td>
        <td><img src="docs/projects.gif" alt="log-in" width="350"></td>
    <!-- <td><img src="docs/projects.gif" alt="projects" width="200"></td>
    <td><img src="docs/daily-planner.gif" alt="daily-planner" width="200"></td>
    <td><img src="docs/daily-planner-nav.gif" alt="daily-planner-navigation" width="200"></td>
    <td><img src="docs/daily-planner-auto.gif" alt="daily-planner-auto-schedule" width="200"></td> -->
    </tr>  
    <tr>
        <td>Log in</td>
        <td>Projects and tasks</td>
    </tr>
    <tr>
        <td><img src="docs/login.gif" alt="log-in" width="350"></td>
        <td><img src="docs/projects.gif" alt="projects" width="350"></td>
    </tr>
</table>

Comming up:

- Weekly plan
- Recurring tasks
- Nested tasks
- Manage "done" tasks
- Report module

## Architecture

System:

Application server:

Scheduling server:

## Maintenance

### Generate new version of Api client from backend openApi definition

1. Generate latest `time-planner-server-openapi.json` in backend repo, copy it to `config` directory in this repo
2. Run `npm run generate-api`
3. Commit and push changes

### Build new development build

`eas build -p android --profile development`
