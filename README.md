# Time-planner app

## Showcase

<table>
    <tr>
        <td>Daily planner</td>
        <td>Daily planner navigation</td>
    </tr>
    <tr>
    <td><img src="docs/dailyplan.gif" alt="daily-planner" width="350"></td>
    <td><img src="docs/navigation.gif" alt="daily-planner-navigation" width="350"></td>
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
- Reporting module

## Architecture

![System architecture diagram](docs/arch.png "System architecture diagram in C4 model.")

Application server: [time-planner](https://github.com/erysman/time-planner)

Scheduling server: [time-planner-scheduling](https://github.com/erysman/time-planner-scheduling)

## Technologies

- React Native
- Expo
- Expo Router
- Tamagui
- React Query
- Reanimated

## Maintenance

### Generate new version of Api client from backend openApi definition

1. Generate latest `time-planner-server-openapi.json` in backend repo, copy it to `config` directory in this repo
2. Run `npm run generate-api`
3. Commit and push changes

### Build app

#### Development build

`eas build -p android --profile development`

#### Production preview build

`eas build -p android --profile preview`