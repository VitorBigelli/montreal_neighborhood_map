# montreal_neighborhood_map
An interactive map of the neighbourhood of Silicon Valley, CA, United States using Google Maps API's.

### Usage 

1. Clone the repository or Download and Unzip the ZipFile.
2. Via Command Prompt access the created directory; 
2. Inside the directory, initilializes a new server by writting 
```
python -m http.server 8000
```
3. At this point, you should be able to access the ``index.html`` file by accessing the ``http://localhost:8000/``
4. Open a new Command Prompt and inside the directory execute the ``ngrok`` by writting
```
ngrok.exe http 8000
```
5. Use the generated URL to access the application from any device. 
