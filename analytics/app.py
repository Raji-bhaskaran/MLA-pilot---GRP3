from dotenv import load_dotenv
from flask import Flask, render_template, jsonify, request
from pymongo import MongoClient
from flask_pymongo import PyMongo
from flask_cors import CORS
from urllib.parse import quote_plus
from bson import json_util
from prometheus_flask_exporter import PrometheusMetrics
import traceback
import logging
import os
from datetime import datetime, timedelta
from ariadne import load_schema_from_path, make_executable_schema, graphql_sync, QueryType
from ariadne.constants import PLAYGROUND_HTML

app = Flask(__name__)
metrics = PrometheusMetrics(app)
CORS(app, resources={r"/*": {"origins": "*"}},
     methods="GET,HEAD,POST,OPTIONS,PUT,PATCH,DELETE")

load_dotenv()
mongo_uri_activity = os.getenv('MONGO_URI_ACTIVITY')
mongo_db_activity = os.getenv('MONGO_DB_ACTIVITY')
mongo_uri_health = os.getenv('MONGO_URI_HEALTH')
mongo_db_health = os.getenv('MONGO_DB_HEALTH')

client_activity = MongoClient(mongo_uri_activity)
db_activity = client_activity[mongo_db_activity]
client_health = MongoClient(mongo_uri_health)
db_health = client_health[mongo_db_health]

metrics.info('app_info', 'Application info', version='1.0.3')

# Load GraphQL schema
type_defs = load_schema_from_path("schema.graphql")
query = QueryType()

# GraphQL routes
@app.route('/api/graphql', methods=['GET'])
def graphql_playground():
    print("Received a get request")
    return PLAYGROUND_HTML, 200

@app.route('/api/graphql', methods=['POST'])
def graphql_server():
    print("Getting a request...")
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=True
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code

