# Heroku Build

TODO

# FAQ

### How come archive -> build upload is not streamed?

A `Content-Size` header is required when uploading to presigned S3 urls, so we have to create the archive and figure out how big it is before upload can begin.
