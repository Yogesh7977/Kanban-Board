from flask import Flask, request, jsonify
import boto3
from botocore.exceptions import ClientError
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
 # Enable CORS for frontend to make requests

# DynamoDB setup
dynamodb = boto3.resource('dynamodb', region_name='eu-north-1')
table = dynamodb.Table('tasksTable')  # Replace with your DynamoDB table name
print("Tables:", list(dynamodb.tables.all()))
# Function to fetch all tasks from DynamoDB

def validate_task(task):
    required_fields = {'id', 'title', 'description', 'status'}
    missing = required_fields - task.keys()
    if missing:
        print(f"Missing fields: {missing}")
        return False
    return True

# Function to add multiple tasks to DynamoDB
def add_bulk_tasks(tasks):
    try:
        with table.batch_writer() as batch:
            for task in tasks:
                batch.put_item(Item=task)
        return True
    except ClientError as e:
        print("Error adding tasks:", e.response['Error']['Message'])
        return False

def get_all_tasks():
    try:
        response = table.scan()  # Scan all tasks from DynamoDB table
        return response.get('Items', [])
    except ClientError as e:
        print(e.response['Error']['Message'])
        return []

# Function to add a task to DynamoDB
def add_task(task):
    try:
        print("Adding task to DynamoDB:", task)
        response = table.put_item(Item=task)
        print("Put item response:", response)
        return True
    except ClientError as e:
        print("ClientError:", e.response['Error']['Message'])
        return False
    except Exception as ex:
        print("Unexpected error:", str(ex))
        return False

# Function to update a task's status
def update_task_status(task_id, status):
    try:
        response = table.update_item(
            Key={'id': task_id},
            UpdateExpression="set #st = :s",
            ExpressionAttributeNames={"#st": "status"},
            ExpressionAttributeValues={":s": status},
            ReturnValues="UPDATED_NEW"
        )
        return response
    except ClientError as e:
        print(e.response['Error']['Message'])
        return None

# Function to delete a task by ID
def delete_task(task_id):
    try:
        table.delete_item(Key={'id': task_id})
        return True
    except ClientError as e:
        print(e.response['Error']['Message'])
        return False

# Function to update a task's title and description
def update_task_details(task_id, updated_task):
    try:
        response = table.update_item(
            Key={'id': task_id},
            UpdateExpression="set #t = :t, #d = :d",
            ExpressionAttributeNames={"#t": "title", "#d": "description"},
            ExpressionAttributeValues={":t": updated_task['title'], ":d": updated_task['description']},
            ReturnValues="UPDATED_NEW"
        )   
        return response
    except ClientError as e:
        print(e.response['Error']['Message'])
        return None


# Routes for the API

# Get all tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = get_all_tasks()
    return jsonify(tasks)

# Route to handle bulk task insert
@app.route('/tasks/bulk', methods=['POST'])
def add_bulk_tasks_route():
    tasks = request.get_json()

    if tasks and isinstance(tasks, list):
        if add_bulk_tasks(tasks):
            return jsonify({'message': 'Tasks added successfully'}), 201
        else:
            return jsonify({'message': 'Failed to add tasks'}), 400
    else:
        return jsonify({'message': 'Invalid task data or format'}), 400

# Add a new task
@app.route('/tasks', methods=['POST'])
def create_task():
    task = request.get_json()

    print("Received task", task) 

    if task and 'title' in task and 'description' in task and 'status' in task:
        if add_task(task):
            return jsonify({'message': 'Task added successfully'}), 201
        else:
            return jsonify({'message': 'Failed to add task'}), 400
    else:
        return jsonify({'message': 'Missing required fields'}), 400

# Update a task (status or details based on the request data)
@app.route('/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    updated_task = request.get_json()

    if 'status' in updated_task:
        # Update only the status
        status = updated_task['status']
        response = update_task_status(task_id, status)
        if response:
            return jsonify({'message': 'Task status updated successfully'}), 200
        else:
            return jsonify({'message': 'Failed to update task status'}), 400
    
    elif 'title' in updated_task and 'description' in updated_task:
        # Update only the title and description
        response = update_task_details(task_id, updated_task)
        if response:
            return jsonify({'message': 'Task details updated successfully'}), 200
        else:
            return jsonify({'message': 'Failed to update task details'}), 400
    
    else:
        return jsonify({'message': 'Missing required fields'}), 400

# Delete a task
@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task_route(task_id):
    if delete_task(task_id):
        return jsonify({'message': 'Task deleted successfully'}), 200
    else:
        return jsonify({'message': 'Failed to delete task'}), 400


# Run the app
if __name__ == '__main__':
    app.run(debug=True)
