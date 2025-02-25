FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

EXPOSE 8000

# Run migrations and start the development server
CMD ["python", "manage.py", "runserver", "localhost:8000"]
