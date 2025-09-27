# vehicle-fleet-service-app



Setup instructions: Open terminal and cd to vehicle-test-service-app



Set up the virtual environment

```
python -m venv venv

venv\\Scripts\\activate     # If on Windows
source venv/bin/activate  # If on Linux/Mac
```



Install required dependencies

```
pip install -r backend/requirements.txt
cd frontend
npm install
```

To run frontend, cd to the frontend directory first.
```
npm run dev
```

To run backend, cd to the backend directory first (on a separate terminal window from the frontend).
```
flask run
```
