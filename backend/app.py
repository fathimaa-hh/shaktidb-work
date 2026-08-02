from flask import Flask
from routes.auth_routes import auth_bp
from routes.problem_routes import problem_bp
from routes.contest_routes import contest_bp
from routes.activity_routes import activity_bp
from routes.dashboard_routes import dashboard_bp

app = Flask(__name__)

app.register_blueprint(auth_bp)
app.register_blueprint(problem_bp)
app.register_blueprint(contest_bp)
app.register_blueprint(activity_bp)
app.register_blueprint(dashboard_bp)
@app.route("/")
def home():
    return {
        "message": "Welcome to CodeQuest API"
    }

if __name__ == "__main__":
    app.run(debug=True)