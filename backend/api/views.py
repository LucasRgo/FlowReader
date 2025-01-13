from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Reader
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.http import JsonResponse
from .models import Reader, Book, LectureProgress

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if Reader.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = Reader.objects.create_user(username=username, password=password)
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": f"Failed to create user: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)
        if user and isinstance(user, Reader):  # Ensure the user is a Reader
            login(request, user)
            return Response({"message": "Logged in successfully"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)


class UserView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        user_data = {
            "id": user.id,
            "username": user.username,
        }
        return Response(user_data, status=status.HTTP_200_OK)


class UploadBookView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        files = request.FILES
        title = data.get('title')
        pdf = files.get('pdf')
        thumbnail = files.get('thumbnail')

        # Validate required fields
        missing_fields = [field for field, value in {
            'title': title,
            'pdf': pdf,
            'thumbnail': thumbnail
        }.items() if not value]
        if missing_fields:
            return JsonResponse({'error': f'Missing fields: {", ".join(missing_fields)}'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the book object
        book = Book( uploaded_by=request.user, title=title, pdf=pdf, thumbnail=thumbnail)

        book.save()
        return Response({'message': 'Book uploaded successfully'}, status=status.HTTP_201_CREATED)


class BooksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        books = Book.objects.filter(uploaded_by=request.user)
        books_data = [

            {
                "title": book.title,
                "thumbnail": request.build_absolute_uri('/api' + book.thumbnail.url),
                "id": book.id,
                "is_ready": book.is_ready
            }
            for book in books
        ]
        return Response(books_data, status=status.HTTP_200_OK)

class DeleteBookView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        book = Book.objects.get(id=pk)

        if book.uploaded_by == request.user:
            book.delete()
            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_204_NO_CONTENT)

class BookPages(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request, pk):
        book = Book.objects.get(id=pk)
        pages = book.get_text_and_pages()
        title = book.title

        progress = LectureProgress.objects.filter(reader=request.user, book=book).first()
        last_page_read = progress.last_page_read if progress else 1

        pdf = request.build_absolute_uri('/api' + book.pdf.url)
        data = {"title": title, "pdf":pdf, "pages": pages, "last_page_read": last_page_read}
        return Response(data ,status=status.HTTP_200_OK)

class ReadingProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, book_id):
        progress, _ = LectureProgress.objects.get_or_create(reader=request.user, book_id=book_id)
        progress.last_page_read = request.data.get('last_page_read', 1)
        progress.save()
        return Response({'message': 'Progress saved successfully'})

