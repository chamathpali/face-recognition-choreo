# Flask Application for Face Recognition Service

## Deploying the application in Choreo
1. Fork this repository.
2. Create a `Service` component in Choreo.
3. Deploy the component.

## Testing the application

Invoke the following endpoints to test the application. Make sure to change the `<endpoint-url>` to the URL of the deployed component.

### Recognize endpoint

```
curl -X POST localh/recognize
```
Response
```json
{
   "status" : true,
   "similarity" : 0.675
}
```


## Local Development

1. Build image
`docker build -t choreo-deepface-api .`

2. Run
`docker run -p 8080:8080 choreo-deepface-api`