# GraphQL resolvers
@query.field("stats")
def resolve_stats(_, info):
    try:
        print("Resolving the list stats info")
        loadedStats = stats()
        print(loadedStats)
        payload = {
            "success": True,
            "results": loadedStats
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload

@query.field("filteredStats")
def resolve_filteredStats(*_, name=None):
    try:
        print("Resolving the list stats info")
        loadedStats = user_stats(name)
        print(loadedStats)
        payload = {
            "success": True,
            "results": loadedStats
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload

@query.field("filteredHealthStats")
def resolve_filteredHealthStats(*_, name=None):
    try:
        print("Resolving the list health stats info")
        loadedStats = health_user_stats(name)
        print(loadedStats)
        payload = {
            "success": True,
            "results": loadedStats
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload

# Existing Flask routes
@app.route('/')
def index():
    exercises = db_activity.exercises.find()
    exercises_list = list(exercises)
    return json_util.dumps(exercises_list)

# Existing functions
@app.route('/stats')
def stats():
    pipeline = [
        {
            "$group": {
                "_id": {
                    "username": "$username",
                    "exerciseType": "$exerciseType"
                },
                "totalDuration": {"$sum": "$duration"},
                "totalDistance": {"$sum": "$distance"},
                "avgLevelOfEffort": {"$avg": "$levelOfEffort"}
            }
        },
        {
            "$group": {
                "_id": "$_id.username",
                "exercises": {
                    "$push": {
                        "exerciseType": "$_id.exerciseType",
                        "totalDuration": "$totalDuration",
                        "totalDistance": {"$round": ["$totalDistance", 2]},
                        "avgLevelOfEffort": "$avgLevelOfEffort"
                    }
                }
            }
        },
        {
            "$project": {
                "username": "$_id",
                "exercises": 1,
                "_id": 0
            }
        }
    ]

    stats = list(db_activity.exercises.aggregate(pipeline))

    # Calculate pace (seconds per km) for each exercise type
    for user_stats in stats:
        for exercise in user_stats['exercises']:
            if exercise['totalDistance'] != 0 and exercise['totalDuration'] != 0:
                exercise['avgPace'] = exercise['totalDuration'] * 60 / exercise['totalDistance']  # Convert minutes to seconds
            else:
                exercise['avgPace'] = None  # Handle division by zero

    return stats

# Create GraphQL schema
schema = make_executable_schema(type_defs, query)

@app.route('/stats/<username>', methods=['GET'])
def user_stats(username):
    pipeline = [
        {
            "$match": {"username": username}
        },
        {
            "$group": {
                "_id": {
                    "username": "$username",
                    "exerciseType": "$exerciseType"
                },
                "totalDuration": {"$sum": "$duration"},
                "totalDistance": {"$sum": "$distance"},
                "avgLevelOfEffort": {"$avg": "$levelOfEffort"}
            }
        },
        {
            "$group": {
                "_id": "$_id.username",
                "exercises": {
                    "$push": {
                        "exerciseType": "$_id.exerciseType",
                        "totalDuration": "$totalDuration",
                        "totalDistance": {"$round": ["$totalDistance", 2]},
                        "avgLevelOfEffort": "$avgLevelOfEffort"
                    }
                }
            }
        },
        {
            "$project": {
                "username": "$_id",
                "exercises": 1,
                "_id": 0
            }
        }
    ]

    stats = list(db_activity.exercises.aggregate(pipeline))

    # Calculate pace (seconds per km) for each exercise type
    for user_stats in stats:
        for exercise in user_stats['exercises']:
            if exercise['totalDistance'] != 0 and exercise['totalDuration'] != 0 :
                exercise['avgPace'] = exercise['totalDuration'] * 60 / exercise['totalDistance']  # Convert minutes to seconds
            else:
                exercise['avgPace'] = None  # Handle division by zero
    return stats

# Create GraphQL schema
schema = make_executable_schema(type_defs, query)

@app.route('/stats/weekly/', methods=['GET'])
def weekly_user_stats():
    username = request.args.get('user')
    start_date_str = request.args.get('start')
    end_date_str = request.args.get('end')

    date_format = "%Y-%m-%d"
    try:
        start_date = datetime.strptime(start_date_str, date_format)
        end_date = datetime.strptime(end_date_str, date_format) + timedelta(days=1)  # Include the whole end day

        logging.info(f"Fetching weekly stats for user: {username} from {start_date} to {end_date}")
    except Exception as e:
        logging.error(f"Error parsing dates: {e}")
        return jsonify(error="Invalid date format"), 400

    pipeline = [
        {
            "$match": {
                "username": username,
                "date": {
                    "$gte": start_date,
                    "$lt": end_date
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "exerciseType": "$exerciseType"
                },
                "totalDuration": {"$sum": "$duration"},
                "totalDistance": {"$sum": "$distance"},
                "avgPace": {"$avg": {"$divide": [{"$multiply": ["$duration", 60]}, "$distance"]}},  # Convert minutes to seconds
                "avgLevelOfEffort": {"$avg": "$levelOfEffort"}
            }
        },
        {
            "$project": {
                "exerciseType": "$_id.exerciseType",
                "totalDuration": 1,
                "totalDistance": {"$round": ["$totalDistance",2]},
                "avgPace": 1,
                "avgLevelOfEffort": 1,
                "_id": 0
            }
        }
    ]

    try:
        stats = list(db_activity.exercises.aggregate(pipeline))
        return jsonify(stats=stats)
    except Exception as e:
        current_app.logger.error(f"An error occurred while querying MongoDB: {e}")
        traceback.print_exc()
        return jsonify(error="An internal error occurred"), 500

@app.route('/health/stats')
def health_stats():
    pipeline = [
        {
            "$sort": {"createdAt": -1}
        },
        {
            "$group": {
                "_id": "$username",
                "latestHeight": {"$first": "$height"},
                "latestWeight": {"$first": "$weight"},
                "latestHeartRate": {"$first": "$restingHeartRate"},
                "latestBloodPressure": {"$first": "$bloodPressure"},
                "latestTiredness": {"$first": "$tiredness"},
                "latestStress": {"$first": "$stress"}
            }
        },
        {
            "$project": {
                "health": {
                    "latestHeight": "$latestHeight",
                    "latestWeight": "$latestWeight",
                    "latestHeartRate": "$latestHeartRate",
                    "latestBloodPressure": "$latestBloodPressure",
                    "latestTiredness": "$latestTiredness",
                    "latestStress": "$latestStress"
                },
                "username": "$_id",
                "_id": 0
            }
        },
        {
            "$addFields": {
                "health.bmi": {
                    "$divide": [
                        "$health.latestWeight",
                        {"$pow": [{"$divide": ["$health.latestHeight", 100]}, 2]}  # Convert height to meters before calculation
                    ]
                }
            }
        }
    ]

    stats = list(db_health.health.aggregate(pipeline))

    return stats

@app.route('/health/stats/<username>', methods=['GET'])
def health_user_stats(username):
    pipeline = [
        {
            "$match": {"username": username}
        },
        {
            "$sort": {"createdAt": -1}
        },
        {
            "$group": {
                "_id": "$username",
                "latestHeight": {"$first": "$height"},
                "latestWeight": {"$first": "$weight"},
                "latestHeartRate": {"$first": "$restingHeartRate"},
                "latestBloodPressure": {"$first": "$bloodPressure"},
                "latestTiredness": {"$first": "$tiredness"},
                "latestStress": {"$first": "$stress"}
            }
        },
        {
            "$project": {
                "health": {
                    "latestHeight": "$latestHeight",
                    "latestWeight": "$latestWeight",
                    "latestHeartRate": "$latestHeartRate",
                    "latestBloodPressure": "$latestBloodPressure",
                    "latestTiredness": "$latestTiredness",
                    "latestStress": "$latestStress"
                },
                "username": "$_id",
                "_id": 0
            }
        },
        {
            "$addFields": {
                "health.latestBMI": {
                    "$divide": [
                        "$health.latestWeight",
                        {"$pow": [{"$divide": ["$health.latestHeight", 100]}, 2]}  # Convert height to meters before calculation
                    ]
                }
            }
        }
    ]

    logging.info(f"Fetching weekly stats for user: {username}")
    stats = list(db_health.health.aggregate(pipeline))

    return stats

# Create GraphQL schema
schema = make_executable_schema(type_defs, query)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5050)