from flask import Flask
from flask_cors import CORS
from api.routes import api_bp


app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

app.register_blueprint(api_bp, url_prefix='/api')


if __name__ == '__main__':
    app.run(port=5000, debug=True, threaded=True)
