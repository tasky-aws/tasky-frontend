# Tasky (tasky-frontend)
The proof of concept for tasky is a desktop application that interacts with AWS to retrieve ECS cluster data at once.

This then checks periodically with AWS to see if any of your tasks have stopped, and if so send a notification to the user.

This will also provide one-click to task logs and allow you to filter on those logs to find ERROR only messages and so on.

### Tests & Production ready
I'm not really a frontend person and tests were going to slow me down. If you really want to add tests, make a PR or message me about this if you cant make a PR as i may have
the permissions wrong.

### Dependencies

It's pretty useful to have `awsmfa` and to authenticate before you start the api, although it will give you a notification if the token has expired

### Start the app
```bash
Download the latest release
Start the api (./tasky-api) - its in the repo in the organisation
Start the app
```

Here's a dump of whats been done
```
Tasky GUI
- Query api for regions - maybe
- Style cloudwatch logs
- reset button

Done:
- Role management and state
- Ecs load clusters, services and tasks in a tree like fashion
- Chips at the top for ecs stats
- Ecs > cloudwatch logs
- Expose parameters in logs like days, amount to query and a filter
- SSE for alerts
- Notifications for task stoppages by comparing with store every x seconds, delegate to service
- Could query api for roles or use a role manager to add to state. Could read from credentials file
- ECS > parameter store for arns
- Notification > task logs
- If errors come through, logs on fire

Improvements:
- Loop through a list of roles and get them alll
- Change notifications from SSE to Zmq


```

# DISCLAIMER
If tasky blows up your computer, loses your job or just deletes all your everything, I am NOT liable for anything. Also see the liability clause at the end of the new BSD licence text in the COPYRIGHT file.
