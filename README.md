# ImagesStore

### API-end-points
1. ```base_url/signup``` to register a new user
2. ```base_url/signin``` to log the user in
3. ```base_url/addalbum``` to create a new album
4. ```base_url/albums``` to list all the albums created by the user
5. ```base_url/saveImages``` to store the uploaded images information(S3 bucket info and image original name) to the mongodb database
6. ```base_url/getImages``` to list all the images created by the user inside a particular album
7. ```base_url/deleteImage``` to delete a single image
8. ```base_url/updateImageName``` to update the name of an image
