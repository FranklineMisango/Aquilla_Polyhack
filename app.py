import os
from config import OPEN_AI_API_KEY
from langchain.llms import OpenAI
from langchain.agents.agent_toolkits import create_vectorstore_agent, VectorStoreToolkit, VectorStoreInfo
from langchain.vectorstores import Chroma
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import OpenAIEmbeddings
import streamlit as st

os.environ['OPENAI_API_KEY'] = OPEN_AI_API_KEY

# Create instance of OpenAI LLM
llm = OpenAI(temperature=0.1, verbose=True)
embeddings = OpenAIEmbeddings()

# Set Streamlit app title
st.title('Aquila Digital Assistant')
st.success('This app allows you to interact with Aquila, your financial digital assistant.')

# Create a text input box for the user
prompt = st.text_input('Input your question or query here')

# If the user hits enter
if prompt:
    # Load the PDF document using PyPDFLoader
    loader = PyPDFLoader('Aquilla_Notes.pdf')

    # Split pages from the PDF
    pages = loader.load_and_split()

    # Load documents into the vector database (ChromaDB)
    store = Chroma.from_documents(pages, embeddings, collection_name='uploaded_document')

    # Create a vectorstore info object
    vectorstore_info = VectorStoreInfo(
        name="uploaded_document",
        description="Uploaded financial document as a PDF",
        vectorstore=store
    )

    # Create a vectorstore toolkit
    toolkit = VectorStoreToolkit(vectorstore_info=vectorstore_info)

    # Create a vectorstore agent
    agent_executor = create_vectorstore_agent(llm=llm, toolkit=toolkit, verbose=True)

    # Pass the prompt to the agent
    response = agent_executor.run(prompt)

    # Write the response to the screen
    st.write(response)
