# from langchain_groq import ChatGroq
# from dotenv import load_dotenv
# import os

# load_dotenv()

# llm = ChatGroq(
#     groq_api_key=os.getenv("GROQ_API_KEY"),
#     model_name="llama-3.1-8b-instant",
#     temperature=0.5,
#     max_tokens=100,
# )

# response = llm.invoke("Hello Groq! Tell me a short joke about programming.")
# print("Groq Response:")
# print(response.content.strip())