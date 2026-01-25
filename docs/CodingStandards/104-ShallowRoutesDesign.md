we keep our endpoints shallow. that is, we follow a mix of domain based, resource based, and shallow endpoint conventions.

shallow endpoints means we only allow endpoints to be a maximum of two resources deep, where the first resource is a direct parent of the second resource.

resource based means we follow the /resourcename/:resourceId format to access a specific resource or /resourcename for a list of items categorized under that resource, using the HTTP methods to specify the action that we want to do with the resource.

domain based means that all parent resource must be under a specific domain such as /user-system/users for all users and /user-system/users/:userId for a specific user.
