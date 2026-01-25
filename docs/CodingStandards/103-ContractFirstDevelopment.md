general guidelines:

- when making controllers, you must always use the createexpresscontroller function imported from @packages/typed-rest
- since createexpresscontroller requires a contract to work, you must always create a contract first before implementing the endpoint
- to make a contract, you must always specify a response object with atleast a 200 status code in it.
- you must also always export a docs_description and docs_summary strings for our documentation.
