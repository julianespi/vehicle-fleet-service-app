# vehicle-fleet-service-app



Setup instructions: Open terminal and cd to vehicle-test-service-app



Set up the virtual environment in two terminals 

```
python -m venv venv

venv\\Scripts\\activate     # If on Windows
source venv/bin/activate  # If on Linux/Mac
source venv/Scripts/activate # bash
```

```
in one backend terminal
Install required dependencies
cd backend/
pip install -r requirements.txt
flask run
```

``
in one frontend terminal
cd frontend/
npm install
npm run dev
```