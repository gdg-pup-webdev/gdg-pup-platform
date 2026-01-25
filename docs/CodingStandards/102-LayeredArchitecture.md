always adhere to the layered architecture. 

repositories and services are not aware of the existence of the api. hence, types it may use must come locally, without any relationship to the api. the retional behind this is the decoupling of the database or the application schema to the api schemas. 

only the controllers and routes are await of the existence of the api. routes connect http endpoints to controllers. controllers then parses the request and transalates it into objects that the services and repositories understand. after the services did its job, it translates it back to the schema of the api. 

this separate allows us to decouple the api schema and architecture from the structure of our database. it makes is possible to make changes to our tables without having to update the api schema, hence, not breaking the frontend components that uses it. this makes the frontend and the backend independent and allow them to grow on their own pace. 

