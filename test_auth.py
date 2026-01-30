# """
# Quick test script to verify auth is working
# Run this after starting your backend server
# """
# import requests

# BASE_URL = "http://localhost:8000"

# print("=== Testing Authentication ===\n")

# # 1. Login
# print("1. Testing login...")
# login_response = requests.post(
#     f"{BASE_URL}/auth/login",
#     json={"email": "test@example.com", "password": "password123"}
# )

# if login_response.status_code == 200:
#     token = login_response.json()["access_token"]
#     print(f"[OK] Login successful!")
#     print(f"Token: {token[:50]}...")
    
#     # 2. Test /chats/ with token
#     print("\n2. Testing GET /chats/ with token...")
#     headers = {"Authorization": f"Bearer {token}"}
#     chats_response = requests.get(f"{BASE_URL}/chats/", headers=headers)
    
#     if chats_response.status_code == 200:
#         print(f"[OK] GET /chats/ successful!")
#         print(f"Response: {chats_response.json()}")
#     else:
#         print(f"[FAIL] GET /chats/ failed!")
#         print(f"Status: {chats_response.status_code}")
#         print(f"Response: {chats_response.text}")
# else:
#     print(f"[FAIL] Login failed!")
#     print(f"Status: {login_response.status_code}")
#     print(f"Response: {login_response.text}")
#     print("\n[WARNING] Make sure you have a user with email='test@example.com' and password='password123'")
#     print("   Or change the credentials in this script to match your test user")
