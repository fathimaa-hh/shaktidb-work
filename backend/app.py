from flask import Flask
from flask_cors import CORS

from config import Config

from routes.auth_routes import auth_bp
from routes.problem_routes import problem_bp
from routes.contest_routes import contest_bp
from routes.activity_routes import activity_bp
from routes.dashboard_routes import dashboard_bp
from routes.achievement_routes import achievement_bp

app = Flask(__name__)

app.config["SECRET_KEY"] = Config.SECRET_KEY
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False  # Local HTTP development only

CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:5173"}},
    supports_credentials=True
)

app.register_blueprint(auth_bp)
app.register_blueprint(problem_bp)
app.register_blueprint(contest_bp)
app.register_blueprint(activity_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(achievement_bp)


@app.route("/")
def home():
    return {"message": "Welcome to CodeQuest API"}


if __name__ == "__main__":
    app.run(debug=True)