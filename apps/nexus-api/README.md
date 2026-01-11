# EVENT SYSTEM API ENDPOINTS

## GET /api/event-system/events

list events

## POST /api/event-system/events

create event

## DELETE /api/event-system/events/:eventId

delete event

## PUT /api/event-system/events/:eventId

update event

## GET /api/event-system/events/:eventId

get specific event

## POST /api/event-system/checkin

checkin to an event. records attendance and debits user wallet with respect to the event's attendance points.

# HEALTH CHECK API ENDPOINTS

## GET /api/health

ping api

# RESOURCE SYSTEM API ENDPOINTS

## GET /api/resource-system/resources

list resources

## POST /api/resource-system/resources

create resource

## DELETE /api/resource-system/resources/:resourceId

delete resource

## PUT /api/resource-system/resources/:resourceId

update resource

## GET /api/resource-system/resources/:resourceId

get specific resource

# USER SYSTEM API ENDPOINTS

## GET /api/users/:userId

get specific user

## GET /api/users/:userId/wallet

get user wallet

## GET /api/users/:userId/wallet/transactions

get user wallet transactions

## GET /api/users/:userId/roles

get user roles

## GET /api/users/:userId/profile

get user profile

## GET /api/users/:userId/projects

list projects of user

# USER RESOURCE SYSTEM API ENDPOINTS

## POST /api/user-resource-system/projects

create project

## GET /api/user-resource-system/projects/:projectId

get specific project

## DELETE /api/user-resource-system/projects/:projectId

delete project

## PATCH /api/user-resource-system/projects/:projectId

update project
