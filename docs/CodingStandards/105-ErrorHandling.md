# express apis

eneral guidelines:

- calls to our utility functions, external apis, services, and repositories must all be wrapped with the tryCatch function defined in the utility folder.
- utility functions, external apis, services, and repositories are responsible for handling (throwing an instance of ServerError) errors that occurs while calling another utility functions, external apis, services, or repositories. However, it is not responsible for handling errors that occured within it. When an error occurs within it, it must let the error bubble to the caller. if the error is caught, rethrow it or throw a new Error object.
- When encountering a known error, always use our ServerError or its subclasses defined inside the classes folder.

