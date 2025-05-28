from langchain.document_loaders import PyPDFLoader, CSVLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma

# Load PDF
loader = PyPDFLoader("your_report.pdf")
docs = loader.load()
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
docs = splitter.split_documents(docs)

# Embed & Store
db = Chroma.from_documents(
    docs,
    embedding=OpenAIEmbeddings(openai_api_key="YOUR_OPENAI_API_KEY"),
    persist_directory="./chroma_db"
)
db.persist()
