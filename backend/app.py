from flask import Flask
from routes.auth_routes import auth_bp

app = Flask(__name__)

app.register_blueprint(auth_bp)

@app.route("/")
def home():
    return {
        "message": "Welcome to CodeQuest API"
    }

if __name__ == "__main__":
    app.run(debug=True)