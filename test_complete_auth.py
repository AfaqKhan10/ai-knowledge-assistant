# """
# Complete test: Create user, login, test /chats/
# """
# import requests

# BASE_URL = "http://localhost:8000"

# print("=== Complete Authentication Test ===\n")

# # 1. Create a test user
# print("1. Creating test user...")
# signup_data = {
#     "name": "Test User",
#     "email": "testuser@example.com",
#     "password": "testpass123"
# }

# signup_response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
# if signup_response.status_code == 200:
#     print("[OK] Signup successful!")
# elif "already registered" in signup_response.text:
#     print("[INFO] User already exists, continuing...")
# else:
#     print(f"[FAIL] Signup failed: {signup_response.text}")

# # 2. Login
# print("\n2. Logging in...")
# login_response = requests.post(
#     f"{BASE_URL}/auth/login",
#     json={"email": "testuser@example.com", "password": "testpass123"}
# )

# if login_response.status_code == 200:
#     token = login_response.json()["access_token"]
#     print(f"[OK] Login successful!")
#     print(f"Token: {token[:50]}...\n")
    
#     # 3. Test /chats/ with token
#     print("3. Testing GET /chats/...")
#     headers = {"Authorization": f"Bearer {token}"}
#     chats_response = requests.get(f"{BASE_URL}/chats/", headers=headers)
    
#     print(f"Status Code: {chats_response.status_code}")
    
#     if chats_response.status_code == 200:
#         print(f"[OK] GET /chats/ works!")
#         print(f"Chats: {chats_response.json()}")
#     elif chats_response.status_code == 401:
#         print(f"[FAIL] 401 Unauthorized - Token not accepted!")
#         print(f"Response: {chats_response.text}")
#         print("\nThis means get_current_user() is rejecting the token")
#     else:
#         print(f"[FAIL] Unexpected error")
#         print(f"Response: {chats_response.text}")
# else:
#     print(f"[FAIL] Login failed: {login_response.text}")
