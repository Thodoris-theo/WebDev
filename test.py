import requests
import json
# Define the URL of your server
url = 'http://localhost:3000/api/user'

# Define the user data to be sent in the request
user_data = {
    'username': 'test_user',
    'email': 'test@example.com',
    'password': 'testpassword',
    'firstName': 'John',
    'lastName': 'Doe',
    'identity_number': '1234567890',
    'role': 'patient'
}

try:
    # Send a POST request to create the user
    response = requests.post(url, json=user_data)

    # Check if the request was successful (status code 201)
    if response.status_code == 201:
        # Try parsing the JSON response
        try:
            data = response.json()
            print('User created successfully')
            print('User ID:', data.get('userId'))
        except json.JSONDecodeError:
            print('Error: Unexpected response format (not valid JSON)')
    else:
        print('Failed to create user')
        try:
            data = response.json()
            print('Error:', data.get('error'))
        except json.JSONDecodeError:
            print('Error: Could not parse server response')
except requests.RequestException as e:
    print('Error:', e)